#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

function loadPlaywright() {
  const candidates = [];
  if (process.env.PLAYWRIGHT_MODULE)
    candidates.push(process.env.PLAYWRIGHT_MODULE);
  candidates.push("playwright");
  for (const c of candidates) {
    try {
      return require(c);
    } catch (_) {}
  }
  throw new Error(
    `Cannot load Playwright. Set PLAYWRIGHT_MODULE or install playwright.`,
  );
}
const { chromium } = loadPlaywright();
const target = path.resolve(
  process.argv[2] || "reviews/slide-system-2026-09-05/sample/index.html",
);
const shotDir =
  process.env.SLIDE_QA_SCREENSHOTS ||
  (process.argv[3] && path.resolve(process.argv[3]));
const viewports = [
  { width: 1366, height: 768 },
  { width: 1280, height: 665 },
  { width: 1265, height: 536 },
  { width: 1920, height: 1080 },
];
const failures = [];
const fail = (msg) => failures.push(msg);
if (!fs.existsSync(target)) {
  console.error(`Missing input: ${target}`);
  process.exit(2);
}
if (shotDir) fs.mkdirSync(shotDir, { recursive: true });

async function state(page) {
  return page.evaluate(() => ({
    id: document.querySelector("#slide")?.dataset.id,
    type: document.querySelector("#slide")?.dataset.type,
    count: document.querySelector("#count")?.textContent,
    text: document.querySelector("#slide")?.textContent || "",
    buttons: [...document.querySelectorAll("#slide button")].map((b) => ({
      text: b.textContent,
      pressed: b.getAttribute("aria-pressed"),
      disabled: b.disabled,
    })),
    revealHidden: document.querySelector("#reveal")?.hidden,
    resetHidden: document.querySelector("#reset")?.hidden,
    hintHidden: document.querySelector("#hint")?.hidden,
  }));
}

async function measure(page, label) {
  const result = await page.evaluate(() => {
    const stage = document.querySelector("#stage"),
      slide = document.querySelector("#slide"),
      footer = document.querySelector("footer");
    const sr = stage.getBoundingClientRect(),
      fr = footer.getBoundingClientRect();
    const contentBottom = Math.min(fr.top, sr.bottom);
    const bad = [];
    const visible = (el) => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    };
    for (const el of [slide, ...slide.querySelectorAll("*")]) {
      if (!visible(el)) continue;
      const r = el.getBoundingClientRect();
      if (
        r.left < sr.left - 2 ||
        r.right > sr.right + 2 ||
        r.top < sr.top - 2 ||
        r.bottom > contentBottom + 2
      )
        bad.push({
          tag: el.tagName,
          cls: String(el.className || ""),
          text: (el.textContent || "").trim().slice(0, 50),
          bottom: Math.round(r.bottom),
          contentBottom: Math.round(contentBottom),
        });
    }
    const top = [...slide.children].filter(visible);
    for (let i = 0; i < top.length; i++)
      for (let j = i + 1; j < top.length; j++) {
        const a = top[i].getBoundingClientRect(),
          b = top[j].getBoundingClientRect();
        if (
          Math.min(a.right, b.right) - Math.max(a.left, b.left) > 2 &&
          Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 2
        )
          bad.push({
            overlap: [
              top[i].tagName + "." + top[i].className,
              top[j].tagName + "." + top[j].className,
            ],
          });
      }
    return {
      bad,
      images: [...slide.querySelectorAll("img")].map((x) => ({
        src: x.src,
        loaded: x.complete && x.naturalWidth > 0,
      })),
    };
  });
  if (result.bad.length)
    fail(
      `${label}: overflow/overlap ${JSON.stringify(result.bad.slice(0, 4))}`,
    );
  if (result.images.some((x) => !x.loaded))
    fail(`${label}: image did not load ${JSON.stringify(result.images)}`);
}

async function screenshot(page, viewport, slideNo, phase) {
  if (shotDir)
    await page.screenshot({
      path: path.join(
        shotDir,
        `${viewport.width}x${viewport.height}-slide-${String(slideNo).padStart(2, "0")}-${phase}.png`,
      ),
    });
}

