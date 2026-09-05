# Slide and worksheet workspace orchestration

These instructions apply to this folder and its subfolders.

## Route the request

- For any slide-deck task, read `instructional-slide-decks/SKILL.md` and the installed `presentations` skill. The workspace route overrides the installed skill's PowerPoint implementation route: deliver HTML unless the user explicitly requests PowerPoint.
- For any worksheet, quiz, exit ticket, marking guide, or assessment task, also read the installed `worksheet-assessment-design` skill.
- For every slide-deck or worksheet generation or revision, use `gpt-5.6-luna` subagents to reduce turnaround time. After the main agent has personally read all required skills and references, spawn at least one Luna subagent for a concrete independent track; use two or three by default when the work separates cleanly into tracks such as context/source retrieval, content or answer validation, visual/interaction inspection, and archive/catalog checks. Set `model: "gpt-5.6-luna"` explicitly and use a bounded `fork_turns` value compatible with the model override. The main agent remains responsible for interpreting skill instructions, resolving conflicts, integrating edits, running final cross-artifact verification, updating Source of Truth, and obtaining publication permission. Do not skip Luna delegation merely because the deliverable seems small; if the collaboration runtime is unavailable, disclose the limitation and continue with the required local checks.
- When the teacher specifies a Form 1 or Form 2 **module-book page**, read `instructional-slide-decks/references/module-books.md` and treat the requested printed page as the source scope. Use the local per-page working copy under `Modules/`; cite each material page in `notes.md` with its form, printed page, heading/task, use, and verified Markdown line range. For module-led work, use two Luna agents: one retrieves and scopes the page; the other independently validates the proposed scaffolding and citation. If the module materially shapes a Week 31+ lesson, include one concise Form-and-page source line in the matching Source of Truth content. Do not publish the book or its local path.
- When the user requests English **Paper 1 Part 1**, **OAP**, or a **short-text multiple-choice** assessment, also read `paper-1-part-1-oap.md`. Treat it as the primary design reference for that assessment type, alongside `worksheet-assessment-design`.
- When the user requests English **Paper 1 Part 2**, **lexico-grammar**, or **error correction**, also read `paper-1-part-2-lexico-grammar.md`. Treat it as the primary design reference for that assessment type, alongside `worksheet-assessment-design`.
- When the user requests a Form 1 English **Paper 1 Part 3**, **“Part 3” assessment**, or an **“information transfer” assessment**, also read `paper-1-part-3-information-transfer.md`. Treat it as the primary design reference for that assessment type, alongside `worksheet-assessment-design`.
- When the user requests English **Paper 1 Part 4** or a **short-answer reading** assessment, also read `paper-1-part-4-short-text.md`. Treat it as the primary design reference for that assessment type, alongside `worksheet-assessment-design`.
- When the user requests an English **Paper 1 Part 5**, **“Part 5”**, or **“gapped text”** assessment, also read `paper-1-part-5-gapped-text.md`. Treat it as the primary design reference for this Form 1/Form 2 assessment type, alongside `worksheet-assessment-design`.
- When the user requests English **Paper 2 Part 1** or a **short communicative message**, also read `paper-2-part-1-short-communicative-message.md`. Treat it as the primary design reference for that assessment type, alongside `worksheet-assessment-design`.
- Treat Form 1 English **Notes Expansion** and **Paper 2 Part 2** as the same assessment type. When the user requests either name, including a model answer, lesson, or marking support, also read `paper-2-part-2-notes-expansion.md`. Treat it as the primary design reference for that assessment type, alongside `worksheet-assessment-design`.
- When the user asks to draw a passage from authentic material, real-world sources, or the net — or when an assessment passage will be adapted from web sources — also read `skills/authentic-materials/SKILL.md` and follow its select → retrieve → paraphrase → two-level citation workflow.
- Treat feedback such as “too crowded,” “make the questions harder,” “students could not read it,” or “I prefer this style” as a revision request and as learning evidence even when the user does not say “update the skill.” Follow the feedback-learning loop below.
- Do not invoke slide or worksheet workflows for a simple factual answer about the existing files; inspect and answer directly.

## Minimize handholding

