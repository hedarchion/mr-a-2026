# UASA KSSM ENGLISH PAPER 1 — PART 1  
## Short Text Multiple Choice  
### Technical Specification for LLM Item Generation — Form 1 & Form 2

## 1. Scope

This specification describes how to generate **Part 1 of Paper 1: Reading and Use of English** for Malaysian KSSM lower-secondary English UASA assessments.

It applies to:

- **Form 1**
- **Form 2**

The specification is based primarily on the **Kementerian Pendidikan Malaysia (KPM) 2025 UASA Lower Secondary Assessment Instrument Format**, supplemented by published UASA-style materials and examination examples.

---

# 2. Official Assessment Parameters

According to KPM's current UASA format:

| Parameter | Form 1 | Form 2 |
|---|---|---|
| Paper | Paper 1: Reading and Use of English | Paper 1: Reading and Use of English |
| Part | Part 1 | Part 1 |
| Item type | Short text multiple choice | Short text multiple choice |
| Classification | Objektif Aneka Pilihan — OAP | Objektif Aneka Pilihan — OAP |
| Number of questions | **8** | **8** |
| Options per item | **3: A, B, C** | **3: A, B, C** |
| Marks | **8** | **8** |
| Marks per item | 1 | 1 |
| Scoring | Dichotomous | Dichotomous |
| Target CEFR | **A2** | **A2/B1** |

KPM explicitly identifies Part 1 for both levels as **"Short text multiple choice"** consisting of eight questions. Form 1 is targeted at CEFR A2, while Form 2 spans A2/B1. 
---

# 3. Fundamental Item Model

Each question follows this conceptual structure:

```text
[SHORT STIMULUS]

[QUESTION / SENTENCE STEM]

A [option]
B [option]
C [option]
```

The candidate:

1. reads a short independent text or visual-text stimulus;
2. identifies its explicit or implied meaning;
3. chooses the **single best answer** from A, B or C.

Every item should normally use a **different short text**.

Do not construct Part 1 as:

- one passage followed by eight questions;
- a grammar cloze;
- vocabulary definition matching;
- isolated grammar MCQs;
- general-knowledge questions.

The reading stimulus must provide the evidence required to answer the question.

---

# 4. Typical Candidate Instructions

Use instructions equivalent to:

> Read the text carefully for each question. Choose the best answer, A, B or C.

Published UASA materials consistently employ eight independent questions with three options each.

---

# 5. What Part 1 Actually Tests

Part 1 is principally a **short-text reading comprehension task**.

The item should require the learner to perform one or more of these operations:

```yaml
constructs:
  - retrieve_explicit_information
  - identify_main_message
  - identify_purpose
  - identify_intention
  - interpret_short_message
  - interpret_notice_or_sign
  - interpret_simple_data
  - identify_true_statement
  - infer_simple_meaning
  - recognise_consequence
  - recognise_reason
  - recognise_time_or_location
  - integrate_two_or_more_details
```

KPM places Paper 1 within constructs including remembering, understanding, applying, knowledge of the language system and values.

Part 1 should nevertheless remain predominantly a **reading-for-meaning task**, rather than an overt grammar test.

---

# 6. Stimulus Types

Published UASA-style material shows substantial variation in stimulus format. Appropriate stimulus types include:

```yaml
stimulus_types:
  - advertisement
  - poster
  - notice
  - sign
  - announcement
  - personal_message
  - text_message
  - email
  - invitation
  - reminder
  - short_dialogue
  - news_snippet
  - timetable
  - schedule
  - menu
  - promotion
  - product_information
  - warning
  - rules
  - chart
  - graph
  - table
  - infographic
  - simple_diagram
  - label
  - public_information_text
  - club_or_school_notice
```

Authentic examples include advertisements, personal messages, nutrition information, notices, diagrams, charts, news reports and emails.

There is **no evidence in the official KPM format document of a fixed quota** requiring, for example, exactly two advertisements, one email and one graph.

Therefore:

