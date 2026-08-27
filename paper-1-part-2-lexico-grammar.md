# UASA English KSSM — Paper 1 Part 2
## Lexico-Grammar Long Text Error Correction
### Form 1 and Form 2 LLM Item-Generation Specification

## 1. Official task structure

Paper 1 Part 2 is officially described as **“Lexico-grammar long text error correction.”** It contains **8 items worth 8 marks**. Students read one continuous text, identify the incorrect underlined word in each numbered position, and replace it with the correct word. Scoring is dichotomous: **1 correct answer = 1 mark**.

Standard instruction:

> Read the text below and correct the underlined errors. For each question, write the correct word in the space provided on your answer sheet.

The text normally includes an **example item (0)** before the eight assessed errors. Published UASA materials consistently follow this structure.

When Part 2 follows Paper 1 Part 1 in the same paper sequence, number the eight scored locations **9–16** because Part 1 occupies questions 1–8. Keep `(0)` as the worked example. The worksheet may still describe the construct as “8 items”; item count and question numbering are separate.

---

## 2. Level distinction

| Feature | Form 1 | Form 2 |
|---|---|---|
| Target CEFR | A2 | A2–B1 |
| Number of scored errors | 8 | 8 |
| Marks | 8 | 8 |
| Response | one corrected word | one corrected word |
| Main construct | lexico-grammar | lexico-grammar |
| Text type | continuous/long text | continuous/long text |

The official UASA format identifies **Form 1 as CEFR A2**, while Form 2 operates at **A2/B1**.

The task architecture itself is essentially identical. The principal difference should therefore be the **linguistic complexity of the carrier text and target structures**, not a different question format.

---

# 3. Core generation model

Generate:

```text
TITLE

[continuous passage]

(0) incorrect-word
(9) incorrect-word
...
(16) incorrect-word
```

There must be:

- 1 worked/example error numbered `(0)`
- exactly **8 scored errors**, normally numbered `(9)`–`(16)` after Paper 1 Part 1
- exactly **one incorrect word per numbered location**
- exactly **one intended replacement word**
- sufficient sentence context to determine the answer
- no multiple-choice options

Do **not** create spelling-error detection, punctuation correction, sentence rewriting or open-ended proofreading.

---

# 4. Fundamental item rule

Each item should implement:

```text
grammatically incorrect token
        ↓
replace ONE word
        ↓
grammatically and semantically acceptable sentence
```

Example:

```text
Amir (0) visit the museum yesterday.
```

Answer:

```text
visited
```

The transformation must remain a **single-token substitution**.

Good:

```text
She (3) go to school every day.
→ goes
```

Bad:

```text
She go school every day.
→ goes to
```

The second requires two words and therefore violates the response format.

---

# 5. What should be tested

Part 2 should primarily test **lexico-grammatical accuracy in context**, rather than isolated grammar terminology.

Suitable targets include:

### Verb grammar
- present simple
- past simple
- present continuous
- subject–verb agreement
- auxiliary verbs
- modal + base verb
- infinitive / gerund selection
- participles
- passive forms where level-appropriate

Example:

```text
They were (4) play football when it started raining.
→ playing
```

### Determiners and articles
- a / an / the
- this / these
- much / many
- some / any
- another / other

Example:

```text
There are (2) much activities available.
→ many
```

### Prepositions
- in / on / at
- to / from
- for / with
- collocational prepositions

Example:

```text
We arrived (5) to the station early.
→ at
```

### Pronouns
- subject/object pronouns
- possessive forms
- relative pronouns where appropriate

Example:

```text
The woman (6) which helped us was very kind.
→ who
```

### Conjunctions / connectors
- and / but / or
- because / although
- sequencing expressions where appropriate

Published items include substitutions involving connectors as well as grammatical words.

### Word form / lexical grammar
- adjective ↔ adverb
- noun ↔ verb
- infinitive ↔ gerund
- singular ↔ plural
- semantically inappropriate grammatical word

Example:

```text
He spoke very (7) polite to the visitor.
→ politely
```

Published examples include errors such as adjective/adverb selection, verb forms, determiners, conjunctions and prepositions, confirming that Part 2 is broader than tense correction alone.

---

# 6. Error-design constraints

## A. Exactly one clear error

Every numbered location must contain one clearly defective word.

Avoid:

```text
He were goes home.
```

Both `were` and `goes` create problems.

Prefer:

```text
He (3) were tired yesterday.
→ was
```

---

## B. The answer should be uniquely recoverable

