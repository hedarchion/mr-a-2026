# UASA KSSM English Paper 2 — Part 1
## Short Communicative Message: Item-Generation Specification for LLMs

### 1. Purpose

Generate examination-style **UASA KSSM lower-secondary English Paper 2, Part 1: Short Communicative Message** tasks.

The generated item should require the candidate to **respond to a short message/email from a familiar person** for a clear communicative purpose such as:

- giving advice;
- making a suggestion;
- recommending something;
- expressing an opinion;
- choosing between alternatives;
- explaining a preference;
- responding to a request;
- describing a simple future plan or event.

The task should assess the candidate's ability to understand the stimulus and produce a short, coherent, contextually appropriate written response.

---

# 2. Assessment Construct

The fundamental construct is:

> **Read a short message from a known person → understand the communicative situation → respond appropriately to all requested information.**

The task is **not principally an essay-writing task**.

It is a functional communication task.

Typical stimulus:

```text
Hi Amir,

I want to start exercising during the school holidays.
I am thinking of swimming, jogging or playing badminton.
Which one do you think I should choose? Why?

Let me know what you think!

Bye!
Jason
```

Candidate instruction:

```text
In about 70 words, write an email to Jason giving him some advice.
```

Current Form 2 materials repeatedly use this structure: a familiar sender presents a small problem or decision, gives several possibilities, and explicitly requests a recommendation or suggestion.

Form 1 materials use the same underlying communicative design, normally with simpler language and a shorter response.

---

# 3. Form-Level Parameters

## Form 1

Recommended target:

```yaml
form: 1
curriculum_target: "Revise A2"
response_length: "about 60 words"
difficulty: "A1 High–A2 / Revise A2"
```

Recent Form 1 UASA-format materials specify approximately **60 words** for Part 1.

The KSSM curriculum explicitly includes functional writing such as **emails/messages** and expects pupils to construct meaningful simple sentences.

---

## Form 2

Recommended target:

```yaml
form: 2
curriculum_target: "A2 High"
response_length: "about 70 words"
difficulty: "A2 High"
```

A widely used UASA-format specification distinguishes:

- Form 1: about 60 words
- Form 2: about 70 words
- Form 3: about 80 words.

Some commercial Form 2 materials use **80 words**, so the word-count parameter should remain configurable rather than being hard-coded.

For strict UASA-style generation, default to:

```text
Form 1 → about 60 words
Form 2 → about 70 words
```

unless the user supplies a different specification.

---

# 4. Relevant Form 2 KSSM Writing Standards

The Form 2 curriculum is particularly useful for defining the construct.

Relevant standards include:

**4.1.2**
> Make and respond to simple requests and suggestions.

**4.1.4**
> Express opinions and common feelings such as happiness, sadness, surprise and interest.

**4.1.5**
> Organise and sequence ideas within short texts on familiar topics.

The curriculum also requires moderate accuracy in punctuation and spelling.

The curriculum target for Form 2 is **A2 High**.

A 2026 Form 2 examination specification associates the Short Communicative Message with Writing Standards including communicating plans/events, expressing opinions, organising ideas, punctuation and spelling.

Therefore, generated items should primarily elicit **functional A2-level communication**, not sophisticated essay writing.

---

# 5. Canonical Item Architecture

Every generated item should contain four components.

```text
[CONTEXT / STEM]

[INPUT MESSAGE]

[WRITING INSTRUCTION]

[ANSWER SPACE / OPTIONAL EMAIL FRAME]
```

## Component A — Context

Usually one short sentence.

Examples:

```text
Read the email from your friend, Adam.
```

```text
Read the message from your cousin, Sarah.
```

Avoid unnecessary narrative outside the message.

---

# 6. Stimulus Message Architecture

The stimulus should normally contain approximately **3–6 communicative moves**.

Recommended internal structure:

```text
1. Greeting
2. Situation/background
3. Problem, decision or intention
4. Options/details
5. Explicit question/request
6. Friendly closing
```

For example:

```text
Hi Nina,

Our class is going on a trip next month. I can bring either
a camera, binoculars or a small speaker, but I can only
choose one.

Which one do you think would be most useful? Why?

Hope you can help!

Bye!
Aisyah
```

---

# 7. Core Item-Construction Principle

A good Part 1 item must create a **communicative gap**.

