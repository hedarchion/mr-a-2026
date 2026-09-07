import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { render } from "./render.mjs";
import { checkGenerated } from "./check-generated.mjs";
function fixture(fn) {
  const root = mkdtempSync(join(tmpdir(), "slide-provenance-"));
  try {
    mkdirSync(join(root, "source/assets"), { recursive: true });
    mkdirSync(join(root, "out/assets"), { recursive: true });
    const d = {
      version: 1,
      title: "Test",
      slides: [
        {
          id: "one",
          type: "image",
          prompt: "What do you see?",
          src: "assets/image.png",
          alt: "Test image",
        },
      ],
    };
    const input = join(root, "source/content.json"),
      output = join(root, "out/index.html");
    writeFileSync(input, JSON.stringify(d));
    writeFileSync(output, render(d));
    for (const p of ["source", "out"])
      writeFileSync(join(root, p, "assets/image.png"), "same asset");
    fn({ root, d, input, output });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}
test("accepts unmodified shared-renderer output", () =>
  fixture((x) => assert.equal(checkGenerated(x.input, x.output), 1)));
test("rejects manual or stale generated HTML", () =>
  fixture((x) => {
    writeFileSync(
      x.output,
      render(x.d).replace("<body>", '<body style="font-size:10px">'),
    );
    assert.throws(() => checkGenerated(x.input, x.output), /does not match/);
  }));
test("rejects output built from different content", () =>
  fixture((x) => {
    x.d.slides[0].prompt = "A changed question";
    writeFileSync(x.input, JSON.stringify(x.d));
    assert.throws(() => checkGenerated(x.input, x.output), /does not match/);
  }));
test("rejects mismatched image copies", () =>
  fixture((x) => {
    writeFileSync(join(x.root, "out/assets/image.png"), "wrong asset");
    assert.throws(() => checkGenerated(x.input, x.output), /image differs/);
  }));