Resolve context in this order: explicit request → target week's Source of Truth plan → earlier same-class Source of Truth lessons and reflections → current lesson files and same-class artifacts → `copu_classes_full.json` → safe defaults. Read `instructional-slide-decks/references/source-of-truth.md` before retrieving lesson history.

The teacher's rudimentary plan for the target week is the primary implementation brief. Read the current week's entries and resolve the exact class/date/slot before creating materials. Then query the same class's recent earlier `lesson_plan_entries` and read `content`, `objectives`, and `reflection` together. Reflections about what actually happened override an earlier plan when they conflict. Use local decks and worksheets afterward for exact artifact details, not as the primary record of lesson history. Ask one concise question only when the target mapping or a material continuity gap remains unresolved.

Safe defaults:

- Deliverable: self-contained teacher-led HTML.
- Display: `1366 × 768` classroom screen; use `1280 × 665` when continuing a deck already built for that viewport. For Form 1 classes, `1 Devotion` / `class-1d`, and `2 Devotion` / `class-2d`, assume laptop-to-smart-TV projection with weaker text legibility unless a smartboard is confirmed. Use larger type, fewer words per slide, and verify at the classroom viewport.
- Assessment: brief, individual, formative, ungraded, teacher-marked, with ordinary classroom supports and a separate key. State these defaults in `notes.md`; do not interrupt the build to ask for them.
- Lesson duration: infer from the class timetable. If unavailable, use 60 minutes and record the assumption.
- Date/week: infer from the user request, target folder, timetable, and current Malaysia date. Ask only if two plausible dates lead to different filing or lesson-continuity decisions.

Never invent the class. If the class cannot be resolved from the request or nearby lesson context, ask one concise question.

## PBD assessment rounds

- PBD means the teacher goes around with a name randomizer, testing pupils against specific learning standards. It is never a pupil procedure and never needs a "What is PBD?" explainer on the slide.
- Frame every PBD moment as a teacher-operated round: one prompt naming the tested skill, then steps (randomizer pick → pupil performs the tested skill). Record the tested standard in `notes.md` and the Source of Truth entry; never put answer keys in SOT.

## Root slide-library policy

When creating or revising the repository-root slide library:

- Use the title `Mr. A's Class Slides` and list only folders containing an actual `index.html` slide deck.
- Sort decks newest-first by default. Keep the interface limited to Class, Week, and Day filters; do not add search or alternative sort controls unless requested.
- Use a single oversized, legible, viewport-bounded animated background string: `First Rule of the Class is To Listen When I'm Speaking`. Give it a slow worm-like path behind the content, preserve strong readability for the library controls and cards, and provide a `prefers-reduced-motion` fallback.
- Use custom filter chevrons with clear inset spacing from the right edge of each select control.
- Regenerate the root index with `node scripts/build-deck-index.mjs` after adding or revising slide-deck folders, then verify all listed deck links and filter behavior.

## Build a context pack before drafting

For a new or revised deliverable, inspect only the relevant material and summarize it internally as a compact context pack:

1. exact current-week Source of Truth plan, class/date/slot, intended objective, and any book reference;
2. previous lesson, already-taught language, and likely bridge;
3. relevant reflection signals: unfinished learning, artifact criticism, aggregate learner response, and class-specific delivery adjustments;
4. prerequisite knowledge and likely misconceptions;
5. duration and display;
6. source evidence retrieved from the grammar reference book and/or specified module-book page when applicable;
7. assessment purpose and default or user-specified administration conditions;
8. durable user preferences from `learning/user-preferences.md`, if present.

Do not ask the user to repeat information that can be recovered from these sources. Do not expose private roster or individual assessment data in generated or published artifacts.

For English skills or pedagogy not covered by the grammar reference, such as listening, reading, writing, speaking, assessment design, test validity, task scaffolding, or genre instruction, actively look for knowledge gaps. Use current authoritative web sources or official curriculum/exam guidance when local evidence is insufficient, record the sources in `notes.md`, and translate them into class-appropriate teaching decisions rather than publishing long source text.

