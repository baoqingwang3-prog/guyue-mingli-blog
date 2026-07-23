import { expect, test } from '@playwright/test';

test('public homepage is readable on a phone', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('heading', { name: '孤月命理研究台' })).toBeVisible();
  await expect(page.getByRole('link', { name: '阅读方法论' })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(overflow).toBe(false);
});
