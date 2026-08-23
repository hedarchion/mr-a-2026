#!/usr/bin/env node
/**
 * build-deck-index.mjs — regenerate the workspace homepage (index.html).
 *
 * Scans decks/<class>/<year>/week-<NN>/<YYYY-MM-DD>-<topic>/ lesson folders,
 * extracts class / year / week / date / topic metadata, reads the topic title
 * from each notes.md heading (falling back to the humanised slug), detects
 * slide decks (index.html), and writes a self-contained
 * static index.html at the repository root.
 *
 * Usage:  node scripts/build-deck-index.mjs
 * Re-run after adding, renaming, or removing a lesson folder.
 */
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const decksRoot = join(root, 'decks');
const outFile = join(root, 'index.html');

const WEEK_RE = /^week-(\d+)$/i;
const LESSON_RE = /^(\d{4})-(\d{2})-(\d{2})-(.+)$/;

/** Collect every lesson folder: decks/<class>/<year>/week-N/<date>-<topic>. */
function findLessons(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const path = join(dir, entry.name);
    const rel = path.slice(decksRoot.length + 1).split(sep);
    if (rel.length === 4 && WEEK_RE.test(rel[2]) && LESSON_RE.test(rel[3])) {
      out.push(path);
    } else if (rel.length < 4) {
      findLessons(path, out);
    }
  }
  return out;
}

/** Title-case a slug, e.g. "common-illness-past-tense" -> "Common Illness Past Tense". */
function humaniseSlug(slug) {
  return slug
    .split('-')
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ');
}

/** Strip a leading "Class 1D" token and separators from a notes.md heading. */
function topicFromHeading(heading) {
  let t = heading.replace(/^#\s*/, '').trim();
  t = t.replace(/^Class\s+\d\w+\s*[\u00b7\-—:]*\s*/i, '').trim();
  t = t.replace(/^[\u00b7\-—:]\s*/, '').trim();
  // Generic headings like "Week 28 · 11 August 2026" carry no topic -> fallback.
  if (/^week\s+\d+/i.test(t) || /^\d{1,2}\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i.test(t)) return null;
  return t || null;
}

function readTopicTitle(folder, slug) {
  const notes = join(folder, 'notes.md');
  if (existsSync(notes)) {
    const head = readFileSync(notes, 'utf8').split('\n').find((l) => /^#\s+/.test(l));
    if (head) {
      const t = topicFromHeading(head);
      if (t) return t;
    }
  }
  return humaniseSlug(slug);
}

function fileExists(folder, name) {
  return existsSync(join(folder, name));
}

const lessons = findLessons(decksRoot)
  .map((folder) => {
    const cls = folder.slice(decksRoot.length + 1).split(sep)[0];
    const m = LESSON_RE.exec(folder.split(sep).pop());
    const [, year, mm, dd, slug] = m;
    const rel = folder.slice(root.length).split(sep).join('/');
    const date = `${year}-${mm}-${dd}`;
    return {
      class: cls.replace(/^class-/i, '').toUpperCase(), // "1D"
      classSlug: cls,                                    // "class-1d"
      year,
      week: WEEK_RE.exec(folder.split(sep)[folder.split(sep).length - 2])[1],
      date,
      day: weekday(date),
      topic: readTopicTitle(folder, slug),
      topicSlug: slug,
      href: rel + '/',
      hasSlides: fileExists(folder, 'index.html'),
      worksheet: fileExists(folder, 'worksheet.html') ? 'worksheet.html' : null,
      worksheetPdf: readdirSync(folder).find((f) => /worksheet.*\.pdf$/i.test(f)) || null,
      notes: fileExists(folder, 'notes.md'),
    };
  })
  .filter((lesson) => lesson.hasSlides)
  .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.classSlug.localeCompare(b.classSlug)));

function weekday(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', { weekday: 'long' });
}

const classes = [...new Set(lessons.map((l) => l.class))].sort();
const weeks = [...new Set(lessons.map((l) => l.week))].sort((a, b) => Number(a) - Number(b));
const days = [...new Set(lessons.map((l) => l.day))].sort(
  (a, b) => ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].indexOf(a)
    - ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].indexOf(b)
);

const json = JSON.stringify(lessons).replace(/</g, '\\u003c');
const meta = JSON.stringify({ classes, weeks, days, generated: new Date().toISOString().slice(0, 10) }).replace(/</g, '\\u003c');

