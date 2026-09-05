import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { validate, render, types } from "./render.mjs";
const sample = () =>
  JSON.parse(
    readFileSync(new URL("./examples/sample.json", import.meta.url), "utf8"),
  );
test("sample covers every supported preset", () => {
  const d = sample();
  validate(d);
  assert.deepEqual(
    [...new Set(d.slides.map((s) => s.type))].sort(),
    [...types].sort(),
  );
});
test("rejects duplicate IDs and unknown presets", () => {
  const d = sample();
  d.slides[1].id = d.slides[0].id;
  assert.throws(() => validate(d), /unique id/);
  d.slides[1].id = "unique";
  d.slides[1].type = "rawHTML";
  assert.throws(() => validate(d), /unknown preset/);
});
test("rejects ambiguous or missing canonical choice", () => {
  const d = sample();
  d.slides[3].answer = "Neither";
  assert.throws(() => validate(d), /match an option/);
  d.slides[3].options = ["Neither", "Neither"];
  assert.throws(() => validate(d), /duplicate options/);
});
test("requires exactly one inline gap", () => {
  const d = sample();
  d.slides[4].sentence = "No gap";
  assert.throws(() => validate(d), /exactly one/);
  d.slides[4].sentence = "{{blank}} {{blank}}";
  assert.throws(() => validate(d), /exactly one/);
});
test("gap stories need exactly one inline blank", () => {
  const d = sample();
  d.slides[11].text = "No gap here.";
  assert.throws(() => validate(d), /exactly one/);
  d.slides[11].text = "{{blank}} {{blank}}";
  assert.throws(() => validate(d), /exactly one/);
  d.slides[11].text = Array(41).fill("word").join(" ") + " {{blank}}";
  assert.throws(() => validate(d), /max 40/);
});
test("gap answers must match an option", () => {
  const d = sample();
  d.slides[11].answer = "Something else entirely";
  assert.throws(() => validate(d), /match an option/);
});
test("rejects oversized copy instead of shrinking", () => {
  const d = sample();
  d.slides[0].prompt = Array(23).fill("word").join(" ");
  assert.throws(() => validate(d), /exceeds 22/);
});
test("rejects external or parent-directory images", () => {
  const d = sample();
  for (const src of ["https://example.com/a.png", "assets/../../secret.png"]) {
    d.slides[1].src = src;
    assert.throws(() => validate(d), /local assets/);
  }
});
test("teacher notes are absent and text cannot break out of JSON", () => {
  const d = sample();
  d.slides[0].notes = "PRIVATE_SENTINEL";
  d.slides[0].prompt = "</script><script>alert(1)</script>";
  d.title = "<img src=x>";
  const html = render(d);
  assert(!html.includes("PRIVATE_SENTINEL"));
  assert(!html.includes("<title><img"));
  assert(!html.includes("</script><script>alert(1)"));
  assert(html.includes("\\u003c/script>"));
});
test("categorisation needs recoverable canonical categories", () => {
  const d = sample();
  d.slides[9].items[0].category = "Other";
  assert.throws(() => validate(d), /canonical categories/);
});
test("rejects malformed objects with useful diagnostics", () => {
  for (const d of [null, [], 42])
    assert.throws(() => validate(d), /deck object/);
  const d = sample();
  d.slides = [null];
  assert.throws(() => validate(d), /slide object/);
});
test("separate visible-state budget catches combined dense content", () => {
  const d = sample();
  d.slides = [
    {
      id: "dense",
      type: "compare",
      prompt: Array(22).fill("question").join(" "),
      columns: [
        {
          label: "First example label",
          text: Array(22).fill("example").join(" "),
        },
        {
          label: "Second example label",
          text: Array(22).fill("example").join(" "),
        },
      ],
    },
  ];
  assert.throws(() => validate(d), /initial content exceeds/);
});
