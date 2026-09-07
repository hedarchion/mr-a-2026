#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { render } from "./render.mjs";

export function checkGenerated(input, output) {
  const content = JSON.parse(readFileSync(input, "utf8"));
  const expected = render(content);
  if (readFileSync(output, "utf8") !== expected) {
    throw new Error(
      "HTML does not match this JSON and the current shared renderer. Rebuild it; do not edit generated HTML.",
    );
  }
  for (const s of content.slides.filter((s) => s.type === "image")) {
    const source = readFileSync(resolve(dirname(input), s.src));
    const asset = readFileSync(resolve(dirname(output), s.src));
    if (!source.equals(asset))
      throw new Error(`Generated image differs from source: ${s.src}`);
  }
  return content.slides.length;
}
if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const [input, output] = process.argv.slice(2);
  if (!input || !output)
    throw new Error("Usage: node check-generated.mjs content.json index.html");
  console.log(
    `PASS: ${checkGenerated(input, output)} slides match JSON and the shared renderer.`,
  );
}