> Treat stimulus diversity as an item-writing principle, not as a rigid official distribution.

---

# 7. Recommended Distribution for an 8-Item Generated Set

For automatic generation, use a balanced distribution such as:

```yaml
recommended_set:
  personal_communication: 2
  public_functional_text: 2
  advertisement_or_promotion: 1
  visual_or_data_text: 1
  informational_or_news_text: 1
  rules_warning_or_instruction: 1
```

Example:

| Q | Stimulus |
|---|---|
| 1 | WhatsApp-style message |
| 2 | School notice |
| 3 | Advertisement |
| 4 | Chart |
| 5 | Email |
| 6 | Warning/sign |
| 7 | Short news report |
| 8 | Event poster |

Do not repeat the same format eight times.

---

# 8. Text Length

There is no single official word limit published for each Part 1 stimulus.

Observed items range from extremely short signs to short paragraphs.

Recommended generation constraints:

### Form 1

```yaml
Form_1:
  target_cefr: A2
  typical_stimulus_words: 10-60
  preferred_maximum: 70
```

### Form 2

```yaml
Form_2:
  target_cefr: A2-B1
  typical_stimulus_words: 15-80
  preferred_maximum: 90
```

Exceptions are acceptable for:

- timetables;
- charts;
- menus;
- advertisements;
- lists;
- diagrams.

In such cases, calculate **information density**, not literal word count.

---

# 9. Form 1 Difficulty Profile

Official target:

```yaml
form: 1
cefr: A2
```



## 9.1 Expected reading behaviour

A Form 1 learner should usually be able to:

- locate directly stated information;
- understand short everyday messages;
- understand simple notices and signs;
- understand familiar school and daily-life vocabulary;
- connect two straightforward pieces of information;
- make a simple inference where evidence is obvious.

## 9.2 Language characteristics

Prefer:

- simple present;
- simple past;
- present continuous;
- basic future forms;
- imperatives;
- common modals;
- familiar conjunctions;
- straightforward comparative forms;
- common school/community vocabulary.

Avoid making success dependent on:

- obscure idioms;
- low-frequency vocabulary;
- dense figurative language;
- complex embedded clauses;
- advanced phrasal verbs;
- sophisticated cultural knowledge.

---

# 10. Form 2 Difficulty Profile

Official target:

```yaml
form: 2
cefr:
  lower: A2
  upper: B1
```



Form 2 can therefore require somewhat greater processing than Form 1.

Appropriate increases include:

- longer stimuli;
- more paraphrasing between stimulus and answer;
- integrating 2–3 details;
- simple inference;
- identifying intention;
- distinguishing similar alternatives;
- interpreting conditions and restrictions;
- identifying the best summary;
- interpreting cause/result.

Do **not** merely make Form 2 harder by adding rare vocabulary.

Difficulty should primarily come from **reading operations**.

---

# 11. Question-Stem Families

Use varied stems.

## A. Explicit Information

```text
According to the notice, ...
From the message, we know that ...
The advertisement says that ...
Which statement is true?
```

Target:

```yaml
skill: explicit_information
```

---

## B. Purpose

```text
What is the purpose of the poster?
Why was this message written?
The advertisement is mainly intended to ...
```

Target:

```yaml
skill: communicative_purpose
```

Common answers:

- invite;
- warn;
- inform;
- remind;
- advertise;
- request;
- thank;
- apologise;
- encourage.

---

## C. Intention

```text
Why did Amir send the message?
Maya wrote the email because she wanted to ...
```

Requires interpretation of communicative intention.

---

## D. True Statement

```text
Which of the following is true?
From the notice, we know that ...
```

All three options should concern information contained or contradicted by the stimulus.

---

## E. Time / Date / Place

```text
When should ...
Where will ...
At what time ...
```

Avoid trivial copying where possible.

Better:

Stimulus:

```text
Registration: 8:00 a.m.
Competition: 9:30 a.m.
```

Question:

```text
A participant arriving at 9:00 a.m. will ...
```

