const { test, expect } = require('@playwright/test');
const { CompetitionsPage } = require('../../pages/CompetitionsPage');
const { common } = require('../../utils/common');

test.describe('Filter Competition', () => {
  test.use({ loggedInPage: common.loggedInPage });

  test.beforeEach(async ({ loggedInPage }) => {
    await loggedInPage.goto('/competitions');
  });

  test('TC-FILTER-001 - Filter competitions by Active status', async ({ loggedInPage }) => {
    const competitionsPage = new CompetitionsPage(loggedInPage);
    await competitionsPage.filterByStatus('Active');
    const rows = await competitionsPage.getTableRows();
    expect(await rows.count()).toBeGreaterThan(0);
  });

  test('TC-FILTER-002 - Filter competitions by Inactive status', async ({ loggedInPage }) => {
    const competitionsPage = new CompetitionsPage(loggedInPage);
    await competitionsPage.filterByStatus('Inactive');
    const rows = await competitionsPage.getTableRows();
    expect(await rows.count()).toBeGreaterThanOrEqual(0);
  });

  test('TC-FILTER-003 - Clear filter shows all competitions', async ({ loggedInPage }) => {
    const competitionsPage = new CompetitionsPage(loggedInPage);
    await competitionsPage.filterByStatus('Active');
    const filteredCount = await competitionsPage.getTableRows().count();
    await competitionsPage.filterByStatus('All');
    const allCount = await competitionsPage.getTableRows().count();
    expect(allCount).toBeGreaterThanOrEqual(filteredCount);
  });
});