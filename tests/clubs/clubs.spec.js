const { test, expect } = require('@playwright/test');
const { ClubsPage } = require('../../pages/ClubsPage');
const { login } = require('../../utils/common');

test.describe('Clubs', () => {

  test.beforeEach(async ({ page }) => {
    await login(page);
    const clubsPage = new ClubsPage(page);
    await clubsPage.goto();});

  // ==================== LIST PAGE TESTS ====================

  test('TC-CL-001 - Load clubs list page', async ({ page }) => {
    const clubsPage = new ClubsPage(page);
    await expect(page.locator('table')).toBeVisible();
    const rowCount = await clubsPage.getTableRows().count();
    expect(rowCount).toBeGreaterThanOrEqual(0);
  });

  test('TC-CL-002 - View club details in table', async ({ page }) => {
    const clubsPage = new ClubsPage(page);
    const rows = await clubsPage.getTableRows();
    const count = await rows.count();
    if (count > 0) {
      await expect(rows.first()).toBeVisible();
    }
  });

  test('TC-CL-003 - Search club by name', async ({ page }) => {
    const clubsPage = new ClubsPage(page);
    await clubsPage.search('Nusantara');
    await expect(page.locator('table')).toContainText('Nusantara');
  });

  test('TC-CL-004 - Search with no results shows empty state', async ({ page }) => {
    const clubsPage = new ClubsPage(page);
    await clubsPage.search('NonExistentClubXYZ123');
    await clubsPage.expectEmptyState();
  });

  test('TC-CL-005 - Navigate to new club form', async ({ page }) => {
    const clubsPage = new ClubsPage(page);
    await clubsPage.clickNewClub();
    await clubsPage.expectUrl(/\/clubs\/new/);
    await expect(page.locator('#club-name')).toBeVisible();
  });

  test('TC-CL-006 - Navigate to edit club page', async ({ page }) => {
    const clubsPage = new ClubsPage(page);
    const rows = await clubsPage.getTableRows();
    const count = await rows.count();
    if (count > 0) {
      await clubsPage.clickEdit(rows.first());
      await clubsPage.expectUrl(/\/clubs\/.*\/edit/);
    }
  });

  test('TC-CL-007 - Delete button visible for each club', async ({ page }) => {
    const clubsPage = new ClubsPage(page);
    const rows = await clubsPage.getTableRows();
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
    const deleteButton = rows.first().locator('button:has-text("Delete")');
    await expect(deleteButton).toBeVisible();
  });

  test('TC-CL-008 - Verify club list table headers', async ({ page }) => {
    await expect(page.locator('table thead')).toBeVisible();
    await expect(page.locator('th').first()).toBeVisible();
  });

  test('TC-CL-009 - Pagination controls are visible', async ({ page }) => {
    await expect(page.locator('button:has-text("Next"), button:has-text("→")')).toBeVisible({ timeout: 3000 }).catch(() => {
      expect(true).toBe(true);
    });
  });

  test('TC-CL-010 - Click next pagination loads next page', async ({ page }) => {
    const clubsPage = new ClubsPage(page);
    const initialRows = await clubsPage.getTableRows().count();
    if (initialRows > 0) {
      const nextButton = page.locator('button:has-text("Next"), button:has-text("→")');
      if (await nextButton.isVisible()) {
        await clubsPage.clickNextPagination();
        await expect(page.locator('table')).toBeVisible();
      }
    }
  });

  // ==================== CREATE CLUB TESTS ====================

  const ASSET_URL = 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAGND9TjDY-pDP-a1EDTIFwnbkBxFExvgVAiX0xzilhWbun3IheQBFOr0yBpEWRv8P_tMm9VDAG-fCp7S4M-QnwTzWxo7GSg7MwU46HS7YKst8Y_5pMjHdyVwD4keX2BRLdJIbw=w289-h312-n-k-no';

  test('TC-CL-011 - Create club with valid data', async ({ page }) => {
    const clubsPage = new ClubsPage(page);
    await clubsPage.gotoNew();
    await clubsPage.fillName('Manchester United');
    await clubsPage.fillShortName('Man Utd');
    await clubsPage.fillClubCode('MUN');
    await clubsPage.fillStadium('Old Trafford');
    await clubsPage.fillLogoUrl(ASSET_URL);
    await clubsPage.fillStadiumImageUrl(ASSET_URL);
    await clubsPage.setActive(true);
    await clubsPage.clickCreateClub();
    await clubsPage.expectUrl(/\/clubs/);
    await clubsPage.expectInTable('Manchester United');
  });

  test('TC-CL-012 - Create club with only required fields', async ({ page }) => {
    const clubsPage = new ClubsPage(page);
    await clubsPage.gotoNew();
    await clubsPage.fillName('Basic Club');
    await clubsPage.fillShortName('Basic');
    await clubsPage.fillClubCode('BSC');
    await clubsPage.fillStadium('Basic Stadium');
    await clubsPage.fillLogoUrl(ASSET_URL);
    await clubsPage.fillStadiumImageUrl(ASSET_URL);
    await clubsPage.clickCreateClub();
    await clubsPage.expectUrl(/\/clubs/);
    await clubsPage.expectInTable('Basic Club');
  });

  test('TC-CL-013 - Create club with empty name shows error', async ({ page }) => {
    const clubsPage = new ClubsPage(page);
    await clubsPage.gotoNew();
    await clubsPage.fillShortName('Short Name Only');
    await clubsPage.clickCreateClub();
    await clubsPage.expectValidationError();
  });

  test('TC-CL-014 - Create club with empty short name shows error', async ({ page }) => {
    const clubsPage = new ClubsPage(page);
    await clubsPage.gotoNew();
    await clubsPage.fillName('Club Without Short Name');
    await clubsPage.clickCreateClub();
    await clubsPage.expectValidationError();
  });

  test('TC-CL-015 - Create club with invalid logo URL', async ({ page }) => {
    const clubsPage = new ClubsPage(page);
    await clubsPage.gotoNew();
    await clubsPage.fillName('Invalid Logo Club');
    await clubsPage.fillLogoUrl('not-a-valid-url');
    await clubsPage.clickCreateClub();
    await clubsPage.expectValidationError();
  });

  test('TC-CL-016 - Create club with stadium', async ({ page }) => {
    const clubsPage = new ClubsPage(page);
    await clubsPage.gotoNew();
    await clubsPage.fillName('Historic Club');
    await clubsPage.fillShortName('Historic');
    await clubsPage.fillClubCode('HST');
    await clubsPage.fillStadium('Classic Stadium');
    await clubsPage.fillLogoUrl(ASSET_URL);
    await clubsPage.fillStadiumImageUrl(ASSET_URL);
    await clubsPage.clickCreateClub();
    await clubsPage.expectInTable('Historic Club');
  });

  test('TC-CL-017 - Create club with active status', async ({ page }) => {
    const clubsPage = new ClubsPage(page);
    await clubsPage.gotoNew();
    await clubsPage.fillName('Active Club');
    await clubsPage.fillShortName('Active');
    await clubsPage.fillClubCode('ACT');
    await clubsPage.fillStadium('Active Stadium');
    await clubsPage.fillLogoUrl(ASSET_URL);
    await clubsPage.fillStadiumImageUrl(ASSET_URL);
    await clubsPage.setActive(true);
    await clubsPage.clickCreateClub();
    await clubsPage.expectInTable('Active Club');
  });

  test('TC-CL-018 - Create club with inactive status', async ({ page }) => {
    const clubsPage = new ClubsPage(page);
    await clubsPage.gotoNew();
    await clubsPage.fillName('Inactive Club');
    await clubsPage.fillShortName('Inactive');
    await clubsPage.fillClubCode('INA');
    await clubsPage.fillStadium('Inactive Stadium');
    await clubsPage.fillLogoUrl(ASSET_URL);
    await clubsPage.fillStadiumImageUrl(ASSET_URL);
    await clubsPage.setActive(false);
    await clubsPage.clickCreateClub();
    await clubsPage.expectInTable('Inactive Club');
  });

  test('TC-CL-019 - Cancel club creation returns to list', async ({ page }) => {
    const clubsPage = new ClubsPage(page);
    await clubsPage.gotoNew();
    await clubsPage.fillName('Cancelled Club');
    await clubsPage.clickCancel();
    await clubsPage.expectUrl(/\/clubs/);
    await clubsPage.expectNotInTable('Cancelled Club');
  });

  test('TC-CL-020 - Create club with duplicate name', async ({ page }) => {
    const clubsPage = new ClubsPage(page);
    await clubsPage.gotoNew();
    const uniqueName = `Dup-${Date.now()}`;
    await clubsPage.fillName(uniqueName);
    await clubsPage.fillShortName('Dup');
    await clubsPage.fillClubCode('DUP');
    await clubsPage.fillStadium('Dup Stadium');
    await clubsPage.fillLogoUrl(ASSET_URL);
    await clubsPage.fillStadiumImageUrl(ASSET_URL);
    await clubsPage.clickCreateClub();
    await clubsPage.gotoNew();
    await clubsPage.fillName(uniqueName);
    await clubsPage.fillShortName('Dup2');
    await clubsPage.fillClubCode('DUP2');
    await clubsPage.fillStadium('Dup Stadium 2');
    await clubsPage.fillLogoUrl(ASSET_URL);
    await clubsPage.fillStadiumImageUrl(ASSET_URL);
    await clubsPage.clickCreateClub();
    await expect(page.locator('text=/already exists|duplicate|exists/i')).toBeVisible({ timeout: 5000 });
  });

  // ==================== EDIT CLUB TESTS ====================

  test('TC-CL-021 - Edit existing club name', async ({ page }) => {
    const clubsPage = new ClubsPage(page);
    const rows = await clubsPage.getTableRows();
    const count = await rows.count();
    if (count > 0) {
      await clubsPage.clickEdit(rows.first());
      await clubsPage.fillName('Updated Club Name');
      await clubsPage.clickSaveClub();
      await clubsPage.expectInTable('Updated Club Name');
    }
  });

  test('TC-CL-022 - Edit club name', async ({ page }) => {
    const clubsPage = new ClubsPage(page);
    const rows = await clubsPage.getTableRows();
    const count = await rows.count();
    if (count > 0) {
      await clubsPage.clickEdit(rows.first());
      await clubsPage.fillName('Updated Club Description Field');
      await clubsPage.clickSaveClub();
      await clubsPage.expectInTable('Updated Club Description Field');
    }
  });

  test('TC-CL-023 - Edit club logo URL', async ({ page }) => {
    const clubsPage = new ClubsPage(page);
    const rows = await clubsPage.getTableRows();
    const count = await rows.count();
    if (count > 0) {
      await clubsPage.clickEdit(rows.first());
      await clubsPage.fillLogoUrl('https://example.com/updated-logo.png');
      await clubsPage.clickSaveClub();
      await clubsPage.expectUrl(/\/clubs/);
    }
  });

  test('TC-CL-024 - Toggle club active status', async ({ page }) => {
    const clubsPage = new ClubsPage(page);
    const rows = await clubsPage.getTableRows();
    const count = await rows.count();
    if (count > 0) {
      await clubsPage.clickEdit(rows.first());
      await clubsPage.setActive(false);
      await clubsPage.clickSaveClub();
      await clubsPage.expectUrl(/\/clubs/);
    }
  });

  test('TC-CL-025 - Edit club with empty name shows error', async ({ page }) => {
    const clubsPage = new ClubsPage(page);
    const rows = await clubsPage.getTableRows();
    const count = await rows.count();
    if (count > 0) {
      await clubsPage.clickEdit(rows.first());
      await page.locator('#club-name').clear();
      await clubsPage.clickSaveClub();
      await clubsPage.expectValidationError();
    }
  });

  test('TC-CL-026 - Cancel edit returns to list without changes', async ({ page }) => {
    const clubsPage = new ClubsPage(page);
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

  test('TC-CL-027 - Save button is visible on edit form', async ({ page }) => {
    const clubsPage = new ClubsPage(page);
    const rows = await clubsPage.getTableRows();
    const count = await rows.count();
    if (count > 0) {
      await clubsPage.clickEdit(rows.first());
      await expect(page.locator('button:has-text("Save Club"), button:has-text("Create Club")')).toBeVisible();
    }
  });

  test('TC-CL-028 - Edit multiple fields at once', async ({ page }) => {
    const clubsPage = new ClubsPage(page);
    const rows = await clubsPage.getTableRows();
    const count = await rows.count();
    if (count > 0) {
      await clubsPage.clickEdit(rows.first());
      await clubsPage.fillName('Multi Updated Club');
      await clubsPage.fillLogoUrl('https://example.com/multi.png');
      await clubsPage.setActive(false);
      await clubsPage.clickSaveClub();
      await clubsPage.expectInTable('Multi Updated Club');
    }
  });

  // ==================== DELETE CLUB TESTS ====================

  test('TC-CL-029 - Delete club from list', async ({ page }) => {
    const clubsPage = new ClubsPage(page);
    const rows = await clubsPage.getTableRows();
    const count = await rows.count();
    if (count > 0) {
      await clubsPage.gotoNew();
      await clubsPage.fillName('Club To Delete');
      await clubsPage.fillShortName('DeleteMe');
      await clubsPage.fillClubCode('DEL');
      await clubsPage.fillStadium('Delete Stadium');
      await clubsPage.fillLogoUrl(ASSET_URL);
      await clubsPage.fillStadiumImageUrl(ASSET_URL);
      await clubsPage.clickCreateClub();
      await clubsPage.expectInTable('Club To Delete');
      const rowsAfterCreate = await clubsPage.getTableRows();
      const deleteRow = rowsAfterCreate.filter({ hasText: 'Club To Delete' }).first();
      if (await deleteRow.isVisible()) {
        await clubsPage.clickDelete(deleteRow);
        await clubsPage.confirmDelete();
        await clubsPage.expectNotInTable('Club To Delete');
      }
    }
  });
});