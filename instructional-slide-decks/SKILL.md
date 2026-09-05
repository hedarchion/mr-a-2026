---
name: instructional-slide-decks
description: Create, revise, and improve concise teacher-led classroom slide decks as interactive HTML, including lesson continuity, heading-aware retrieval from the local grammar reference book, formative interactions, viewport verification, and learning from teacher feedback. Use for lessons, teaching presentations, formative-assessment slides, whiteboard-replacement decks, or requests to turn a topic, curriculum objective, prior deck, or classroom comment into projected student-facing slides.
---

# Instructional Slide Decks

Build a deck for a teacher operating one shared classroom display. Treat slides as a focused teaching surface, not a document or self-paced course.

## Resolve the operating frame

Infer before asking. Use the explicit request, the target week's Source of Truth plan, earlier same-class Source of Truth lessons and reflections, target lesson folder and same-class artifacts, `copu_classes_full.json`, and workspace defaults in that order. Read [references/source-of-truth.md](references/source-of-truth.md) before retrieval. Establish the exact class/date/slot, teacher's planned focus, objective, prior learning, duration, week, language level, target viewport, and requested deliverables. Ask one concise question only when unresolved ambiguity materially changes the result. Never invent a class or replace the teacher's current-week plan with an unrelated artifact sequence.

Lesson continuity is part of the operating frame, not a decorative opener. First read the current week's planned entries and resolve the exact target lesson. Then query recent earlier `lesson_plan_entries` and read `content`, `objectives`, and `reflection` together. Treat reflections about what happened as stronger evidence than an earlier plan. Use local decks and worksheets afterward for exact artifact content, visual conventions, and interaction history. Ask only when the target mapping or a material gap remains unresolved.

Default to `1366 × 768`, 16:9. Continue at `1280 × 665` when the class's existing deck uses that viewport. Fix the canvas at the selected size, scale it to the browser window, and keep all essential content and controls above the fold.

For Form 1 classes, `1 Devotion` / `class-1d`, and `2 Devotion` / `class-2d`, design for laptop-to-smart-TV projection rather than a smartboard unless evidence says otherwise. Prefer shorter visible copy, larger interaction targets, stronger contrast, and more slides over dense text. Treat text legibility as a content requirement.

Create work at:

```text
decks/<class-slug>/<YYYY>/week-<NN>/<YYYY-MM-DD>-<topic-slug>/
├── index.html
├── assets/
└── notes.md
```

Keep worksheets and keys aligned to the deck in the same lesson folder. Keep reusable assets in `templates/`.

## Parallelize with Luna subagents

For every slide-deck or worksheet generation or revision, the main agent must first read and interpret all applicable skills and references, then delegate at least one concrete independent workstream to a subagent with `model: "gpt-5.6-luna"`. Use two or three Luna subagents by default when independent tracks exist, such as context or source retrieval, content and answer validation, visual or interaction inspection, and worksheet archive or catalog checks. Use a bounded `fork_turns` value compatible with the model override and give each subagent a precise task, inputs, output expectation, and file-ownership boundary so parallel edits do not collide.

The main agent owns the lesson architecture, integration, conflict resolution, final viewport and cross-artifact verification, Source of Truth update, and user handoff. Subagent findings are inputs, not substitutes for the main agent's required skill reading or final judgment. If collaboration tools are unavailable, state that limitation and complete all required checks locally.

When a Form 1 or Form 2 module-book page is named or materially used, also read [references/module-books.md](references/module-books.md). Use the requested printed page as the source scope, record a page-specific citation in `notes.md`, and use two independent Luna tracks for page retrieval and provenance/pedagogy validation.

## Write back to Source of Truth

For teaching Week 31 of 2026 onward, finish each verified deck or worksheet workflow by returning to the same Source of Truth record that supplied the current-week brief. Use `notes.md` and verified learner-facing artifacts as evidence. Preserve the teacher's rudimentary plan and add or update a concise **Implemented lesson notes** section rather than replacing the existing content.