This requires interpretation rather than direct transcription.

---

## F. Condition / Eligibility

```text
Who can participate?
To receive the discount, customers must ...
If Farah wants to join, she should ...
```

Particularly suitable for:

- promotions;
- competitions;
- membership notices;
- advertisements.

---

## G. Reason / Cause

```text
Why was the meeting cancelled?
The writer could not attend because ...
```

---

## H. Consequence

```text
What will happen if ...
Customers who ... will receive ...
```

---

## I. Data Interpretation

For:

- bar charts;
- pie charts;
- tables;
- schedules;
- simple diagrams.

Possible stem:

```text
The chart shows that ...
Which statement is correct?
```

Published Form 1 materials include questions requiring interpretation of charts and diagrams.

---

## J. Main Message / Gist

```text
The notice is mainly about ...
What is the main message of the text?
```

Prefer particularly for Form 2.

---

## K. Simple Inference

Stimulus:

```text
Hi Jin,
Football practice is off today. Coach Rahman is at the hospital with his son.
Practice will continue on Thursday.
```

Question:

```text
Players should
A come for training today.
B return for training on Thursday.
C visit Coach Rahman at the hospital.
```

The correct answer is not necessarily copied verbatim but is clearly recoverable.

---

# 12. Correct-Answer Construction

A correct answer must satisfy all of the following:

```yaml
correct_option:
  supported_by_stimulus: true
  uniquely_correct: true
  requires_no_external_knowledge: true
  grammatically_compatible_with_stem: true
  semantically_precise: true
```

The answer may be:

### Direct

Stimulus:

```text
The library closes at 4:30 p.m.
```

Correct option:

```text
The library closes at half past four.
```

### Paraphrased

Stimulus:

```text
Bring your own reusable container.
```

Correct option:

```text
Customers should bring a container from home.
```

### Inferred

Stimulus:

```text
All tickets have been sold.
```

Correct option:

```text
People can no longer buy tickets.
```

Prefer paraphrased answers over verbatim copying when appropriate.

---

# 13. Distractor Engineering

Distractors are central to this item type.

Each question requires:

```yaml
options:
  correct: 1
  distractors: 2
```

Both distractors must be **plausible**.

Never generate absurd or obviously unrelated alternatives.

---

# 14. Recommended Distractor Types

## 14.1 Detail Swap

Stimulus contains:

```text
Saturday
10:00 a.m.
School library
```

Distractor swaps one detail:

```text
Sunday at 10:00 a.m.
```

---

## 14.2 Partial Truth

A statement contains one true detail but is incorrect overall.

Stimulus:

```text
Members pay RM5.
Non-members pay RM8.
```

Distractor:

```text
Everyone pays RM5.
```

---

## 14.3 Reversal

Stimulus:

```text
The event has been postponed.
```

Distractor:

```text
The event has been brought forward.
```

---

## 14.4 Wrong Actor

Stimulus:

```text
Lina asked Mei to bring the book.
```

Distractor:

```text
Mei asked Lina to bring the book.
```

---

## 14.5 Wrong Purpose

Poster asks for donations.

Distractor:

```text
To advertise items for sale
```

---

## 14.6 Unsupported Inference

The option sounds reasonable but is not stated or inferable.

This is particularly useful for medium-difficulty items.

---

## 14.7 Condition Omission

Stimulus:

```text
Free drink with purchases above RM30.
```

Distractor:

```text
All customers receive a free drink.
```

---

## 14.8 Numerical Confusion

Stimulus:

```text
RM15 per child
RM20 per adult
```

Distractors can swap values or calculate an incorrect total.

Keep arithmetic extremely light because this is a reading assessment.

---

# 15. Distractor Quality Rules

All options should be:

```yaml
parallel:
  grammar: true
  length: approximately_similar
  semantic_category: same
```

Bad:

```text
A at 3 p.m.
B because her mother was ill.
C tomorrow.
```

Good:

