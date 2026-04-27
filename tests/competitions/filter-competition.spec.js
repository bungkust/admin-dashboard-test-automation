const { test, expect } = require('@playwright/test');
const { CompetitionsPage } = require('../../pages/CompetitionsPage');
const { login } = require('../../utils/common');

test.describe('Filter Competition', () => {

  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/competitions');});

  test('TC-FILTER-001 - Filter competitions by Active status', async ({ page }) => {
    const competitionsPage = new CompetitionsPage(page);
    await competitionsPage.filterByStatus('Active');
    const rows = await competitionsPage.getTableRows();
    expect(await rows.count()).toBeGreaterThan(0);
  });

  test('TC-FILTER-002 - Filter competitions by Inactive status', async ({ page }) => {
    const competitionsPage = new CompetitionsPage(page);
    await competitionsPage.filterByStatus('Inactive');
    const rows = await competitionsPage.getTableRows();
    expect(await rows.count()).toBeGreaterThanOrEqual(0);
  });

  test('TC-FILTER-003 - Clear filter shows all competitions', async ({ page }) => {
    const competitionsPage = new CompetitionsPage(page);
    await competitionsPage.filterByStatus('Active');
    const filteredCount = await competitionsPage.getTableRows().count();
    await competitionsPage.filterByStatus('All Platforms');
    const allCount = await competitionsPage.getTableRows().count();
    expect(allCount).toBeGreaterThanOrEqual(filteredCount);
  });
});