In the implemented section, include the verified materials, main model/practice/application sequence, worksheet purpose, and intended evidence of learning or exit check. Separately merge one to three concise, observable learner objectives as ordered `{ id, text, isCompleted }` records only when they are genuinely new. Preserve existing text, IDs, order, and completion states. Preserve the teacher-owned `reflection` field unchanged.

Resolve the class, date, and timetable slot from the artifact and active schedule; never guess a missing mapping. After local verification, upsert only the corresponding `content` and `objectives`, then read both fields back. Treat this standing Week 31+ instruction as permission for that narrow database update, not for reflection edits or unrelated Neon changes.

## Build a compact context pack

Before drafting, build the compact implementation brief defined in [references/source-of-truth.md](references/source-of-truth.md). Begin with the teacher's target-week plan and intended objectives, then add confirmed prior teaching, unfinished learning, reflection-based artifact feedback, class-specific adjustment, and a retrieval bridge. Inspect the most relevant local deck or worksheet afterward for exact artifact details. Also capture likely misconceptions, duration, display, source evidence, and durable preferences. Do not make the user restate discoverable context.

Read [references/class-data.md](references/class-data.md) before using `copu_classes_full.json`. Use aggregate data only. Never embed rosters, names, individual scores, tiers, or the class JSON in a publishable deck. Use `teacher-tools/name-picker/index.html` in a private teacher window when needed.

Use Form 1 **A2 Revise** and Form 2 **A2 High** language targets unless the user overrides them. Differentiate through modelling, prompts, task demand, and optional extension—not public labels.

## Ground grammar accurately

For grammar or language-form lessons, query the private workspace-root `grammar for english teachers.md.md` before writing explanations, examples, distractors, or feedback:

```text
node instructional-slide-decks/scripts/search-grammar-book.mjs "<topic or contrast>" --objective "<learning objective>" --misconception "<likely error>" --limit 5
```

Run separate queries for the central rule, contrast, and likely misconception. Read the strongest distinct heading paths and adjacent passages; record the headings and line numbers in `notes.md`. Prefer explanatory and learner-difficulty sections over index entries, contents tables, or answer keys. Translate evidence into concise original A2-appropriate teaching; do not publish the book or copy long passages.

If no relevant evidence appears after related terminology and misconception queries, inspect the table of contents and headings directly. Ask for another source or permission to proceed without book grounding only after both routes fail.

## Ground non-grammar English pedagogy

For English lessons or assessments outside grammar, such as listening, reading, writing, speaking, vocabulary, genre, comprehension, test design, or rubrics, do not rely on memory alone when the local materials do not cover the pedagogical decision. Search authoritative web sources, official curriculum or exam guidance, or reputable language-teaching references. Record sources in `notes.md`, then adapt the findings into concise A2-appropriate activities, prompts, and teacher notes. When an assessment passage itself is adapted from authentic web material, paraphrase rather than copy at the target CEFR level; the learner sheet carries only a short source line (publishers and date), while full URLs, access dates, and the no-verbatim-copy statement live in the key, content input, and `notes.md`.

For A2 vocabulary selection, lexical-set planning, or checking whether a word or sense belongs to the August 2025 Cambridge A2 Key list, read [references/a2-key-vocabulary-2025.md](references/a2-key-vocabulary-2025.md). Never load or print the full JSON. Use `scripts/query-a2-vocabulary.mjs` for bounded retrieval: at most 20 compact candidates, normally 8–12 selected lesson records, and ID-only re-query for final verification. Check the intended sense, `pos_raw`, examples, regional note, and 2025 status. Record the JSON title/version plus relevant record IDs or Appendix list name in `notes.md`; do not paste raw retrieval output or publish the JSON and long source lists.

## Plan the learning sequence

Read [references/instructional-design.md](references/instructional-design.md) while mapping or reviewing a lesson.

Reserve the first 5–10 minutes of a new lesson for 2–4 retrieval prompts, including at least one explanation or application. Bridge the evidence explicitly into the new objective rather than reteaching the prior lesson.

Sequence prior knowledge → bridge → model → guided practice → check → explanatory correction → transfer. Give each slide one visible teaching move and one dominant learning question or action. Split dense ideas instead of shrinking type. Keep teacher talk tracks, wait time, anticipated responses, and transitions in `notes.md`.

