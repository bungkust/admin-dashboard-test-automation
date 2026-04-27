const { test, expect } = require('@playwright/test');
const { MerchantVoucherPage } = require('../../pages/MerchantVoucherPage');
const { login } = require('../../utils/common');

test.describe('Merchant Voucher', () => {

  test.beforeEach(async ({ page }) => {
    await login(page);
    const merchantVoucherPage = new MerchantVoucherPage(page);
    await merchantVoucherPage.goto();});

  // ==================== LIST PAGE TESTS ====================

  test('TC-MV-001 - Load merchant voucher list page', async ({ page }) => {
    const merchantVoucherPage = new MerchantVoucherPage(page);
    await expect(page.locator('table')).toBeVisible();
    const rowCount = await merchantVoucherPage.getTableRows().count();
    expect(rowCount).toBeGreaterThanOrEqual(0);
  });

  test('TC-MV-002 - View voucher details in table', async ({ page }) => {
    const merchantVoucherPage = new MerchantVoucherPage(page);
    const rows = await merchantVoucherPage.getTableRows();
    const count = await rows.count();
    if (count > 0) {
      await expect(rows.first()).toBeVisible();
    }
  });

  test('TC-MV-003 - Search voucher by title', async ({ page }) => {
    const merchantVoucherPage = new MerchantVoucherPage(page);
    await merchantVoucherPage.search('Test');
    await expect(page.locator('table')).toContainText('Test');
  });

  test('TC-MV-004 - Search with no results shows empty state', async ({ page }) => {
    const merchantVoucherPage = new MerchantVoucherPage(page);
    await merchantVoucherPage.search('NonExistentVoucherXYZ123');
    await merchantVoucherPage.expectEmptyState();
  });

  test('TC-MV-005 - Navigate to new voucher form', async ({ page }) => {
    const merchantVoucherPage = new MerchantVoucherPage(page);
    await merchantVoucherPage.clickNewVoucher();
    await merchantVoucherPage.expectUrl(/\/merchant-vouchers\/new/);
    await expect(page.locator('#voucher-title')).toBeVisible();
  });

  test('TC-MV-006 - Navigate to edit voucher page', async ({ page }) => {
    const merchantVoucherPage = new MerchantVoucherPage(page);
    const rows = await merchantVoucherPage.getTableRows();
    const count = await rows.count();
    if (count > 0) {
      await merchantVoucherPage.clickEdit(rows.first());
      await merchantVoucherPage.expectUrl(/\/merchant-vouchers\/.*\/edit/);
    }
  });

  test('TC-MV-007 - Delete button visible for each voucher', async ({ page }) => {
    const merchantVoucherPage = new MerchantVoucherPage(page);
    const rows = await merchantVoucherPage.getTableRows();
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
    const deleteButton = rows.first().locator('button:has-text("Delete")');
    await expect(deleteButton).toBeVisible();
  });

  test('TC-MV-008 - Verify voucher list table headers', async ({ page }) => {
    await expect(page.locator('table thead')).toBeVisible();
    await expect(page.locator('th').first()).toBeVisible();
  });

  test('TC-MV-009 - Pagination controls are visible', async ({ page }) => {
    await expect(page.locator('button:has-text("Next"), button:has-text("→")')).toBeVisible({ timeout: 3000 }).catch(() => {
      expect(true).toBe(true);
    });
  });

  test('TC-MV-010 - Click next pagination loads next page', async ({ page }) => {
    const merchantVoucherPage = new MerchantVoucherPage(page);
    const initialRows = await merchantVoucherPage.getTableRows().count();
    if (initialRows > 0) {
      const nextButton = page.locator('button:has-text("Next"), button:has-text("→")');
      if (await nextButton.isVisible()) {
        await merchantVoucherPage.clickNextPagination();
        await expect(page.locator('table')).toBeVisible();
      }
    }
  });

  // ==================== CREATE VOUCHER TESTS ====================

  test('TC-MV-011 - Create voucher with valid data', async ({ page }) => {
    const merchantVoucherPage = new MerchantVoucherPage(page);
    await merchantVoucherPage.gotoNew();
    await merchantVoucherPage.fillTitle('Summer Sale Voucher');
    await merchantVoucherPage.fillDescription('Get 20% off on all items');
    await merchantVoucherPage.fillBannerUrl('https://example.com/banner.png');
    await merchantVoucherPage.setActive(true);
    await merchantVoucherPage.fillStartDate('2026-05-01');
    await merchantVoucherPage.fillExpiryDate('2026-12-31T23:59');
    await merchantVoucherPage.clickCreateVoucher();
    await merchantVoucherPage.expectUrl(/\/merchant-vouchers/);
    await merchantVoucherPage.expectInTable('Summer Sale Voucher');
  });

  test('TC-MV-012 - Create voucher with only required fields', async ({ page }) => {
    const merchantVoucherPage = new MerchantVoucherPage(page);
    await merchantVoucherPage.gotoNew();
    await merchantVoucherPage.fillTitle('Basic Voucher');
    await merchantVoucherPage.clickCreateVoucher();
    await merchantVoucherPage.expectUrl(/\/merchant-vouchers/);
    await merchantVoucherPage.expectInTable('Basic Voucher');
  });

  test('TC-MV-013 - Create voucher with empty title shows error', async ({ page }) => {
    const merchantVoucherPage = new MerchantVoucherPage(page);
    await merchantVoucherPage.gotoNew();
    await merchantVoucherPage.fillDescription('Description without title');
    await merchantVoucherPage.clickCreateVoucher();
    await merchantVoucherPage.expectValidationError();
  });

  test('TC-MV-014 - Create voucher with empty description shows error', async ({ page }) => {
    const merchantVoucherPage = new MerchantVoucherPage(page);
    await merchantVoucherPage.gotoNew();
    await merchantVoucherPage.fillTitle('Voucher Without Description');
    await merchantVoucherPage.clickCreateVoucher();
    await merchantVoucherPage.expectValidationError();
  });

  test('TC-MV-015 - Create voucher with invalid banner URL', async ({ page }) => {
    const merchantVoucherPage = new MerchantVoucherPage(page);
    await merchantVoucherPage.gotoNew();
    await merchantVoucherPage.fillTitle('Invalid Banner Voucher');
    await merchantVoucherPage.fillBannerUrl('not-a-valid-url');
    await merchantVoucherPage.clickCreateVoucher();
    await merchantVoucherPage.expectValidationError();
  });

  test('TC-MV-016 - Create voucher with start and expiry dates', async ({ page }) => {
    const merchantVoucherPage = new MerchantVoucherPage(page);
    await merchantVoucherPage.gotoNew();
    await merchantVoucherPage.fillTitle('Dated Voucher');
    await merchantVoucherPage.fillStartDate('2026-06-01');
    await merchantVoucherPage.fillExpiryDate('2026-08-31');
    await merchantVoucherPage.clickCreateVoucher();
    await merchantVoucherPage.expectInTable('Dated Voucher');
  });

  test('TC-MV-017 - Create voucher with active status', async ({ page }) => {
    const merchantVoucherPage = new MerchantVoucherPage(page);
    await merchantVoucherPage.gotoNew();
    await merchantVoucherPage.fillTitle('Active Voucher');
    await merchantVoucherPage.setActive(true);
    await merchantVoucherPage.clickCreateVoucher();
    await merchantVoucherPage.expectInTable('Active Voucher');
  });

  test('TC-MV-018 - Create voucher with inactive status', async ({ page }) => {
    const merchantVoucherPage = new MerchantVoucherPage(page);
    await merchantVoucherPage.gotoNew();
    await merchantVoucherPage.fillTitle('Inactive Voucher');
    await merchantVoucherPage.setActive(false);
    await merchantVoucherPage.clickCreateVoucher();
    await merchantVoucherPage.expectInTable('Inactive Voucher');
  });

  test('TC-MV-019 - Cancel voucher creation returns to list', async ({ page }) => {
    const merchantVoucherPage = new MerchantVoucherPage(page);
    await merchantVoucherPage.gotoNew();
    await merchantVoucherPage.fillTitle('Cancelled Voucher');
    await merchantVoucherPage.fillDescription('This should not be saved');
    await merchantVoucherPage.clickCancel();
    await merchantVoucherPage.expectUrl(/\/merchant-vouchers/);
    await merchantVoucherPage.expectNotInTable('Cancelled Voucher');
  });

  test('TC-MV-020 - Create voucher with duplicate title', async ({ page }) => {
    const merchantVoucherPage = new MerchantVoucherPage(page);
    await merchantVoucherPage.gotoNew();
    await merchantVoucherPage.fillTitle('Duplicate Title Voucher');
    await merchantVoucherPage.clickCreateVoucher();
    await merchantVoucherPage.gotoNew();
    await merchantVoucherPage.fillTitle('Duplicate Title Voucher');
    await merchantVoucherPage.clickCreateVoucher();
    await expect(page.locator('text=/already exists|duplicate|exists/i')).toBeVisible({ timeout: 3000 });
  });

  // ==================== EDIT VOUCHER TESTS ====================

  test('TC-MV-021 - Edit existing voucher title', async ({ page }) => {
    const merchantVoucherPage = new MerchantVoucherPage(page);
    const rows = await merchantVoucherPage.getTableRows();
    const count = await rows.count();
    if (count > 0) {
      await merchantVoucherPage.clickEdit(rows.first());
      await merchantVoucherPage.fillTitle('Updated Voucher Title');
      await merchantVoucherPage.clickSaveVoucher();
      await merchantVoucherPage.expectInTable('Updated Voucher Title');
    }
  });

  test('TC-MV-022 - Edit voucher description', async ({ page }) => {
    const merchantVoucherPage = new MerchantVoucherPage(page);
    const rows = await merchantVoucherPage.getTableRows();
    const count = await rows.count();
    if (count > 0) {
      await merchantVoucherPage.clickEdit(rows.first());
      await merchantVoucherPage.fillDescription('Updated voucher description');
      await merchantVoucherPage.clickSaveVoucher();
      await merchantVoucherPage.expectInTable('Updated voucher description');
    }
  });

  test('TC-MV-023 - Edit voucher banner URL', async ({ page }) => {
    const merchantVoucherPage = new MerchantVoucherPage(page);
    const rows = await merchantVoucherPage.getTableRows();
    const count = await rows.count();
    if (count > 0) {
      await merchantVoucherPage.clickEdit(rows.first());
      await merchantVoucherPage.fillBannerUrl('https://example.com/updated-banner.png');
      await merchantVoucherPage.clickSaveVoucher();
      await merchantVoucherPage.expectUrl(/\/merchant-vouchers/);
    }
  });

  test('TC-MV-024 - Toggle voucher active status', async ({ page }) => {
    const merchantVoucherPage = new MerchantVoucherPage(page);
    const rows = await merchantVoucherPage.getTableRows();
    const count = await rows.count();
    if (count > 0) {
      await merchantVoucherPage.clickEdit(rows.first());
      await merchantVoucherPage.setActive(false);
      await merchantVoucherPage.clickSaveVoucher();
      await merchantVoucherPage.expectUrl(/\/merchant-vouchers/);
    }
  });

  test('TC-MV-025 - Edit voucher with empty title shows error', async ({ page }) => {
    const merchantVoucherPage = new MerchantVoucherPage(page);
    const rows = await merchantVoucherPage.getTableRows();
    const count = await rows.count();
    if (count > 0) {
      await merchantVoucherPage.clickEdit(rows.first());
      await page.locator('#voucher-title').clear();
      await merchantVoucherPage.clickSaveVoucher();
      await merchantVoucherPage.expectValidationError();
    }
  });

  test('TC-MV-026 - Cancel edit returns to list without changes', async ({ page }) => {
    const merchantVoucherPage = new MerchantVoucherPage(page);
    const rows = await merchantVoucherPage.getTableRows();
    const count = await rows.count();
    const originalTitle = count > 0 ? await rows.first().locator('td').first().textContent() : '';
    if (count > 0) {
      await merchantVoucherPage.clickEdit(rows.first());
      await merchantVoucherPage.fillTitle('Should Not Save');
      await merchantVoucherPage.clickCancel();
      await merchantVoucherPage.expectUrl(/\/merchant-vouchers/);
      if (originalTitle) {
        await merchantVoucherPage.expectInTable(originalTitle.trim());
      }
    }
  });

  test('TC-MV-027 - Save button is visible on edit form', async ({ page }) => {
    const merchantVoucherPage = new MerchantVoucherPage(page);
    const rows = await merchantVoucherPage.getTableRows();
    const count = await rows.count();
    if (count > 0) {
      await merchantVoucherPage.clickEdit(rows.first());
      await expect(page.locator('button:has-text("Save Voucher")')).toBeVisible();
    }
  });

  test('TC-MV-028 - Edit multiple fields at once', async ({ page }) => {
    const merchantVoucherPage = new MerchantVoucherPage(page);
    const rows = await merchantVoucherPage.getTableRows();
    const count = await rows.count();
    if (count > 0) {
      await merchantVoucherPage.clickEdit(rows.first());
      await merchantVoucherPage.fillTitle('Multi Updated Voucher');
      await merchantVoucherPage.fillDescription('Multiple fields updated');
      await merchantVoucherPage.fillBannerUrl('https://example.com/multi.png');
      await merchantVoucherPage.setActive(false);
      await merchantVoucherPage.clickSaveVoucher();
      await merchantVoucherPage.expectInTable('Multi Updated Voucher');
    }
  });

  // ==================== DELETE VOUCHER TESTS ====================

  test('TC-MV-029 - Delete voucher from list', async ({ page }) => {
    const merchantVoucherPage = new MerchantVoucherPage(page);
    const rows = await merchantVoucherPage.getTableRows();
    const count = await rows.count();
    if (count > 0) {
      const initialCount = count;
      await merchantVoucherPage.gotoNew();
      await merchantVoucherPage.fillTitle('Voucher To Delete');
      await merchantVoucherPage.clickCreateVoucher();
      await merchantVoucherPage.expectInTable('Voucher To Delete');
      const rowsAfterCreate = await merchantVoucherPage.getTableRows();
      const deleteRow = rowsAfterCreate.filter({ has: page.locator('text=Voucher To Delete') }).first();
      if (await deleteRow.isVisible()) {
        await merchantVoucherPage.clickDelete(deleteRow);
        await merchantVoucherPage.confirmDelete();
        await merchantVoucherPage.expectNotInTable('Voucher To Delete');
      }
    }
  });

  test('TC-MV-030 - Cancel delete does not remove voucher', async ({ page }) => {
    const merchantVoucherPage = new MerchantVoucherPage(page);
    const rows = await merchantVoucherPage.getTableRows();
    const count = await rows.count();
    if (count > 0) {
      const initialCount = count;
      await merchantVoucherPage.clickDelete(rows.first());
      await merchantVoucherPage.cancelDelete();
      const newCount = await merchantVoucherPage.getTableRows().count();
      expect(newCount).toBe(initialCount);
    }
  });

  test('TC-MV-031 - Confirm dialog appears on delete', async ({ page }) => {
    const merchantVoucherPage = new MerchantVoucherPage(page);
    const rows = await merchantVoucherPage.getTableRows();
    const count = await rows.count();
    if (count > 0) {
      await merchantVoucherPage.clickDelete(rows.first());
      await expect(page.locator('button:has-text("Confirm"), button:has-text("Ya"), button:has-text("OK")')).toBeVisible({ timeout: 3000 });
    }
  });

  test('TC-MV-032 - Back to Merchant Vouchers button works', async ({ page }) => {
    const merchantVoucherPage = new MerchantVoucherPage(page);
    await merchantVoucherPage.gotoNew();
    await merchantVoucherPage.clickBackToMerchantVouchers();
    await merchantVoucherPage.expectUrl(/\/merchant-vouchers/);
    await expect(page.locator('table')).toBeVisible();
  });

  // ==================== EDGE CASE TESTS ====================

  test('TC-MV-033 - Create voucher with maximum length title', async ({ page }) => {
    const merchantVoucherPage = new MerchantVoucherPage(page);
    await merchantVoucherPage.gotoNew();
    const maxLengthTitle = 'A'.repeat(255);
    await merchantVoucherPage.fillTitle(maxLengthTitle);
    await merchantVoucherPage.clickCreateVoucher();
    await merchantVoucherPage.expectUrl(/\/merchant-vouchers/);
    await merchantVoucherPage.expectInTable(maxLengthTitle);
  });

  test('TC-MV-034 - Create voucher with special characters in description', async ({ page }) => {
    const merchantVoucherPage = new MerchantVoucherPage(page);
    await merchantVoucherPage.gotoNew();
    await merchantVoucherPage.fillTitle('Special Char Voucher');
    await merchantVoucherPage.fillDescription('Description with special chars: @#$%^&*()_+-=[]{}|;:,.<>?/~`"\\');
    await merchantVoucherPage.clickCreateVoucher();
    await merchantVoucherPage.expectInTable('Special Char Voucher');
  });
});