The sender knows something or has a problem.

The candidate must supply information that the sender does not already have.

Bad:

```text
I like badminton. Badminton is fun.
Do you like badminton?
```

Too trivial.

Better:

```text
I want to join a sports club but I cannot decide between
badminton, basketball and swimming.

Which sport do you think I should choose? Why?
```

The response now requires:

1. making a decision;
2. communicating the decision;
3. supporting it.

---

# 8. Most Common Communicative Functions

The item generator should select **one dominant function**.

## Type A — Recommendation

```text
Which one should I choose?
```

Candidate must:

```text
recommend + justify
```

Example domains:

- sports club;
- hobby;
- book genre;
- transport;
- school activity;
- holiday destination.

This is one of the most common observed structures.

---

## Type B — Advice

Stimulus:

```text
I want to become healthier but I do not know what exercise
to start with. What should I do?
```

Candidate must:

```text
give advice + explanation
```

---

## Type C — Choice Between Alternatives

Stimulus:

```text
Should I take the ferry or use the bridge?
What do you think?
```

Candidate must:

```text
select option + explain preference
```

Commercial UASA materials use precisely this kind of familiar decision-making problem.

---

## Type D — Suggestion / Planning

Stimulus:

```text
We want to celebrate our class teacher's birthday.
Where should we celebrate it and what should we do?
```

Candidate must provide several requested pieces of information.

---

## Type E — Opinion

```text
Do you think joining the school camp is a good idea?
Why?
```

Candidate must:

```text
state opinion + give reasons
```

---

## Type F — Responding to a Practical Problem

```text
I spend too much money every week.
How can I save more?
```

Candidate must:

```text
acknowledge problem + suggest practical solutions
```

---

# 9. Content-Point Design

The stimulus should normally create **2–4 identifiable content obligations**.

Example:

```text
Where should we go?
What can we do there?
What should we bring?
```

This creates:

```yaml
content_points:
  - destination
  - activity
  - item_to_bring
```

Do not create six or seven independent questions.

The response is only approximately 60–70 words.

---

# 10. Recommended Number of Content Obligations

Use:

```yaml
minimum: 2
preferred: 3
maximum: 4
```

A three-point design is particularly useful because it allows weaker pupils to identify what information must be included while still allowing stronger pupils to elaborate.

The assessment logic used for Short Communicative Message tasks strongly rewards fulfilling the requested content and informing the target reader. Writing assessment frameworks describe Content in terms of addressing the required content elements and fully informing the reader.

---

# 11. Stimulus Length

Keep the input compact.

Target approximately:

```yaml
form_1_stimulus: 35-55 words
form_2_stimulus: 40-65 words
```

The exact count is less important than cognitive economy.

The stimulus must contain only information needed to understand the situation.

Avoid:

- biographies;
- long explanations;
- irrelevant descriptions;
- multiple paragraphs of background information;
- specialist knowledge.

---

# 12. Familiarity Rule

Topics must concern **familiar teenage life**.

Good domains:

```text
school
friends
family
hobbies
sports
shopping
food
holidays
clubs
books
movies
technology
pets
health habits
transport
school events
weekend activities
saving money
celebrations
local places
environmental activities
```

Avoid tasks requiring specialised factual knowledge.

Bad:

```text
Which investment instrument should I choose:
government bonds, REITs or derivatives?
```

Bad:

```text
Which type of photovoltaic cell should our school install?
```

The candidate should be assessed on English, not domain expertise.

---

# 13. Options Structure

Recommendation items often supply **2–3 plausible options**.

Preferred:

```text
badminton / swimming / jogging
```

```text
science fiction / mystery / classic
```

```text
bus / train / ferry
```

Examples from published UASA practice include choosing among exercise types, shopping locations, book genres and sports clubs.

Three options are particularly effective because:

- there is genuine choice;
- no option needs to be objectively correct;
- candidates can independently generate reasons.

---

# 14. No Single Correct Content Answer

Part 1 should normally be **open-response**.

The item writer must not construct a hidden factual key such as:

```text
Correct answer = swimming
```

Instead:

```text
swimming → acceptable with reasonable justification
jogging → acceptable with reasonable justification
badminton → acceptable with reasonable justification
another sensible exercise → potentially acceptable
```

