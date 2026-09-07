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

For diagnostic and tutoring decks, use one question per slide. Optional semantic fields `label`, `instruction` and `stimulus` render respectively as a subordinate task label, a subordinate administration instruction, and same-slide evidence beneath the dominant question. Use root `"mode": "answering"` for neutral teacher-operated response capture; place a `review` slide with `reviewIds` after the full question set so response review and JSON export happen once at the end.

| Preset | Required content | Classroom use |
|---|---|---|
| `prompt` | `prompt` | Retrieval, discussion, exit question, a single instruction |
| `reveal` | `answer`, `feedback` | Model, explanation, error repair after thinking |
| `choice` | 2–4 `options`, exact `answer`, `feedback` | Choose, then discuss and reveal |
| `cloze` | `sentence` with one `{{blank}}`, `options`, `answer`, `feedback` | Selection fills the blank inline immediately |
| `gap` | story `text` with one `{{blank}}` (max 30 words), one-line `prompt` (max 48 chars), 2–4 `options`, exact `answer`, `feedback` | Tap a candidate to test-drive it inside the story gap, then reveal |
| `compare` | Two `columns`, each with `label` and `text` | One meaningful contrast |
| `steps` | 2–4 short `items` | First item visible; Next step adds one at a time |
| `passage` | `text` | Complete short reading evidence with one question |
| `order` | 2–4 unique `items` in canonical order, `feedback` | Items shown in reverse order; click in sequence, click again to remove |
| `sort` | 2–3 `categories`, 2–4 `items` with `text` and canonical `category`, `feedback` | Click an item's category, then Reveal |
| `wordmix` | 2–6 `pairs` with `word` and `meaning`, 2–4 `ideas`, `frame` | Keep a complete vocabulary set visible while choosing a word and idea for an original sentence |
| `image` | Local `src` (`assets/...`), descriptive `alt` | One image with one question |
| `writing` | `task`, optional `frame` | Application; optional frame hidden until Reveal |

Use `reveal` for error repair, `order` for sentence chunks, `steps` for a gradually built model, and `prompt` for partner talk or exit questions. These do not need separate visual designs. Rich multi-gap reading, audio and video, hotspots, timed activities and freeform annotation are not yet supported. Add a named reusable preset with validation and browser tests when one is needed; do not hide custom markup in JSON or rebuild a lesson shell.

## Implement the accepted content states

- The accepted copywriting storyboard determines the pupil content, sequence and allocation among initial, hint, reveal and teacher-note states. The renderer implements those roles; it does not independently add, delete, reorder or rewrite teaching content.
- Selection before Check/Reveal is a neutral attempt. After Check/Reveal, keep a wrong attempted option visible with explicit wrong text or a symbol, identify the canonical answer separately, and show the supplied explanatory feedback. Use a high-contrast visual treatment plus text/symbols and an accessible announcement; colour alone is insufficient. A correct attempt receives an equally explicit correct state.
- Default prompt limit: 22 words; options: 10 words each; hints and feedback: 24 words; answers: 35 words. These are prototype guardrails, not research-derived thresholds.
- Reading has a dedicated 85-word limit. Keep necessary evidence together; split longer passages at meaningful paragraph boundaries and retain a printable full text when needed. Do not shorten assessment evidence merely to satisfy a slide limit.
- Do not shrink fonts to bypass validation. Use a suitable preset or return a fit problem to the copywriting workflow. A material wording or sequence change does not belong to the renderer.
- Reset affects only the current slide. Moving away and back preserves its state. Left/right arrows navigate; Space reveals the answer or next reveal step, including when a button has focus. Further Space presses do nothing after the last step. Command+Space resets the current slide. Tab and Enter operate controls. Editable fields retain ordinary typing. macOS may intercept Command+Space for Spotlight; use the visible Reset button if the browser does not receive it.

## Verification and versioning

Run content tests, then inspect every initial, hint, neutral-attempt, correct, incorrect, reveal, reset and revisit state with real pointer and keyboard behavior in a browser at the selected canvas. Include inline gap updates, categorisation, ordering and image loading. A deliberately wrong attempt must remain visible after checking, the canonical answer must be marked separately, status text and the accessible announcement must name the result, and reset must clear every attempt/result state. Schema limits alone cannot detect weak hierarchy, subtle wrong-answer treatment, overflow, incorrect answers or inaccessible composition.

Changes to the shared runtime affect only decks rebuilt afterward. Keep generated legacy HTML frozen until a specific migration is requested. Rebuild a lesson from its JSON after any runtime fix, verify it, and follow normal Source of Truth and publication rules. Increment the data version for incompatible contract changes and document migrations. Local generation does not authorize publishing.

The manifest reports separate initial, hinted and revealed word estimates. Ordinary initial states are limited to 65 words; hinted/revealed states to 110. These estimates exclude navigation labels and include repeated category labels. Always inspect the rendered state as well.

