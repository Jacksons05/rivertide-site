# Acceptance contract

## Financial invariants — no math changes in visual work
Fixed charter sample date: September 7, 2026. Cash $52,400; cushion $6,000; estimated spending room $500.

Baseline month-end cash September 2026–August 2027:
`63000, 67600, 68200, 40200, 11500, 7500, 6500, 14500, 26500, 45500, 68500, 80500`.

$15,000 October purchase: March low −$8,500, January–April below zero. May purchase: March low remains $6,500.

Spending-room bridge: $52,400 − $16,200 bills within 90 days − $6,000 cushion − $6,000 seasonal reserve = $24,200; capped by March's $500 above cushion. Never present estimated spending room as a guarantee or bank balance.

## App input behavior
Purchase workspace accepts $1–$1,000,000, up to two decimal places. Blank, nonnumeric, zero, negative and above-limit input shows linked field error, aria-invalid, dimmed last-valid result/chart and explicit “Not updated” notice. Invalid dates must not invoke an invalid forecast. Reset restores sample state. Engine numeric limits are separate from UI limits.

Marketing currently retains its earlier $0–$1 billion input range. This is a known cross-surface difference, not authorization to change either range silently.

## Copy and access
Use cushion and Estimated spending room; date sample cash explicitly. Label month-end projections and limitations. Preserve keyboard access, visible focus, chart descriptions and accessible exact-value tables. Keep personal browser storage isolated from resettable demo data.

## Definition of done

UI work also follows [consumer UI standard](UI-STANDARD.md). Report internal checks separately from owner comprehension evidence; untested accessibility criteria remain outstanding, not passed.
Scope addressed; relevant tests pass; UI inspected when changed; no unexpected asset/math changes; PR/preview/commit identified; limitations documented. Passing CI does not prove visual correctness. Preview ready, merged main and verified production are distinct states.
