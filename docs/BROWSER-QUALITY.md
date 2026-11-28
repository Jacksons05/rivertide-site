# Browser quality checks

## Run
Use Node 22.12+ and `npm ci`, then `npx playwright install chromium`.
Website: `npm test` starts its own static server on 4291; no app checkout required.
App: `npx next build`, then `npm run test:browser` starts Next on 4290.
Optional app paired check: `RT_SITE_ROOT=../rivertide-site npm run test:browser`.
Servers refuse to reuse occupied ports. Never stop an unrelated service to run checks.

## Automated scope
Chromium at 1440×900 and 390×844. Axe checks WCAG A/AA tags through 2.2 on selected
pages and error/expanded states; full JSON results include violations and incomplete checks.
No rules are disabled. Incomplete checks need manual review, not a pass claim.
Financial interactions assert fixed sample outcomes. No real customer data is captured.
Screenshots and traces stay ignored locally; CI artifacts expire after seven days.

## Visual review — approval pending
Open `npx playwright show-report`, select a test, and inspect its named candidate PNG
and accessibility attachment. CI uploads reports even on success.
Candidates are evidence, not approved baselines and not a visual-regression pass.

1. Review desktop/mobile candidates from the exact PR commit alongside its preview.
2. Owner explicitly approves named states; record commit, reviewer, date and images.
3. On the same OS/browser version used by CI, generate only approved snapshots:
   `RT_VISUAL_COMPARE=1 npx playwright test accessibility.spec.ts --update-snapshots=all`.
   Review generated diff against approved artifacts before committing.
4. Enable `RT_VISUAL_COMPARE=1` in CI only after approved snapshots are committed.
   Missing snapshots then fail; default configuration forbids automatic updates.
5. Later changes require a reviewed image diff. Never regenerate snapshots to silence failures.

Current mode: candidate capture. No snapshots approved or committed.
Screenshot comparison is opt-in and not yet a required CI gate.
Keep browser version, OS, viewport, data, fonts and reduced-motion setting consistent.
App sample date is fixed; screenshots disable CSS animation. Do not mask financial results.

## Remaining human checks
Keyboard focus visibility and scroll behavior; screen reader; physical phone and TikTok
in-app browser; image-background contrast and axe incomplete checks; owner comprehension.
Passing automation does not establish WCAG conformance or customer usability.