Assessment should focus on whether the candidate successfully communicates a relevant response.

---

# 15. Explicitness of the Task

The sender's request must be unmistakable.

Good:

```text
Which club do you think I should join? Why?
```

Good:

```text
What should I do? Please give me some advice.
```

Bad:

```text
Anyway, those are my choices. See you soon.
```

The candidate should not need to infer what type of response the examiner expects.

---

# 16. Relationship Between Sender and Candidate

Use familiar relationships.

Preferred:

```yaml
relationship:
  - friend
  - cousin
  - brother
  - sister
  - pen pal
  - classmate
```

Published tasks commonly frame the sender as a friend, sibling, cousin or pen pal.

This naturally supports informal communication.

---

# 17. Register

For Form 1 and Form 2, default to a **friendly informal or neutral-informal register**.

Suitable stimulus expressions:

```text
Hi,
How are you?
I need your help.
What do you think?
Which one should I choose?
Hope you can help.
Let me know what you think!
Thanks!
Bye!
```

Do not unnecessarily force formal business correspondence.

Form 2's curriculum does not yet prescribe a separate learning standard for formal/informal register; explicit register development occurs more strongly in subsequent forms.

Therefore, the safest default is a familiar-person message.

---

# 18. Language Level

## Form 1

Use primarily:

```text
A1 High → A2 Low / Revise A2
```

Sentence characteristics:

- short;
- concrete;
- predominantly simple clauses;
- common vocabulary;
- transparent questions.

---

## Form 2

Use:

```text
A2, with target around A2 High
```

Allow:

- simple compound sentences;
- because/so/but/and;
- basic comparatives;
- should/could/can;
- present and simple future reference;
- straightforward reasons;
- common opinion expressions.

Avoid making lexical difficulty the challenge.

---

# 19. Grammar Control in the Stimulus

The item itself must be grammatically clean.

Suitable structures include:

```text
present simple
present continuous
past simple where context requires
be going to
will
can
could
should
comparatives
basic superlatives
because
but
so
and
if + simple condition where appropriate
```

Do not overload the stimulus with:

```text
complex passive constructions
mixed conditionals
inversions
rare phrasal verbs
advanced idioms
dense relative clauses
C1 vocabulary
```

---

# 20. Prompt Question Design

Good prompt questions have high **response productivity**.

Example:

```text
Which activity should I choose and why?
```

Candidate can easily produce:

```text
I think you should choose swimming because...
```

Poor:

```text
What are your thoughts regarding the implications of this decision?
```

The latter unnecessarily increases linguistic processing.

---

# 21. Instruction Stem

Preferred Form 1 template:

```text
In about 60 words, write a message to [NAME], [COMMUNICATIVE PURPOSE].
```

Example:

```text
In about 60 words, write a message to Ella, giving her some advice.
```

This formulation appears directly in Form 1 UASA-format materials.

Preferred Form 2 template:

```text
In about 70 words, write an email to [NAME], [COMMUNICATIVE PURPOSE].
```

Example:

```text
In about 70 words, write a reply to Raj, giving him your suggestion.
```

This structure appears in Form 2 UASA practice materials.

---

# 22. Mark Allocation

Use:

```text
[20 marks]
```

Published lower-secondary UASA-format materials allocate:

```text
Part 1 = 20 marks
Part 2 = 20 marks
Total Paper 2 = 40 marks
```



---

# 23. Assessment Dimensions

For an LLM generating items and model responses, design the task so that performance can meaningfully be judged according to four writing dimensions:

```text
Content
Communicative Achievement
Organisation
Language
```

The same four-part structure is used in the Malaysian CEFR-aligned Short Communicative Message assessment tradition.

Conceptually:

### Content

Does the response answer what the sender actually asked?

### Communicative Achievement

Does the response function successfully as a message/email to the intended reader?

### Organisation

Are the ideas connected and logically sequenced?

### Language

Is vocabulary and grammar sufficiently appropriate and controlled for the level?

Do **not** build items where success depends primarily on advanced vocabulary.

---

# 24. Item-Generation Algorithm

The LLM should generate an item using the following sequence.

## STEP 1 — Select form

```yaml
form: 1 | 2
```

---

## STEP 2 — Select CEFR target

```python
if form == 1:
    target = "Revise A2"
elif form == 2:
    target = "A2 High"
```

