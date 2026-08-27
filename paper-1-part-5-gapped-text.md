# UASA English KSSM Part 5 — Gapped Text Item Construction Specification

## 1. Purpose

This specification defines how an LLM should generate **Part 5: Matching / Gapped Text** items for Malaysian lower-secondary **UASA English KSSM**, specifically:

- **Form 1**
- **Form 2**

The generated task should reproduce the **assessment behaviour and structure** of authentic UASA-style Part 5 tasks rather than merely creating a generic sentence-matching exercise.

Part 5 primarily assesses whether pupils can reconstruct the logical and semantic organisation of a continuous text by identifying which removed sentence belongs in each gap.

It therefore tests:

- understanding of main points;
- understanding of specific information;
- local sentence-to-sentence cohesion;
- paragraph-level coherence;
- reference tracking;
- chronological/logical sequencing;
- discourse relationships;
- interpretation of contextual clues.

It is **not primarily a grammar gap-fill exercise**.

---

# 2. Source Hierarchy

When constructing items, use the following priority:

1. **KPM DSKP / Secondary English Syllabus**
2. **Current UASA format / JSU**
3. Recent UASA school papers following the standard format
4. Major Malaysian KSSM/UASA publishers for operational examples
5. Generic CEFR guidance only when the Malaysian sources do not specify something

KPM states that UASA is a school-based summative assessment and that standardised instrument formats and JSUs are provided for lower-secondary English.

---

# 3. Core UASA Part 5 Format

## 3.1 Form 1

Typical full-paper format:

```text
PART 5
[8 marks]

Questions 33 to 40

Read the text below. Eight sentences have been removed from the text.

For 33 to 36, choose from the sentences (A – D) to fit each gap.
For 37 to 40, choose from the sentences (E – H) to fit each gap.
```

This structure appears consistently in recent Form 1 UASA papers.

### Structural specification

```yaml
form: 1
part: 5
question_numbers: 33-40
number_of_gaps: 8
marks: 8
option_structure:
  set_1:
    questions: 33-36
    options: A-D
  set_2:
    questions: 37-40
    options: E-H
marks_per_item: 1
unused_options: 0
```

### Important Form 1 characteristic

Treat the task effectively as **two independent four-item matching sets**.

Questions 33–36 should only require A–D.

Questions 37–40 should only require E–H.

Do not make Question 33 depend on option G, for example.

Every option within its four-option bank should normally be used exactly once.

---

# 4. Form 2 Format

Typical format:

```text
PART 5
[6 marks]

Questions 35 to 40

Read the text below.

Six sentences have been removed from the text.
Choose from the sentences (A – H) to fit each gap (35 – 40).

There are two extra sentences which you do not need to use.
```

The six-gap/eight-option structure is consistently found in Form 2 UASA-style papers and commercial UASA materials.

A current Form 2 JSU likewise defines Part 5 as **six gapped-text items worth six marks**.

### Structural specification

```yaml
form: 2
part: 5
question_numbers: 35-40
number_of_gaps: 6
number_of_options: 8
option_labels: A-H
unused_options: 2
marks: 6
marks_per_item: 1
```

### Important Form 2 characteristic

Unlike Form 1:

- all six gaps share the same A–H option pool;
- exactly six options are answers;
- exactly two options are unused distractors.

The two unused options must be **plausible**, not obviously irrelevant.

---

# 5. Critical Difference Between Form 1 and Form 2

| Feature | Form 1 | Form 2 |
|---|---:|---:|
| Curriculum target | Revise A2 | A2 High |
| Gaps | 8 | 6 |
| Options | 8 | 8 |
| Option organisation | A–D + E–H | Single A–H pool |
| Unused distractors | Normally 0 | 2 |
| Question numbers | 33–40 | 35–40 |
| Marks | 8 | 6 |
| Expected inference burden | Lower | Higher |
| Cross-paragraph tracking | Moderate | Moderate–high |

KPM curriculum progression places Form 1 at **Revise A2** and Form 2 at **A2 High**.

Therefore Form 2 should not simply be a shorter Form 1 exercise.

