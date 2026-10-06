import assert from "node:assert/strict";
import test from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const webRoot = fileURLToPath(new URL("../", import.meta.url));
const config = ts.readConfigFile(path.join(webRoot, "tsconfig.json"), ts.sys.readFile);
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, webRoot);
const options = { ...parsed.options, incremental: false, noEmit: true };

// Replace content in the compiler's memory only: the shipped data and files
// remain untouched. These simulate the ordinary edits documented for owners.
function editedArrays(relativePath, changes) {
  const filename = path.join(webRoot, relativePath);
  const original = ts.sys.readFile(filename);
  const file = ts.createSourceFile(filename, original, ts.ScriptTarget.Latest, true);
  const replacements = [];
  function visit(node) {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && changes[node.name.text]) {
      let array = node.initializer;
      while (ts.isAsExpression(array) || ts.isSatisfiesExpression(array)) array = array.expression;
      assert.ok(ts.isArrayLiteralExpression(array), node.name.text + " is a content array");
      const replacement = changes[node.name.text](array, file);
      replacements.push({ start: array.getStart(file), end: array.end, replacement });
    }
    ts.forEachChild(node, visit);
  }
  visit(file);
  assert.equal(replacements.length, Object.keys(changes).length, "Every requested edit found its source array");
  let content = original;
  for (const edit of replacements.sort((a, b) => b.start - a.start))
    content = content.slice(0, edit.start) + edit.replacement + content.slice(edit.end);
  return [filename, content];
}

function without(id) {
  return (array, file) => "[" + array.elements.filter((entry) =>
    !entry.properties.some((property) => property.name?.getText(file) === "id" && property.initializer?.text === id),
  ).map((entry) => entry.getText(file)).join(",") + "]";
}

function assertCompiles(edits) {
  const overrides = new Map(edits);
  const host = ts.createCompilerHost(options);
  const baseRead = host.readFile.bind(host);
  host.readFile = (filename) => overrides.get(path.resolve(filename)) ?? baseRead(filename);
  const program = ts.createProgram(parsed.fileNames, options, host);
  const errors = ts.getPreEmitDiagnostics(program).filter((entry) => entry.category === ts.DiagnosticCategory.Error);
  const messages = errors.map((entry) => {
    const line = entry.file?.getLineAndCharacterOfPosition(entry.start || 0).line;
    return `${path.relative(webRoot, entry.file?.fileName || webRoot)}:${line === undefined ? "" : line + 1} ${ts.flattenDiagnosticMessageText(entry.messageText, " ")}`;
  });
  assert.deepEqual(messages, [], "Content edits must typecheck without presentation edits");
}

test("removing the only screenshot flagship or linked internship preserves optional field types", () => {
  assertCompiles([
    editedArrays("app/dossier-data.ts", {
      FEATURED: without("pocket-engineer"),
      EXPERIENCE: without("arch-technologies"),
    }),
  ]);
});

test("every editable record list can be cleared without rewriting its consumers", () => {
  const clear = (names) => Object.fromEntries(names.map((name) => [name, () => "[]"]));
  assertCompiles([
    editedArrays("app/portfolio-data.ts", clear([
      "SOCIAL_LINKS", "PORTALS", "PROJECTS", "CERTIFICATE_GROUPS", "CERTIFICATES",
      "ACHIEVEMENT_SPOTLIGHTS", "ACHIEVEMENTS", "EDUCATION",
    ])),
    editedArrays("app/dossier-data.ts", clear([
      "CHAPTERS", "CVS", "RESEARCH", "FEATURED", "EXPERIENCE", "LEADERSHIP", "SKILLS",
    ])),
    editedArrays("app/collaborators-data.ts", clear(["COLLABORATORS"])),
  ]);
});

test("new screenshot and optional evidence records use existing gallery schemas", () => {
  const media = '{ src: "/media/achievements/sempec-award-presentation.webp", alt: "Project evidence", width: 1600, height: 1067, caption: "Project context" }';
  const evidenceEntry = (id) => (array, file) => {
    const current = array.elements.map((entry) => entry.getText(file));
    return `[${current.join(",")}, { ...(${current[0]}), id: "${id}", media: [${media}] }]`;
  };
  assertCompiles([
    editedArrays("app/dossier-data.ts", {
      FEATURED: (array, file) => {
        const properties = array.elements[0].properties.filter((property) => !["drawing", "id"].includes(property.name?.getText(file)));
        return `[${array.elements.map((entry) => entry.getText(file)).join(",")}, { ${properties.map((property) => property.getText(file)).join(",")}, id: "new-screenshot-project", image: ${media}, media: [${media}] }]`;
      },
      RESEARCH: evidenceEntry("new-research"),
      EXPERIENCE: evidenceEntry("new-experience"),
      LEADERSHIP: evidenceEntry("new-leadership"),
      CVS: evidenceEntry("new-cv"),
    }),
    editedArrays("app/collaborators-data.ts", { COLLABORATORS: evidenceEntry("new-collaborator") }),
  ]);
});