---

## STEP 3 — Select theme

Example:

```text
hobbies
```

---

## STEP 4 — Select communicative function

Example:

```text
recommendation
```

---

## STEP 5 — Create a realistic problem

Example:

```text
Friend wants to begin a hobby but cannot decide what to choose.
```

---

## STEP 6 — Generate 2–3 plausible options

```text
photography
gardening
cycling
```

Options must all be plausible.

---

## STEP 7 — Create 2–4 content obligations

Example:

```yaml
required_content:
  - recommended hobby
  - reason
  - optional practical suggestion
```

---

## STEP 8 — Write stimulus

Example:

```text
Hi Adam,

I want to start a new hobby during the school holidays.
I'm thinking about photography, gardening or cycling,
but I can't decide.

Which one do you think I should try? Why?

Let me know what you think!

Bye!
Ravi
```

---

## STEP 9 — Generate instruction

Form 2:

```text
In about 70 words, write an email to Ravi giving him your suggestion.
```

---

## STEP 10 — Validate

Run all checks specified below.

---

# 25. Structural Validation Rules

Before outputting an item, verify:

```yaml
has_sender: true
sender_known_to_candidate: true
has_clear_context: true
has_communicative_problem: true
has_explicit_request: true
content_points: 2-4
topic_familiar: true
specialist_knowledge_required: false
multiple_valid_responses_possible: true
language_matches_form: true
response_length_matches_form: true
marks: 20
```

Reject and regenerate if any mandatory condition fails.

---

# 26. Difficulty Validation

Ask:

```text
Could a genuine A2 learner understand exactly what the sender wants?
```

If no:

> simplify.

Ask:

```text
Could the student answer using mostly everyday language?
```

If no:

> simplify.

Ask:

```text
Is the difficulty caused by communicating ideas rather than decoding obscure vocabulary?
```

If no:

> revise.

---

# 27. Content Validity Rule

The question should naturally allow the candidate to demonstrate approximately three things:

```text
UNDERSTAND → DECIDE → EXPLAIN
```

For example:

```text
UNDERSTAND:
Friend cannot decide which sport to choose.

DECIDE:
Recommend badminton.

EXPLAIN:
It is fun, inexpensive and can be played with friends.
```

That is an ideal Short Communicative Message construct.

---

# 28. Avoid Over-Scaffolding

Bad stimulus:

```text
Which sport should I choose?
Please say badminton.
Give Reason 1: cheap.
Give Reason 2: healthy.
Give Reason 3: friends.
```

This turns the task into copying.

Better:

```text
Should I join badminton, swimming or basketball?
Which one would you recommend? Why?
```

The learner must independently generate supporting content.

---

# 29. Avoid Under-Specification

Bad:

```text
Tell me about sports.
```

There is no clear communicative outcome.

Better:

```text
I want to join a sports club this year.
Which sport should I choose? Why?
```

---

# 30. Avoid Artificial Examination Language

Do not write the sender's message as if the sender is an examiner.

Bad:

```text
Provide three reasons supporting the selection of an activity.
```

Better:

```text
Which activity do you think I should choose? Why?
```

---

# 31. Topic Localisation

Items may use Malaysian contexts, but localisation should be natural rather than encyclopaedic.

Good:

```text
school canteen
night market
school holiday
sports day
book fair
Penang trip
school club
Hari Raya open house
community clean-up
```

Avoid requiring candidates to know a specific Malaysian factual answer.

The item should remain answerable from personal reasoning.

---

# 32. Distractor-Like Options

Although this is not an MCQ, supplied alternatives should be approximately equally plausible.

Bad:

```text
Should I travel by bus, train or helicopter?
```

The third option distorts the choice.

Better:

```text
Should I travel by bus, train or car?
```

---

# 33. Content Independence

Do not make one content point dependent on obscure information from another.

Bad:

```text
Which Korean mountain should I visit and which trail grade is safest?
```

This assesses knowledge.

Better:

```text
Should we spend our holiday at the beach, in the countryside or in the city?
Which would you choose and what could we do there?
```

---

# 34. Item Archetype Library

The generator may randomly select from these patterns.

## Archetype 1 — Choose One

```text
I am thinking of [A], [B] or [C].
Which should I choose? Why?
```

---

## Archetype 2 — Solve My Problem