Its distractors and cohesion relationships can be somewhat less explicit.

---

# 6. Assessment Construct

## 6.1 Primary construct

The pupil must identify the sentence that restores the **meaning and organisation of the text**.

A successful item should require the pupil to process at least one contextual relationship.

Typical relationships include:

```text
CAUSE → EFFECT
PROBLEM → SOLUTION
GENERAL STATEMENT → EXAMPLE
CLAIM → EXPLANATION
QUESTION → ANSWER
EVENT → CONSEQUENCE
ACTION → REACTION
OLD INFORMATION → NEW INFORMATION
CHRONOLOGICAL EVENT → NEXT EVENT
TOPIC → ELABORATION
CONTRAST → CONTRASTING IDEA
PERSON/THING → PRONOUN REFERENCE
```

---

# 7. DSKP Alignment

Do **not** automatically label Form 1 or Form 2 Part 5 as Learning Standard 3.1.6.

In the official curriculum progression, **3.1.6 has no learning standard for Form 1 and Form 2** and is introduced subsequently.

The safer alignment for Part 5 is:

## Form 1

### Reading 3.1.1

> Understand the main points in simple longer texts.

### Reading 3.1.2

> Understand specific details and information in simple longer texts.

The Form 1 DSKP places reading at the Revise A2 curriculum target.

## Form 2

### Reading 3.1.1

Understand the main points in simple longer texts on a range of familiar topics.

### Reading 3.1.2

Understand specific details and information in simple longer texts on a range of familiar topics.

A recent Form 2 JSU maps:

- **5/6 Part 5 questions → 3.1.2**
- **1/6 → 3.1.1**

and classifies the items primarily under analytical processing.

Therefore a useful generation target is:

```yaml
form_2_construct_distribution:
  specific_detail_3_1_2: 5
  main_point_3_1_1: 1
```

This need not be mechanically identical every time, but it is a useful default.

---

# 8. What Makes a Good Gap?

A valid gap must have contextual evidence that makes **one option demonstrably superior** to all others.

The evidence should normally exist:

- immediately before the gap;
- immediately after the gap;
- or across both sides of the gap.

Strong items use evidence from **both directions**.

## Example abstract structure

```text
Rina wanted to join the photography competition.
[GAP]
Therefore, she borrowed her brother's camera and began practising every evening.
```

Correct missing sentence:

```text
However, she did not own a camera.
```

The answer is supported by:

### Left clue
She wants to enter a photography competition.

### Right clue
She therefore borrows a camera.

The missing sentence provides the logical problem connecting the two.

---

# 9. Bidirectional Cohesion Rule

For most gaps, generate:

```text
PRE-GAP CLUE
      ↓
MISSING SENTENCE
      ↓
POST-GAP CLUE
```

The correct option should connect naturally to **both**.

Avoid designing an item where the answer can be identified solely because of one matching vocabulary word.

---

# 10. Cohesion Mechanisms to Test

Use a deliberate mixture.

## 10.1 Pronoun/reference cohesion

Example:

```text
Amir found a small kitten outside his house.
[GAP]
It was shaking because of the heavy rain.
```

The missing sentence should establish or continue the kitten referent.

Possible cues:

- he / she
- it
- they
- this
- that
- these
- those
- his / her / their
- such

---

# 11. Lexical Cohesion

Use related concepts rather than exact repetition.

Example:

```text
The campsite had no electricity.
[GAP]
We therefore used torches after sunset.
```

Possible answer:

```text
There were no lights in our tents either.
```

Semantic chain:

```text
electricity
→ lights
→ torches
```

Prefer this over crude repetition such as:

```text
electricity → electricity → electricity
```

---

# 12. Logical Connectors

Appropriate connectors can provide clues:

### Addition
- also
- besides
- furthermore

### Contrast
- but
- however
- although

### Cause/effect
- because
- so
- therefore
- as a result

### Sequence
- first
- then
- next
- after that
- finally

### Example
- for example
- such as

Do not make every answer dependent on an explicit connector.

---

# 13. Temporal Cohesion

Especially effective in narratives.

Example:

