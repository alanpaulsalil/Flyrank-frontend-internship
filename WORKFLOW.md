# WORKFLOW.md

## The Drill
Built the same settings form feature twice: Round 1 with a single vague prompt 
("Make me a settings form with validation"), Round 2 with a precise prompt specifying 
exact fields, file locations, accessibility constraints, and a required test-and-verify step.

## Correctness
Both rounds produced working validation, confirmed by manual browser testing (empty 
fields, invalid email, short/missing password, mismatched confirm-password). Round 2 
went further: it included an actual test file (`settings.test.js`) with 11 assertions 
covering every validation rule, which I ran independently via `node settings.test.js` 
and confirmed 11/11 passed. Round 1 had no automated verification — I only trusted 
what I could see in the browser.

## Scope and Diff
`git diff --stat` shows Round 1 added 496 lines across a 6-field form (name, email, 
username, bio, theme, language, notifications, plus a 3-field password section) — far 
more than what a "settings form" strictly required. Round 2 added 227 net lines and 
built exactly the 3 fields specified in the prompt (name, email, password), plus a 
dedicated test file. The vague prompt let the model guess at scope; the precise prompt 
constrained it to what was actually needed.

## Accessibility
Round 1 was never explicitly asked for accessibility features and I didn't test for 
them. Round 2 explicitly required `aria-invalid`, `aria-describedby`, and focus-shift 
to the first invalid field on submit. I verified this with DevTools: submitting the 
form empty moved keyboard focus to the Full Name field, and inspecting the invalid 
Email field showed `aria-invalid="true"` set dynamically. This was a testable, 
verifiable requirement that only existed because I asked for it directly.

## AI Mistake Caught
Round 1's generated `index.html` contained two `<title>` tags in the `<head>` — leftover 
from the original scaffold plus a new one the AI added, instead of replacing the 
existing one. It didn't break rendering, but it's invalid HTML I would have missed if 
I'd only glanced at the browser output. Round 2's prompt explicitly said "check the 
current index.html first," and the resulting file had only one `<title>` tag.

## Review Effort and Time
Round 1 felt faster to prompt (one sentence) but the output required more scrutiny 
afterward — extra fields I didn't ask for, no tests to lean on, and a markup bug I only 
caught by manually reading the head section. Round 2 took longer to write the prompt, 
but the review was faster and more confident: the test suite did a lot of the 
verification work for me, and the output matched spec exactly with no scope drift.

## Takeaway
Round 2 wasn't slower overall — it just shifted effort earlier (writing a careful 
prompt) instead of later (reviewing and debugging unclear output). The vague prompt's 
apparent speed was misleading once review time is counted.