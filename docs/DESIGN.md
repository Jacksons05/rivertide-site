# Design contract

Follow the approved [consumer UI standard](UI-STANDARD.md) for visual decisions, accessibility targets and comprehension testing. Existing screens must be evaluated against it; approval of the standard is not proof of conformance.

Owner approved monochrome on November 19, 2026. Read [palette](../brand/PALETTE.md) and [approved logo](../brand/APPROVED-LOGO.md). Palette approval supersedes older Graphite and Ice guidance; approved logo artwork remains unchanged.

- Black/charcoal surfaces, white text, gray secondary text and light-gray selected controls.
- Public Sans only. At most two sizes per viewport: 16px + 32px mobile; 16px + 40px desktop in current decision experience. Use weight and spacing for hierarchy.
- Preserve monochrome ocean backdrop, pause control and reduced-motion support.
- Show product decisions early. Avoid decorative cards, excessive copy, forced fullscreen sections and scroll snapping.
- Charts: solid baseline, dashed scenario, outlined/filled low markers, explicit low values/months and month-end captions. Warnings require text, not color alone.
- Active navigation uses a clearly visible fill, bold weight and aria-current. Controls remain keyboard-accessible and at least 44px tall.

## Ownership
Canonical shared stylesheet: `rivertide-app/app/design-system.css`. Exact mirror: `rivertide-site/dist/rivertide-design.css`. Keep byte-identical. Preserve corresponding logo/font assets. Repo-specific styles may adjust layout, not contradict the shared contract.

Current monochrome implementation uses neutral tokens plus document grayscale to cover legacy colors and imagery. Treat it as an implementation detail, not permission to alter assets. Check fixed overlays/dialogs when changing this approach.

## Verification
Check 1440×900 and 390×844, including expanded explanation. Inspect typography, overflow, control states, both chart lows and navigation. At 390×844 homepage result, full chart and both timing options fit without scrolling. Real-phone, screen-reader and TikTok-browser checks must be recorded separately; desktop emulation is not equivalent.
