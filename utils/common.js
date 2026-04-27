const credentials = require('../config/credentials');

/**
 * @param {import('@playwright/test').Page} page
 */
async function login(page) {
  await page.goto('/login');
  await page.waitForSelector('input[type="email"]', { timeout: 10000 });
  await page.fill('input[type="email"]', credentials.email);
  await page.fill('input[type="password"]', credentials.password);
  
  // Use Promise.all to ensure we catch the navigation triggered by the click
  await Promise.all([
    page.waitForURL('**/dashboard', { timeout: 20000 }),
    page.click('button[type="submit"]')
  ]);
  
  // Ensure the page is actually loaded
  await page.waitForLoadState('networkidle');
}

module.exports = { login };