```text
A at 2.00 p.m.
B at 2.30 p.m.
C at 3.00 p.m.
```

Do not make the correct answer conspicuously:

- longer;
- more detailed;
- grammatically polished;
- more specific

than the distractors.

---

# 16. Option Independence

Do not use:

```text
A All of the above
B None of the above
```

Do not construct overlapping answers such as:

```text
A Monday
B Monday morning
C weekdays
```

unless only one can logically be correct.

---

# 17. Text–Question Dependency

A critical validation rule:

> The question must be impossible to answer reliably without reading the stimulus.

Bad:

```text
NOTICE:
Wear a helmet when cycling.

Question:
Which item protects your head?

A helmet
B shoe
C watch
```

This primarily tests vocabulary/general knowledge.

Better:

```text
NOTICE:
Bicycles may only enter the park if riders wear helmets.

Question:
A cyclist without a helmet
A must leave the bicycle outside.
B can cycle slowly inside.
C may borrow a bicycle from the park.
```

---

# 18. Authenticity

Texts should resemble genuine short texts encountered by Malaysian teenagers.

Recommended contexts:

```yaml
contexts:
  - school
  - family
  - friends
  - hobbies
  - food
  - health
  - environment
  - technology
  - shopping
  - transport
  - sports
  - clubs
  - celebrations
  - community
  - travel
  - public_services
```

Published items commonly employ familiar school, health, environmental, social and everyday-life settings.

Avoid excessive dependence on:

- foreign cultural trivia;
- specialist science knowledge;
- politics;
- adult financial concepts;
- unfamiliar professional contexts.

---

# 19. Visual Stimuli

Part 1 can use non-linear and semi-visual texts such as:

- posters;
- advertisements;
- charts;
- labels;
- diagrams;
- signs;
- schedules.

For LLM generation, describe the visual semantically.

Example internal structure:

```yaml
stimulus:
  type: poster
  title: "School Fun Run"
  visual_elements:
    - running_shoe_icon
  text:
    date: "12 July"
    time: "7.30 a.m."
    registration_fee: "RM5"
    instruction: "Register before 5 July"
```

The rendered graphic may subsequently be produced from this schema.

Do not make the answer dependent on purely decorative details.

---

# 20. Visual-to-Text Separation

Mark each visual attribute as either:

```yaml
functional: true
```

or:

```yaml
decorative: true
```

Example:

```yaml
functional:
  - date
  - prices
  - opening_hours
  - chart_values
  - warning_symbol

decorative:
  - background_colour
  - cartoon_character
  - decorative_border
```

Only functional information should determine the keyed answer.

---

# 21. Recommended Difficulty Distribution

KPM specifies the CEFR level but does **not** publish a mandatory Part-1-only easy/medium/hard ratio in the format document.

For generated classroom material, a sensible distribution is:

### Form 1

```yaml
difficulty:
  easy: 3
  moderate: 4
  challenging: 1
```

### Form 2

```yaml
difficulty:
  easy: 2
  moderate: 4
  challenging: 2
```

This is a **generation recommendation**, not an official KPM requirement.

---

# 22. Operational Definition of Difficulty

Difficulty should be manipulated through these variables:

```yaml
difficulty_dimensions:
  information_distance:
    easy: answer closely matches stimulus
    hard: answer substantially paraphrases stimulus

  details_to_integrate:
    easy: 1
    medium: 2
    hard: 2-3

  distractor_similarity:
    easy: low
    hard: high

  inference_depth:
    easy: none
    medium: simple
    hard: simple_but_indirect

  stimulus_density:
    easy: low
    hard: moderate

  lexical_level:
    form_1: A2
    form_2: A2-B1
```

Avoid creating artificial difficulty using obscure vocabulary.

---

# 23. Form 1 vs Form 2: Generation Difference

The basic **exam format is essentially identical** in Part 1.

The main difference is the target language and processing demand.

