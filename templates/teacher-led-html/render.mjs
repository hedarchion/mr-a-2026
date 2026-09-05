#!/usr/bin/env node
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  copyFileSync,
  existsSync,
} from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
export const types = [
  "prompt",
  "reveal",
  "choice",
  "cloze",
  "gap",
  "compare",
  "steps",
  "passage",
  "order",
  "sort",
  "image",
  "writing",
];
const words = (s) =>
  String(s || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
export function contentCounts(s) {
  let body = [];
  if (s.type === "cloze") body.push(s.sentence);
  if (s.type === "gap") body.push(s.text);
  if (["choice", "cloze", "gap"].includes(s.type)) body.push(...s.options);
  if (s.type === "compare")
    body.push(...s.columns.flatMap((c) => [c.label, c.text]));
  if (s.type === "passage") body.push(s.text);
  if (s.type === "writing") body.push(s.task);
  if (s.type === "steps") body.push(s.items[0]);
  if (s.type === "order") body.push(...s.items);
  if (s.type === "sort")
    body.push(...s.items.flatMap((x) => [x.text, ...s.categories]));
  const initial = words([s.prompt, ...body].join(" "));
  let revealed = initial;
  if (["reveal", "choice"].includes(s.type)) revealed += words(s.answer);
  if (s.type === "steps")
    revealed += s.items.slice(1).reduce((a, x) => a + words(x), 0);
  if (s.type === "writing") revealed += words(s.frame);
  if (["reveal", "choice", "cloze", "gap", "order", "sort"].includes(s.type))
    revealed += words(s.feedback);
  return {
    id: s.id,
    type: s.type,
    initialWords: initial,
    hintWords: initial + words(s.hint),
    revealedWords: revealed,
  };
}
export function validate(d) {
  if (!d || typeof d !== "object" || Array.isArray(d))
    throw Error("deck object required");
  if (!Array.isArray(d.slides) || !d.slides.length)
    throw Error("slides must be a nonempty array");
  const errors = [];
  const require = (ok, msg) => {
    if (!ok) errors.push(msg);
  };
  require(d.version === 1, "version must be 1");
  require(typeof d.title === "string" && d.title.trim(), "title required");
  require(Array.isArray(d.slides) &&
    d.slides.length > 0, "slides must be a nonempty array");
  require(!d.viewport ||
    ["1366x768", "1280x665"].includes(d.viewport), "unsupported viewport");
  const ids = new Set();
  for (const [i, s] of (d.slides || []).entries()) {
    const p = `slide ${i + 1}`;
    if (!s || typeof s !== "object" || Array.isArray(s)) {
      errors.push(`${p}: slide object required`);
      continue;
    }
    require(s.id &&
      typeof s.id === "string" &&
      !ids.has(s.id), `${p}: unique id required`);
    ids.add(s.id);
    require(types.includes(s.type), `${p}: unknown preset`);
    require(typeof s.prompt === "string" &&
      s.prompt.trim(), `${p}: prompt required`);
    require(words(s.prompt) <=
      22, `${p}: prompt exceeds 22 words; simplify or split`);
    for (const k of ["hint", "feedback"])
      if (s[k])
        require(typeof s[k] === "string" &&
          words(s[k]) <= 24, `${p}: ${k} exceeds 24 words`);
    if (["reveal", "choice", "cloze", "gap", "order", "sort"].includes(s.type))
      require(typeof s.feedback === "string" &&
        s.feedback.trim(), `${p}: explanatory feedback required`);
    if (["reveal", "choice", "cloze", "gap"].includes(s.type))
      require(typeof s.answer === "string" &&
        s.answer.trim(), `${p}: answer required`);
    if (s.answer)
      require(words(s.answer) <= 35, `${p}: answer exceeds 35 words`);
    if (["choice", "cloze", "gap"].includes(s.type)) {
      require(Array.isArray(s.options) &&
        s.options.length >= 2 &&
        s.options.length <= 4, `${p}: use 2–4 options`);
      require(Array.isArray(s.options) &&
        new Set(s.options).size ===
          s.options.length, `${p}: duplicate options`);
      require(Array.isArray(s.options) &&
        s.options.includes(s.answer), `${p}: answer must match an option`);
      require(Array.isArray(s.options) &&
        s.options.every(
          (x) => typeof x === "string" && words(x) <= 10,
        ), `${p}: options must be short text`);
    }
    if (s.type === "cloze")
      require(typeof s.sentence === "string" &&
        s.sentence.split("{{blank}}").length === 2 &&
        words(s.sentence) <=
          22, `${p}: sentence needs exactly one {{blank}}, max 22 words`);
    if (s.type === "gap")
      require(typeof s.text === "string" &&
        s.text.split("{{blank}}").length === 2 &&
        words(s.text) <=
          40, `${p}: story needs exactly one {{blank}}, max 40 words`);
    if (["steps", "order"].includes(s.type))
      require(Array.isArray(s.items) &&
        s.items.length >= 2 &&
        s.items.length <= 4 &&
        new Set(s.items).size === s.items.length &&
        s.items.every(
          (x) => typeof x === "string" && words(x) <= 12,
        ), `${p}: use 2–4 unique short items`);
    if (s.type === "compare")
      require(Array.isArray(s.columns) &&
        s.columns.length === 2 &&
        s.columns.every(
          (c) =>
            c &&
            typeof c.label === "string" &&
            words(c.label) <= 5 &&
            typeof c.text === "string" &&
            words(c.text) <= 22,
        ), `${p}: two concise labelled examples required`);
    if (s.type === "passage")
      require(typeof s.text === "string" &&
        words(s.text) <=
          85, `${p}: passage max 85 words; split at paragraph boundaries`);
    if (s.type === "writing")
      require(typeof s.task === "string" &&
        words(s.task) <= 35 &&
        (!s.frame ||
          (typeof s.frame === "string" &&
            words(s.frame) <=
              30)), `${p}: concise task and optional frame required`);
    if (s.type === "sort") {
      require(Array.isArray(s.categories) &&
        s.categories.length >= 2 &&
        s.categories.length <= 3 &&
        new Set(s.categories).size === s.categories.length &&
        s.categories.every(
          (x) => typeof x === "string" && words(x) <= 5,
        ), `${p}: 2–3 unique categories`);
      require(Array.isArray(s.items) &&
        s.items.length >= 2 &&
        s.items.length <= 4 &&
        s.items.every(
          (x) =>
            x &&
            typeof x.text === "string" &&
            words(x.text) <= 8 &&
            Array.isArray(s.categories) &&
            s.categories.includes(x.category),
        ), `${p}: 2–4 short items with canonical categories`);
    }
    if (s.type === "image")
      require(typeof s.src === "string" &&
        /^assets\/[\w./-]+$/.test(s.src) &&
        !s.src.includes("..") &&
        typeof s.alt === "string" &&
        s.alt.trim(), `${p}: local assets path and alt required`);
    const allowed = [
      "id",
      "type",
      "prompt",
      "hint",
      "feedback",
      "answer",
      "options",
      "sentence",
      "items",
      "columns",
      "text",
      "task",
      "frame",
      "categories",
      "src",
      "alt",
      "notes",
    ];
    for (const k of Object.keys(s))
      require(allowed.includes(k), `${p}: unsupported field ${k}`);
  }
  if (errors.length) throw new Error(errors.join("\n"));
  for (const s of d.slides) {
    const c = contentCounts(s),
      budget = s.type === "passage" ? 110 : 65;
    require(c.initialWords <=
      budget, `${s.id}: initial content exceeds ${budget} words; split the teaching move`);
    require(Math.max(c.hintWords, c.revealedWords) <=
      110, `${s.id}: hint/reveal state exceeds 110 words`);
  }
  if (errors.length) throw new Error(errors.join("\n"));
  return d;
}
export function render(d) {
  validate(d);
  const base = dirname(fileURLToPath(import.meta.url));
  // Teacher-only material is never embedded in the projected artifact.
  const publicData = {
    version: d.version,
    title: d.title,
    viewport: d.viewport,
    slides: d.slides.map(({ notes, ...s }) => s),
  };
  const json = JSON.stringify(publicData)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
  const title = d.title.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
  return `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><style>${readFileSync(base + "/theme.css", "utf8")}</style><body><main id="stage"><section id="slide" aria-label="Teaching slide"></section><div id="announcement" class="sr-only" aria-live="polite" aria-atomic="true"></div><footer><div><button id="hint">Hint</button><button id="reveal">Reveal</button><button id="reset">Reset</button></div><nav aria-label="Slides"><button id="prev" aria-label="Previous slide">←</button><span id="count"></span><button id="next" aria-label="Next slide">→</button></nav></footer></main><script type="application/json" id="deck-data">${json}</script><script>${readFileSync(base + "/runtime.js", "utf8")}</script></body></html>`;
}
if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const [input, output] = process.argv.slice(2);
  if (!input || !output)
    throw Error("Usage: node render.mjs lesson.json output/index.html");
  const d = JSON.parse(readFileSync(input, "utf8"));
  const html = render(d);
  for (const s of d.slides.filter((s) => s.type === "image")) {
    const src = resolve(dirname(input), s.src);
    if (!existsSync(src)) throw Error(`Missing asset: ${src}`);
  }
  mkdirSync(dirname(output), { recursive: true });
  for (const s of d.slides.filter((s) => s.type === "image")) {
    const src = resolve(dirname(input), s.src),
      dst = resolve(dirname(output), s.src);
    mkdirSync(dirname(dst), { recursive: true });
    if (src !== dst) copyFileSync(src, dst);
  }
  writeFileSync(output, html);
  writeFileSync(
    resolve(dirname(output), "slide-manifest.json"),
    JSON.stringify(
      { version: d.version, slides: d.slides.map(contentCounts) },
      null,
      2,
    ) + "\n",
  );
  writeFileSync(
    resolve(dirname(output), "generated-slide-notes.md"),
    `# ${d.title} — slide notes\n\n` +
      d.slides
        .map(
          (s, i) =>
            `## ${i + 1}. ${s.id} (${s.type})\n\n${s.notes || "No additional teacher notes."}\n`,
        )
        .join("\n"),
  );
  console.log(`Built ${d.slides.length} slides: ${output}`);
}
