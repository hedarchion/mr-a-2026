# Worksheet templates and naming

## Reuse structure

Before creating a worksheet, check `templates/worksheet-html/` for an assessment-type template. Reuse its page structure, typography, metadata row, print rules and renderer. Keep task content in the template's content file so later work changes the assessment content rather than rebuilding the HTML shell.

The template does not replace the relevant Paper 1/Paper 2 design guide. Draft and validate the assessment content first, then render it through the matching template. If no matching template exists, build the worksheet carefully and promote its stable, reusable structure into `templates/worksheet-html/<assessment-type>/` after verification.

## Lesson-related worksheet title

Use this exact learner-facing title pattern for a worksheet aligned to a dated lesson:

```text
<class abbreviation>-W<two-digit week>-<weekday code>-<YYYYMMDD>-P<paper>P<part>
```

Example:

```text
1D-W30-S-20260825-P1P1
```

Weekday codes follow Malay day names:

| Day | Malay | Code |
|---|---|:---:|
| Monday | Isnin | I |
| Tuesday | Selasa | S |
| Wednesday | Rabu | R |
| Thursday | Khamis | K |
| Friday | Jumaat | J |

Use the compact ISO 8601 basic date form `YYYYMMDD`. The class abbreviation comes first. A short descriptive subtitle may appear below the code, but it does not replace or alter the coded title.

Standalone worksheets that are not aligned to a dated lesson may retain a concise descriptive title.

## Paper-saving duplicate pages

When the learner worksheet content fits on one page, render two identical document pages by default. The teacher may call this output `2 in 1`; treat that phrase as valid shorthand for the same paper-saving workflow. The teacher chooses `2 pages per sheet` in the print dialog, cuts the physical A4 sheet, and receives two complete learner copies. Each duplicate is a detachable copy, so repeat its title and Name/Class/Date fields. Keep a single-page override in the content file for occasions when the teacher requests one full-size copy.

## Paper 1 Part 2 answer table

Use `templates/worksheet-html/paper-1-part-2/` as the default Paper 1 Part 2 scaffold. Keep lesson content in the worksheet JSON and rerun the renderer; do not rebuild the page shell. Make each number column extremely narrow—approximately 7% of its half-table—and give the remaining approximately 43% to the corrected-word response space. Use question numbers 9–16 when Part 2 continues after Paper 1 Part 1.

## Central worksheet archive

After verification, copy each completed worksheet set to `/Users/copu/Documents/Worksheets 2026/Archive/` while keeping the lesson-folder originals. Do not mirror HTML into this archive. Keep HTML in the lesson repository and archive its printable PDF instead. Use the hierarchy `Form <N>/<class>/Week <NN>/<coded worksheet folder>/`; use `Unscheduled` when a reliable week is unavailable. Name archived files with explicit roles such as `-LEARNER.pdf`, `-KEY.md`, `-CONTENT.json`, `-SOURCE.<non-html extension>`, or `-LEARNER-2IN1.pdf`. Update the archive's `INDEX.md` and `catalog.csv` with class, week, date, Paper-Part, skill/topic and searchable semicolon-separated tags. Preserve unrelated or pre-existing top-level files.