| Feature | Form 1 | Form 2 |
|---|---|---|
| Questions | 8 | 8 |
| Options | A/B/C | A/B/C |
| Text type | Short independent texts | Short independent texts |
| CEFR | A2 | A2/B1 |
| Explicit retrieval | Frequent | Frequent |
| Paraphrase | Light | Moderate |
| Simple inference | Limited | More frequent |
| Detail integration | Usually 1–2 | Usually 2–3 |
| Vocabulary | High-frequency | High-frequency + common B1 |
| Syntactic density | Low | Low–moderate |

Do **not** create separate structural templates for Form 1 and Form 2.

Use the same architecture with different language and cognitive difficulty settings.

---

# 24. Question-Type Distribution Recommendation

A robust 8-question generation model:

```yaml
questions:
  - skill: explicit_information
  - skill: purpose
  - skill: explicit_information
  - skill: data_interpretation
  - skill: intention
  - skill: condition_or_consequence
  - skill: true_statement
  - skill: simple_inference
```

For Form 1, make Q8 only mildly inferential.

For Form 2, approximately 2–3 items may require genuine paraphrase or simple inference.

---

# 25. Prohibited Generation Patterns

The LLM MUST NOT:

```yaml
prohibited:
  - generate_four_options
  - generate_more_or_fewer_than_8_items_when_full_part_requested
  - ask_open_ended_questions
  - test isolated_grammar_as_part1
  - use one_long_passage_for_all_items
  - require_external_knowledge
  - use ambiguous_correct_answers
  - generate joke_distractors
  - overuse_negative_stems
  - copy_correct_answer_verbatim_every_time
  - make_answer_obvious_by_length
  - use vocabulary far_above_target_cefr
  - use all_of_the_above
  - use none_of_the_above
```

---

# 26. Negative Questions

Questions using:

```text
NOT
EXCEPT
```

may be generated sparingly.

Maximum recommendation:

```yaml
negative_items_per_8:
  preferred: 0-1
  maximum: 2
```

If used, visually emphasise the negative word:

```text
Which activity is NOT allowed?
```

Do not create difficulty merely by confusing candidates with negatives.

---

# 27. Language Accuracy

All generated language should follow standard international/British English conventions appropriate to Malaysian KSSM.

Use Malaysian conventions where relevant:

```text
RM
programme
colour
centre
7.30 a.m.
Form 1
school hall
```

Avoid accidentally turning grammatical errors into clues unless the source is intentionally authentic informal communication.

---

# 28. Personal Messages

Messages should sound natural.

Example structure:

```text
Hi Nadia,

Mum cannot fetch us today. Wait for me at the school gate after your
badminton practice. I should arrive at about 4.30 p.m.

Azra
```

Question:

```text
Azra wants Nadia to

A wait for her after badminton practice.
B ask their mother to collect them.
C leave school before 4.30 p.m.
```

This tests communicative meaning rather than grammatical terminology.

---

# 29. Advertisement Items

An advertisement should contain several candidate facts.

Example:

```text
WEEKEND BOOK SALE

Saturday and Sunday
10 a.m. – 6 p.m.

20% off storybooks
Buy 3 notebooks and get 1 free

City Bookshop
```

Question:

```text
Customers can

A receive a free notebook after buying three.
B get 20% off every item in the shop.
C visit the sale on weekdays.
```

Correct answer: A.

Distractors are constructed from nearby stimulus information.

---

# 30. Purpose Items

Purpose questions should test the relationship between text and communicative function.

Example:

```text
PLEASE RETURN ALL LIBRARY BOOKS
BY 18 NOVEMBER.
Students with overdue books will not be allowed
to borrow books during the school holidays.
```

Question:

```text
The notice is written to

A remind students to return library books.
B invite students to borrow books for the holidays.
C announce that the library will close.
```

---

# 31. Data Items

Keep mathematics subordinate to reading.

Example:

```text
Students attending clubs

Robotics       25
Badminton      40
Drama          20
Cooking        35
```

Form 1:

```text
Which club has the most students?
```

Form 2:

