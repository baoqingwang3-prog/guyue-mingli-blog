import { expect, test } from '@playwright/test';

test('private route contains no personal data and redirects a signed-out browser', async ({ page }) => {
  const response = await page.goto('./app/');

  expect(response?.status()).toBe(200);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex,nofollow');
  await expect(page).toHaveURL(/\/login\/$/);
  expect(await page.content()).not.toContain('2004-06-12');
});
