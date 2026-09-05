# Teacher-led HTML slides, version 1

Write the content JSON. Reuse the renderer, stylesheet and interaction runtime. No per-lesson CSS or JavaScript is needed for supported presets.

```sh
node templates/teacher-led-html/render.mjs path/to/content.json path/to/index.html
node --test templates/teacher-led-html/render.test.mjs
```

The build validates content, embeds CSS/JS/data in `index.html`, copies referenced images from the input folder's `assets/`, and exports `generated-slide-notes.md`. It runs offline and opens directly as a file. Keep the JSON as the editable source. `generated-slide-notes.md` is generated; put lesson context, objectives, source references, assumptions and delivery decisions in separately maintained `notes.md`.

Try the complete component sample:

```sh
node templates/teacher-led-html/render.mjs templates/teacher-led-html/examples/sample.json reviews/slide-system-2026-09-05/sample/index.html
```

## Content contract

```json
{
  "version": 1,
  "title": "Lesson title",
  "viewport": "1366x768",
  "slides": [{
    "id": "one-question",
    "type": "reveal",
    "prompt": "What do you notice?",
    "answer": "A short example answer.",
    "feedback": "A short explanation of the important detail.",
    "hint": "An optional clue.",
    "notes": "Teacher delivery notes, never projected."
  }]
}
```

`viewport` is optional, defaults to `1366x768`, and also accepts `1280x665`. The stage scales to the browser while preserving the composition. Inspect at the intended classroom size; scaling to a smaller screen does not guarantee legibility from the back of a room.

All text is plain text, rendered safely as text nodes. Do not pass HTML, CSS, a component tree or scripts. Every slide needs a unique `id`, supported `type`, and `prompt`. `hint` and `notes` are optional. Public answers are present in the HTML data even before Reveal; this is a teacher-led teaching surface, not a secure test. Notes are excluded from HTML but remain in the JSON/Markdown: never put private pupil data in any publishable source.

| Preset | Required content | Classroom use |
|---|---|---|
| `prompt` | `prompt` | Retrieval, discussion, exit question, a single instruction |
| `reveal` | `answer`, `feedback` | Model, explanation, error repair after thinking |
| `choice` | 2–4 `options`, exact `answer`, `feedback` | Choose, then discuss and reveal |
| `cloze` | `sentence` with one `{{blank}}`, `options`, `answer`, `feedback` | Selection fills the blank inline immediately |
| `gap` | story `text` with one `{{blank}}` (max 40 words), 2–4 `options`, exact `answer`, `feedback` | Tap a candidate to test-drive it inside the story gap, then reveal |
| `compare` | Two `columns`, each with `label` and `text` | One meaningful contrast |
| `steps` | 2–4 short `items` | First item visible; Next step adds one at a time |
| `passage` | `text` | Complete short reading evidence with one question |
| `order` | 2–4 unique `items` in canonical order, `feedback` | Items shown in reverse order; click in sequence, click again to remove |
| `sort` | 2–3 `categories`, 2–4 `items` with `text` and canonical `category`, `feedback` | Click an item's category, then Reveal |
| `image` | Local `src` (`assets/...`), descriptive `alt` | One image with one question |
| `writing` | `task`, optional `frame` | Application; optional frame hidden until Reveal |

Use `reveal` for error repair, `order` for sentence chunks, `steps` for a gradually built model, and `prompt` for partner talk or exit questions. These do not need separate visual designs. Rich multi-gap reading, audio and video, hotspots, timed activities and freeform annotation are not yet supported. Add a named reusable preset with validation and browser tests when one is needed; do not hide custom markup in JSON or rebuild a lesson shell.

## Keep the surface essential

- Start with one prompt, example, or coherent piece of evidence. Omit repeated titles, class/date badges, objectives, timings, activity labels and teacher talk.
- Hints and answers stay hidden until requested. Selection shows an attempt; it does not grade automatically. Reveal supplies the canonical answer and explanation.
- Default prompt limit: 22 words; options: 10 words each; hints and feedback: 24 words; answers: 35 words. These are prototype guardrails, not research-derived thresholds.
- Reading has a dedicated 85-word limit. Keep necessary evidence together; split longer passages at meaningful paragraph boundaries and retain a printable full text when needed. Do not shorten assessment evidence merely to satisfy a slide limit.
- Do not shrink fonts to bypass validation. Rewrite, split the teaching move, or add and test a suitable preset.
- Reset affects only the current slide. Moving away and back preserves its state. Arrow keys navigate; Space navigates when focus is on the page and activates a focused button normally. Tab and Enter operate all controls.

## Verification and versioning

Run content tests, then inspect every initial/hint/reveal/reset state and real pointer/keyboard behavior in a browser at the selected canvas. Include inline gap updates, categorisation, ordering, revisiting slides, and image loading. Schema limits alone cannot detect every long word, overflow, incorrect answer or inaccessible composition.

Changes to the shared runtime affect only decks rebuilt afterward. Keep generated legacy HTML frozen until a specific migration is requested. Rebuild a lesson from its JSON after any runtime fix, verify it, and follow normal Source of Truth and publication rules. Increment the data version for incompatible contract changes and document migrations. Local generation does not authorize publishing.

The manifest reports separate initial, hinted and revealed word estimates. Ordinary initial states are limited to 65 words; hinted/revealed states to 110. These estimates exclude navigation labels and include repeated category labels. Always inspect the rendered state as well.

Browser verification (Playwright must be available):

```sh
node templates/teacher-led-html/verify.cjs path/to/index.html /tmp/slide-screenshots
```

If Playwright is supplied by a bundled runtime, set `PLAYWRIGHT_MODULE` to its module path. Set `PLAYWRIGHT_CHANNEL=chrome` to use installed Chrome, or let Playwright use its installed Chromium. The verifier exercises each supported preset and both browser sizes, checks content above the footer and image loading, and can save state screenshots. Also build the compatibility canvas explicitly when using `1280x665`; a smaller browser viewport alone only scales the original canvas.


## Projection at 4–6 metres

The audience is students, viewing a laptop over HDMI on a smart TV or a large Imago smartboard. The teacher estimates the back row at 4–6 metres. Actual screen dimensions and lighting are not recorded; browser QA verifies layout, not physical eyesight or back-row readability.

Use the shared projection scale: 96 px for a lone prompt, 60 px for ordinary questions, 48 px for body/answers, 46 px for passages, 44 px for choices, 40 px for ordered items, and at least 36 px for hints, labels and feedback. These are logical canvas sizes. Sparse states enlarge up to 25% (40% for lone prompts/reveals) while staying inside the safe area. The runtime never reduces below the base scale; split any content that fails the browser check. Type size may change when a hint or answer is revealed because that state has more content.

Side margins are 44 px; vertical content padding is 32 px. The footer is 76 px high with controls at least 48 px tall on the canvas. Images use the remaining teaching area with their original aspect ratio preserved, without cropping teaching evidence. Do not add filler to use space. Do not put teacher talk or metadata back into the projected slide.

Verify canonical layouts plus 1920 × 1080 fullscreen and the legacy 1265 × 536 browser profile. Those browser sizes are QA conditions, not claimed Imago hardware specifications. Use fullscreen on the actual teaching display where possible. Proportional scaling preserves content and may leave bars when the window and canvas have different aspect ratios.