Context must strongly constrain the intended correction.

Avoid:

```text
She went (4) the shop.
```

Possible answers include `to`, `into`, `towards`, etc.

Prefer:

```text
She arrived (4) the airport at 8.00 a.m.
→ at
```

---

## C. Preserve the rest of the sentence

Replacing the target word should repair the sentence without requiring changes elsewhere.

---

## D. Do not manufacture nonsense

The incorrect form should resemble a **plausible learner error**.

Good:

```text
She enjoys (5) swim.
→ swimming
```

Weak:

```text
She enjoys refrigerator.
```

Part 2 should resemble authentic learner-error correction, not arbitrary corrupted text.

---

# 7. Text construction

Construct the passage **first as a coherent text**, then insert controlled errors.

Recommended pipeline:

```text
1. Select topic.
2. Draft fully correct passage.
3. Check CEFR level.
4. Select eight grammatical locations.
5. Replace each correct token with one plausible incorrect token.
6. Add example item (0).
7. Verify every correction independently.
8. Re-read corrected passage for coherence.
```

Do not generate eight unrelated grammar sentences and combine them artificially.

The task is explicitly a **long-text** error-correction task, so discourse coherence matters.

---

# 8. Suitable carrier texts

Use familiar lower-secondary contexts such as:

- hobbies
- school activities
- trips
- festivals
- environmental activities
- animals
- healthy lifestyles
- technology
- money and saving
- friendship
- sports
- Malaysian places
- biographies
- personal experiences

Published examples include an elephant sanctuary visit, saving money, a biography of Jeff Kinney and the Town Mouse/Country Mouse story.

Both **factual** and **narrative** texts are therefore valid.

---

# 9. Tense consistency

Determine the discourse time-frame before inserting errors.

### Narrative text

Normally anchor predominantly in:

```text
past simple
past continuous
past perfect only if level-appropriate
```

Example:

```text
Last Saturday, Farah and her family travelled to Melaka.
```

### Factual/expository text

Normally anchor predominantly in:

```text
present simple
present perfect where appropriate
passives where appropriate
```

Example:

```text
Recycling helps reduce the amount of waste sent to landfills.
```

Do not change tenses randomly merely to create errors.

Published teacher guidance for this part specifically encourages students to first recognise whether the passage is factual or narrative and identify its tense framework.

---

# 10. Form 1 generation profile

Target approximately **CEFR A2**.

Prefer:

- high-frequency vocabulary
- relatively short sentences
- obvious time markers
- familiar contexts
- common grammar
- limited subordination
- transparent lexical relationships

Recommended target distribution:

```yaml
form_1:
  items: 8
  recommended_targets:
    verb_form: 2
    subject_verb_agreement: 1
    preposition: 1
    article_or_determiner: 1
    pronoun_or_relative_word: 1
    conjunction: 1
    word_form_or_number: 1
```

This distribution is a **generation heuristic**, not an official fixed blueprint.

Avoid making all eight errors simple past tense errors.

---

# 11. Form 2 generation profile

Target approximately **A2–B1**.

Keep the same item format but allow:

- moderately longer sentences
- more varied connectors
- richer noun phrases
- relative clauses
- passive structures
- more demanding preposition/collocation choices
- present perfect where context naturally supports it
- gerund/infinitive contrasts
- slightly less explicit grammatical clues

Recommended distribution:

```yaml
form_2:
  items: 8
  recommended_targets:
    tense_or_verb_form: 2
    agreement_or_auxiliary: 1
    preposition_or_collocation: 1
    determiner_or_quantifier: 1
    pronoun_or_relative_clause: 1
    connector: 1
    word_form_or_lexico_grammar: 1
```

Again, this is an LLM design recommendation rather than an official prescribed ratio.

---

# 12. Difficulty engineering

Difficulty should come from **contextual grammatical reasoning**, not obscure vocabulary.

## Easier item

```text
Last Sunday, we (3) visit the museum.
```

The past-time marker makes `visited` obvious.

## Moderate item

```text
The programme has (4) attract hundreds of visitors since 2023.
```

Requires recognising:

```text
has + past participle
```

Answer:

```text
attracted
```

## Poor difficulty design

```text
The ornithologist scrutinised the avifauna...
```

Making vocabulary obscure does not appropriately test the intended construct.

---

# 13. Error distribution

Do not place several errors in the same sentence unless unavoidable.

Preferred pattern:

```text
paragraph 1 → items 0, 1, 2
paragraph 2 → items 3, 4, 5
paragraph 3 → items 6, 7, 8
```

