# Paper 1 Part 4 worksheet template (Form 1)

Form 1 UASA-style short-answer reading worksheet: one 180–280-word text,
Questions 25–28 (True/False) and Questions 29–32 (short extraction answers,
no more than five words and/or a number), 8 marks.

## Use

1. Draft and validate the reading text and items against
   `paper-1-part-4-short-text.md` (answer map, unique anchors, ≤5-word answers,
   textual order, ambiguity and length checks).
2. Write a content JSON modelled on `example-content.json` (full schema:
   `textParagraphs`, `tfStatements`, `shortItems` with `___ANS___` for the
   answer blank, `answerMap`, numeric `paper`/`part`).
3. Render:

   ```bash
   node render.mjs <content.json> <output-worksheet.html>
   ```

4. The output is A4 print-ready. Default is two identical learner pages
   (`2 pages per sheet`); set `"copies": 1` for a single full-size copy, or
   open the HTML with `?single=1` for a one-page print of a two-copy sheet.
5. Render printable PDFs (e.g. headless Chrome `--print-to-pdf`) and produce
   the teacher key (`-KEY.md`) with every answer anchored to a text span.

## Validation reminders

- Answers must be uniquely recoverable from the passage and ≤5 words and/or a
  number; reject ambiguous, overlength or grammatically incompatible answers.
- True/False items paraphrase the text; False items change exactly one
  meaningful proposition.
- Keep learner material free of answers; the key stays separate.