// Concentric rings of curved text (SVG textPath) in Inter Black (900).
// Typography-driven layout: radii grow geometrically (~20% per ring) and each
// ring's font size is derived from its circumference, so the phrase fills every
// ring at ~100% with natural character spacing (no stretch, no gaps, no repeats).
// Each ring has its own hue (teal -> amber across radii), opacity (inner fainter,
// outer crisper = the hero ring), geared speed (inner fast, outer slow), staggered
// phrase start angle, and a slow "breath" scale. Hover pauses the spin.
const RULE_PHRASE = 'First Rule of the Class is to Listen when <tspan fill="#d62828">Mr A</tspan> is speaking';
const RING_CX = 683;
const RING_CY = 384;
// Natural advance of the phrase in Manufacturing Consent, measured in-page
// (plain text, straight path, and circle all agree): ~20.9em (58 chars).
// Ascent ~0.92em / descent ~0.28em; on the counter-clockwise arcs the glyph
// bodies hang inward from the circle, so deep descenders/ligature tails stay
// inside the ring band and never poke outward past the ring radius.
const RULE_PHRASE_EM = 20.9;
// Manufacturing Consent has tall glyphs (~1.2em total, mostly hanging inward),
// so fonts sized for 100% fill would make neighbouring rings' text bands
// interleave into one mass (measured overlap up to ~56px on the outer rings).
// Backing the fill target off to 80% keeps every ring a closed loop while
// shrinking the bands so adjacent rings only kiss (~2-28px, like the Inter
// layout that was well received).
const RULE_FILL_TARGET = 0.8;
const ruleRingsMarkup = [
  { r: 100, dur: 60,  dir: 'normal',  delay: 5,  bdur: 34, bdelay: 2,  color: '#0a8f8c', op: 0.6 },
  { r: 120, dur: 68,  dir: 'reverse', delay: 14, bdur: 42, bdelay: 11, color: '#1680a8', op: 0.64 },
  { r: 144, dur: 76,  dir: 'normal',  delay: 23, bdur: 29, bdelay: 5,  color: '#1f6fb0', op: 0.68 },
  { r: 173, dur: 84,  dir: 'reverse', delay: 32, bdur: 38, bdelay: 17, color: '#3363bc', op: 0.72 },
  { r: 207, dur: 92,  dir: 'normal',  delay: 41, bdur: 46, bdelay: 8,  color: '#4d55c4', op: 0.76 },
  { r: 249, dur: 100, dir: 'reverse', delay: 50, bdur: 33, bdelay: 21, color: '#6a4cc8', op: 0.8 },
  { r: 299, dur: 108, dir: 'normal',  delay: 59, bdur: 40, bdelay: 3,  color: '#8a44c4', op: 0.84 },
  { r: 358, dur: 116, dir: 'reverse', delay: 68, bdur: 48, bdelay: 14, color: '#a644ae', op: 0.88 },
  { r: 430, dur: 124, dir: 'normal',  delay: 77, bdur: 36, bdelay: 25, color: '#bf4d8c', op: 0.92 },
  { r: 516, dur: 132, dir: 'reverse', delay: 86, bdur: 44, bdelay: 7,  color: '#cf6a3f', op: 0.96 },
].map((ring, i) => {
  const circ = 2 * Math.PI * ring.r;
  const fs = Math.round((circ * RULE_FILL_TARGET) / RULE_PHRASE_EM); // font sized so the phrase ~fills the ring
  // Staggered path start so the phrase begins at a different angle on every ring.
  const a = ((180 + i * 36) * Math.PI) / 180;
  const x1 = RING_CX + ring.r * Math.cos(a);
  const y1 = RING_CY + ring.r * Math.sin(a);
  const x2 = RING_CX - ring.r * Math.cos(a);
  const y2 = RING_CY - ring.r * Math.sin(a);
  const d = `M ${x1.toFixed(1)} ${y1.toFixed(1)} a ${ring.r} ${ring.r} 0 1 0 ${(x2 - x1).toFixed(1)} ${(y2 - y1).toFixed(1)} a ${ring.r} ${ring.r} 0 1 0 ${(x1 - x2).toFixed(1)} ${(y1 - y2).toFixed(1)}`;
  return `        <g class="rule-ring" style="--dur: ${ring.dur}s; --dir: ${ring.dir}; --delay: -${ring.delay}s; opacity: ${ring.op}; color: ${ring.color};">
          <g class="rule-breathe" style="--bdur: ${ring.bdur}s; --bdelay: -${ring.bdelay}s;">
            <path id="rule-ring-${i + 1}" d="${d}" fill="none" />
            <text font-size="${fs}"><textPath href="#rule-ring-${i + 1}" textLength="${Math.round(circ)}">${RULE_PHRASE}</textPath></text>
          </g>
        </g>`;
}).join('\n');

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mr. A's Class Slides</title>
    <style>
      :root { color-scheme: light; font-family: system-ui, -apple-system, "Segoe UI", sans-serif; color: #13233a; background: #eef3f9; }
      * { box-sizing: border-box; }
      body { margin: 0; overflow-x: hidden; }
      .wrap { position: relative; z-index: 1; max-width: 1040px; margin: 0 auto; padding: 3rem 1.5rem 4rem; }
      header h1 { font-size: clamp(2rem, 5vw, 3rem); letter-spacing: -.04em; margin: 0 0 .4rem; }
      header p { margin: 0; color: #52657d; max-width: 60ch; }
      .rule-waves { position: fixed; inset: 0; z-index: 0; overflow: hidden; opacity: .18; pointer-events: auto; user-select: none; }
      .rule-svg { position: absolute; inset: 0; width: 100%; height: 100%; }
      .rule-ring { transform-box: fill-box; transform-origin: center; will-change: transform; animation: ring-spin var(--dur, 120s) linear infinite; animation-direction: var(--dir, normal); animation-delay: var(--delay, 0s); }
      .rule-breathe { transform-box: fill-box; transform-origin: center; will-change: transform; animation: breathe var(--bdur, 40s) ease-in-out infinite alternate; animation-delay: var(--bdelay, 0s); }
      @font-face {
        font-family: 'Manufacturing Consent';
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: url('assets/manufacturing-consent-latin.woff2') format('woff2');
      }
      @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 900;
        font-display: swap;
        src: url('assets/inter-900-latin.woff2') format('woff2');
      }
      .rule-ring text { font-family: 'Manufacturing Consent', 'Inter', system-ui, -apple-system, "Segoe UI", sans-serif; font-weight: 400; letter-spacing: normal; fill: currentColor; }
      @keyframes ring-spin { to { transform: rotate(360deg); } }
      @keyframes breathe { from { transform: scale(.985); } to { transform: scale(1.015); } }
      .rule-waves:hover .rule-ring, .rule-waves:hover .rule-breathe { animation-play-state: paused; }
      .filters { display: flex; flex-wrap: wrap; gap: .6rem; align-items: center; margin: 1.75rem 0 1rem; }
      .filters select {
        appearance: none; -webkit-appearance: none; font: inherit; color: inherit; background-color: #fff;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='8' viewBox='0 0 14 8'%3E%3Cpath d='m1 1 6 6 6-6' fill='none' stroke='%231f5f9e' stroke-linecap='round' stroke-linejoin='round' stroke-width='2'/%3E%3C/svg%3E");
        background-position: right .85rem center; background-repeat: no-repeat; border: 1px solid #c9d6e4; border-radius: .65rem; min-width: 9.6rem; padding: .58rem 2.75rem .58rem .82rem;
      }
      .filters select:focus-visible { outline: 3px solid #7db3e6; outline-offset: 2px; }
      .count { font-size: .9rem; color: #52657d; margin: 0 0 1rem; }
      .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem; }
      .card {
        background: #fff; border: 1px solid #dce6f0; border-radius: .9rem; padding: 1rem 1.1rem 1.1rem;
        box-shadow: 0 8px 24px #173a6610; display: flex; flex-direction: column; gap: .6rem;
      }
      .card h2 { font-size: 1.06rem; line-height: 1.35; margin: 0; letter-spacing: -.01em; }
      .card h2 a { color: #13233a; text-decoration: none; }
      .card h2 a:hover { text-decoration: underline; text-decoration-color: #2f6fb2; text-underline-offset: 3px; }
      .badges { display: flex; flex-wrap: wrap; gap: .35rem; }
      .badge {
        font-size: .72rem; font-weight: 600; padding: .18rem .5rem; border-radius: 999px;
        background: #e6eef8; color: #2c5583; border: 1px solid #cdddec;
      }
      .badge.new { background: #fff3d6; color: #8a5a00; border-color: #f2d98c; }
      .meta { font-size: .85rem; color: #52657d; }
      .links { display: flex; margin-top: auto; padding-top: .2rem; }
      .links a {
        font-size: .82rem; font-weight: 600; text-decoration: none; border-radius: .5rem; padding: .38rem .7rem;
        background: #eef4fb; color: #1f5f9e; border: 1px solid #cdddec;
      }
      .links a.primary { background: #1f5f9e; border-color: #1f5f9e; color: #fff; }
      .links a:hover { filter: brightness(.96); }
      .empty { padding: 2.5rem 1rem; text-align: center; color: #52657d; background: #fff; border: 1px dashed #c9d6e4; border-radius: .9rem; }
      .reset { display: none; font: inherit; font-size: .85rem; background: #fff; border: 1px solid #c9d6e4; border-radius: .55rem; padding: .45rem .7rem; color: #1f5f9e; cursor: pointer; }
      .reset:hover { background: #eef4fb; }
      @media (prefers-reduced-motion: reduce) { .rule-ring, .rule-breathe { animation: none; } }
    </style>
  </head>
  <body>
    <main class="wrap">
      <header>
        <h1>Mr. A's Class Slides</h1>
        <p>Latest lessons first. Filter the slide library by class, week, or day.</p>
      </header>

      <div class="filters" aria-label="Slide filters">
        <select id="f-class" aria-label="Filter by class">
          <option value="">All classes</option>
        </select>
        <select id="f-week" aria-label="Filter by week">
          <option value="">All weeks</option>
        </select>
        <select id="f-day" aria-label="Filter by day">
          <option value="">All days</option>
        </select>
        <button id="reset" class="reset" type="button">Clear filters</button>
      </div>
      <p id="count" class="count"></p>
      <div id="grid" class="grid"></div>
    </main>

    <div class="rule-waves" aria-hidden="true">
      <svg class="rule-svg" viewBox="0 0 1366 768" preserveAspectRatio="xMidYMid meet" role="presentation">
${ruleRingsMarkup}
      </svg>
    </div>

    <script type="application/json" id="deck-data">${json}</script>
    <script type="application/json" id="deck-meta">${meta}</script>
    <script>
      const DECKS = JSON.parse(document.getElementById('deck-data').textContent);
      const META = JSON.parse(document.getElementById('deck-meta').textContent);
      const state = { cls: '', week: '', day: '' };

      const els = {
        cls: document.getElementById('f-class'),
        week: document.getElementById('f-week'),
        day: document.getElementById('f-day'),
        reset: document.getElementById('reset'),
        count: document.getElementById('count'),
        grid: document.getElementById('grid'),
      };

      META.classes.forEach((c) => els.cls.add(new Option('Class ' + c, c)));
      META.weeks.forEach((w) => els.week.add(new Option('Week ' + w, w)));
      META.days.forEach((d) => els.day.add(new Option(d, d)));

      const fmtDate = (iso) => {
        const [y, m, d] = iso.split('-').map(Number);
        return new Date(y, m - 1, d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      };

      function filtered() {
        return DECKS.filter((l) => {
          if (state.cls && l.class !== state.cls) return false;
          if (state.week && l.week !== state.week) return false;
          if (state.day && l.day !== state.day) return false;
          return true;
        });
      }

      function render() {
        const list = filtered();
        els.count.textContent = list.length === DECKS.length
          ? DECKS.length + ' slide deck' + (DECKS.length === 1 ? '' : 's')
          : 'Showing ' + list.length + ' of ' + DECKS.length + ' slide decks';
        els.reset.style.display = (state.cls || state.week || state.day) ? 'inline-block' : 'none';
        if (!list.length) {
          els.grid.innerHTML = '<div class="empty">No lessons match. Clear a filter or try a different search.</div>';
          return;
        }
        const latest = DECKS[0].date; // DECKS is pre-sorted newest first
        els.grid.innerHTML = list.map((l) => {
          const badges = [];
          badges.push('<span class="badge">Class ' + l.class + '</span>');
          badges.push('<span class="badge">Week ' + l.week + '</span>');
          if (l.date === latest) badges.push('<span class="badge new">Latest</span>');
          const links = '<a class="primary" href="' + l.href + '">Open slides</a>';
          return '<article class="card">'
            + '<h2><a href="' + l.href + '">' + esc(l.topic) + '</a></h2>'
            + '<div class="badges">' + badges.join('') + '</div>'
            + '<div class="meta">' + l.day + ' · ' + fmtDate(l.date) + '</div>'
            + '<div class="links">' + links + '</div>'
            + '</article>';
        }).join('');
      }

      const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

      const onInput = (key) => (e) => { state[key] = e.target.value; render(); };
      els.cls.addEventListener('change', onInput('cls'));
      els.week.addEventListener('change', onInput('week'));
      els.day.addEventListener('change', onInput('day'));
      els.reset.addEventListener('click', () => {
        state.cls = state.week = state.day = '';
        els.cls.value = ''; els.week.value = ''; els.day.value = '';
        render();
      });

      render();
    </script>
  </body>
</html>
`;

writeFileSync(outFile, html);
console.log('Wrote ' + outFile);
console.log('Indexed ' + lessons.length + ' slide decks: ' + lessons.map((l) => l.date + ' ' + l.class + ' ' + l.topic).join(' | '));
