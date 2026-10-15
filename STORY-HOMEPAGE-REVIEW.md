# Story homepage review

Local branch: `story-homepage`. Main, GitHub, the live website, and the app were not changed.

## Changes

- Replaced the thin homepage and navigation-card grid with the requested seven-part story.
- Added a real engine-driven cash comparison, expandable calculation, monthly chart, October/May purchase selector, and keyboard-operable May shortcut.
- Moved seasonal photos onto the homepage; retained attribution and redirected Who it's for.
- Kept the founder's existing facts and circular portrait. Removed eyebrow labels and repeated busy/quiet slogans.
- Moved explanation and full trust principles to How it works. Replaced the outdated recording with the live demo link.
- Preserved Signature R artwork, fonts, shared design tokens, and forecast-engine source.
- Design guidance informed the restrained layout; no new palette, font family, framework, or invented claims.

## Verification

- Node assertions: safe spending $500; March 2027 low $6,500; October purchase low −$8,500; May purchase low $6,500 and shortfall $0.
- Playwright: all four routes at 1280px and 390px; images loaded; no horizontal overflow, page exceptions, or console errors. Redirect reaches index.html#seasons.
- Screenshots: eight full-page files in ../outputs/story-homepage/. Redirect screenshots show the destination.
- Keyboard activation of Try May updates the scenario and focuses the labeled month selector. Programmatic selection tests both native select options.
- Accessibility-tree review confirms chart names, labeled combobox, heading structure, and atomic polite status announcement.
- Reduced-motion mode renders the final chart directly. Normal mode animates only the scenario line.
- No manual VoiceOver listening test was performed. Native select arrow-key automation was inconclusive in headless macOS; the keyboard May shortcut passed.
- Visual inspection found no text overlaps. Mobile charts retain readable labels rather than scaling a desktop SVG down.
- Git diff confirms no changes to the engine, shared design file, logo assets, or fonts.

## Homepage word counts

Visible HTML text, including headings and controls; closed disclosures excluded. SVG labels are not included by innerText.

| Section | Words | Flag |
| --- | ---: | --- |
| Hero | 31 | |
| Gap | 30 | 74 when math disclosure opens |
| Decision | 101 | Over 40: required three steps, controls, result and caveat |
| Seasons | 31 | |
| Founder | 27 | |
| Trust | 29 | |
| Close | 8 | |

The supplied hero headline is 9 words and seasons headline is 11 words. Both are retained verbatim despite the general 8-word rule. Supporting paragraphs remain at most 25 words.

## Reference patterns

[Provenance](https://www.provenancexl.com/): one example, ordered steps, numerical consequences.
[Space](https://spacefs.com/): clear section claims and recognizable product context.

## Re-run

Serve dist on localhost:4183. Run scripts/test-story.mjs with Playwright available. Optional PLAYWRIGHT_MODULE and PLAYWRIGHT_CHROMIUM_EXECUTABLE environment variables select an existing installation. No dependencies were added to the site.
