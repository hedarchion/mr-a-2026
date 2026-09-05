// Render a Form 1/Form 2 grammar-practice worksheet from a content JSON file.
// Usage: node render.mjs <worksheet-content.json> <worksheet.html>
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const [inputArg, outputArg] = process.argv.slice(2);
if (!inputArg || !outputArg)
  throw new Error("Usage: node render.mjs <worksheet-content.json> <worksheet.html>");

const inputPath = path.resolve(inputArg);
const outputPath = path.resolve(outputArg);
const templatePath = new URL("./worksheet-template.html", import.meta.url);
const data = JSON.parse(await readFile(inputPath, "utf8"));
const template = await readFile(templatePath, "utf8");

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const required = (name, value) => {
  if (value === undefined || value === null || value === "")
    throw new Error(`Missing ${name}`);
  return value;
};

// ---- validation ----
const code = required("code", data.code);
required("subtitle", data.subtitle);
const marks = Number(required("marks", data.marks));
if (!Number.isInteger(marks)) throw new Error("marks must be an integer");
required("instructions", data.instructions);
if (!Array.isArray(data.sections) || data.sections.length === 0)
  throw new Error("sections must be a non-empty array");
let count = 0;
for (const s of data.sections) {
  if (!s.heading || !Array.isArray(s.items) || s.items.length === 0)
    throw new Error("each section needs a heading and non-empty items");
  for (const it of s.items) {
    if (!it.text) throw new Error("each item needs text");
    count += 1;
  }
}
if (count !== marks)
  throw new Error(`item count (${count}) must equal marks (${marks})`);
if (!data.answerMap || Object.keys(data.answerMap).length !== marks)
  throw new Error("answerMap must cover every item");

// ---- build parts ----
const renderText = (text) =>
  escapeHtml(text).replaceAll("___ANS___", '<span class="ans"></span>');

let n = 0;
const sections = data.sections
  .map((s) => {
    const items = s.items
      .map((it) => {
        n += 1;
        return `        <p class="item">${n}. ${renderText(it.text)}</p>`;
      })
      .join("\n");
    const bank = s.bank
      ? `        <p class="bank">${escapeHtml(s.bank)}</p>\n`
      : "";
    return `      <section class="box">\n        <h2>${escapeHtml(s.heading)}</h2>\n${bank}${items}\n      </section>`;
  })
  .join("\n");

const copyScript =
  Number(data.copies ?? 2) >= 2
    ? `    <script>
      // Two identical pages let the teacher choose “2 pages per sheet” and cut
      // the printout into two complete learner copies. Add ?single=1 to the URL
      // to render one full-size copy instead.
      if (!new URLSearchParams(location.search).has("single")) {
        const original = document.querySelector(".page");
        const duplicate = original.cloneNode(true);
        duplicate.setAttribute("aria-label", "Duplicate learner copy");
        document.body.append(duplicate);
      }
    </script>`
    : "";

const out = template
  .replaceAll("{{CODE}}", escapeHtml(code))
  .replaceAll("{{SUBTITLE}}", escapeHtml(data.subtitle))
  .replaceAll("{{MARKS}}", String(marks))
  .replaceAll("{{INSTRUCTIONS}}", escapeHtml(data.instructions))
  .replaceAll("{{SECTIONS}}", sections)
  .replaceAll("{{COPY_SCRIPT}}", copyScript);

await writeFile(outputPath, out);
console.log(`Built ${count} items: ${outputPath}`);