async function gotoSlide(page, n) {
  await page.goto(`file://${target}`, { waitUntil: "load" });
  for (let i = 0; i < n; i++) await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(20);
}

async function testSlide(page, viewport, i, total) {
  await gotoSlide(page, i);
  const spec = await page.evaluate(
    (i) =>
      JSON.parse(document.getElementById("deck-data").textContent).slides[i],
    i,
  );
  const initial = await state(page);
  await measure(
    page,
    `${viewport.width}x${viewport.height} slide ${i + 1} initial`,
  );
  await screenshot(page, viewport, i + 1, "initial");
  if (await page.locator(".answer,.feedback,.hint").count())
    fail(`${viewport.width}: initial answer/hint leaked on slide ${i + 1}`);
  if (!initial.id || initial.type == null)
    fail(`${viewport.width}: slide ${i + 1} missing id/type`);
  const content = page.locator("#slide button");
  const contentCount = await content.count();

  if (!initial.hintHidden) {
    await page.locator("#hint").click();
    const shown = await state(page);
    if (!shown.text || shown.text === initial.text)
      fail(`${viewport.width}: slide ${i + 1} hint did not change content`);
    await measure(page, `hint slide ${i + 1}`);
    await screenshot(page, viewport, i + 1, "hint");
    await page.locator("#hint").click();
  }
  for (let j = 0; j < contentCount; j++) {
    const b = page.locator("#slide button").nth(j);
    if (!(await b.isVisible())) continue;
    const before = await page.locator("#count").textContent();
    await b.focus();
    await page.keyboard.press("Space");
    const after = await page.locator("#count").textContent();
    if (before !== after)
      fail(
        `${viewport.width}: Space on focused content button navigated slide ${i + 1}`,
      );
    await measure(
      page,
      `${viewport.width}x${viewport.height} slide ${i + 1} click-${j + 1}`,
    );
  }
  const type = initial.type;
  // The generic click pass above deliberately touches every control. Restore a clean
  // state before the preset-specific assertions so selection order is deterministic.
  if (await page.locator("#reset").isVisible())
    await page.locator("#reset").click();
  if (type === "cloze" || type === "gap") {
    const options = page.locator("#slide .choices button");
    for (let j = 0; j < (await options.count()); j++) {
      await options.nth(j).click();
      const value = await page.locator(".blank").textContent();
      const expected = await options.nth(j).textContent();
      if (value.trim() !== expected.trim())
        fail(
          `${viewport.width}: ${type} click did not fill exact option on slide ${i + 1}`,
        );
    }
    await page.locator("#reveal").click();
    const answer = await page.locator(".blank").textContent();
    if (answer.trim() !== spec.answer)
      fail(`${viewport.width}: ${type} Reveal left blank on slide ${i + 1}`);
  } else if (type === "choice") {
    const first = page.locator("#slide .choices button").first();
    await first.focus();
    await page.keyboard.press("Enter");
    if ((await first.getAttribute("aria-pressed")) !== "true")
      fail(`${viewport.width}: Enter did not select choice on slide ${i + 1}`);
    await page.locator("#reveal").click();
    if (!(await page.locator(".answer").count()))
      fail(`${viewport.width}: choice Reveal missing answer on slide ${i + 1}`);
  } else if (type === "sort") {
    const rows = page.locator(".sort-row");
    for (let j = 0; j < (await rows.count()); j++) {
      const cats = rows.nth(j).locator("button");
      await cats.last().click();
    }
    await page.locator("#reveal").click();
    for (let j = 0; j < spec.items.length; j++) {
      const selected = await rows
        .nth(j)
        .locator('button[aria-pressed="true"]')
        .textContent();
      if (selected.replace(/^✓ /, "") !== spec.items[j].category)
        fail(`sort canonical mismatch: ${spec.id} item ${j}`);
    }
  } else if (type === "order") {
    const buttons = page.locator("#slide .list button");
    for (let j = 0; j < (await buttons.count()); j++)
      await buttons.nth(j).click();
    const selected = await page
      .locator('#slide .list button[aria-pressed="true"]')
      .count();
    if (selected !== (await buttons.count()))
      fail(
        `${viewport.width}: order did not select all items on slide ${i + 1}`,
      );
    await buttons.first().click();
    const afterDeselect = await page
      .locator("#slide .list button")
      .first()
      .textContent();
    if (!/^○/.test(afterDeselect))
      fail(
        `${viewport.width}: order deselect did not clear marker on slide ${i + 1}`,
      );
    await page.locator("#reveal").click();
    for (let j = 0; j < spec.items.length; j++) {
      if ((await buttons.nth(j).textContent()) !== `${j + 1}. ${spec.items[j]}`)
        fail(`order canonical mismatch ${spec.id}`);
    }
  } else if (type === "steps") {
    const expected = await page.locator("#slide .list .step").count();
    let clicks = 0;
    while (!(await page.locator("#reveal").isDisabled()) && clicks < 8) {
      await page.locator("#reveal").click();
      clicks++;
    }
    const final = await page.locator("#slide .list .step").count();
    if (final !== spec.items.length)
      fail(
        `${viewport.width}: steps Reveal did not reach all items on slide ${i + 1}`,
      );
  } else if (["reveal", "writing"].includes(type))
    await page.locator("#reveal").click();

  if (!["prompt", "compare", "passage", "image"].includes(type)) {
    await measure(
      page,
      `${viewport.width}x${viewport.height} slide ${i + 1} final`,
    );
    await screenshot(page, viewport, i + 1, "final");
  }
  if (i < total - 1) {
    const before = await state(page);
    await page.locator("#next").click();
    await page.keyboard.press("ArrowLeft");
    if ((await state(page)).text !== before.text)
      fail(`state lost on revisit ${spec.id}`);
  }
  if (await page.locator("#reset").isVisible()) {
    await page.locator("#reset").click();
    const reset = await state(page);
    if (reset.text !== initial.text || reset.id !== initial.id)
      fail(
        `${viewport.width}: Reset changed base slide unexpectedly on slide ${i + 1}`,
      );
    await screenshot(page, viewport, i + 1, "reset");
  }
  if (i < total - 1) {
    await page.locator("#next").click();
    await page.keyboard.press("ArrowLeft");
    if ((await state(page)).id !== initial.id)
      fail(`${viewport.width}: navigation revisit lost slide ${i + 1}`);
  }
}