```text
I have a problem with [familiar situation].
What do you think I should do?
```

---

## Archetype 3 — Help Me Plan

```text
I am planning [event].
Where should we go?
What should we do?
```

---

## Archetype 4 — Give Me Your Opinion

```text
I am thinking of [decision].
Do you think it is a good idea? Why?
```

---

## Archetype 5 — Recommend Something

```text
I want to [goal].
Can you recommend a [book/activity/place/etc.]?
```

---

## Archetype 6 — Compare Two Choices

```text
Should I choose [A] or [B]?
What do you think?
```

---

# 35. Variation Dimensions

To prevent repetitive generated questions, vary independently:

```yaml
sender_relationship:
  - friend
  - cousin
  - sibling
  - classmate
  - pen_pal

function:
  - recommendation
  - advice
  - opinion
  - suggestion
  - planning
  - preference

theme:
  - hobbies
  - school
  - health
  - travel
  - shopping
  - money
  - sports
  - food
  - technology
  - environment
  - celebrations
  - books

decision_shape:
  - two_options
  - three_options
  - open_recommendation

required_points:
  - 2
  - 3
  - 4
```

---

# 36. Anti-Repetition Rule

When producing a batch, do not merely replace nouns in the same template.

Bad batch:

```text
Which sport should I choose?
Which hobby should I choose?
Which food should I choose?
Which club should I choose?
```

Instead vary the actual communicative operation:

```text
Q1 recommendation
Q2 advice
Q3 planning
Q4 opinion
Q5 problem-solving
Q6 preference
```

---

# 37. Model Answer Generation

If a model answer is requested, the answer must respond naturally rather than mechanically repeating each question.

Recommended structure:

```text
Greeting

Acknowledge the sender's situation.

Main answer/recommendation.

Reason 1.

Reason 2 or supporting detail.

Friendly closing.
```

Example:

```text
Hi Ravi,

I think you should try cycling. It is a fun way to stay healthy,
and you can also explore new places around your neighbourhood.
You could ask one of your friends to cycle with you at the
weekend so that you will not get bored. You only need a bicycle
and a helmet to get started.

Hope you enjoy your new hobby!

Bye!
Adam
```

Do not require idioms or advanced vocabulary.

A successful A2 response can use basic vocabulary and straightforward grammatical forms.

---

# 38. Important Marking Implication for Item Writers

Every explicit question placed in the stimulus creates a potential **content obligation**.

For example:

```text
Where should we go?
What should we do there?
What should we bring?
```

means the generated marking logic should recognise:

```yaml
content_point_1: place
content_point_2: activity
content_point_3: item
```

Therefore, never add casual rhetorical questions accidentally.

Example:

```text
Sounds exciting, doesn't it?
```

This should not be treated as an assessed content point.

---

# 39. Machine-Readable Item Schema

Recommended JSON-compatible schema:

```json
{
  "paper": "English KSSM UASA Paper 2",
  "part": 1,
  "task_type": "Short Communicative Message",
  "form": 2,
  "target_cefr": "A2 High",
  "marks": 20,
  "target_words": 70,
  "theme": "Health and Environment",
  "communicative_function": "giving advice",
  "relationship": "friend",
  "stimulus": {
    "sender": "Jason",
    "recipient": "candidate",
    "message": "..."
  },
  "content_obligations": [
    "recommend one activity",
    "give at least one supporting reason"
  ],
  "instruction": "In about 70 words, write an email to Jason giving him some advice.",
  "valid_response_space": "open",
  "difficulty_controls": {
    "specialist_knowledge": false,
    "familiar_context": true,
    "multiple_valid_answers": true
  }
}
```

---

# 40. Recommended Generator Prompt

Use the following internal instruction when generating questions:

