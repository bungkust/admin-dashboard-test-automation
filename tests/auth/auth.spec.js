const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const credentials = require('../../config/credentials');

test.describe('Authentication', () => {
  // Override global storageState to run login tests in an unauthenticated context
  test.use({ storageState: { cookies: [], origins: [] } });
  test('TC-AUTH-001 - Login with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(credentials.email, credentials.password);
    await loginPage.expectLoggedIn();
  });

  test('TC-AUTH-002 - Login with invalid password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(credentials.email, 'wrongpassword');
    await expect(page.locator('text=/invalid|incorrect|wrong/i')).toBeVisible({ timeout: 3000 });
  });

  test('TC-AUTH-003 - Login with empty fields', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await page.click('button[type="submit"]');
    // Browser validation should prevent submission
    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toBeDisabled({ timeout: 3000 }).catch(() => {
      // or expect to stay on login
      expect(page.url()).toContain('/login');
    });
  });
});