(async () => {
  const options = { headless: true };
  if (
    process.env.PLAYWRIGHT_CHROME_EXECUTABLE &&
    fs.existsSync(process.env.PLAYWRIGHT_CHROME_EXECUTABLE)
  )
    options.executablePath = process.env.PLAYWRIGHT_CHROME_EXECUTABLE;
  else if (process.env.PLAYWRIGHT_CHANNEL)
    options.channel = process.env.PLAYWRIGHT_CHANNEL;
  else if (
    fs.existsSync(
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    )
  )
    options.channel = "chrome";
  const browser = await chromium.launch(options);
  try {
    for (const viewport of viewports) {
      const page = await browser.newPage({ viewport });
      const js = [];
      page.on("pageerror", (e) => js.push(e.message));
      await page.goto(`file://${target}`, { waitUntil: "load" });
      const total = Number(
        (await page.locator("#count").textContent()).split("/")[1],
      );
      for (let i = 0; i < total; i++) await testSlide(page, viewport, i, total);
      if (js.length) fail(`${viewport.width}: page errors ${js.join(" | ")}`);
      await page.close();
    }
  } finally {
    await browser.close();
  }
  if (failures.length) {
    console.error(`FAIL (${failures.length})`);
    failures.forEach((x) => console.error(`- ${x}`));
    process.exit(1);
  }
  console.log(
    `PASS: ${target} at ${viewports.map((x) => `${x.width}x${x.height}`).join(", ")}`,
  );
})().catch((e) => {
  console.error(e.stack || e);
  process.exit(1);
});