Errors should appear naturally throughout the passage.

Avoid predictable sequences such as:

```text
1 = verb
2 = preposition
3 = article
4 = verb
...
```

Students should need to diagnose each error independently.

---

# 14. Answer-key rules

Return only the replacement word.

Example:

```yaml
answers:
  0: visited
  1: were
  2: many
  3: at
  4: playing
  5: who
  6: carefully
  7: because
  8: children
```

Do not return:

```text
3. change "in" to "at"
```

unless an explanation key was explicitly requested.

---

# 15. LLM validation checklist

Before accepting an item set, verify:

```yaml
validation:
  scored_items: 8
  example_item_0: true

  each_item:
    one_incorrect_word_only: true
    one_word_answer: true
    unique_answer: true
    grammatically_repairable: true
    contextual_clue_available: true
    plausible_learner_error: true

  passage:
    coherent: true
    age_appropriate: true
    cefr_appropriate: true
    tense_consistent: true
    topic_appropriate: true

  coverage:
    varied_grammar_targets: true
    not_all_tense_errors: true
```

---

# 16. Generation algorithm

```text
INPUT:
- form_level: 1 | 2
- topic
- optional grammar targets

SET:
- Form 1 → CEFR A2
- Form 2 → CEFR A2–B1

GENERATE:
1. Write one coherent lower-secondary passage.
2. Write it completely correctly first.
3. Identify nine suitable correction locations:
   - one demonstration item (0)
   - eight scored items (9–16 when continuing after Paper 1 Part 1)
4. Assign varied lexico-grammar constructs.
5. Replace exactly one word at each location with a plausible learner error.
6. Ensure the intended correction requires one word only.
7. Confirm that no unnumbered grammatical errors remain.
8. Confirm every corrected sentence is grammatical.
9. Confirm corrected passage remains coherent.
10. Produce passage + answer key.
```

---

# 17. Anti-patterns

The generator must reject items that:

- contain more or fewer than 8 scored errors;
- require adding or deleting several words;
- depend mainly on punctuation;
- test spelling rather than lexico-grammar;
- contain two possible answers;
- contain accidental additional errors;
- use grammar substantially beyond the intended CEFR level;
- rely on rare vocabulary to create difficulty;
- present eight disconnected sentences instead of a coherent passage;
- repeat the same grammatical construct excessively;
- make the incorrect word semantically absurd rather than learner-plausible.

---

# 18. Minimal machine-readable specification

```yaml
task:
  exam: UASA English KSSM
  paper: Paper 1 - Reading and Use of English
  part: 2
  task_type: Lexico-grammar long text error correction

format:
  example_items: 1
  scored_items: 8
  marks: 8
  response_type: single-word correction
  scoring: dichotomous

levels:
  form_1: A2
  form_2: A2-B1

passage:
  type: coherent continuous text
  genres:
    - narrative
    - factual
    - descriptive
    - biographical
    - informational
  context: familiar lower-secondary topics

item_constraints:
  incorrect_tokens_per_item: 1
  answer_tokens: 1
  unique_answer_required: true
  contextual_resolution_required: true
  plausible_learner_error: true

target_constructs:
  - tense
  - verb_form
  - subject_verb_agreement
  - auxiliary
  - modal
  - infinitive_gerund
  - article
  - determiner
  - quantifier
  - preposition
  - pronoun
  - relative_word
  - conjunction
  - connector
  - singular_plural
  - adjective_adverb
  - word_form
  - lexico_grammar

generation_method:
  - draft_correct_passage
  - select_target_locations
  - corrupt_one_token_per_location
  - validate_unique_repairs
  - validate_cefr
  - output_answer_key
```

## Evidence note

### Worksheet rendering defaults

Use the reusable scaffold at `templates/worksheet-html/paper-1-part-2/`. Keep assessment content in its JSON input, number scored questions 9–16 after Paper 1 Part 1, and reserve only about 7% of each answer-table half for the question number so learners have substantially more room for the corrected word. A one-page task defaults to `2 in 1`: two identical document pages for `2 pages per sheet` printing and cutting.

The strongest official-format evidence is the Ministry of Education UASA instrument specification, which defines Part 2 for both Form 1 and Form 2 as an **8-item “Lexico-grammar long text error correction” task** and fixes the respective proficiency levels at **A2** and **A2/B1**. Published UASA-aligned materials were then used to infer the practical construction patterns: continuous passages, an example `(0)`, one-word replacements, and the range of grammatical targets commonly manipulated.
