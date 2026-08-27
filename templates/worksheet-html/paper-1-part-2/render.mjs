import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const [inputArg, outputArg] = process.argv.slice(2);
if (!inputArg || !outputArg) throw new Error("Usage: node render.mjs <worksheet-content.json> <worksheet.html>");

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
  const date = required("date", config.date);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("date must use YYYY-MM-DD");
  const dayCode = weekdayCodes.get(new Date(`${date}T12:00:00Z`).getUTCDay());
  if (!dayCode) throw new Error("Lesson-related worksheet dates must be Monday-Friday");
  return `${required("classAbbrev", config.classAbbrev)}-W${String(Number(required("weekNo", config.weekNo))).padStart(2, "0")}-${dayCode}-${date.replaceAll("-", "")}-P${Number(required("paper", config.paper))}P${Number(required("part", config.part))}`;
}

if (Number(data.paper) !== 1 || Number(data.part) !== 2) throw new Error("This renderer is for Paper 1 Part 2 only");
if (!Array.isArray(data.paragraphs) || data.paragraphs.length === 0) throw new Error("paragraphs must be a non-empty array");
if (!Array.isArray(data.items) || data.items.length !== 9) throw new Error("Paper 1 Part 2 requires item 0 and exactly 8 scored items");
const firstItem = Number(data.firstItem ?? 9);
const scoredNumbers = Array.from({ length: 8 }, (_, index) => firstItem + index);
const expectedNumbers = [0, ...scoredNumbers];
if (data.items.map(item => Number(item.number)).join(",") !== expectedNumbers.join(",")) {
  throw new Error(`items must be numbered ${expectedNumbers.join(", ")}`);
}

const title = deriveTitle(data);
const copies = Number(data.copies ?? 2);
if (![1, 2].includes(copies)) throw new Error("copies must be 1 or 2");
let passageHtml = data.paragraphs.map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join("\n        ");
for (const item of data.items) {
  const marker = `[[${item.number}:${item.incorrect}]]`;
  const replacement = `<span class="item-number">(${item.number})</span> <span class="error">${escapeHtml(item.incorrect)}</span>`;
  const occurrences = passageHtml.split(escapeHtml(marker)).length - 1;
  if (occurrences !== 1) throw new Error(`Expected marker ${marker} exactly once; found ${occurrences}`);
  passageHtml = passageHtml.replace(escapeHtml(marker), replacement);
}

const answerRows = Array.from({ length: 4 }, (_, row) => {
  const left = scoredNumbers[row * 2];
  const right = scoredNumbers[row * 2 + 1];
  return `        <tr><td>${left}</td><td></td><td>${right}</td><td></td></tr>`;
}).join("\n");
const renderPage = () => `    <section class="page">
      <h1>${escapeHtml(title)}</h1>
      <div class="subtitle">${escapeHtml(required("subtitle", data.subtitle))} <span class="marks">[${escapeHtml(required("marks", data.marks))} marks]</span></div>
      <hr class="rule">
      <div class="meta">
        <div>Name: <span class="line"></span></div>
        <div>Class: <span class="line short">${escapeHtml(data.classAbbrev)}</span></div>
        <div>Date: <span class="line short"></span></div>
      </div>
      <p class="instructions"><b>Questions ${scoredNumbers[0]}-${scoredNumbers.at(-1)}:</b> ${escapeHtml(required("instructions", data.instructions))}</p>
      <div class="focus"><b>Focus:</b> ${escapeHtml(required("focus", data.focus))}</div>
      <article class="passage">
        <h2>${escapeHtml(required("passageTitle", data.passageTitle))}</h2>
        ${passageHtml}
      </article>
      <div class="example"><b>Example (0):</b> ${escapeHtml(data.items[0].incorrect)} &rarr; <b>${escapeHtml(data.items[0].answer)}</b></div>
      <table class="answers" aria-label="Answer spaces">
        <colgroup>
          <col class="number-column"><col class="word-column">
          <col class="number-column"><col class="word-column">
        </colgroup>
        <thead><tr><th>No.</th><th>Correct word</th><th>No.</th><th>Correct word</th></tr></thead>
        <tbody>
${answerRows}
        </tbody>
      </table>
      <div class="footer">Paper 1 Part 2</div>
    </section>`;

const pages = Array.from({ length: copies }, renderPage).join("\n\n");

const html = template
  .replace("{{DOCUMENT_TITLE}}", escapeHtml(`${title} | ${data.subtitle}`))
  .replace("{{PAGE}}", pages);

await writeFile(outputPath, html, "utf8");
console.log(`Rendered ${copies} identical learner ${copies === 1 ? "page" : "pages"} with example item 0 and 8 scored items to ${outputPath}`);