```text
We arrived at the campsite at noon.
[GAP]
That evening, we cooked dinner beside the river.
```

Possible missing sentence:

```text
After putting up our tents, we explored the area.
```

The chronology must be internally consistent.

---

# 14. Cause–Effect Cohesion

Example:

```text
Heavy rain continued throughout the night.
[GAP]
The organisers cancelled the morning activities.
```

Correct idea:

```text
By morning, the field was completely flooded.
```

---

# 15. Topic Continuity

Each missing sentence must belong to the same local topic.

Example:

```text
Electric bicycles are useful for travelling short distances.
[GAP]
They also produce very little noise.
```

A sentence about petrol vehicles may be thematically related but should not automatically fit unless discourse structure supports it.

---

# 16. Paragraph Function

A removed sentence may perform one of several discourse functions.

Use a varied distribution:

```yaml
possible_gap_functions:
  - introduction_of_detail
  - elaboration
  - example
  - consequence
  - reason
  - contrast
  - transition
  - chronological_event
  - reaction
  - conclusion
  - problem
  - solution
```

Do not make all gaps simple continuation sentences.

---

# 17. Gap Placement Rules

Do not remove sentences randomly.

A suitable removed sentence should create a recoverable cohesion problem.

Preferred positions:

- between a statement and explanation;
- between cause and consequence;
- between two chronological events;
- after introducing a participant;
- before a pronoun-dependent sentence;
- between a general claim and example;
- before a concluding statement;
- at a paragraph transition when adequately signalled.

Avoid:

- gaps requiring external factual knowledge;
- gaps where two answers are semantically interchangeable;
- gaps in quotations that depend on punctuation tricks;
- gaps whose answer is obvious solely because of capitalization;
- gaps whose answer requires obscure vocabulary rather than reading skill.

---

# 18. Spacing of Gaps

Do not cluster multiple gaps together.

Bad:

```text
Sentence.
[GAP]
[GAP]
Sentence.
```

Preferred:

```text
2–5 meaningful sentences or clauses
between most gaps.
```

The intact text must provide sufficient context.

---

# 19. Text Type

Part 5 uses a **continuous/linear text**.

Suitable genres include:

- story;
- personal narrative;
- article;
- informational article;
- advice article;
- experience/recount;
- descriptive article;
- simple factual explanation;
- blog-style text;
- informal report-like article;
- travel account;
- school-life account.

Recent papers demonstrate both narrative and informational texts, for example stories and environmental/informational articles.

Avoid making Part 5 primarily:

- advertisements;
- timetables;
- menus;
- isolated notices;
- forms;
- tables;
- disconnected messages.

Those belong more naturally to other reading-task formats.

---

# 20. Topic Domains

KSSM secondary English uses four broad themes:

1. **People and Culture**
2. **Health and Environment**
3. **Science and Technology**
4. **Consumerism and Financial Awareness**

These themes apply to both Form 1 and Form 2.

Suitable topics include:

```text
school life
friendship
family
hobbies
celebrations
travel
sports
healthy habits
environment
weather
animals
technology
science
shopping
saving money
transport
community activities
Malaysian culture
volunteering
personal experiences
```

Prefer familiar, age-appropriate contexts.

---

# 21. Malaysian Context

Malaysian contexts are encouraged but should feel natural.

Possible contexts:

- school programmes;
- neighbourhood activities;
- Malaysian celebrations;
- local food;
- travelling within Malaysia;
- public transport;
- environmental programmes;
- sports;
- school competitions;
- community events.

Avoid inserting Malaysian references merely as decoration.

For example:

```text
During the school holidays, Aina visited Langkawi with her family.
```

is preferable to forcing multiple Malaysian cultural references into every paragraph.

---

# 22. Form 1 Language Level

## Target

```yaml
CEFR_target: Revise A2
```

Form 1 language should consist mostly of:

- common vocabulary;
- concrete situations;
- familiar topics;
- relatively short sentences;
- explicit chronological or causal relationships;
- manageable subordinate clauses;
- identifiable referents.

Some inference is required, but the clue chain should generally be visible.

---

