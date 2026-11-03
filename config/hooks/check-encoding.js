#!/usr/bin/env node
// PostToolUse (Edit|Write): detecta BOM UTF-8 o bytes NUL en archivos de texto.
// Motivo: en Windows, PowerShell 5.1 escribe BOM y a veces NUL; git trata el
// archivo como binario y su diff deja de ser revisable. Exit 2 = avisar a Claude
// para que lo corrija.
const fs = require("fs");
const path = require("path");

const TEXT_EXT = new Set([
  ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".json", ".jsonc", ".md", ".mdx",
  ".css", ".scss", ".html", ".vue", ".svelte", ".py", ".sql", ".yml", ".yaml",
  ".toml", ".sh", ".env.example", ".txt", ".xml", ".astro",
]);

let raw = "";
process.stdin.on("data", (d) => (raw += d));
process.stdin.on("end", () => {
  let file;
  try {
    const input = JSON.parse(raw);
    file = input?.tool_response?.filePath || input?.tool_input?.file_path;
  } catch {
    process.exit(0);
  }
  if (!file || !TEXT_EXT.has(path.extname(file).toLowerCase())) process.exit(0);

  let buf;
  try {
    buf = fs.readFileSync(file);
  } catch {
    process.exit(0);
  }
  const problems = [];
  if (buf.length >= 3 && buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) problems.push("BOM UTF-8 al inicio");
  if (buf.includes(0x00)) problems.push("bytes NUL (git lo tratará como binario)");
  if (problems.length) {
    process.stderr.write(`Codificación incorrecta en ${file}: ${problems.join(", ")}. Reescríbelo en UTF-8 sin BOM.\n`);
    process.exit(2);
  }
  process.exit(0);
});
