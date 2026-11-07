#!/usr/bin/env node
'use strict';

// Mide el consumo real de tokens a partir de las transcripciones locales de
// Claude Code (~/.claude/projects). Sin dependencias.
//
//   node scripts/measure-tokens.js
//   node scripts/measure-tokens.js --since 2026-10-01 --until 2026-11-01
//   node scripts/measure-tokens.js --json
//
// Privacidad: solo imprime agregados. De cada línea usa campos estructurales
// (tipo, ids, fechas, modelo, usage); del contenido de un mensaje solo mira el
// tipo de bloque, para distinguir un prompt de un resultado de herramienta.
// Nunca imprime texto, rutas, ids ni nombres de proyecto.
//
// Decisiones comprobadas en los datos reales, no supuestas:
// - Cada bloque de una respuesta (texto, thinking, herramienta) se guarda como
//   una entrada con el mismo message.id y el mismo usage. Sumar líneas infla el
//   total, así que se deduplica por message.id. "usage_distinto" vigila que siga
//   siendo seguro.
// - Una sesión puede repartirse en dos archivos, por eso se agrupa por el campo
//   sessionId y no por archivo. Los subagentes comparten el sessionId del padre.
// - Los errores de API se registran con modelo "<synthetic>" y usage a cero: se
//   excluyen porque no son llamadas facturadas.

const fs = require('fs');
const os = require('os');
const path = require('path');
const readline = require('readline');

const USAGE = 'Uso: node measure-tokens.js [--since YYYY-MM-DD] [--until YYYY-MM-DD] [--json]';
const SYNTHETIC_MODEL = '<synthetic>';

function fail(message) {
  console.error(`${message}\n${USAGE}`);
  process.exit(1);
}

function isDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return false;
  const time = Date.parse(value);
  return !Number.isNaN(time) && new Date(time).toISOString().startsWith(value);
}

function parseArgs(argv) {
  const options = { since: null, until: null, json: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--json') {
      options.json = true;
    } else if (arg === '--since' || arg === '--until') {
      const value = argv[++i];
      if (!isDate(value)) fail(`${arg} necesita una fecha YYYY-MM-DD válida.`);
      options[arg.slice(2)] = value;
    } else {
      fail(`Argumento desconocido: ${arg}`);
    }
  }
  return options;
}

function listTranscripts(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return listTranscripts(full);
    return entry.name.endsWith('.jsonl') ? [full] : [];
  });
}

function hasToolResult(content) {
  return Array.isArray(content) && content.some((block) => block && block.type === 'tool_result');
}

// Un prompt es lo que abre un turno: ni resultado de herramienta, ni mensaje
// interno, ni el resumen que inyecta una compactación.
function isPrompt(entry) {
  return entry.type === 'user' && !entry.isSidechain && !entry.isMeta
    && !entry.isCompactSummary && !hasToolResult(entry.message && entry.message.content);
}

function recordEntry(entry, data) {
  const message = entry.message;

  if (entry.type === 'assistant' && message && message.usage && message.id) {
    if (message.model === SYNTHETIC_MODEL) return;
    const u = message.usage;
    const call = {
      session: entry.sessionId,
      model: message.model,
      subagent: entry.isSidechain === true,
      timestamp: entry.timestamp,
      input: u.input_tokens || 0,
      output: u.output_tokens || 0,
      cacheCreation: u.cache_creation_input_tokens || 0,
      cacheRead: u.cache_read_input_tokens || 0,
    };
    const previous = data.calls.get(message.id);
    // Cuántas líneas ocupa la respuesta: así el factor de inflado respeta el periodo.
    call.lines = (previous ? previous.lines : 0) + 1;
    if (previous) previous.lines = call.lines;
    if (!previous) {
      data.calls.set(message.id, call);
    } else if (previous.output !== call.output || previous.input !== call.input
      || previous.cacheRead !== call.cacheRead || previous.cacheCreation !== call.cacheCreation) {
      // No debería ocurrir; si el formato cambia, se avisa y se conserva la más completa.
      data.usageMismatch++;
      if (call.output > previous.output) data.calls.set(message.id, call);
    }
    return;
  }

  if (entry.subtype === 'compact_boundary' && entry.uuid) {
    const meta = entry.compactMetadata || {};
    data.compactions.set(entry.uuid, {
      timestamp: entry.timestamp,
      trigger: meta.trigger,
      preTokens: meta.preTokens || 0,
      postTokens: meta.postTokens || 0,
    });
    return;
  }

  if (entry.uuid && isPrompt(entry)) {
    data.prompts.set(entry.uuid, {
      session: entry.sessionId,
      timestamp: entry.timestamp,
      // Sin turnOrigin (versiones antiguas) se asume humano.
      human: entry.turnOrigin === undefined || entry.turnOrigin === 'human',
    });
  }
}