# 23. Form 2 Language Level

## Target

```yaml
CEFR_target: A2_High
```

Compared with Form 1, Form 2 may use:

- somewhat longer sentences;
- greater lexical variety;
- less explicit repetition;
- moderate inferencing;
- paragraph-level references;
- slightly more abstract explanations;
- more competitive distractors.

Do not push ordinary Form 2 passages into B1-heavy syntax merely to make them difficult.

---

# 24. Grammar Policy

Grammar should be **integrated naturally** into the text.

Do not design Part 5 as:

```text
Choose the sentence because only one has the correct tense.
```

Instead:

```text
Choose the sentence because it fits the chronology, referents,
meaning and discourse relationship.
```

Grammar provides supporting cohesion, not the sole construct.

---

# 25. Form 1 Grammar Boundary

The Form 1 syllabus includes textbook grammar from Pulse 2 Units 1–5 plus additional Language Awareness structures.

## Core textbook grammar

### Present simple

```text
affirmative
negative
questions
short answers
```

### Present continuous

Use for actions happening now/current situations.

### Past simple

```text
regular and common irregular verbs
affirmative
negative
questions
short answers
```

### was / were

### could / couldn't

### Past continuous

### Past continuous + past simple

Typical relationship:

```text
His mother was cooking when she heard a noise.
```

### Adjectives and adverbs

### Comparatives and superlatives

### Articles / determiners / quantity

```text
a
an
some
any
```

### Countable and uncountable nouns

### much / many / a lot of

### will / won't

### First conditional

```text
If + present, will + verb
```

These textbook structures are explicitly listed in the Form 1 curriculum.

---

# 26. Additional Form 1 Language Awareness Grammar

The Form 1 syllabus additionally specifies:

```text
1. Indirect questions using present/past forms
   Do you know what ...?
   Can you tell me ...?

2. Past tense with sequencing adverbs
   first
   then
   after that

3. Modals for rules and obligations
   must
   mustn't
   should
   shouldn't

4. Future events/plans/arrangements
   present continuous
   going to
   will

5. Modals for advice
   can
   could
   should
   shouldn't
   might

6. Defining relative clauses
   who
   which
   that

7. Growing range of prepositions

8. Infinitive of purpose
   to + verb

9. Passive
   present simple passive
   past simple passive
```

---

# 27. Form 1 Grammar Generation Rule

An LLM should therefore:

```yaml
form_1_grammar_policy:
  prefer:
    - present_simple
    - present_continuous
    - past_simple
    - past_continuous
    - will
    - going_to
    - first_conditional
    - comparatives
    - superlatives
    - basic_modals
    - simple_relative_clauses
    - countable_uncountable
    - common_quantifiers
    - infinitive_of_purpose
    - simple_passives

  avoid_as_core_language:
    - past_perfect
    - third_conditional
    - mixed_conditionals
    - complex_participle_clauses
    - inversion
    - advanced_modal_perfects
    - highly_embedded_relative_clauses
```

Advanced structures may occasionally appear incidentally if completely transparent, but they should not determine an answer.

---

# 28. Form 2 Grammar Boundary

Form 2 builds on Form 1.

Pulse 2 Units 6–9 explicitly add:

## Future intentions

```text
be going to
```

## will with future time expressions

## when + future meaning

Example:

```text
When I go on holiday, I'll buy some souvenirs.
```

## would like + infinitive

## Present perfect

```text
affirmative
negative
questions
short answers
```

## Present perfect + for / since

## Tense review

- present simple;
- present continuous;
- past simple;
- past continuous;
- present perfect;
- will;
- be going to.

## should / shouldn't

## must / mustn't

These are explicitly represented in the Form 2 syllabus.

---

# 29. Additional Form 2 Grammar

The Form 2 Language Awareness syllabus includes:

```text
1. Review of present simple and present continuous

2. Growing range of quantifiers
   all
   both
   any
   a few
   a lot / a lot of
   too much
   too many

3. Review of past simple and past continuous

4. Question forms and indirect questions

5. -ed / -ing adjectives

6. Comparatives and superlatives

7. Countable and uncountable nouns

8. Modals for rules/obligation in present and past
   must
   mustn't
   have to
   don't have to
   had to
   didn't have to

9. Question tags

10. Present and past simple passive

11. Infinitive of purpose
```

