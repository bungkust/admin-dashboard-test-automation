const { test: setup, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const credentials = require('../config/credentials');

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(credentials.email, credentials.password);
  await loginPage.expectLoggedIn();
  
  // Wait for the JWT token/cookies to be fully saved in the browser context
  await page.waitForLoadState('networkidle');
  await page.locator('text=Dashboard').first().waitFor({ state: 'visible', timeout: 10000 });
  
  await page.context().storageState({ path: authFile });
});
