# Current status — website

## November 25 workflow update (local, not published)
Code-first review loop documented in WORKFLOW.md. App verification now supports command planning, explicit browser deferral, bounded steps and machine-readable summaries. Generated browser artifacts are excluded from lint. App CI filter removed so new app browser flows are included after push.
Verification: runner help/plan/unknown-option behavior and lint passed; paired run passed lint (four existing warnings), 44 regressions, types and shared assets. Final Next build stalled in compilation and was interrupted; no full verification claim. Browser execution remains deferred locally due to macOS sandbox restriction. CI changes are not active remotely until committed/pushed. No production changes.

## Earlier baseline

Checked November 24, 2026. Refresh git/PR/deployment facts before releasing; this file is not a deployment monitor.

- Review branch: `chore/monochrome-workflow`.
- Fetched GitHub main: `233e1f8569663c8597f2cd55b1c49b960c2438bf`.
- Previous Phase 1 PR #4 is merged. Approved monochrome work was committed afterward and is being packaged with documentation/tooling for a new PR.
- Production commit not independently verified. No production merge/deployment authorized by this packaging task.

## Included work
Approved monochrome styling; concise AGENTS/CLAUDE entry points; shared product/design/acceptance contracts; task template; read-only project-status command. App includes a verification runner, Playwright desktop/mobile tests and a browser CI job. Marketing preview accepts an isolated PORT for paired tests.

## Verification
- November 24: lint passes with four existing warnings; 42 regressions, type checks, shared CSS/fonts/logos and Next production build pass.
- November 24 browser rerun blocked before assertions: macOS sandbox denies Chromium MachPortRendezvousServer registration. This is not a successful browser run.
- November 23: paired browser suite passed all four cases at 1440×900 and 390×844, including May timing, invalid input, reset and marketing layout/keyboard checks.
- New GitHub CI results and preview URLs belong to the delivery PR; verify their exact final commit before release.
- Real-phone, screen-reader and TikTok-browser checks remain unverified.

## Next actions
1. Review new paired PRs and current CI/previews; release only after explicit approval.
2. Complete remaining manual device/access checks.
3. Phase 2: website-to-demo continuity → optional guidance → personal inputs → feedback/analytics → outreach assets. Not implemented by this task.

Known cross-surface difference: app purchase range is $1–$1,000,000; marketing retains $0–$1 billion. Reconcile only in a separately scoped behavior change.
