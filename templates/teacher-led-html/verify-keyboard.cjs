#!/usr/bin/env node
const assert = require("node:assert/strict");
const { resolve } = require("node:path");
const { pathToFileURL } = require("node:url");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
(async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.PLAYWRIGHT_CHANNEL
      ? { channel: process.env.PLAYWRIGHT_CHANNEL }
      : process.platform === "darwin"
        ? { channel: "chrome" }
        : {}),
  });
  try {
    const page = await browser.newPage({
      viewport: { width: 1366, height: 768 },
    });
    const url = pathToFileURL(
      resolve(
        process.argv[2] || "reviews/slide-system-2026-09-05/sample/index.html",
      ),
    ).href;
    await page.goto(url);
    const slides = await page.evaluate(
      () => JSON.parse(document.getElementById("deck-data").textContent).slides,
    );
    for (let i = 0; i < slides.length; i++) {
      await page.goto(url);
      for (let j = 0; j < i; j++) await page.keyboard.press("ArrowRight");
      const s = slides[i],
        initial = await page.locator("#slide").innerText();
      assert.equal(await page.locator("#slide").getAttribute("data-id"), s.id);
      const control = page.locator("#reveal"),
        canReveal = await control.isVisible();
      // Space with a navigation button focused must reveal, not navigate.
      await page.locator(i < slides.length - 1 ? "#next" : "#prev").focus();
      await page.keyboard.press("Space");
      assert.equal(await page.locator("#slide").getAttribute("data-id"), s.id);
      if (canReveal) {
        if (s.type === "steps") {
          assert.equal(await page.locator(".step").count(), 2);
          for (let step = 2; step < s.items.length; step++) {
            await page.keyboard.press("Space");
            assert.equal(await page.locator(".step").count(), step + 1);
          }
        } else assert.equal(await control.isDisabled(), true);
        const final = await page.locator("#slide").innerText();
        await page.keyboard.press("Space");
        assert.equal(await page.locator("#slide").innerText(), final);
      } else assert.equal(await page.locator("#slide").innerText(), initial);
      // Reset reaches the browser handler. This cannot prove macOS delivers the OS shortcut.
      await page.keyboard.press("Meta+Space");
      assert.equal(await page.locator("#slide").innerText(), initial);
      assert.equal(await page.locator("#slide").getAttribute("data-id"), s.id);
      if (canReveal) {
        await page.evaluate(() =>
          document.body.dispatchEvent(
            new KeyboardEvent("keydown", {
              key: " ",
              code: "Space",
              repeat: true,
              bubbles: true,
              cancelable: true,
            }),
          ),
        );
        assert.equal(await page.locator("#slide").innerText(), initial);
      }
      if (i < slides.length - 1) {
        await page.keyboard.press("ArrowRight");
        assert.equal(
          await page.locator("#slide").getAttribute("data-id"),
          slides[i + 1].id,
        );
        await page.keyboard.press("ArrowLeft");
        assert.equal(
          await page.locator("#slide").getAttribute("data-id"),
          s.id,
        );
      }
    }
    await page.goto(url);
    await page.evaluate(() => {
      const x = document.createElement("input");
      x.id = "typing-check";
      document.body.append(x);
      x.focus();
    });
    await page.keyboard.press("Space");
    assert.equal(await page.locator("#typing-check").inputValue(), " ");
    assert.equal(
      await page.locator("#slide").getAttribute("data-id"),
      slides[0].id,
    );
    console.log(
      `PASS: navigation, staged Space reveal, final no-op, Command+Space reset, repeat and typing (${slides.length} slides).`,
    );
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