```text
Which statement is correct?

A Drama has half as many students as Badminton.
B Cooking is more popular than Badminton.
C Robotics has fewer students than Drama.
```

The Form 2 item requires comparison rather than direct lookup.

---

# 32. News Items

Use very short reports.

```text
IPOH — Heavy rain caused several roads near Taman Murni
to flood yesterday evening. Residents were advised to avoid
Jalan Murni until the water level dropped.
```

Possible question:

```text
Residents were advised to

A use another route.
B leave Taman Murni immediately.
C wait for heavy rain to begin.
```

Do not require knowledge about actual Malaysian events.

---

# 33. Rules and Instructions

Example:

```text
SCIENCE LAB

• Wear safety goggles.
• Do not eat or drink.
• Keep bags outside the laboratory.
• Report broken equipment immediately.
```

Question:

```text
Students may

A bring drinks into the laboratory.
B tell the teacher about damaged equipment.
C leave their bags beside their tables.
```

---

# 34. Semantic Paraphrasing

A high-quality UASA-style item should often transform wording.

Stimulus:

```text
The meeting has been moved to Friday.
```

Preferred answer:

```text
The meeting will take place on a different day.
```

rather than:

```text
The meeting has been moved to Friday.
```

For Form 1, paraphrasing should remain transparent.

For Form 2, it can be less direct.

---

# 35. Vocabulary Control

Use a vocabulary filter during generation.

```yaml
form_1:
  ceiling: A2
  exceptions:
    - transparent_topic_word
    - proper_noun
    - word_explained_by_context

form_2:
  dominant: A2
  permitted: common_B1
```

If a rare word is necessary, the student should not need to know the exact word to answer.

Example:

```text
The sanctuary protects endangered turtles.
```

If `sanctuary` is potentially unknown, surrounding information should make its function evident.

---

# 36. Item Independence

Each item must be self-contained.

```yaml
item_independence:
  relies_on_previous_question: false
  shared_answer_dependency: false
  shared_long_passage: false
```

Do not allow Question 5's answer to reveal Question 6's answer.

---

# 37. Key Distribution

Avoid detectable answer patterns.

Recommended algorithm:

```pseudo
answers = balanced_shuffle(
  A approximately 2-3,
  B approximately 2-3,
  C approximately 2-3
)
```

For eight items:

```text
A = 3
B = 3
C = 2
```

or any balanced permutation.

Avoid patterns such as:

```text
A A A A B B C C
```

Do not deliberately force perfect mathematical balance if it damages item quality.

---

# 38. Automatic Validation Pipeline

Before accepting an item, run the following checks.

```pseudo
function validate(item):

    assert item.options.count == 3
    assert exactly_one_correct_answer(item)

    assert answer_is_supported_by_stimulus(item)
    assert distractor_1_is_plausible(item)
    assert distractor_2_is_plausible(item)

    assert no_external_knowledge_required(item)

    assert options_are_grammatically_parallel(item)

    assert vocabulary_within_target_cefr(item)

    assert item.tests_reading_not_trivia(item)

    assert no_answer_overlap(item)

    assert no_hidden_ambiguity(item)

    assert stimulus_contains_sufficient_evidence(item)

    return PASS
```

---

# 39. Ambiguity Check

The LLM should explicitly test every option against the text.

Example internal reasoning:

```yaml
A:
  text_support: direct
  verdict: correct

B:
  text_support: contradicted
  verdict: distractor

C:
  text_support: not_stated
  verdict: distractor
```

Reject an item if two options are:

```yaml
possible: true
```

even if one appears "more likely".

The answer must be **textually defensible**, not based on examiner preference.

---

# 40. Distractor Verification

For each distractor, record its error mechanism.

Example:

```yaml
options:
  A:
    status: distractor
    mechanism: wrong_date

  B:
    status: key
    evidence: "Register before 5 July"

  C:
    status: distractor
    mechanism: confuses_event_date_with_registration_deadline
```

This dramatically improves automated item quality.

