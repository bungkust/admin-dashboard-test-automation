const { test, expect } = require('../../fixtures/page.fixture');
const { CompetitionsPage } = require('../../pages/CompetitionsPage');

// Helper to generate a unique competition name to avoid collisions
function generateUniqueCompetition(seasonYear) {
  const uniqueId = Math.random().toString(36).substring(2, 7).toUpperCase();
  return {
    name: `Comp-FLTR-${uniqueId}`,
    season: `20${seasonYear}-20${parseInt(seasonYear) + 1}`
  };
}

async function cleanupCompetition(competitionsPage, name) {
  if (!name || name.includes('BRI Super League') || name === 'BRI Super League') {
    return;
  }
  try {
    await competitionsPage.goto();
    // Search for the specific competition first to isolate it
    await competitionsPage.search(name);
    
    const rows = competitionsPage.getTableRows();
    const count = await rows.count();
    
    for (let i = 0; i < count; i++) {
      const row = rows.first();
      await competitionsPage.clickDelete(row);
      await competitionsPage.confirmDelete();
      await competitionsPage.page.waitForTimeout(1000);
    }
  } catch (e) {
    console.error(`Cleanup failed for competition ${name}:`, e);
  }
}

test.describe('Filter Competition', () => {
  test.beforeEach(async ({ page }) => {
    const competitionsPage = new CompetitionsPage(page);
    await competitionsPage.goto();
    // Ensure search and filter inputs are completely fresh
    await competitionsPage.search('');
    await competitionsPage.openFilterPopover();
    await competitionsPage.clickClearFilter();
  });

  test('TC-FILTER-001 - Filter competitions by Season', async ({ page }) => {
    const competitionsPage = new CompetitionsPage(page);
    const uniqueComp = generateUniqueCompetition('44'); // Season: 2044-2045

    // Create a unique active competition
    await competitionsPage.gotoNew();
    await competitionsPage.fillName(uniqueComp.name);
    await competitionsPage.fillSeason(uniqueComp.season);
    await competitionsPage.setActive(true);
    await competitionsPage.clickCreate();
    await competitionsPage.expectOnList();
    await competitionsPage.search('');

    try {
      // Filter by the unique Season
      await competitionsPage.openFilterPopover();
      await competitionsPage.fillFilterSeason(uniqueComp.season);
      await competitionsPage.clickApplyFilter();
      
      // Ensure only our unique competition is visible in table
      await expect(page.locator('table').first()).toContainText(uniqueComp.name);
      await expect(page.locator('table').first()).toContainText(uniqueComp.season);
    } finally {
      await cleanupCompetition(competitionsPage, uniqueComp.name);
    }
  });

  test('TC-FILTER-002 - Clear Season filter shows all competitions', async ({ page }) => {
    const competitionsPage = new CompetitionsPage(page);
    const uniqueComp = generateUniqueCompetition('45'); // Season: 2045-2046

    // Create unique competition
    await competitionsPage.gotoNew();
    await competitionsPage.fillName(uniqueComp.name);
    await competitionsPage.fillSeason(uniqueComp.season);
    await competitionsPage.setActive(true);
    await competitionsPage.clickCreate();
    await competitionsPage.expectOnList();
    await competitionsPage.search('');

    try {
      const initialCount = await competitionsPage.getRowCount();

      // Filter by the unique Season
      await competitionsPage.openFilterPopover();
      await competitionsPage.fillFilterSeason(uniqueComp.season);
      await competitionsPage.clickApplyFilter();
      const filteredCount = await competitionsPage.getRowCount();
      expect(filteredCount).toBe(1);

      // Clear filter and verify count resets
      await competitionsPage.openFilterPopover();
      await competitionsPage.clickClearFilter();
      const clearedCount = await competitionsPage.getRowCount();
      expect(clearedCount).toBeGreaterThanOrEqual(initialCount);
    } finally {
      await cleanupCompetition(competitionsPage, uniqueComp.name);
    }
  });
});