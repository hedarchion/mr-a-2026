# Formative Interaction Patterns

Choose the smallest interaction that produces useful evidence of learning.

## Interaction contract

Every interactive slide must provide a clear prompt, a visible way to respond, a teacher-controlled check/reveal, explanatory feedback, and a reset. Preserve keyboard operation and a non-digital fallback. A button, tab, card, or reveal control that is visible but does not update the slide state is a blocking defect.

## Suitable patterns

| Pattern | Evidence collected | Feedback |
| --- | --- | --- |
| Multiple choice | Chosen misconception/strategy | Explain the correct choice and contrast a distractor. |
| Order the steps | Procedural understanding | Show the correct order and name the dependency. |
| Categorise | Concept boundaries | Explain the defining feature of each category. |
| Error analysis | Diagnostic reasoning | Identify the exact faulty step, then repair it. |
| Confidence check | Readiness to proceed | Invite support or extension based on responses. |

## Implementation guidance

Use buttons for discrete choices and native pointer/keyboard-accessible interactions. Do not rely on drag-and-drop alone; provide tap/click alternatives. Maintain visible focus states, sufficient contrast, labels that describe actions, and motion that can be skipped. Keep state local to the slide and never require a login, network connection, or individual student device unless the user explicitly requests it.

For **gap-fill / cloze** slides, render each blank as an inline `<span class="blank">` (or equivalent) inside the sentence and wire every choice button to populate that span with the selected text on click/keyboard activation. The sentence must visibly update in place (e.g., `She ______ her teeth.` → `She brushes her teeth.`) alongside any `good/bad` highlighting and explanatory `.feedback`. On `Reset`, clear both the `good/bad` states and the blank's inserted text (restore `_____`); on `Reveal`, populate the blank with the canonical answer. This makes the thinking visible in context and is a required success condition for gap-fill interactions.

During verification, exercise each control with a real browser action: click or tap choices and confirm the **inline blank updates**, reveal/check answers, reset the slide and confirm the blank clears, navigate away and back, and test the keyboard path. If an existing deck's interaction shell fails (blank does not update, or only colours the choice), simplify or refactor the implementation rather than preserving a non-working pattern.