For Form 1 English Paper 1 Part 3 / Information Transfer specifically, preserve the distinction between official KPM requirements and established UASA conventions recorded in `paper-1-part-3-information-transfer.md`. Build a CEFR A2 **linear** text with eight uniquely recoverable facts and an eight-slot table or graphic organiser. Use dichotomous scoring (one mark per item; eight marks total); normally use concise, source-lifted answers of no more than three words and/or a number. Validate that each field has one defensible answer, every canonical answer appears in the source, and several items require semantic discrimination among competing information. Record the assessment architecture, answer policy, accepted variants, and source evidence in `notes.md`.

For Form 1 English Paper 2 Part 2 / Notes Expansion specifically, follow `paper-2-part-2-notes-expansion.md`. Build one 20-mark CEFR A2–B1 guided-writing task with a clear purpose, suitable text type, and three distinct expandable notes. Use familiar contexts and an approximately 90-word response target as a UASA-aligned convention, not an official fixed KPM rule. Create the rubric and model answer together: the response must develop and connect all notes rather than copy them, and marking must address Content, Communicative Achievement, Organisation, and Language (five marks each). Record the official format separately from UASA conventions in `notes.md`.

For English Paper 1 Part 5 / Gapped Text specifically, follow `paper-1-part-5-gapped-text.md`. Confirm the target form before drafting, then use its correct architecture: Form 1 has eight gaps (33–40), eight marks, and two independent four-option banks (A–D and E–H); Form 2 has six gaps (35–40), six marks, one A–H bank, and two plausible unused distractors. Generate a complete CEFR-appropriate linear passage before removing sentences. Each correct option must restore cohesion with evidence on both sides of its gap; test all alternatives, reject ambiguity, reconstruct the completed passage, and provide an answer key. Assess discourse cohesion and reading comprehension, not isolated grammar knowledge; do not claim Learning Standard 3.1.6 for Form 1 or Form 2.

For any other Paper 1 or Paper 2 part assessment, follow its corresponding `paper-<paper>-part-<part>-*.md` guide as the technical source of truth. Confirm the form before drafting, preserve the guide's item architecture, generate the answer key/rubric with the learner task, and run its specified validation checks. Record official-format evidence separately from model-paper conventions in `notes.md`.

## Output contract

- Create slides under `decks/<class-slug>/<YYYY>/week-<NN>/<YYYY-MM-DD>-<topic-slug>/`.
- Put `index.html` at the lesson root. Keep assets local to `assets/` and teacher-facing objective, assumptions, slide map, answers, misconceptions, sources, and delivery notes in `notes.md`.
- Beginning with teaching Week 31 of 2026, every verified slide deck or worksheet creation or revision must return to the exact Source of Truth class/date/slot record used as its brief. Preserve the teacher's rudimentary plan and add or update a concise **Implemented lesson notes** section covering the verified materials, main teaching and practice sequence, application task, and evidence of learning. Do not paste every slide, question, answer key, production detail, or QA log. Merge one to three concise observable objectives only when genuinely new, preserving existing objective text, IDs, order, and completion states. Preserve the separate teacher-owned `reflection` field exactly. Read back content and objectives after saving. This standing instruction authorizes only these Week 31+ content/objective upserts after local artifact verification; it does not authorize reflection edits or other Neon mutations.
- Every class slide deck must ultimately be published as a GitHub Pages site. Treat publication as a required final stage of the slide-deck workflow, not as optional follow-up work.
- Publishing changes external state and always requires the user's explicit permission first. After the local deck passes verification, ask the user for permission to publish; do not push, deploy, enable GitHub Pages, modify a publishing workflow, or otherwise make the deck public until the user clearly approves that specific publication.
- If permission has not yet been granted, finish and verify the local deck, report that it is ready for GitHub Pages, and pause before any publishing action. A request to create, revise, preview, or verify a deck does not by itself count as permission to publish it.
- A worksheet aligned to that lesson belongs in the same folder. Keep the learner version separate from its answer key or rubric.
- After a worksheet passes verification, mirror its printable learner PDF, key/rubric, content input and useful non-HTML editable source into `/Users/copu/Documents/Worksheets 2026/Archive/` without moving or deleting the lesson originals. Do not mirror worksheet HTML; keep HTML only in the lesson repository and render its verified PDF for the archive. Organise by Form → Class → Week → coded worksheet folder, use explicit role suffixes such as `LEARNER`, `KEY`, `CONTENT`, `SOURCE`, and `LEARNER-2IN1`, then update `/Users/copu/Documents/Worksheets 2026/INDEX.md` and `catalog.csv`. Preserve pre-existing top-level files. Use `UNDATED` / `Unscheduled` rather than inventing missing dates or weeks.
- Do not create, edit, convert to, or use `.ppt` or `.pptx` unless the user explicitly requests PowerPoint. A supplied PowerPoint may be inspected as reference without changing the HTML deliverable.
- Do not reorganize or delete legacy work merely to match the current convention.

