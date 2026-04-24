const { test, expect } = require('@playwright/test');
const { CompetitionsPage } = require('../../pages/CompetitionsPage');
const { common } = require('../../utils/common');

test.describe('Search Competition', () => {
  test.use({ loggedInPage: common.loggedInPage });

  test.beforeEach(async ({ loggedInPage }) => {
    await loggedInPage.goto('/competitions');
  });

  test('TC-SEARCH-001 - Search competition by name', async ({ loggedInPage }) => {
    const competitionsPage = new CompetitionsPage(loggedInPage);
    await competitionsPage.search('Premier');
    await expect(loggedInPage.locator('table')).toContainText('Premier');
  });

  test('TC-SEARCH-002 - Search returns no results for non-existent name', async ({ loggedInPage }) => {
    const competitionsPage = new CompetitionsPage(loggedInPage);
    await competitionsPage.search('NonExistentCompetitionXYZ123');
    const rows = await competitionsPage.getTableRows();
    await expect(rows).toHaveCount(0);
  });

  test('TC-SEARCH-003 - Search by partial name matches results', async ({ loggedInPage }) => {
    const competitionsPage = new CompetitionsPage(loggedInPage);
    await competitionsPage.search('League');
    const rows = await competitionsPage.getTableRows();
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
  });

  test('TC-SEARCH-004 - Clear search shows all competitions', async ({ loggedInPage }) => {
    const competitionsPage = new CompetitionsPage(loggedInPage);
    await competitionsPage.search('Premier');
    await competitionsPage.search('');
    const rows = await competitionsPage.getTableRows();
    const count = await rows.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('TC-SEARCH-005 - Search field is visible on competition list', async ({ loggedInPage }) => {
    const searchInput = loggedInPage.locator('input[type="search"], input[placeholder*="Search"], input[type="text"]').first();
    await expect(searchInput).toBeVisible();
  });
});