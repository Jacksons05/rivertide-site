# Consumer UI standard
Approved November 25, 2026. Applies to marketing website and app. App owns this contract; website keeps an identical copy.

## Outcome
A seasonal business owner should understand what Rivertide does, what to do next, and why a result follows from their assumptions. Visual polish alone is not evidence of understanding.

## Visual baseline
- Approved monochrome palette, Public Sans, Signature R, and shared design tokens.
- At most two type sizes per viewport. Use weight, spacing, and grouping for hierarchy. This is a brand constraint, not proof of accessibility; propose changes for owner approval if testing exposes a problem.
- Decision surfaces prioritize result → chart → controls, with a clear next action.
- Keep water imagery outside opaque calculation surfaces. Motion supports the task; preserve pause and reduced-motion behavior.
- Use short, plain-language labels. Put detailed assumptions and exact values one step away, not behind jargon.
- Preserve visible distinctions between sample data, personal estimates, saved state, and unsaved/session-only previews.

## Accessibility target
Target WCAG 2.2 AA. This is a target, not a conformance claim or a complete WCAG checklist.
For changed screens, verify contrast; text resizing and mobile reflow; keyboard operation and visible/unobscured focus; semantic headings, labels and announcements; textual errors and recovery; chart text equivalents and non-color distinctions; adequate touch targets; reduced motion and pause controls.
Automated checks complement, not replace, screen-reader, keyboard and physical-device testing. Record untested criteria explicitly. Do not shrink text or remove explanations merely to fit a screen.

## Customer comprehension
Test representative owners without coaching:
1. Explain what the displayed result means.
2. Compare buying now versus later.
3. Find the lowest-cash month.
4. Distinguish bank balance from estimated spending room.
5. Find an assumption and change it.

Record task completion, incorrect interpretations, hesitation, assistance needed, and the owner's own explanation. Separate observed evidence from design hypotheses. Do not invent success rates or declare usability validated from internal checks or preference alone.
Public beta feedback can supply this evidence; a separate pilot program is not required. Use sample or consented test data, not unsolicited sensitive financial records.

## Review evidence
Each UI handoff states:
- Customer task and reason for visual choices.
- Screens, viewport sizes, controls and accessibility checks actually exercised.
- Automated results, manual findings and unresolved blockers.
- Customer testing performed, or explicitly “not yet tested with owners.”
- Status: implemented / internally checked / customer-validated. These are distinct states.

## Current limits
Earlier internal checks covered selected desktop/mobile states, keyboard actions, labels, errors and overflow. Full accessibility audit, screen-reader review, physical-device coverage and owner comprehension validation remain incomplete. This standard does not approve every existing screen or publish the concept route.
