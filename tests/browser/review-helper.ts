import AxeBuilder from '@axe-core/playwright';
import {expect, type Page, type TestInfo} from '@playwright/test';

// Automated subset only; keyboard, screen-reader and owner review remain required.
export async function scan(page: Page, info: TestInfo, state: string) {
  await page.evaluate(() => document.fonts.ready);
  const results = await new AxeBuilder({page})
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  await info.attach(state + '-accessibility', {
    body: JSON.stringify(results, null, 2), contentType: 'application/json',
  });
  // Review candidates, NOT approved baselines or a visual regression pass.
  const screenshot = await page.screenshot({fullPage: true, animations: 'disabled'});
  await info.attach(state + '-candidate', {
    body: screenshot,
    contentType: 'image/png',
  });
  if (process.env.RT_VISUAL_COMPARE === '1') {
    expect(screenshot).toMatchSnapshot(state + '.png');
  }
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
}
