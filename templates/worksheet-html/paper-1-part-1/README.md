# Paper 1 Part 1 worksheet template

Use this template for print-first HTML Paper 1 Part 1/OAP worksheets. Keep assessment content in a JSON file and let the renderer supply the stable page structure, typography, metadata row and page footers.

## Create a worksheet

1. Copy `example-content.json` into the target lesson folder as `worksheet-content.json`.
2. Replace the example stimulus, question and option content.
3. Render the self-contained learner file:

```bash
node templates/worksheet-html/paper-1-part-1/render.mjs \
  decks/<class>/<year>/week-<NN>/<lesson>/worksheet-content.json \
  decks/<class>/<year>/week-<NN>/<lesson>/worksheet.html
```

4. Create the separate answer key or rubric with the learner task.
5. Verify the rendered pages in a browser and at print media before delivery.

## Naming

For a lesson-related worksheet, set `lessonRelated` to `true` and supply:

- `classAbbrev`, for example `1D`;
- `weekNo`, for example `30`;
- `date` in `YYYY-MM-DD` form;
- `paper` and `part` as numbers.

The renderer derives the learner-facing title automatically:

```text
<class>-W<week>-<weekday code>-<YYYYMMDD>-P<paper>P<part>
```

Weekday codes use Malay day names: Monday/Isnin = `I`, Tuesday/Selasa = `S`, Wednesday/Rabu = `R`, Thursday/Khamis = `K`, Friday/Jumaat = `J`.

Example: `1D-W30-S-20260825-P1P1`.

For a standalone worksheet, set `lessonRelated` to `false` and provide a concise `title` instead.

## Content contract

- `pages` controls intentional print pagination.
- A full Part 1 set must contain exactly eight items.
- Every item must have exactly three options: `A`, `B` and `C`.
- `stimulusHtml` is trusted local HTML for the stimulus box. Questions and options are escaped by the renderer.
- Keep all scoring guidance in the separate answer key, never in this learner file.