Browser verification (Playwright must be available):

```sh
node templates/teacher-led-html/verify.cjs path/to/index.html /tmp/slide-screenshots
```

If Playwright is supplied by a bundled runtime, set `PLAYWRIGHT_MODULE` to its module path. Set `PLAYWRIGHT_CHANNEL=chrome` to use installed Chrome, or let Playwright use its installed Chromium. The verifier exercises each supported preset and the four browser sizes, checks content above the footer and image loading, and can save state screenshots. Also build the compatibility canvas explicitly when using `1280x665`; a smaller browser viewport alone only scales the original canvas.


## Projection at 4–6 metres

The audience is students, viewing a laptop over HDMI on a smart TV or a large Imago smartboard. The teacher estimates the back row at 4–6 metres. Actual screen dimensions and lighting are not recorded; browser QA verifies layout, not physical eyesight or back-row readability.

Use the shared projection scale: 96 px for a lone prompt, 60 px for ordinary questions, 48 px for body/answers, 46 px for passages, 44 px for choices, 40 px for ordered items, and at least 36 px for hints, labels and feedback. These are logical canvas sizes. Sparse states enlarge up to 25% (40% for lone prompts/reveals) while staying inside the safe area. The runtime never reduces below the base scale; split any content that fails the browser check. Type size may change when a hint or answer is revealed because that state has more content.

Use shared semantic type roles to create an immediate reading order. The primary pupil job or synthesis heading is strongest; evidence/examples and choices form a second tier; hints, statuses and explanations remain clearly subordinate but fully readable. Use size and weight first, supported by spacing, alignment, placement and restrained colour. Never make grey, opacity, ALL CAPS or colour the only hierarchy cue. If all projected text looks equally important, the layout fails.

Side margins are 44 px; vertical content padding is 32 px. The footer is 76 px high with controls at least 48 px tall on the canvas. Images use the remaining teaching area with their original aspect ratio preserved, without cropping teaching evidence. Do not add filler to use space. Do not put teacher talk or metadata back into the projected slide.

Verify canonical layouts plus 1920 × 1080 fullscreen and the legacy 1265 × 536 browser profile. Those browser sizes are QA conditions, not claimed Imago hardware specifications. Use fullscreen on the actual teaching display where possible. Proportional scaling preserves content and may leave bars when the window and canvas have different aspect ratios.


## Required authoring skills and generated-file check

Read `.agents/skills/classroom-slide-design/SKILL.md` for typography, layout, interaction states and renderer-extension constraints. Read `.agents/skills/classroom-slide-copywriting/SKILL.md` for the authoritative pupil content, instructional sequence, semantic hierarchy, state allocation, feedback and all-concepts synthesis requirement. `AGENTS.md` makes these part of the workspace route even if automatic skill discovery is unavailable.

```sh
node templates/teacher-led-html/check-generated.mjs path/to/content.json path/to/index.html
node --test templates/teacher-led-html/render.test.mjs templates/teacher-led-html/check-generated.test.mjs
node templates/teacher-led-html/verify-keyboard.cjs path/to/index.html
```

The generated-file check compares HTML with a fresh in-memory rendering and verifies copied images. Rebuild if it reports stale or hand-edited output. It runs locally when invoked; no Git hook, CI workflow or publication change is installed. For a new preset, update semantic validation/counting, runtime states, role-based styles, examples, docs and actual browser assertions. The sample is a growing preset tour, not a fixed lesson length.

When the accepted storyboard contains an all-concepts synthesis beat, its final visible state must show every member of the taught set together. Use an aligned list for one shared attribute or a table/matrix for repeated comparable attributes. If no supported preset can keep the whole set readable on one viewport at the shared type scale, add and test a named semantic overview/table preset; do not split the synthesis, omit a concept or introduce per-lesson markup.

## Instructional storyboard gate

Before creating new lesson JSON or revising teaching content, the dedicated instructional content designer must draft the teaching sequence and exact pupil copy from verified context. Follow `.agents/skills/classroom-slide-copywriting/references/content-designer-handoff.md`. The main agent reviews and accepts the storyboard before rendering; return instructional weaknesses for revision. The renderer implements the accepted lesson, with content-to-JSON comparison afterward. Pure code/layout maintenance does not require a new lesson storyboard.

## Required lesson visuals

New decks and substantive revisions must implement the visual plan accepted from the independent content designer. Follow `.agents/skills/classroom-slide-design/SKILL.md`, section “Compulsory reusable visual layer”, for Lucide/unDraw selection, local assets, licence records and verification. The existing `image` preset supports local images; this documentation does not add an icon field. Extend shared semantic fields and tests when a planned composition is unsupported. Navigation icons alone do not satisfy the deck-level requirement.
