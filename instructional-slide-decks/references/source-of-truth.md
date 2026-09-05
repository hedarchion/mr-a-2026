# Source of Truth lesson continuity

“Source of Truth” is the agent-facing name for the production lesson-planning data in the Neon database. The primary record is `public.lesson_plan_entries`, joined to `public.classes` and resolved against the active schedule. Do not call local slide folders, deck notes, class JSON, or generated knowledge extracts the source of truth.

## Verified schema

`lesson_plan_entries` stores one lesson per `class_id`, `date`, and `slot_id`, enforced by a unique index. Its relevant fields are:

- `content text`: the lesson record and teaching sequence;
- `objectives jsonb`: ordered learner objectives with IDs and completion state;
- `reflection text`: the teacher's post-lesson account, criticism, learner response, and delivery observations;
- `book_references jsonb` and `learning_standard_ids jsonb`: linked planning evidence;
- `schedule_set_id`, `date`, and `slot_id`: timetable identity;
- `updated_at`: recency signal.

The reflection field is teacher-owned. Agents may read it but must not overwrite, rewrite, or append to it unless the teacher explicitly requests that exact change.

## Retrieval order

Before creating or substantially revising a deck or worksheet:

1. Resolve the exact class and target lesson date.
2. Read that class's Source of Truth entries for the target week first. The teacher's current-week `content`, `objectives`, book references, target date, and slot form the implementation brief.
3. Resolve the exact target lesson row. Do not create a different lesson merely because an older deck suggests another sequence. If the target row is missing or multiple rows remain possible, resolve the mapping before implementation.
4. Query the five most recent earlier lessons for that class, then read their `content`, `objectives`, and `reflection`. A reflection describing what actually happened overrides the earlier plan when they conflict.
5. When the new topic continues an older strand, add a bounded thematic search for up to three older lessons.
6. Summarize the current plan and historical evidence into a short implementation brief, then discard the raw database output from working context.
7. Inspect local slides or worksheets only for artifact-level evidence such as exact examples, visual conventions, interaction patterns, answer architecture, or implementation details.

Use the bounded helper:

```sh
node instructional-slide-decks/scripts/query-source-of-truth.mjs \
  --class "Class 1D" \
  --target 2026-09-08 \
  --limit 5 \
  --search "descriptive adjectives"
```

The helper returns the target week's plan, the exact-date match, recent past lessons, and optional thematic history in one read-only call. It caps the target week at ten entries, recent retrieval at eight lessons, thematic retrieval at five, and each content/reflection field at 1,200 characters. Do not dump the whole table or load all lesson records into context.

## Resolve timetable identity from SOT schedules

Never infer a calendar date from a school-week label or deck folder. `schedule_sets.teaching_calendar` is the authoritative teachingWeek-to-date mapping, `schedule_sets.slots` defines each class's weekday slots and times, `schedule_activations` selects the active set, and `schedule_sets.holidays` marks no-teaching ranges. Resolve before planning or writing:

```sh
node instructional-slide-decks/scripts/resolve-sot-slot.mjs --class "Class 2E" --week 31 --day I
node instructional-slide-decks/scripts/resolve-sot-slot.mjs --class "Class 2E" --date 2026-09-07
```

Weekday codes: `I/S/R/K/J` for Mon-Fri. The resolver returns the exact date, slot_id, slot time, schedule_set_id, create-vs-update mode, any existing entry, and warnings. Treat warnings as blockers: a `no-slot` result means the class has no lesson that day, and a holiday result means no teaching is expected — stop and confirm with the teacher instead of writing. State the resolved date and slot explicitly when confirming a target.

If Source of Truth has no useful content for the immediately previous lesson, inspect the nearest local artifact and then ask one concise continuity question only if the gap still materially affects the plan.

## Reflection-to-improvement loop

Classify every relevant reflection signal before drafting:

- **continuity fact:** what was actually taught, practised, completed, collected, postponed, or left unfinished;
- **artifact feedback:** criticism or praise about slides, worksheets, questions, assets, examples, videos, interaction, legibility, challenge, or validity;
- **instructional outcome:** aggregate evidence about understanding, misconception, pacing, participation, accessibility, or engagement;
- **class constraint:** a recurring condition that should change delivery for that class, such as noise, device legibility, confidence, or the need for differentiation;
- **private/irrelevant detail:** names, individual scores, sensitive narratives, or incidental remarks that do not change the next lesson.

Turn only the first four categories into planning decisions. Never copy names, individual scores, or private narratives into slides, worksheets, `notes.md`, delegation prompts, or published material. Use an aggregate conclusion only when it is instructionally relevant and supported by the reflection.

Create a six-part implementation brief:

1. teacher's current-week plan and intended objective;
2. confirmed prior teaching;
3. unfinished or insecure learning;
4. artifact feedback to act on;
5. class-specific delivery adjustment;
6. retrieval bridge and evidence needed next.

Do not mechanically repeat every comment. Translate each relevant signal into an observable action. Examples include increasing semantic discrimination after “too easy,” replacing mismatched assets, adding a role-rotation routine after conflict over roles, or using more visual modelling after a word-order misconception.

## Durable learning

Reflection feedback enters the existing feedback-learning system:

- Record a privacy-safe observation in `learning/feedback.jsonl` when a reflection contains actionable artifact feedback or an instructional outcome that should influence later work.
- Use `source-of-truth/lesson_plan_entries/<lesson-id>` as the source identifier rather than copying the reflection.
- Keep a class-specific observation in the next lesson's continuity brief unless it recurs or the teacher generalizes it.
- Update `learning/user-preferences.md` immediately for an explicit durable preference.
- Promote a reusable rule only under `references/feedback-learning.md`: explicit future-facing instruction, repetition across two independent lessons/artifacts, or a confirmed correctness/privacy/accessibility/scoring boundary.

## Sparse briefs and the lesson flow

The teacher's current-week notes are often sparse, non-linear, and brief. Interpret them very carefully: never invent structure the brief does not state, but treat its stated focus, objectives, and principles as standing for the lesson.

Map every lesson onto the teacher's canonical flow: set induction first, then lesson development (where the slides operate), then the teacher-specified activity (PBD round, worksheet, module bookwork, or whatever the brief names). If the brief names no activity, confirm with the teacher rather than assuming one.

## Input and output boundary

Source of Truth is the primary input twice: first as the teacher's current-week plan, then as continuity and reflection history. Local artifacts are secondary evidence about the actual generated materials.

After local artifact verification for Week 31+ lessons, return to the exact same class/date/slot record. Preserve the teacher's rudimentary plan and add or update a concise **Implemented lesson notes** section describing the verified materials, teaching sequence, application task, and evidence of learning. Do not replace the teacher's plan with an agent rewrite. Write the section as a concise instructional lesson-plan note (focus, timed sequence, worksheet administration, evidence/follow-up). Never include answer keys or gap-to-letter mappings in Source of Truth; keep keys only in the lesson folder. Link published GitHub Pages URLs, never local filesystem paths. Merge only genuinely new structured `objectives`, preserving existing text, IDs, order, and completion states. Preserve the entire `reflection`, then read back the saved fields. On a later cycle, the teacher's new reflection becomes input for the next same-class lesson. The standing authorization does not permit other production mutations.

The operating loop is therefore:

1. teacher plans in Source of Truth;
2. agent reads the current week, then past lessons and reflections;
3. agent implements and verifies slides or worksheets;
4. agent enriches the same Source of Truth record with implemented notes and objectives;
5. teacher teaches and adds a reflection;
6. the next lesson begins from that updated record.