```text
Generate one UASA KSSM English Paper 2 Part 1 Short Communicative
Message item for Form {FORM}.

The task must simulate a realistic short message/email from someone
the candidate knows.

Create a familiar teenage situation involving a clear communicative
need such as advice, recommendation, opinion, preference, suggestion
or planning.

The sender must explicitly ask the candidate to respond.

Requirements:

1. Use an informal or neutral-informal relationship such as friend,
   sibling, cousin, classmate or pen pal.

2. Use a familiar everyday topic appropriate to Malaysian lower-
   secondary pupils.

3. The stimulus must create 2–4 clear content obligations.

4. The candidate must need to generate some original content rather
   than copy the stimulus.

5. All major options must be plausible. There must not be one
   predetermined correct opinion.

6. Do not require specialist or factual knowledge.

7. Keep vocabulary and syntax appropriate to:
   - Form 1: Revise A2
   - Form 2: A2 High

8. Default response lengths:
   - Form 1: about 60 words
   - Form 2: about 70 words

9. Allocate 20 marks.

10. The final instruction must state exactly what communicative
    function the candidate must perform.

11. Do not generate the model answer unless explicitly requested.

12. Before outputting, identify the hidden content obligations and
    verify that each one can reasonably be answered within the
    target word count.
```

---

# 41. Output Format for an LLM Question Generator

Return:

```markdown
## Part 1 – Short Communicative Message

Read the email from your [relationship], [name].

> [stimulus message]

In about **{60|70} words**, write an email/message to [name],
[communicative purpose].

**[20 marks]**
```

Internally retain:

```yaml
communicative_function:
content_obligations:
cefr_target:
theme:
expected_register:
```

Do not print those metadata fields on the student paper unless specifically requested.

---

# 42. Quality-Control Checklist

An item is acceptable only if all are **YES**:

- Is the sender clearly identifiable?
- Is the sender someone familiar to the candidate?
- Is the situation realistic for a teenager?
- Is the topic familiar?
- Is the sender's communicative need clear?
- Does the sender explicitly request a response?
- Are there 2–4 assessable content obligations?
- Can all obligations be answered within 60/70 words?
- Are multiple sensible answers possible?
- Does answering require English rather than specialised knowledge?
- Is the stimulus approximately A2?
- Is vocabulary mostly high-frequency?
- Are the options genuinely plausible?
- Is the candidate required to generate original information?
- Does the instruction correctly describe the communicative purpose?
- Is the mark allocation 20?
- Does the task resemble actual short interpersonal communication rather than a miniature academic essay?

If any answer is **NO**, revise the item.

---

# 43. Core Design Formula

The shortest usable abstraction is:

```text
FAMILIAR PERSON
+
FAMILIAR SITUATION
+
SMALL PROBLEM / DECISION / PLAN
+
2–4 INFORMATION NEEDS
+
EXPLICIT REQUEST FOR A RESPONSE
+
A2-LEVEL LANGUAGE
=
UASA SHORT COMMUNICATIVE MESSAGE
```

For recommendation-style items:

```text
SITUATION
→ 2–3 PLAUSIBLE OPTIONS
→ "WHICH SHOULD I CHOOSE?"
→ "WHY?"
→ 60/70-WORD RESPONSE
```

This pattern is strongly represented across Form 1 and Form 2 UASA practice materials.

---

# 44. Critical Distinction

Do **not** instruct the LLM:

```text
Create a 70-word email essay question.
```

That definition is too broad.

Use:

```text
Create an input-based interpersonal writing task in which a familiar
sender communicates a realistic problem, decision or plan and asks
the candidate for 2–4 pieces of communicatively necessary
information. The response should be approximately 70 words and
should assess successful communication at A2 High.
```

That better captures what the item is actually designed to test.

---

# 45. Recommended Defaults

```yaml
UASA_P2_PART1:
  name: "Short Communicative Message"
  marks: 20

  form_1:
    target_cefr: "Revise A2"
    target_words: 60

  form_2:
    target_cefr: "A2 High"
    target_words: 70

  default_genre: "informal email/message"
  default_relationship: "friend"
  content_obligations: 3
  options: 3

  preferred_functions:
    - advice
    - recommendation
    - suggestion
    - opinion
    - preference
    - planning

  required_properties:
    familiar_context: true
    explicit_communicative_need: true
    explicit_request: true
    multiple_valid_answers: true
    specialist_knowledge: false

  assessment_dimensions:
    - Content
    - Communicative Achievement
    - Organisation
    - Language
```

## Implementation note

There is some inconsistency across commercial publications concerning the Form 2 word count: examples exist using **70 words** and **80 words**. The clearest lower-secondary progression located in current UASA-format material is **60 / 70 / 80 words for Forms 1 / 2 / 3 respectively**, so this specification uses **70 words as the Form 2 default** while keeping `target_words` configurable.