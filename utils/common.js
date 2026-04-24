const { test } = require('@playwright/test');
const credentials = require('../config/credentials');

/**
 * @param {import('@playwright/test').Page} page
 */
async function loginAs(page) {
  await page.goto('/login');
  await page.fill('input[type="email"]', credentials.email);
  await page.fill('input[type="password"]', credentials.password);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard', { timeout: 10000 });
}

const common = test.extend({
  loggedInPage: async ({ page }, use) => {
    await loginAs(page);
    await use(page);
  },
});

module.exports = { common, loginAs };
