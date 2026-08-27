// Render a Form 1 Paper 1 Part 4 worksheet from a content JSON file.
// Usage: node render.mjs <worksheet-content.json> <worksheet.html>
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

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const required = (name, value) => {
  if (value === undefined || value === null || value === "") throw new Error(`Missing ${name}`);
  return value;
};

// ---- validation ----
if (Number(data.paper) !== 1 || Number(data.part) !== 4) throw new Error("This renderer is for Paper 1 Part 4 only");
const code = required("code", data.code);
required("title", data.title);
const marks = Number(required("marks", data.marks));
if (!Number.isInteger(marks)) throw new Error("marks must be an integer");
required("textTitle", data.textTitle);
if (!Array.isArray(data.textParagraphs) || data.textParagraphs.length === 0) throw new Error("textParagraphs must be a non-empty array");
if (!Array.isArray(data.tfStatements) || data.tfStatements.length !== 4) throw new Error("tfStatements must contain exactly 4 statements (25-28)");
if (!Array.isArray(data.shortItems) || data.shortItems.length !== 4) throw new Error("shortItems must contain exactly 4 items (29-32)");
if (data.tfStatements.some((s) => s.n < 25 || s.n > 28)) throw new Error("True/False numbers must be 25-28");
if (data.shortItems.some((s) => s.n < 29 || s.n > 32)) throw new Error("Short-answer numbers must be 29-32");
if (!data.answerMap || Object.keys(data.answerMap).length !== 8) throw new Error("answerMap must cover all 8 questions");

// ---- build parts ----
const paragraphs = data.textParagraphs
  .map((p) => `        <p>${escapeHtml(p)}</p>`)
  .join("\n");

const tfRows = data.tfStatements
  .map(
    (s) =>
      `        <tr>\n          <td>${s.n}</td>\n          <td>${escapeHtml(s.text)}</td>\n          <td></td>\n        </tr>`
  )
  .join("\n");

const saItems = data.shortItems
  .map((s) => {
    const body = escapeHtml(s.text).replaceAll("___ANS___", '<span class="ans"></span>');
    return `        <p>${s.n} ${body}</p>`;
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
  .replaceAll("{{TITLE}}", escapeHtml(data.title))
  .replaceAll("{{MARKS}}", String(marks))
  .replaceAll("{{TEXT_TITLE}}", escapeHtml(data.textTitle))
  .replaceAll("{{TEXT_PARAGRAPHS}}", paragraphs)
  .replaceAll("{{TF_ROWS}}", tfRows)
  .replaceAll("{{SA_ITEMS}}", saItems)
  .replaceAll("{{COPY_SCRIPT}}", copyScript);

await writeFile(outputPath, out, "utf8");
console.log(`Wrote ${outputPath}`);
