# Agent workflow

1. Read AGENTS.md and STATUS.md; inspect git status, branch and relevant remote PR state. Preserve uncommitted work. Never assume old PRs remain open.
2. Read only task-relevant specifications and source. Identify outcome, files and acceptance checks. Honor task-specific scope/approval requirements without inventing new ones.
3. Make small coherent changes. Prefer existing checkout; use a focused branch when needed. Avoid dependencies, refactors or framework migrations unrelated to the task.
4. Run relevant checks once. Repeat after meaningful edits or failures. Documentation-only tasks need link/diff checks, not product builds.
5. For UI work, inspect rendered desktop/mobile states, capture useful evidence and exercise changed controls. Use supported browser tools; do not substitute screenshots for interaction tests.
6. Report result, tests, preview/PR links and remaining limitations. Update STATUS.md with dated evidence, not guessed completion.

## Tool and context budget
Use filesystem/shell for code, GitHub for PR state, browser for rendered behavior, Vercel for deployment checks. Load Figma only for an actual design handoff and database tools only for database work. Select one relevant specialist skill rather than loading overlapping instructions. Use installed skills when needed; do not copy their entire content into project docs.

Use concise updates; retain technical precision in code, tests and specs. Start with targeted searches. Use stronger reasoning for financial correctness/security/architecture; routine edits need narrow context. Delegate only when authorized and work is independent. Never send private financial data to extra providers without approval.

## Release boundary
Push feature branches/PRs when authorized. Do not merge, push main or deploy production without explicit release authorization. Main changes may automatically deploy. Verify deployed commit before claiming release. Do not push the legacy Sites remote as a substitute for GitHub/Vercel.

## Context ownership
PRODUCT, DESIGN and ACCEPTANCE are mirrored contracts owned by app repo. STATUS and commands are repo-specific. Synchronize contracts intentionally; if only one repo is available, record pending synchronization. Older date-stamped reports are evidence, not current instructions.

## Repo commands and structure
- Local preview: `node scripts/preview-server.mjs` (port 4183; do not replace an unrelated running server).
- Vercel build: `node scripts/build-vercel.mjs` → `.vercel-site/`.
- Existing browser checks: `node scripts/test-story.mjs` and `node scripts/test-marketing-polish.mjs`; require Playwright and running preview. Inspect each script's prerequisites first. Use supported browser tooling when packages are unavailable; report checks actually run.
- Source is `dist/` (tracked static HTML/CSS/JS), despite directory name. Do not edit generated `.vercel-site/`.
- Demo math comes from app forecast sources; do not hand-edit compiled math to change outcomes.

## Installed workflow tooling (November 23, 2026)
From app repo: `npm run verify -- --paired` runs lint, existing regression/build suite, types, shared-assets check, Next build and desktop/mobile browser smoke tests. Stop at first failure; full logs live in ignored `outputs/verify/`. Omit `--paired` when marketing checkout is unavailable.

`npm run test:browser` uses a previously built Next app. Set `RT_SITE_ROOT=../rivertide-site` to include marketing tests. Playwright owns isolated ports 4290/4291 and refuses to reuse another server. Chromium is the only installed browser; install with `npx playwright install chromium` after a fresh checkout. Failure screenshots/traces go to ignored test-results and playwright-report directories.

Run `node scripts/project-status.mjs` in either repo (or `npm run project:status` in app). This reports local changes and current GitHub facts without mutating them. If GitHub does not expose hosting deployment records, it explicitly leaves production commit unverified. Use Vercel connector for that check; never infer it from main or PR success.

App CI has a separate browser-smoke job and failure artifact upload. Website integration runs locally with both checkouts; no cross-repo credentials added to CI. Scripts and workflow must be committed/pushed before CI can use them remotely.