## Worksheet print-design defaults

- Before building worksheet HTML, read `instructional-slide-decks/references/worksheet-templates.md` and reuse a matching scaffold under `templates/worksheet-html/` when available. Keep assessment content separate from the reusable structure so future worksheets can be produced by replacing content and rerunning the renderer.
- For a lesson-related worksheet, use the learner-facing title `<class abbreviation>-W<two-digit week>-<weekday code>-<YYYYMMDD>-P<paper>P<part>`, for example `1D-W30-S-20260825-P1P1`. Use weekday codes from Malay day names: Monday/Isnin `I`, Tuesday/Selasa `S`, Wednesday/Rabu `R`, Thursday/Khamis `K`, and Friday/Jumaat `J`. Put the class abbreviation first. A concise content-only subtitle may follow beneath the coded title. Do not add learner-facing difficulty, process, or task-type annotations such as `Easy`, `Revision`, `Practice`, or `Error Correction` unless the user explicitly requests the wording or the official format requires it.
- Keep each worksheet coherent around the requested lesson topic or theme. When a later task asks for extended application such as an email, make the earlier practice directly scaffold the language, content, and organisation needed for that task.
- Use an ink-saving print design by default: white backgrounds, black or dark-grey text, thin outlines, minimal light-grey shading, and no large solid fills or decorative areas that consume ink.
- Show the worksheet title and the `Name`, `Class`, and `Date` fields once, on the first page only. Do not repeat them on later pages unless the user explicitly requests detachable pages.
- Treat `2 in 1` as valid shorthand for a paper-saving worksheet output: when the worksheet content fits on one page, render two identical document pages so the teacher can select `2 pages per sheet` in the print dialog and cut the physical A4 sheet into two complete learner copies. Each detachable copy repeats its title and Name/Class/Date fields. Keep a single-copy override when requested.
- For Paper 1 Part 2, reuse `templates/worksheet-html/paper-1-part-2/` and replace only the content input. Continue Paper 1 numbering with questions 9–16, keep `(0)` as the example, and make the answer-table number columns extremely narrow (about 7% per half) so most width is available for corrected words.
- Use only the response lines needed for the expected answer length. Remove redundant rules, repeated labels, duplicate checklists, and other learner-facing text that does not improve instructions, accessibility, or assessment evidence.
- When a worksheet passage is adapted from authentic web material, paraphrase rather than copy: write all item text originally at the target CEFR level, show a short learner-facing source line on the sheet (publishers and date, no URLs), and record full URLs with access dates plus a no-verbatim-copy statement in the key/rubric, content input, and `notes.md`.

## Grammar grounding

For grammar, tense, usage, sentence structure, punctuation, or parts-of-speech lessons, use the workspace-root `grammar for english teachers.md.md` as the canonical private reference:

1. Run 2–3 focused queries with `instructional-slide-decks/scripts/search-grammar-book.mjs`, using the topic, target contrast, learning objective, and likely misconception.
2. Read the strongest distinct heading paths and their neighboring passages with enough context to verify the claim. Record the Markdown heading path and line numbers in `notes.md`.
3. Prefer sections titled `Key considerations`, `Typical difficulties for learners`, relevant form/use subsections, and `Teaching` when they directly address the lesson decision. Do not treat answer-key or index occurrences as primary evidence when an explanatory section is available.
4. Translate the teacher reference into concise, level-appropriate explanations and original examples. Do not publish the book or copy long passages.
5. If relevant evidence cannot be retrieved after related terminology and misconception queries, inspect the book's table of contents and headings directly. Ask for another source or permission to proceed without book grounding only after both routes fail.

## A2 vocabulary grounding