## Design the projected surface

Use the smallest visual system that makes the teaching move obvious. Prefer one composition, strong hierarchy, high contrast, and direct examples over decorative panels or generic chrome. For supported teaching moves, write content JSON and reuse `templates/teacher-led-html/render.mjs`, its shared stylesheet and runtime; read `templates/teacher-led-html/README.md` before building. Do not recreate a slide shell or write per-lesson CSS/JavaScript. Add unsupported behavior as a named, validated and browser-tested reusable preset. Preserve existing legacy decks until migration is requested.

Initially show only the essential prompt, example, or reading evidence. Keep hints and answers behind teacher-controlled reveals; move timings, objectives, repeated labels, and teacher directions to notes. This is the teacher’s explicit default, including when using older decks as references.

Write every projected line as sayable presenter copy, not document copy. Prompts name the job in words the teacher can read aloud verbatim (“Which one is BEST?”), never worksheet rubrics, quiz-show riddles, sentence fragments, slang, or page-number bookkeeping. Feedback explains the mechanism and contrasts each distractor; hints are rescue lines the teacher can voice. Full spoken sentences, page numbers, timings, and administration live in notes only.

The teacher projects student-facing slides via laptop HDMI to a smart TV or Imago smartboard, with the back row about 4–6 metres away. Spend spare canvas space on larger essential text and images. Avoid oversized margins, small centred content blocks, and unused fixed-height image regions. Retain safe edges and original image proportions. In the shared template, use the projection type scale and bounded enlargement; never shrink content below that scale to make it fit. Verify all reveal states at the actual canvas and include a full-HD display check. Physical screen size and room lighting remain unknown until classroom observation.

Design for pupils who are nearsighted by default: at least 28 px body text, 34 px questions, and 38 px slide titles at the target viewport. Do not rely on color alone, muted gray, thin strokes, low-opacity text, or interaction below the navigation safe zone.

Support `ArrowLeft`, `ArrowRight`, and `Space`, plus visible previous/next controls and a clear slide indicator.

## Add formative interactions

Read [references/formative-interactions.md](references/formative-interactions.md) when adding interactions. Use the smallest interaction that reveals useful thinking: predict/reveal, choose, order, categorise, complete, or error analysis.

For PBD assessment moments, build one teacher-operated round: a prompt naming the tested skill, then steps for the randomizer pick and pupil performance. PBD means the teacher goes around with a name randomizer testing against specific learning standards — never write a pupil procedure or a "What is PBD?" explainer. Name the tested standard in `notes.md`.

Every interaction needs a prompt, response path, teacher-controlled check or reveal, explanatory feedback, reset, keyboard access, and non-digital fallback. For any **gap-fill / cloze / complete-the-sentence** interaction where the prompt sentence contains a blank (`_____` or similar), selecting an answer must **update the blank inline within the sentence itself** — the chosen word or phrase appears in the blank — in addition to any choice highlighting (e.g., green/bordered) or separate explanatory feedback. Do not rely solely on colouring the correct choice or printing the answer elsewhere; the sentence display must show the selection in context, and Reset must clear the blank again. Visible controls that do not change state, or that leave the blank empty after a selection, are failed interactions, not decoration. Refactor inherited slide code or shared button handlers when needed so the actual click and keyboard paths update both the choice state and the in-sentence blank. Avoid scores, timers, confetti, accounts, and competitive mechanics unless they directly serve the objective.

## Align worksheets

Read [references/worksheet-templates.md](references/worksheet-templates.md) before authoring worksheet HTML. Reuse the matching scaffold under `templates/worksheet-html/`, keep content in its separate input file, and render the final self-contained learner HTML instead of rebuilding stable structure. Apply the coded title there for every lesson-related worksheet. If a subtitle is useful, keep it content-only; omit learner-facing difficulty, process, or task-type annotations such as `Easy`, `Revision`, `Practice`, or `Error Correction` unless the user explicitly requests them or the official assessment format requires them.

