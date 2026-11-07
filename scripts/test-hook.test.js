// Tests de los hooks de Claude Code. Sin dependencias: node --test scripts/test-hook.test.js
// Cada caso lanza el hook como lo hace Claude Code (JSON por stdin) contra repos
// temporales, para comprobar su contrato real: código 2 bloquea o avisa, 0 deja pasar.
const assert = require("node:assert/strict");
const { execFileSync, spawnSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { after, describe, test } = require("node:test");

const HOOKS = path.join(__dirname, "..", "adapters", "claude-code", "hooks");
const BLOCK_COMMIT = path.join(HOOKS, "block-commit-on-main.js");
const CHECK_ENCODING = path.join(HOOKS, "check-encoding.js");
const BLOCKED = 2;
const ALLOWED = 0;

const root = fs.mkdtempSync(path.join(os.tmpdir(), "withia-hooks-"));
after(() => fs.rmSync(root, { recursive: true, force: true }));

let count = 0;
const tempDir = () => fs.mkdtempSync(path.join(root, `caso-${++count}-`));

const git = (dir, ...args) => execFileSync("git", ["-C", dir, ...args], { encoding: "utf8" });

const makeRepo = ({ branch = "main", remote = true } = {}) => {
  const dir = tempDir();
  git(dir, "init", "-q", "-b", branch);
  // El remoto es ficticio: el hook sólo pregunta si existe, nunca lo contacta.
  if (remote) git(dir, "remote", "add", "origin", "https://example.com/prueba.git");
  return dir;
};

const runHook = (hook, input) => {
  const stdin = typeof input === "string" ? input : JSON.stringify(input);
  const { status, stderr } = spawnSync(process.execPath, [hook], { input: stdin, encoding: "utf8" });
  return { status, stderr };
};

const runCommit = (cwd, command) => runHook(BLOCK_COMMIT, { cwd, tool_input: { command } });

describe("block-commit-on-main: rama de destino", () => {
  test("bloquea en main con remoto y explica el motivo", () => {
    const { status, stderr } = runCommit(makeRepo(), 'git commit -m "x"');
    assert.equal(status, BLOCKED);
    assert.match(stderr, /no se commitea en 'main'/);
  });

  test("bloquea en master con remoto", () => {
    assert.equal(runCommit(makeRepo({ branch: "master" }), "git commit -m x").status, BLOCKED);
  });

  test("deja pasar en una rama de tarea", () => {
    assert.equal(runCommit(makeRepo({ branch: "feat/x" }), "git commit -m x").status, ALLOWED);
  });

  test("deja pasar en main sin remoto, como un repo de configuración local", () => {
    assert.equal(runCommit(makeRepo({ remote: false }), "git commit -m x").status, ALLOWED);
  });

  test("deja pasar fuera de un repo git", () => {
    assert.equal(runCommit(tempDir(), "git commit -m x").status, ALLOWED);
  });

  test("deja pasar un comando sin commit", () => {
    assert.equal(runCommit(makeRepo(), "git status").status, ALLOWED);
  });
});

describe("block-commit-on-main: formas del comando", () => {
  const blockedForms = [
    "git -c user.name=x commit -m x",
    "git --no-pager commit -m x",
    "git add . && git commit -m x",
    "git status; git commit -m x",
    'sh -c "git commit -m x"',
    "git.exe commit -m x",
  ];
  for (const command of blockedForms) {
    test(`bloquea: ${command}`, () => {
      assert.equal(runCommit(makeRepo(), command).status, BLOCKED);
    });
  }

  test("no confunde un subcomando parecido con commit", () => {
    assert.equal(runCommit(makeRepo(), "git commit-graph verify").status, ALLOWED);
  });
});

describe("block-commit-on-main: repo real del commit", () => {
  test("sigue un cd hacia main aunque la sesión esté en una rama", () => {
    const session = makeRepo({ branch: "feat/x" });
    assert.equal(runCommit(session, `cd "${makeRepo()}" && git commit -m x`).status, BLOCKED);
  });

  test("sigue un cd hacia una rama aunque la sesión esté en main", () => {
    const target = makeRepo({ branch: "feat/x" });
    assert.equal(runCommit(makeRepo(), `cd "${target}" && git commit -m x`).status, ALLOWED);
  });

  test("sigue git -C hacia main", () => {
    const session = makeRepo({ branch: "feat/x" });
    assert.equal(runCommit(session, `git -C "${makeRepo()}" commit -m x`).status, BLOCKED);
  });

  test("sigue git -C hacia una rama", () => {
    const target = makeRepo({ branch: "feat/x" });
    assert.equal(runCommit(makeRepo(), `git -C "${target}" commit -m x`).status, ALLOWED);
  });

  test("resuelve rutas relativas desde la carpeta de la sesión", () => {
    const parent = tempDir();
    const main = path.join(parent, "repo");
    fs.mkdirSync(main);
    git(main, "init", "-q", "-b", "main");
    git(main, "remote", "add", "origin", "https://example.com/prueba.git");
    assert.equal(runCommit(parent, "cd repo && git commit -m x").status, BLOCKED);
  });

  test("bloquea si la ruta de cd no existe", () => {
    const { status, stderr } = runCommit(tempDir(), "cd no-existe && git commit -m x");
    assert.equal(status, BLOCKED);
    assert.match(stderr, /no se pudo resolver/);
  });
});

describe("block-commit-on-main: destino desconocido", () => {
  const unknownTargets = [
    "git switch main && git commit -m x",
    "git checkout main && git commit -m x",
    "pushd otra && git commit -m x",
    "(cd otra && git commit -m x)",
    "GIT_DIR=/tmp/x git commit -m x",
  ];
  for (const command of unknownTargets) {
    test(`bloquea aun en una rama de tarea: ${command}`, () => {
      assert.equal(runCommit(makeRepo({ branch: "feat/x" }), command).status, BLOCKED);
    });
  }
});

// Estos casos fijan límites declarados en «Barreras»: si uno cambia, hay que
// actualizar ese texto, no sólo el test.
describe("block-commit-on-main: límites documentados", () => {
  test("mencionar un commit entre comillas bloquea de más", () => {
    assert.equal(runCommit(makeRepo(), 'echo "git commit -m x"').status, BLOCKED);
  });

  for (const command of ["git merge feat/x", "git cherry-pick abc123", "git revert HEAD"]) {
    test(`no ve: ${command}`, () => {
      assert.equal(runCommit(makeRepo(), command).status, ALLOWED);
    });
  }

  test("una entrada inesperada deja pasar", () => {
    assert.equal(runHook(BLOCK_COMMIT, "esto no es JSON").status, ALLOWED);
  });
});

describe("check-encoding", () => {
  const write = (name, content) => {
    const file = path.join(tempDir(), name);
    fs.writeFileSync(file, content);
    return file;
  };
  const check = (file) => runHook(CHECK_ENCODING, { tool_input: { file_path: file } });

  test("acepta UTF-8 sin BOM, con acentos", () => {
    assert.equal(check(write("ok.md", "Configuración\n")).status, ALLOWED);
  });

  test("avisa de un BOM al inicio", () => {
    const { status, stderr } = check(write("bom.md", Buffer.from([0xef, 0xbb, 0xbf, 0x61])));
    assert.equal(status, BLOCKED);
    assert.match(stderr, /BOM UTF-8/);
  });

  test("avisa de bytes NUL", () => {
    const { status, stderr } = check(write("nul.js", Buffer.from([0x61, 0x00, 0x62])));
    assert.equal(status, BLOCKED);
    assert.match(stderr, /bytes NUL/);
  });

  test("usa la ruta de tool_response si existe", () => {
    const filePath = write("bom.json", Buffer.from([0xef, 0xbb, 0xbf, 0x7b, 0x7d]));
    const input = { tool_response: { filePath }, tool_input: { file_path: "otro.md" } };
    assert.equal(runHook(CHECK_ENCODING, input).status, BLOCKED);
  });

  test("ignora extensiones que no son de texto", () => {
    assert.equal(check(write("imagen.png", Buffer.from([0x00, 0x01]))).status, ALLOWED);
  });

  test("deja pasar si el archivo no existe o la entrada es inesperada", () => {
    assert.equal(check(path.join(tempDir(), "no-existe.md")).status, ALLOWED);
    assert.equal(runHook(CHECK_ENCODING, "esto no es JSON").status, ALLOWED);
  });
});
