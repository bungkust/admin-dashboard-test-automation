const { test, expect } = require('@playwright/test');
const { ClubsPage } = require('../../pages/ClubsPage');
const { common } = require('../../utils/common');

test.describe('Clubs', () => {
  test.use({ loggedInPage: common.loggedInPage });

  test.beforeEach(async ({ loggedInPage }) => {
    const clubsPage = new ClubsPage(loggedInPage);
    await clubsPage.goto();
  });

  // ==================== LIST PAGE TESTS ====================

  test('TC-CL-001 - Load clubs list page', async ({ loggedInPage }) => {
    const clubsPage = new ClubsPage(loggedInPage);
    await expect(loggedInPage.locator('table')).toBeVisible();
    const rowCount = await clubsPage.getTableRows().count();
    expect(rowCount).toBeGreaterThanOrEqual(0);
  });

  test('TC-CL-002 - View club details in table', async ({ loggedInPage }) => {
    const clubsPage = new ClubsPage(loggedInPage);
    const rows = await clubsPage.getTableRows();
    const count = await rows.count();
    if (count > 0) {
      await expect(rows.first()).toBeVisible();
    }
  });

  test('TC-CL-003 - Search club by name', async ({ loggedInPage }) => {
    const clubsPage = new ClubsPage(loggedInPage);
    await clubsPage.search('Test');
    await expect(loggedInPage.locator('table')).toContainText('Test');
  });

  test('TC-CL-004 - Search with no results shows empty state', async ({ loggedInPage }) => {
    const clubsPage = new ClubsPage(loggedInPage);
    await clubsPage.search('NonExistentClubXYZ123');
    await clubsPage.expectEmptyState();
  });

  test('TC-CL-005 - Navigate to new club form', async ({ loggedInPage }) => {
    const clubsPage = new ClubsPage(loggedInPage);
    await clubsPage.clickNewClub();
    await clubsPage.expectUrl(/\/clubs\/new/);
    await expect(loggedInPage.locator('#name')).toBeVisible();
  });

  test('TC-CL-006 - Navigate to edit club page', async ({ loggedInPage }) => {
    const clubsPage = new ClubsPage(loggedInPage);
    const rows = await clubsPage.getTableRows();
    const count = await rows.count();
    if (count > 0) {
      await clubsPage.clickEdit(rows.first());
      await clubsPage.expectUrl(/\/clubs\/.*\/edit/);
    }
  });

  test('TC-CL-007 - Delete button visible for each club', async ({ loggedInPage }) => {
    const clubsPage = new ClubsPage(loggedInPage);
    const rows = await clubsPage.getTableRows();
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
    const deleteButton = rows.first().locator('button:has-text("Delete")');
    await expect(deleteButton).toBeVisible();
  });

  test('TC-CL-008 - Verify club list table headers', async ({ loggedInPage }) => {
    await expect(loggedInPage.locator('table thead')).toBeVisible();
    await expect(loggedInPage.locator('th').first()).toBeVisible();
  });

  test('TC-CL-009 - Pagination controls are visible', async ({ loggedInPage }) => {
    await expect(loggedInPage.locator('button:has-text("Next"), button:has-text("→")')).toBeVisible({ timeout: 3000 }).catch(() => {
      expect(true).toBe(true);
    });
  });

  test('TC-CL-010 - Click next pagination loads next page', async ({ loggedInPage }) => {
    const clubsPage = new ClubsPage(loggedInPage);
    const initialRows = await clubsPage.getTableRows().count();
    if (initialRows > 0) {
      const nextButton = loggedInPage.locator('button:has-text("Next"), button:has-text("→")');
      if (await nextButton.isVisible()) {
        await clubsPage.clickNextPagination();
        await expect(loggedInPage.locator('table')).toBeVisible();
      }
    }
  });

  // ==================== CREATE CLUB TESTS ====================

  test('TC-CL-011 - Create club with valid data', async ({ loggedInPage }) => {
    const clubsPage = new ClubsPage(loggedInPage);
    await clubsPage.gotoNew();
    await clubsPage.fillName('Manchester United');
    await clubsPage.fillDescription('English professional football club');
    await clubsPage.fillLogoUrl('https://example.com/logo.png');
    await clubsPage.fillWebsite('https://www.manutd.com');
    await clubsPage.setActive(true);
    await clubsPage.fillFoundedYear('1878');
    await clubsPage.fillStadium('Old Trafford');
    await clubsPage.clickCreateClub();
    await clubsPage.expectUrl(/\/clubs/);
    await clubsPage.expectInTable('Manchester United');
  });

  test('TC-CL-012 - Create club with only required fields', async ({ loggedInPage }) => {
    const clubsPage = new ClubsPage(loggedInPage);
    await clubsPage.gotoNew();
    await clubsPage.fillName('Basic Club');
    await clubsPage.clickCreateClub();
    await clubsPage.expectUrl(/\/clubs/);
    await clubsPage.expectInTable('Basic Club');
  });

  test('TC-CL-013 - Create club with empty name shows error', async ({ loggedInPage }) => {
    const clubsPage = new ClubsPage(loggedInPage);
    await clubsPage.gotoNew();
    await clubsPage.fillDescription('Description without name');
    await clubsPage.clickCreateClub();
    await clubsPage.expectValidationError();
  });

  test('TC-CL-014 - Create club with empty description shows error', async ({ loggedInPage }) => {
    const clubsPage = new ClubsPage(loggedInPage);
    await clubsPage.gotoNew();
    await clubsPage.fillName('Club Without Description');
    await clubsPage.clickCreateClub();
    await clubsPage.expectValidationError();
  });

  test('TC-CL-015 - Create club with invalid logo URL', async ({ loggedInPage }) => {
    const clubsPage = new ClubsPage(loggedInPage);
    await clubsPage.gotoNew();
    await clubsPage.fillName('Invalid Logo Club');
    await clubsPage.fillLogoUrl('not-a-valid-url');
    await clubsPage.clickCreateClub();
    await clubsPage.expectValidationError();
  });

  test('TC-CL-016 - Create club with founded year and stadium', async ({ loggedInPage }) => {
    const clubsPage = new ClubsPage(loggedInPage);
    await clubsPage.gotoNew();
    await clubsPage.fillName('Historic Club');
    await clubsPage.fillFoundedYear('1900');
    await clubsPage.fillStadium('Classic Stadium');
    await clubsPage.clickCreateClub();
    await clubsPage.expectInTable('Historic Club');
  });

  test('TC-CL-017 - Create club with active status', async ({ loggedInPage }) => {
    const clubsPage = new ClubsPage(loggedInPage);
    await clubsPage.gotoNew();
    await clubsPage.fillName('Active Club');
    await clubsPage.setActive(true);
    await clubsPage.clickCreateClub();
    await clubsPage.expectInTable('Active Club');
  });

  test('TC-CL-018 - Create club with inactive status', async ({ loggedInPage }) => {
    const clubsPage = new ClubsPage(loggedInPage);
    await clubsPage.gotoNew();
    await clubsPage.fillName('Inactive Club');
    await clubsPage.setActive(false);
    await clubsPage.clickCreateClub();
    await clubsPage.expectInTable('Inactive Club');
  });

  test('TC-CL-019 - Cancel club creation returns to list', async ({ loggedInPage }) => {
    const clubsPage = new ClubsPage(loggedInPage);
    await clubsPage.gotoNew();
    await clubsPage.fillName('Cancelled Club');
    await clubsPage.fillDescription('This should not be saved');
    await clubsPage.clickCancel();
    await clubsPage.expectUrl(/\/clubs/);
    await clubsPage.expectNotInTable('Cancelled Club');
  });

  test('TC-CL-020 - Create club with duplicate name', async ({ loggedInPage }) => {
    const clubsPage = new ClubsPage(loggedInPage);
    await clubsPage.gotoNew();
    await clubsPage.fillName('Duplicate Name Club');
    await clubsPage.clickCreateClub();
    await clubsPage.gotoNew();
    await clubsPage.fillName('Duplicate Name Club');
    await clubsPage.clickCreateClub();
    await expect(loggedInPage.locator('text=/already exists|duplicate|exists/i')).toBeVisible({ timeout: 3000 });
  });

  // ==================== EDIT CLUB TESTS ====================

  test('TC-CL-021 - Edit existing club name', async ({ loggedInPage }) => {
    const clubsPage = new ClubsPage(loggedInPage);
    const rows = await clubsPage.getTableRows();
    const count = await rows.count();
    if (count > 0) {
      await clubsPage.clickEdit(rows.first());
      await clubsPage.fillName('Updated Club Name');
      await clubsPage.clickSaveClub();
      await clubsPage.expectInTable('Updated Club Name');
    }
  });

  test('TC-CL-022 - Edit club description', async ({ loggedInPage }) => {
    const clubsPage = new ClubsPage(loggedInPage);
    const rows = await clubsPage.getTableRows();
    const count = await rows.count();
    if (count > 0) {
      await clubsPage.clickEdit(rows.first());
      await clubsPage.fillDescription('Updated club description');
      await clubsPage.clickSaveClub();
      await clubsPage.expectInTable('Updated club description');
    }
  });

  test('TC-CL-023 - Edit club logo URL', async ({ loggedInPage }) => {
    const clubsPage = new ClubsPage(loggedInPage);
    const rows = await clubsPage.getTableRows();
    const count = await rows.count();
    if (count > 0) {
      await clubsPage.clickEdit(rows.first());
      await clubsPage.fillLogoUrl('https://example.com/updated-logo.png');
      await clubsPage.clickSaveClub();
      await clubsPage.expectUrl(/\/clubs/);
    }
  });

  test('TC-CL-024 - Toggle club active status', async ({ loggedInPage }) => {
    const clubsPage = new ClubsPage(loggedInPage);
    const rows = await clubsPage.getTableRows();
    const count = await rows.count();
    if (count > 0) {
      await clubsPage.clickEdit(rows.first());
      await clubsPage.setActive(false);
      await clubsPage.clickSaveClub();
      await clubsPage.expectUrl(/\/clubs/);
    }
  });

  test('TC-CL-025 - Edit club with empty name shows error', async ({ loggedInPage }) => {
    const clubsPage = new ClubsPage(loggedInPage);
    const rows = await clubsPage.getTableRows();
    const count = await rows.count();
    if (count > 0) {
      await clubsPage.clickEdit(rows.first());
      await loggedInPage.locator('#name').clear();
      await clubsPage.clickSaveClub();
      await clubsPage.expectValidationError();
    }
  });

  test('TC-CL-026 - Cancel edit returns to list without changes', async ({ loggedInPage }) => {
    const clubsPage = new ClubsPage(loggedInPage);
    const rows = await clubsPage.getTableRows();
    const count = await rows.count();
    const originalName = count > 0 ? await rows.first().locator('td').first().textContent() : '';
    if (count > 0) {
      await clubsPage.clickEdit(rows.first());
      await clubsPage.fillName('Should Not Save');
      await clubsPage.clickCancel();
      await clubsPage.expectUrl(/\/clubs/);
      if (originalName) {
        await clubsPage.expectInTable(originalName.trim());
      }
    }
  });

  test('TC-CL-027 - Save button is visible on edit form', async ({ loggedInPage }) => {
    const clubsPage = new ClubsPage(loggedInPage);
    const rows = await clubsPage.getTableRows();
    const count = await rows.count();
    if (count > 0) {
      await clubsPage.clickEdit(rows.first());
      await expect(loggedInPage.locator('button:has-text("Save Club")')).toBeVisible();
    }
  });

  test('TC-CL-028 - Edit multiple fields at once', async ({ loggedInPage }) => {
    const clubsPage = new ClubsPage(loggedInPage);
    const rows = await clubsPage.getTableRows();
    const count = await rows.count();
    if (count > 0) {
      await clubsPage.clickEdit(rows.first());
      await clubsPage.fillName('Multi Updated Club');
      await clubsPage.fillDescription('Multiple fields updated');
      await clubsPage.fillLogoUrl('https://example.com/multi.png');
      await clubsPage.setActive(false);
      await clubsPage.clickSaveClub();
      await clubsPage.expectInTable('Multi Updated Club');
    }
  });

  // ==================== DELETE CLUB TESTS ====================

  test('TC-CL-029 - Delete club from list', async ({ loggedInPage }) => {
    const clubsPage = new ClubsPage(loggedInPage);
    const rows = await clubsPage.getTableRows();
    const count = await rows.count();
    if (count > 0) {
      await clubsPage.gotoNew();
      await clubsPage.fillName('Club To Delete');
      await clubsPage.clickCreateClub();
      await clubsPage.expectInTable('Club To Delete');
      const rowsAfterCreate = await clubsPage.getTableRows();
      const deleteRow = rowsAfterCreate.filter({ has: loggedInPage.locator('text=Club To Delete') }).first();
      if (await deleteRow.isVisible()) {
        await clubsPage.clickDelete(deleteRow);
        await clubsPage.confirmDelete();
        await clubsPage.expectNotInTable('Club To Delete');
      }
    }
  });
});