---

# 30. Form 2 Grammar Generation Rule

```yaml
form_2_grammar_policy:
  allow_all_form_1_structures: true

  additionally_prefer:
    - present_perfect
    - present_perfect_for_since
    - would_like
    - have_to
    - had_to
    - broader_quantifiers
    - question_tags
    - tense_contrast

  avoid_as_required_knowledge:
    - past_perfect
    - future_perfect
    - third_conditional
    - mixed_conditionals
    - modal_perfects
    - advanced_passive_constructions
    - reduced_relative_clauses
    - advanced_subjunctive
```

---

# 31. Important Grammar Safeguard

Do not accidentally create a Form 1 question whose solution depends on knowledge introduced mainly in Form 2.

For example, avoid a Form 1 item whose decisive clue requires mastery of:

```text
present perfect + since
```

Likewise do not introduce advanced grammar merely because it is grammatically correct English.

The goal is:

```text
curriculum-compatible English
```

not:

```text
the most sophisticated English the LLM can produce
```

---

# 32. Constructing the Original Passage

Generate the **complete coherent text first**, without gaps.

Recommended pipeline:

```text
STEP 1
Generate complete passage.

STEP 2
Check story/article coherence.

STEP 3
Identify candidate removable sentences.

STEP 4
Analyse cohesion dependencies.

STEP 5
Select gaps.

STEP 6
Remove sentences.

STEP 7
Create option pool.

STEP 8
Create distractors if required.

STEP 9
Validate uniqueness.

STEP 10
Return final examination task.
```

Never attempt to write the passage with blanks already inserted from the beginning.

That approach frequently produces weak cohesion.

---

# 33. Candidate Sentence Selection

A removable sentence should satisfy:

```yaml
candidate_sentence:
  grammatically_complete: true
  meaningful_in_original_text: true
  recoverable_from_context: true
  has_contextual_dependency: true
  removal_does_not_destroy_entire_text: true
  answer_not_based_on_trivia: true
```

Prefer sentences containing:

- pronouns;
- demonstratives;
- discourse markers;
- consequence;
- explanation;
- reaction;
- reference to previously introduced information;
- transition to the next idea.

---

# 34. Form 1 Option Construction

For each four-question group:

```text
Q33-Q36 → A-D
Q37-Q40 → E-H
```

Shuffle the correct sentences.

Do not preserve passage order.

Bad:

```text
33 A
34 B
35 C
36 D
```

unless it happens very rarely by chance.

Prefer varied permutations:

```text
33 C
34 A
35 D
36 B
```

and:

```text
37 F
38 H
39 E
40 G
```

---

# 35. Form 1 Distractor Behaviour

Although there are normally no unused options, each option acts as a **temporary distractor for the other gaps in the set**.

Therefore every four-option bank should contain sentences sharing enough:

- topic;
- vocabulary;
- grammar;
- referents;

to require actual reading.

Do not make one sentence obviously unrelated to the passage.

---

# 36. Form 2 Distractor Construction

Form 2 requires **two unused sentences**.

A valid distractor should:

1. match the general topic;
2. use similar language level;
3. look superficially possible;
4. fail because of a specific discourse incompatibility.

Possible distractor failure mechanisms:

```text
wrong referent
wrong chronology
wrong cause
wrong consequence
wrong paragraph topic
wrong polarity
contradiction
repetition of information
incorrect transition
semantic redundancy
```

---

# 37. Weak Distractor Example

Passage topic:

```text
A school camping trip
```

Weak distractor:

```text
Elephants are the largest land animals.
```

This is immediately rejected without comprehension.

Do not use such distractors.

---

# 38. Better Distractor Example

Context:

```text
The pupils reached the campsite before lunch.
They put up their tents.
```

Distractor:

```text
They packed their tents and returned home immediately.
```

This is topically plausible but conflicts with subsequent events.

That is a useful distractor.