---

# 41. Recommended Internal Item Schema

```json
{
  "item_number": 1,
  "form": 1,
  "part": 1,
  "target_cefr": "A2",
  "stimulus": {
    "type": "notice",
    "text": ""
  },
  "skill": "communicative_purpose",
  "question": "",
  "options": {
    "A": "",
    "B": "",
    "C": ""
  },
  "answer": "B",
  "evidence": "",
  "distractors": {
    "A": {
      "mechanism": ""
    },
    "C": {
      "mechanism": ""
    }
  },
  "difficulty": "moderate"
}
```

For Form 2:

```json
{
  "form": 2,
  "target_cefr": "A2-B1"
}
```

---

# 42. Full-Set Output Schema

```json
{
  "assessment": {
    "subject": "English",
    "curriculum": "KSSM",
    "exam": "UASA",
    "paper": "Paper 1 - Reading and Use of English",
    "part": 1,
    "form": 1,
    "item_count": 8,
    "marks": 8
  },
  "instructions": "",
  "items": [],
  "answer_key": []
}
```

---

# 43. Suggested Generation Algorithm

```pseudo
INPUT:
    form
    optional_theme
    optional_difficulty

SET:
    if form == 1:
        CEFR = A2
    if form == 2:
        CEFR = A2-B1

CREATE 8 item specifications

ASSIGN diverse stimulus types

ASSIGN reading constructs:
    explicit_information
    purpose
    explicit_information
    data_interpretation
    intention
    condition
    true_statement
    inference

FOR EACH item:
    create authentic short stimulus
    identify one target proposition
    create correct paraphrase
    create distractor from nearby information
    create second distractor from plausible misconception
    validate all three options

RUN:
    CEFR check
    ambiguity check
    answer-distribution check
    stimulus-diversity check
    external-knowledge check

OUTPUT:
    examination version
    answer key
    item metadata
```

---

# 44. Quality-Control Matrix

Score every generated item against:

| Criterion | Required |
|---|---:|
| Exactly three options | Yes |
| Exactly one answer | Yes |
| Answer supported by text | Yes |
| Both distractors plausible | Yes |
| Appropriate CEFR | Yes |
| Natural stimulus | Yes |
| No outside knowledge needed | Yes |
| Options grammatically parallel | Yes |
| Reading comprehension required | Yes |
| No ambiguity | Yes |
| Appropriate teen context | Yes |
| No accidental answer clue | Yes |

Recommended acceptance rule:

```yaml
critical_failures_allowed: 0
```

Any failure in:

- unique answer;
- textual support;
- CEFR appropriateness;
- ambiguity

requires regeneration.

---

# 45. Set-Level Quality Control

For the complete eight-item section, additionally verify:

```yaml
set_validation:
  number_of_items: 8
  number_of_options_each: 3
  stimulus_variety: >= 5_types
  repeated_contexts: <= 2
  answer_distribution: balanced
  pure_explicit_retrieval_items: <= 4
  simple_inference_items:
    form_1: 1-2
    form_2: 2-3
```

These distribution values are recommended generation controls rather than official KPM quotas.

---

# 46. Example Form 1 Item

```text
SCHOOL DENTAL CHECK-UP

Tuesday, 12 May
8.00 a.m. – 12.00 noon
School Health Room

Form 1 students should bring their health cards.
Students attending the check-up will be called from their classes.

1. Form 1 students should

A wait outside the Health Room at 8.00 a.m.
B take their health cards to the dental check-up.
C leave their classes before the dentist arrives.
```

**Answer:** B

Metadata:

```yaml
level: A2
skill: explicit_information
difficulty: easy
distractors:
  A: unsupported_instruction
  C: incorrect_sequence
```

---

# 47. Example Form 2 Item

```text
Hi Rina,

I can't meet you at the shopping centre tomorrow morning.
My basketball training was moved from Friday to Saturday.
It finishes at one, so I can meet you at the café around
two instead. Let me know if that's too late.

Sara
```

