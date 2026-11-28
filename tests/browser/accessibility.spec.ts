import {test, expect} from '@playwright/test';
import {scan} from './review-helper';

for (const route of ['/', '/how-it-works', '/why']) {
  test('accessibility and review candidate: ' + route, async ({page}, info) => {
    await page.goto(route);
    await expect(page.locator('main')).toBeVisible();
    if (route === '/') await expect(page.locator('#buy-may')).toBeEnabled();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await scan(page, info, route === '/' ? 'home' : route.slice(1));
  });
}

test('purchase timing, explanation and invalid input', async ({page}, info) => {
  await page.goto('/');
  await expect(page.locator('#march-value')).toHaveText('−$8,500');
  await expect(page.locator('#buy-may')).toBeEnabled();
  await page.locator('#buy-may').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#march-value')).toHaveText('$6,500');
  await page.getByText('Why this result?', {exact: true}).click();
  await expect(page.locator('#spend')).toHaveText('$500');
  await scan(page, info, 'may-explanation');
  await page.locator('#purchase-amount').fill('-1');
  await expect(page.locator('#purchase-error')).toBeVisible();
  await scan(page, info, 'invalid-amount');
});