async function readTranscript(file, data) {
  const lines = readline.createInterface({ input: fs.createReadStream(file), crlfDelay: Infinity });
  for await (const line of lines) {
    if (!line.trim()) continue;
    try {
      recordEntry(JSON.parse(line), data);
    } catch {
      data.badLines++;
    }
  }
}

function emptyTotals() {
  return { calls: 0, input: 0, output: 0, cacheCreation: 0, cacheRead: 0 };
}

function addCall(totals, call) {
  totals.calls++;
  totals.input += call.input;
  totals.output += call.output;
  totals.cacheCreation += call.cacheCreation;
  totals.cacheRead += call.cacheRead;
}

// "Procesados": todo lo que pasó por el modelo, incluida la lectura de caché.
const processed = (t) => t.input + t.output + t.cacheCreation + t.cacheRead;
// "Sin caché": lo que no se reaprovechó de una llamada anterior.
const uncached = (t) => t.input + t.output + t.cacheCreation;
// Contexto de entrada de una llamada: el prompt completo que recibió el modelo.
const promptSize = (c) => c.input + c.cacheCreation + c.cacheRead;

function percent(part, whole) {
  return whole ? Math.round((part / whole) * 10000) / 100 : 0;
}

// Percentil por rango más cercano: devuelve siempre un valor observado.
function percentile(sorted, p) {
  if (!sorted.length) return 0;
  return sorted[Math.max(0, Math.ceil((p / 100) * sorted.length) - 1)];
}

function distribution(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const sum = sorted.reduce((acc, value) => acc + value, 0);
  return {
    n: sorted.length,
    mean: sorted.length ? Math.round(sum / sorted.length) : 0,
    median: percentile(sorted, 50),
    p90: percentile(sorted, 90),
  };
}

function withFields(totals) {
  return { ...totals, processed: processed(totals), uncached: uncached(totals) };
}

function buildReport(data, files, { since, until }) {
  const inRange = (timestamp) => Boolean(timestamp)
    && (!since || timestamp >= since) && (!until || timestamp < until);

  const allCalls = [...data.calls.values()];
  const calls = allCalls.filter((call) => inRange(call.timestamp));
  const prompts = [...data.prompts.values()].filter((p) => inRange(p.timestamp));
  const compactions = [...data.compactions.values()].filter((c) => inRange(c.timestamp));

  const totals = emptyTotals();
  const main = emptyTotals();
  const subagents = emptyTotals();
  const models = new Map();
  const sessions = new Map();

  for (const call of calls) {
    addCall(totals, call);
    addCall(call.subagent ? subagents : main, call);
    if (!models.has(call.model)) models.set(call.model, emptyTotals());
    addCall(models.get(call.model), call);
    if (!sessions.has(call.session)) sessions.set(call.session, emptyTotals());
    addCall(sessions.get(call.session), call);
  }

  // Contexto inicial: primera llamada real de cada sesión. Se busca sobre todos
  // los datos para que --since no confunda una sesión a medias con un inicio.
  const firstCalls = new Map();
  for (const call of allCalls) {
    if (call.subagent || !call.timestamp) continue;
    const first = firstCalls.get(call.session);
    if (!first || call.timestamp < first.timestamp) firstCalls.set(call.session, call);
  }
  const firstInRange = [...firstCalls.values()].filter((c) => inRange(c.timestamp));
  // Una sesión automática no arranca como una de trabajo: se da también sin ellas.
  const humanSessions = new Set([...data.prompts.values()].filter((p) => p.human).map((p) => p.session));

  const timestamps = calls.map((call) => call.timestamp).sort();
  const perSession = [...sessions.values()];
  const cacheInput = totals.input + totals.cacheCreation + totals.cacheRead;

  return {
    period: {
      since,
      until,
      first: timestamps[0] || null,
      last: timestamps[timestamps.length - 1] || null,
    },
    integrity: {
      files: files.length,
      unreadableFiles: data.unreadableFiles,
      badLines: data.badLines,
      assistantLinesWithUsage: calls.reduce((sum, call) => sum + call.lines, 0),
      uniqueResponses: calls.length,
      usageMismatch: data.usageMismatch,
    },
    sessions: sessions.size,
    turns: {
      prompts: prompts.length,
      human: prompts.filter((p) => p.human).length,
      apiCalls: totals.calls,
      apiCallsMain: main.calls,
      apiCallsSubagents: subagents.calls,
    },
    totals: withFields(totals),
    perSession: {
      processed: distribution(perSession.map(processed)),
      uncached: distribution(perSession.map(uncached)),
      output: distribution(perSession.map((s) => s.output)),
      apiCalls: distribution(perSession.map((s) => s.calls)),
    },
    cache: {
      hitRatioPct: percent(totals.cacheRead, cacheInput),
    },
    initialContext: distribution(firstInRange.map(promptSize)),
    initialContextHuman: distribution(firstInRange.filter((c) => humanSessions.has(c.session)).map(promptSize)),
    models: [...models.entries()]
      .map(([model, t]) => ({
        model,
        ...withFields(t),
        pctProcessed: percent(processed(t), processed(totals)),
        pctUncached: percent(uncached(t), uncached(totals)),
      }))
      .sort((a, b) => b.processed - a.processed),
    subagents: {
      ...withFields(subagents),
      pctProcessed: percent(processed(subagents), processed(totals)),
      pctUncached: percent(uncached(subagents), uncached(totals)),
    },
    main: withFields(main),
    compactions: {
      count: compactions.length,
      auto: compactions.filter((c) => c.trigger === 'auto').length,
      preTokens: distribution(compactions.map((c) => c.preTokens)),
      postTokens: distribution(compactions.map((c) => c.postTokens)),
    },
  };
}