```text
Sara is telling Rina that

A her basketball practice has been cancelled.
B she wants to meet at a different time.
C she will leave basketball practice early.
```

**Answer:** B

Metadata:

```yaml
level: A2-B1
skill: communicative_intention
processing:
  - understand_schedule_change
  - infer_effect_on_meeting
difficulty: moderate
```

The answer requires integrating multiple details rather than copying one sentence.

---

# 48. Critical Design Principle

The generator should follow this hierarchy:

```text
AUTHENTIC SHORT TEXT
        ↓
MEANING TO BE UNDERSTOOD
        ↓
READING OPERATION
        ↓
QUESTION
        ↓
ONE SUPPORTED ANSWER
        ↓
TWO PLAUSIBLE TEXT-BASED DISTRACTORS
```

Do **not** begin by inventing three random options and then write a text around them.

Construct the stimulus and reading target first.

---

# 49. Compact LLM Generation Instruction

```text
Generate UASA KSSM English Paper 1 Part 1 for Form [1/2].

Produce exactly 8 independent short-text MCQs.

FORMAT:
- 8 questions.
- One independent short stimulus per question.
- Three options only: A, B and C.
- Exactly one correct answer.
- 1 mark each.

LEVEL:
- Form 1: CEFR A2.
- Form 2: CEFR A2-B1.

STIMULI:
Use varied authentic short texts such as messages, emails, notices,
advertisements, posters, signs, charts, schedules, dialogues, rules,
news snippets and public-information texts.

ASSESS:
Primarily reading comprehension:
- explicit information,
- purpose,
- intention,
- true statements,
- conditions,
- reasons,
- consequences,
- simple data interpretation,
- simple inference.

ITEM CONSTRUCTION:
1. Create the stimulus first.
2. Identify one proposition to assess.
3. Write one clearly supported answer.
4. Write two plausible distractors using details from the stimulus.
5. Paraphrase information rather than copying the answer verbatim whenever appropriate.
6. Ensure the question cannot be answered reliably without reading the stimulus.

DISTRACTORS:
Use mechanisms such as:
- detail swap,
- partial truth,
- wrong actor,
- reversed meaning,
- wrong condition,
- unsupported inference,
- time/date confusion.

DO NOT:
- test isolated grammar,
- use four options,
- use all/none of the above,
- require external knowledge,
- use joke distractors,
- create ambiguous answers,
- use vocabulary beyond the target CEFR merely to increase difficulty.

FORM 2 should be harder mainly through greater paraphrasing, information
integration and simple inference—not obscure vocabulary.

After generation, validate every option against the stimulus and reject any
question for which more than one option could reasonably be defended.

Return:
1. student examination version;
2. answer key;
3. item metadata showing stimulus type, skill, CEFR, difficulty and distractor mechanism.
```

---

# 50. Evidence Status

## Officially specified by KPM

The following are explicitly supported by the KPM 2025 assessment format:

- Part 1 = Short Text Multiple Choice;
- 8 questions;
- 8 marks;
- objective multiple-choice format;
- Form 1 CEFR A2;
- Form 2 CEFR A2/B1;
- Form 1 Paper 1 total = 40 marks;
- Form 2 Paper 1 total = 40 marks;
- Paper duration = 1 hour 30 minutes.

## Strongly evidenced by published UASA materials

The following are recurring item-writing conventions rather than explicitly prescribed quotas:

- three options A/B/C;
- independent short stimuli;
- advertisements;
- messages;
- emails;
- notices;
- news extracts;
- signs;
- charts;
- diagrams;
- purpose questions;
- explicit-information questions;
- simple inference;
- true-statement questions.

## Recommended rather than official

The following rules in this specification are quality-control recommendations for LLM generation:

- exact stimulus distribution;
- suggested difficulty ratios;
- maximum number of negative questions;
- answer-key balancing;
- specific stimulus word limits;
- recommended number of inference questions.

These should **not** be represented as formal KPM regulations.