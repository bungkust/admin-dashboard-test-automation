const { test, expect } = require('@playwright/test');
const credentials = require('../config/credentials');

async function login(page) {
  await page.goto('/login');
  await page.fill('input[type="email"]', credentials.email);
  await page.fill('input[type="password"]', credentials.password);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard', { timeout: 10000 });
}

test.describe('Inline Login Pattern', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('admin users - works with page', async ({ page }) => {
    await page.goto('/admin-users');
    await expect(page.locator('table')).toBeVisible();
  });
});
