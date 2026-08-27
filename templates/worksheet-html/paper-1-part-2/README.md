# Paper 1 Part 2 worksheet template

Render a lesson content file with:

```bash
node templates/worksheet-html/paper-1-part-2/render.mjs <worksheet-content.json> <worksheet.html>
```

The renderer enforces the coded lesson title, one example item `(0)`, exactly eight scored items, one occurrence of every marked incorrect token, and a separate answer space. It defaults to two identical document pages—called `2 in 1` by the teacher—so the teacher can print two pages per sheet and cut the paper into two copies. Set `"copies": 1` only when a single full-size copy is required. Keep answers and validation notes outside the learner HTML.

The answer table reserves only 7% of each half for the question number and 43% for the learner's corrected word. This narrow-number/wide-answer ratio is the default for Paper 1 Part 2.

For the next worksheet, copy `example-content.json`, replace only its lesson metadata, passage markers, item answers and teaching labels, then run the renderer. Keep `(0)` as the worked example and use scored question numbers 9–16 to continue after Paper 1 Part 1.