For A2 vocabulary selection, lexical-set planning, or checking whether a word or sense belongs to the August 2025 Cambridge A2 Key list, read `instructional-slide-decks/references/a2-key-vocabulary-2025.md` and query the private workspace-root `a2_key_vocabulary_2025.json`.

- Never load or print the complete JSON into model context. Use `node instructional-slide-decks/scripts/query-a2-vocabulary.mjs ...`; it projects compact fields and caps every record or Appendix page at 20 results. Direct `jq` is allowed only when the helper lacks a required relationship, and its output must project fields and use a hard result limit.
- Retrieve in stages: cheap metadata/topic discovery, at most 20 candidates, normally 8–12 final lesson records, then 1–3 records when drafting an individual slide or worksheet item. Re-query chosen IDs for verification instead of repeating broad retrieval.
- Use `vocabulary[]` for enriched headword records, including `pos_raw`, normalized `pos[]`, regional notes, examples, source page, topics, and the 2025 flag.
- Use `topics` for the complete Appendix 2 word lists and `word_sets` for Appendix 1. Do not assume a `vocabulary[].topics` filter exactly reproduces an Appendix list.
- Treat `id` as the stable identifier because a headword can have separate records. Check the intended sense and part of speech before using an item or accepting an answer.
- Use source examples to verify sense and keys; prefer concise original learner examples in public artifacts. Preserve relevant Br/Am distinctions.
- Record only the JSON title/version, selection purpose, and relevant record IDs or Appendix list name in `notes.md`. Do not paste raw query output, publish the copyrighted JSON or long source lists, or expose its local path.

## Lesson and assessment coherence

- After building the Source of Truth continuity brief, review the most relevant same-class deck for exact terminology, language level, successful interaction patterns, and visual conventions while avoiding needless repetition.
- Start a new lesson with 5–10 minutes of retrieval that samples essential prior learning and bridges into the new objective.
- Use one visible teaching move per slide: orient, elicit, model, practise, check, correct, apply, or retrieve.
- Build worksheet items from the same observable outcomes and taught examples, but require fresh application rather than copying slide questions.
- Create the worksheet blueprint and key/rubric together. Use enough varied evidence for the intended claim, check accessibility and fairness, and avoid claims of statistical validity or reliability for an unpiloted worksheet.

## Verification gates

Do not deliver until the relevant gates pass:

- Content: source-grounded where required, accurate, level-appropriate, and continuous with prior teaching.
- Slides: every slide inspected at the target viewport, including reveal/reset states; no clipping, overlap, below-fold content, tiny type, broken navigation, or inaccessible interaction. Treat visible but non-working buttons as a blocking defect, refactor the slide code when needed, and retest the actual click/keyboard behavior before handoff.
- Worksheet: every item maps to an outcome; directions, administration conditions, scoring, answers, partial-credit rules, and limitations are explicit.
- Cross-artifact: slide objective, practice, exit evidence, worksheet blueprint, and answer key agree.
- Privacy: no real roster, individual score, private corpus content, or class JSON is embedded in publishable artifacts.

Fix failures before handoff. Record material assumptions and unresolved limitations in `notes.md`.

## Feedback-learning loop

Read `instructional-slide-decks/references/feedback-learning.md` whenever the user comments on a generated slide, worksheet, answer key, interaction, or lesson outcome.

Also apply this loop to relevant teacher criticism and instructional outcomes found in Source of Truth reflections. First remove names, individual scores, sensitive narratives, and incidental remarks. Keep class-specific observations in the continuity brief; record privacy-safe actionable feedback and promote it only under the normal evidence rules.

Without requiring a separate prompt:

1. Apply the feedback to the current artifact when the user is asking for revision.
2. Record the observation with `node instructional-slide-decks/scripts/record-feedback.mjs ...`.
3. Update `learning/user-preferences.md` immediately for explicit, durable personal preferences.
4. Promote a rule into `instructional-slide-decks/SKILL.md`, its references, or this file only when the evidence meets the promotion rules in the feedback reference.
5. Validate changed skills and run proportionate artifact checks. Tell the user briefly what durable behavior changed.

Do not modify installed system/plugin skills. The user-owned `worksheet-assessment-design` skill may be improved when worksheet evidence meets the same promotion threshold.