const fmt = (n) => n.toLocaleString('en-US');

function row(label, t) {
  return `  ${label.padEnd(22)} llamadas ${fmt(t.calls).padStart(7)} | entrada ${fmt(t.input).padStart(10)} | `
    + `salida ${fmt(t.output).padStart(10)} | crea caché ${fmt(t.cacheCreation).padStart(12)} | `
    + `lee caché ${fmt(t.cacheRead).padStart(14)}`;
}

function distributionLine(label, d) {
  return `  ${label.padEnd(22)} media ${fmt(d.mean).padStart(12)} | mediana ${fmt(d.median).padStart(12)} | `
    + `p90 ${fmt(d.p90).padStart(12)} | n ${d.n}`;
}

function printReport(r) {
  const out = [];
  out.push(`Periodo: ${r.period.first || 'sin datos'} a ${r.period.last || 'sin datos'} (UTC)`);
  out.push(`Sesiones: ${fmt(r.sessions)}`);
  out.push(`Turnos: ${fmt(r.turns.prompts)} prompts (${fmt(r.turns.human)} humanos) -> `
    + `${fmt(r.turns.apiCalls)} llamadas a la API`);
  out.push('');
  out.push('Totales');
  out.push(row('todo', r.totals));
  out.push(`  procesados ${fmt(r.totals.processed)} | sin caché ${fmt(r.totals.uncached)} | `
    + `ratio de caché ${r.cache.hitRatioPct}%`);
  out.push('');
  out.push('Por sesión (subagentes incluidos)');
  out.push(distributionLine('procesados', r.perSession.processed));
  out.push(distributionLine('sin caché', r.perSession.uncached));
  out.push(distributionLine('salida', r.perSession.output));
  out.push(distributionLine('llamadas', r.perSession.apiCalls));
  out.push('');
  out.push('Contexto inicial (entrada de la primera llamada de cada sesión)');
  out.push(distributionLine('tokens', r.initialContext));
  out.push(distributionLine('con turnos humanos', r.initialContextHuman));
  out.push('');
  out.push('Por modelo');
  for (const m of r.models) {
    out.push(row(m.model, m));
    out.push(`  ${''.padEnd(22)} ${m.pctProcessed}% de procesados | ${m.pctUncached}% de sin caché`);
  }
  out.push('');
  out.push('Subagentes');
  out.push(row('subagentes', r.subagents));
  out.push(`  ${''.padEnd(22)} ${r.subagents.pctProcessed}% de procesados | ${r.subagents.pctUncached}% de sin caché`);
  out.push('');
  out.push(`Compactaciones: ${r.compactions.count} (${r.compactions.auto} automáticas)`);
  out.push(distributionLine('tokens antes', r.compactions.preTokens));
  out.push(distributionLine('tokens después', r.compactions.postTokens));
  out.push('');
  out.push(`Integridad: ${r.integrity.files} archivos, ${fmt(r.integrity.assistantLinesWithUsage)} líneas con usage -> `
    + `${fmt(r.integrity.uniqueResponses)} respuestas únicas; usage distinto: ${r.integrity.usageMismatch}; `
    + `líneas ilegibles: ${r.integrity.badLines}; archivos ilegibles: ${r.integrity.unreadableFiles}`);
  console.log(out.join('\n'));
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const configDir = process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude');
  const root = path.join(configDir, 'projects');
  if (!fs.existsSync(root)) fail('No se encontró el directorio de transcripciones de Claude Code.');

  const files = listTranscripts(root).sort();
  const data = {
    calls: new Map(),
    prompts: new Map(),
    compactions: new Map(),
    badLines: 0,
    unreadableFiles: 0,
    usageMismatch: 0,
  };

  for (const file of files) {
    try {
      await readTranscript(file, data);
    } catch {
      // No se muestra el error: su mensaje incluiría la ruta.
      data.unreadableFiles++;
    }
  }

  const report = buildReport(data, files, options);
  if (options.json) console.log(JSON.stringify(report, null, 2));
  else printReport(report);
}

// Sin el error original: su mensaje incluiría rutas.
main().catch(() => fail('No se pudieron leer las transcripciones.'));