---

# 39. Distractor Similarity Rule

Distractors should have **semantic proximity but contextual incompatibility**.

Aim for:

```text
TOPICAL SIMILARITY: HIGH
LOCAL COHESION: LOW
GLOBAL COHERENCE: LOW
```

Correct option:

```text
TOPICAL SIMILARITY: HIGH
LOCAL COHESION: HIGH
GLOBAL COHERENCE: HIGH
```

---

# 40. Avoid Lexical Giveaway

Bad:

```text
Before gap:
The bicycle had a flat tyre.

Correct answer:
The flat tyre needed repairing.

All distractors:
Sentences about food, school and music.
```

Better:

All options concern the journey/bicycle but only one explains the local context.

---

# 41. Avoid Pronoun Giveaway Without Meaning

Pronouns can form part of the clue, but avoid:

```text
Only one option contains "she",
and the preceding person is female.
```

The student should ideally need both:

```text
reference compatibility
+
meaning compatibility
```

---

# 42. Unique-Solution Requirement

For every gap:

```text
exactly_one_best_answer = true
```

Before accepting the task, test every option in every available gap.

Create a compatibility matrix:

```text
        Gap1 Gap2 Gap3 Gap4 ...
Opt A    ✓    X    X    X
Opt B    X    X    ✓    X
Opt C    X    ✓    X    X
...
```

No gap may contain two strong ✓ candidates.

---

# 43. Ambiguity Check

For every incorrect option, answer:

```text
Why exactly does this option fail here?
```

Valid explanations include:

```text
referent mismatch
chronological inconsistency
logical contradiction
wrong discourse relationship
repeats already stated information
topic shift
does not connect with following sentence
does not connect with previous sentence
```

If the only explanation is:

```text
"The other answer sounds slightly better."
```

the item is too ambiguous.

Rewrite it.

---

# 44. Passage Coherence Test

After reinserting the answers, the complete passage must read as though it was originally written continuously.

Check:

```yaml
coherence_check:
  logical_sequence: pass
  pronoun_references: pass
  tense_consistency: pass
  paragraph_topics: pass
  chronology: pass
  transitions: pass
  repetition: acceptable
  conclusion_matches_body: pass
```

---

# 45. Gap Independence

Avoid creating chained dependencies where getting one answer wrong automatically forces several subsequent errors.

Some option elimination is unavoidable, particularly in Form 1, but every gap should retain sufficient contextual evidence.

Target:

```text
contextual solution > elimination-only solution
```

---

# 46. Difficulty Calibration — Form 1

A useful mixture for eight items:

```yaml
form_1_default_difficulty:
  direct: 3
  moderate_inference: 4
  stronger_inference: 1
```

### Direct
Strong lexical/reference/sequence signal.

### Moderate
Requires reading both neighbouring sentences.

### Stronger inference
Requires paragraph purpose or broader chronology.

Do not make all eight items direct lexical matches.

---

# 47. Difficulty Calibration — Form 2

Recommended six-item spread:

```yaml
form_2_default_difficulty:
  direct: 1
  moderate_inference: 3
  stronger_inference: 2
```

Form 2 distractors should generally be more competitive than Form 1 options.

---

# 48. Vocabulary Control

Use vocabulary appropriate to:

```text
Form 1 → Revise A2
Form 2 → A2 High
```

Unknown words may occur if:

- their precise meaning is unnecessary;
- meaning is inferable from context;
- they are unavoidable topic terms.

Do not make the answer depend on understanding an obscure word.

---

# 49. Sentence Complexity

## Form 1

Prefer approximately:

```text
8–18 words per sentence
```

with occasional longer sentences.

## Form 2

Prefer approximately:

```text
9–22 words per sentence
```

with controlled complex sentences.

These are generation guidelines, **not official KPM word limits**.

Naturalness takes priority over mechanically meeting sentence lengths.

---

# 50. Text Length

There does not appear to be a rigid public KPM word-count rule specifically defining Part 5 passage length.

Therefore do **not** falsely claim an official word count.

Instead generate a passage long enough to:

- support all gaps;
- provide sufficient context;
- remain suitable for an A2 reader;
- fit the expected lower-secondary paper.

Practical generation targets:

```yaml
recommended_not_official:
  form_1:
    words: 220-320
  form_2:
    words: 250-350
```

Adjust according to genre and sentence complexity.

These are **item-writing targets, not statutory UASA limits**.

---

# 51. Information Density

Avoid highly compressed encyclopaedic writing.

Bad:

```text
Photosynthesis, involving chlorophyll-mediated photochemical
reactions, converts electromagnetic radiation...
```

Preferred:

```text
Plants need sunlight to make their own food. Their leaves collect
light from the sun and use it during this process.
```

The task tests reading, not technical expertise.

---

# 52. Genre Integrity

The passage must behave like the genre it claims to be.

## Narrative

Needs:

```text
characters
setting
event sequence
reactions
resolution or meaningful endpoint
```

## Advice article

Needs:

```text
problem/purpose
recommendations
reasons/examples
conclusion
```

## Informational article

Needs:

```text
clear topic
organised subtopics
explanation/examples
logical progression
```

Do not create a sequence of disconnected facts merely to manufacture gaps.

---

# 53. Paragraphing

Use natural paragraphs.

Typical structure:

```text
TITLE

Paragraph 1
Introduction

Paragraph 2
Development

Paragraph 3
Development

Paragraph 4
Development / consequence

Paragraph 5
Conclusion
```

Not every task requires exactly five paragraphs.

---

# 54. Answer Position Distribution

Avoid suspicious answer patterns.

## Form 1

For each four-option bank, use every option once.

Randomise ordering.

## Form 2

Use six of A–H.

Avoid:

```text
A B C D E F
```

or repeated predictable patterns.

Randomisation must occur **after validity has been established**.

---

# 55. Content Safety and Age Appropriateness

Suitable:

- friendship disagreements;
- getting lost temporarily;
- school challenges;
- environmental problems;
- minor accidents;
- sports;
- travel problems;
- responsible online behaviour.

Avoid unnecessary:

- graphic injury;
- sexual content;
- extreme violence;
- detailed self-harm;
- adult criminal scenarios;
- politically inflammatory material.

---

# 56. LLM Generation Algorithm

Use the following algorithm.

## Stage A — Set parameters

Input:

```yaml
form: 1 | 2
theme: optional
topic: optional
genre: optional
difficulty: standard | easier | harder
```

Derive:

```text
CEFR level
number of gaps
option configuration
grammar boundary
question numbering
```

---

## Stage B — Generate complete text

Create a coherent passage **without gaps**.

Check:

```text
age appropriateness
CEFR suitability
grammar compatibility
clear paragraph structure
internal coherence
```

---

## Stage C — Identify removable sentences

Rank each sentence according to:

```text
cohesion strength
recoverability
context dependence
value as assessment item
```

Choose sentences that rely on varied clue mechanisms.

---

## Stage D — Build the gapped text

Remove:

```text
Form 1 → 8 sentences
Form 2 → 6 sentences
```

Ensure reasonable distance between gaps.

---

## Stage E — Construct options

### Form 1

Use the eight removed sentences themselves.

Divide:

```text
first four gap answers → A-D bank
second four gap answers → E-H bank
```

Shuffle within each bank.

### Form 2

Use:

```text
6 removed sentences
+
2 purpose-built distractors
=
8 options A-H
```

Shuffle all eight.

---

## Stage F — Validate every gap

For each gap:

```text
1. Insert correct answer.
2. Read sentence before + answer + sentence after.
3. Verify coherence.
4. Insert every alternative.
5. Identify why every alternative fails.
```

---

## Stage G — Global validation

Reconstruct the original passage.

Check:

```text
Does it sound natural?
Are all referents clear?
Is chronology intact?
Are there contradictions?
Does every paragraph have a function?
```

---

# 57. Automated Quality-Control Schema

Internally generate a record similar to:

```yaml
item_validation:
  gap: 35
  answer: C

  clue_before:
    type: cause
    description: "Writer explains that cycling long distances is tiring."

  clue_after:
    type: consequence
    description: "Electric assistance solves the problem."

  answer_function:
    type: problem_elaboration

  alternatives:
    A:
      valid: false
      reason: chronology mismatch
    B:
      valid: false
      reason: unrelated consequence
    D:
      valid: false
      reason: wrong referent
    E:
      valid: false
      reason: paragraph-topic mismatch
    F:
      valid: false
      reason: redundant information
    G:
      valid: false
      reason: contradicts following sentence
    H:
      valid: false
      reason: describes later event

  ambiguity: false
```

Do not necessarily show this structure to pupils.

Use it internally to verify item quality.

---

# 58. Required Final Output

For **Form 1**, output:

```markdown
## Part 5
**[8 marks]**

### Questions 33 to 40

Read the text below. Eight sentences have been removed from the text.

For questions 33 to 36, choose from the sentences (A–D) to fit each gap.
For questions 37 to 40, choose from the sentences (E–H) to fit each gap.

# [TITLE]

[PASSAGE WITH GAPS 33–40]

### A–D
A. ...
B. ...
C. ...
D. ...

### E–H
E. ...
F. ...
G. ...
H. ...

## Answer Key
33. ...
...
40. ...
```

---

# 59. Required Form 2 Output

```markdown
## Part 5
**[6 marks]**

### Questions 35 to 40

Read the text below. Six sentences have been removed from the text.

Choose from the sentences (A–H) to fit each gap (35–40).
There are two extra sentences which you do not need to use.

# [TITLE]

[PASSAGE WITH GAPS 35–40]

### Sentences

A. ...
B. ...
C. ...
D. ...
E. ...
F. ...
G. ...
H. ...

## Answer Key
35. ...
36. ...
37. ...
38. ...
39. ...
40. ...
```

---

# 60. Teacher/Developer Metadata

When requested, additionally return:

```yaml
metadata:
  form:
  cefr_target:
  kssm_theme:
  topic:
  genre:
  word_count:
  grammar_used:
  learning_standards:
    - 3.1.1
    - 3.1.2

  gaps:
    - number:
      answer:
      discourse_function:
      primary_clue:
      secondary_clue:
      difficulty:

  unused_distractors:
    - option:
      reason_invalid:
```

---

# 61. Prohibited Generation Behaviours

Never:

```text
❌ generate disconnected sentences first and then force them into a passage

❌ use grammar correctness as the sole answer clue

❌ use vocabulary far above the target level to create difficulty

❌ create two equally plausible answers

❌ create irrelevant Form 2 distractors

❌ place all gaps at identical paragraph positions

❌ make every clue an obvious pronoun match

❌ create an answer sequence that simply follows A-B-C-D

❌ introduce Form 2/advanced grammar as essential knowledge in Form 1

❌ claim that 3.1.6 is the Form 1/Form 2 learning standard

❌ state invented "official" word-count requirements

❌ confuse Form 1's two 4-option banks with Form 2's 8-option/2-distractor system
```

---

# 62. Gold-Standard Item Principle

A high-quality Part 5 question should make a pupil think:

> "This sentence belongs here because it explains what came before and connects naturally with what comes next."

not:

> "This sentence contains the same word."

and not:

> "This is the only sentence with the correct verb tense."

---

# 63. Final LLM Instruction

When generating a UASA Part 5 Gapped Text task:

1. Determine whether the target is Form 1 or Form 2.
2. Apply the correct CEFR and grammar boundary.
3. Generate a complete natural passage first.
4. Select sentences whose removal creates meaningful cohesion problems.
5. Construct the exact Form-specific option architecture.
6. Ensure each correct answer is supported through semantic and discourse evidence.
7. Make distractors topically plausible.
8. Test every option against every available gap.
9. Reject and rewrite any ambiguous item.
10. Reconstruct the completed text and perform a final coherence check.
11. Return the examination task and answer key.
12. If teacher metadata is requested, explain the clue mechanism and reason every distractor fails.

**Optimise for construct validity, uniqueness of answers, CEFR/KSSM compatibility and natural discourse—not superficial difficulty.**