Interpret `2 in 1` as the teacher's shorthand for duplicating a one-page worksheet as two identical document pages. The resulting file is intended for `2 pages per sheet` printing and cutting into two complete learner copies; preserve a one-copy override.

For Paper 1 Part 2, reuse `templates/worksheet-html/paper-1-part-2/` and change only the content JSON. Default to question numbers 9–16 after Paper 1 Part 1 and make the answer-table number columns extremely narrow so corrected-word spaces receive most of the width.

When a worksheet is requested, also use the `worksheet-assessment-design` skill. Default unspecified administration to brief, individual, formative, ungraded, teacher-marked work with ordinary classroom supports; record the assumption rather than stopping the build.

For an English Paper 1 or Paper 2 part assessment, read its corresponding workspace-root `paper-<paper>-part-<part>-*.md` guide before drafting. Confirm the form, use the guide's format and CEFR level, produce the answer key or rubric with the learner task, and complete its item-specific validation. Keep official-format requirements separate from UASA model-paper conventions in `notes.md`.

When the requested assessment is Form 1 English **Paper 1 Part 3** or **Information Transfer**, read the workspace-root `paper-1-part-3-information-transfer.md` as the primary format reference. It governs the task architecture: a CEFR A2 linear passage, eight semantic fields in a table or graphic organiser, eight one-mark dichotomously scored items, and normally source-lifted answers of no more than three words and/or a number. Keep official KPM requirements distinct from UASA conventions in `notes.md`. Plan the eight target facts before drafting the passage; include controlled competing information in several items, ensure each field has a single defensible answer, and document canonical and accepted answers.

When the requested assessment is English **Paper 1 Part 5** or **Gapped Text**, read the workspace-root `paper-1-part-5-gapped-text.md`. Confirm whether it is Form 1 or Form 2 and use the appropriate option architecture. Draft a complete linear passage first; remove only sentences whose replacement requires bidirectional contextual cohesion. Verify each gap against every option, use plausible Form 2 distractors, reject ambiguity, reconstruct the original passage, and deliver the answer key. Treat this as a reading and discourse-cohesion task, not grammar gap fill.

Derive worksheet outcomes from the deck objective and taught practice. Build the blueprint and key/rubric together. Use fresh examples, sample important outcomes more than once when practical, and keep learner material separate from scoring guidance. Ensure slide instruction, exit evidence, worksheet items, and scoring rules make the same learning claim.

After verification, mirror every completed worksheet set into `/Users/copu/Documents/Worksheets 2026/Archive/`. Preserve the lesson originals, but exclude HTML from the archive; keep worksheet HTML in the lesson repository and mirror only its printable PDF plus the key/rubric, content input and useful non-HTML editable source. Group those files under the same coded folder, use role suffixes that make each file's purpose obvious, and update the central `INDEX.md` and `catalog.csv`. Never invent a missing date or week; use `UNDATED` and `Unscheduled` and record the limitation.

## Verify before delivery

Inspect every slide at the exact viewport, including answer, error, reset, and final states. Fix clipping, overlap, wrapping, below-fold content, tiny text, broken focus, inaccessible controls, and navigation faults. Check that every slide advances the objective and that feedback explains the reasoning.

For a worksheet, verify outcome coverage, item clarity, answer defensibility, distractor plausibility, scoring consistency, fairness, accessibility, and the stated limits of an unpiloted instrument. Cross-check all answers against the learner version. For Information Transfer, additionally verify exactly eight gaps and eight marks; that every canonical answer is a short, preferably contiguous span in the passage; uniqueness of each table field; varied semantic categories; A2-appropriate language; and that the table cannot be completed reliably by keyword matching alone.

## Learn from use

When the user comments on an artifact, reports student response, or records relevant criticism or outcomes in a Source of Truth reflection, read [references/feedback-learning.md](references/feedback-learning.md). Remove names, individual scores, sensitive narratives, and irrelevant remarks before recording anything. Apply the insight to the next same-class lesson, record privacy-safe actionable evidence, and update durable preferences when promotion rules are met. Do not turn one-off class events into universal rules. Validate the skill after any change and briefly disclose durable improvements to the user.
