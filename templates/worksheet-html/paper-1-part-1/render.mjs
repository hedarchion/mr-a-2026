import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const [inputArg, outputArg] = process.argv.slice(2);
if (!inputArg || !outputArg) {
  throw new Error("Usage: node render.mjs <worksheet-content.json> <worksheet.html>");
}

const inputPath = path.resolve(inputArg);
const outputPath = path.resolve(outputArg);
const templatePath = new URL("./worksheet-template.html", import.meta.url);
const data = JSON.parse(await readFile(inputPath, "utf8"));
const template = await readFile(templatePath, "utf8");

const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const required = (name, value) => {
  if (value === undefined || value === null || value === "") throw new Error(`Missing ${name}`);
  return value;
};

const weekdayCodes = new Map([[1, "I"], [2, "S"], [3, "R"], [4, "K"], [5, "J"]]);

function deriveTitle(config) {
  if (!config.lessonRelated) return required("title", config.title);
  const classAbbrev = required("classAbbrev", config.classAbbrev);
  const weekNo = Number(required("weekNo", config.weekNo));
  const date = required("date", config.date);
  const paper = Number(required("paper", config.paper));
  const part = Number(required("part", config.part));
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("date must use YYYY-MM-DD");
  const weekday = new Date(`${date}T12:00:00Z`).getUTCDay();
  const dayCode = weekdayCodes.get(weekday);
  if (!dayCode) throw new Error("Lesson-related worksheet dates must be Monday–Friday");
  return `${classAbbrev}-W${String(weekNo).padStart(2, "0")}-${dayCode}-${date.replaceAll("-", "")}-P${paper}P${part}`;
}

if (!Array.isArray(data.pages) || data.pages.length === 0) throw new Error("pages must be a non-empty array");
const items = data.pages.flat();
if (items.length !== 8) throw new Error(`Paper 1 Part 1 requires exactly 8 items; received ${items.length}`);

for (const item of items) {
  required("item.number", item.number);
  required(`item ${item.number} stimulusHtml`, item.stimulusHtml);
  required(`item ${item.number} question`, item.question);
  if (!item.options || Object.keys(item.options).sort().join("") !== "ABC") {
    throw new Error(`Item ${item.number} must have exactly options A, B and C`);
  }
}

const title = deriveTitle(data);
const paperLabel = `Paper ${required("paper", data.paper)} Part ${required("part", data.part)}`;
const renderItem = (item) => `      <article class="item">
        <h2>${escapeHtml(item.number)}</h2>
        <div class="stimulus">${item.stimulusHtml}</div>
        <p class="question">${escapeHtml(item.question)}</p>
        <ul class="options">
          ${["A", "B", "C"].map(letter => `<li><span class="letter">${letter}</span> ${escapeHtml(item.options[letter])}</li>`).join("\n          ")}
        </ul>
      </article>`;

const pages = data.pages.map((pageItems, pageIndex) => {
  const header = pageIndex === 0 ? `      <h1>${escapeHtml(title)}</h1>
      <div class="subtitle">${escapeHtml(required("subtitle", data.subtitle))} <span class="marks">[${escapeHtml(required("marks", data.marks))} marks]</span></div>
      <hr class="rule">
      <div class="meta">
        <div>Name: <span class="line"></span></div>
        <div>Class: <span class="line short">${escapeHtml(required("classAbbrev", data.classAbbrev))}</span></div>
        <div>Date: <span class="line short"></span></div>
      </div>
      <p class="instructions"><b>Questions 1–8:</b> ${escapeHtml(required("instructions", data.instructions))}</p>` : "";
  return `    <section class="page">
${header}
${pageItems.map(renderItem).join("\n\n")}
      <div class="footer">${escapeHtml(paperLabel)} · Page ${pageIndex + 1} of ${data.pages.length}</div>
    </section>`;
}).join("\n\n");

const html = template
  .replace("{{DOCUMENT_TITLE}}", escapeHtml(`${title} | ${data.subtitle}`))
  .replace("{{PAGES}}", pages);

await writeFile(outputPath, html, "utf8");
console.log(`Rendered ${items.length} items to ${outputPath}`);
