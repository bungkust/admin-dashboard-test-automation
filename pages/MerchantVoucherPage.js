const { expect } = require('@playwright/test');

class MerchantVoucherPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/merchant-vouchers');
  }

  async gotoNew() {
    await this.page.goto('/merchant-vouchers/new');
  }

  async gotoEdit(id) {
    await this.page.goto(`/merchant-vouchers/${id}/edit`);
  }

  // --- List page ---
  getTableRows() {
    return this.page.locator('table tbody tr');
  }

  async search(term) {
    const input = this.page.locator('input[type="search"], input[placeholder*="Search"]').first();
    await input.clear();
    await input.fill(term);
  }

  async clickNewVoucher() {
    await this.page.click('a:has-text("New Voucher"), button:has-text("New Voucher"), [href*="/merchant-vouchers/new"]');
  }

  async clickEdit(row) {
    await row.locator('button:has-text("Edit"), a:has-text("Edit")').click();
  }

  async clickDelete(row) {
    await row.locator('button:has-text("Delete"), a:has-text("Delete")').click();
  }

  async confirmDelete() {
    await this.page.click('button:has-text("Delete"):not([disabled]), button:has-text("Confirm"), button:has-text("Ya"), button:has-text("OK")');
  }

  async cancelDelete() {
    await this.page.click('button:has-text("Cancel"), button:has-text("Batal")');
  }

  async clickNextPagination() {
    await this.page.click('button:has-text("Next"), button:has-text("→")');
  }

  async clickPreviousPagination() {
    await this.page.click('button:has-text("Previous"), button:has-text("←")');
  }

  // --- Form ---
  async fillTitle(value) {
    await this.page.fill('#title', value);
  }

  async fillDescription(value) {
    const desc = this.page.locator('#description, textarea#description, [placeholder*="Description"]');
    await desc.fill(value);
  }

  async fillBannerUrl(value) {
    await this.page.fill('#banner-url', value);
  }

  async setActive(checked) {
    const cb = this.page.locator('#active, input[type="checkbox"]').first();
    if (checked !== await cb.isChecked()) {
      await cb.click();
    }
  }

  async fillStartDate(value) {
    await this.page.fill('#start-date', value);
  }

  async fillExpiryDate(value) {
    await this.page.fill('#expiry-date', value);
  }

  async clickCreateVoucher() {
    await this.page.click('button:has-text("Create Voucher")');
  }

  async clickSaveVoucher() {
    await this.page.click('button:has-text("Save Voucher")');
  }

  async clickCancel() {
    await this.page.click('button:has-text("Cancel")');
  }

  async clickBackToMerchantVouchers() {
    await this.page.click('button:has-text("Back to Merchant Vouchers")');
  }

  // --- Assertions ---
  async expectInTable(title) {
    await expect(this.page.locator('table')).toContainText(title);
  }

  async expectNotInTable(title) {
    await expect(this.page.locator('table')).not.toContainText(title);
  }

  async expectEmptyState() {
    await expect(this.page.locator('table')).toContainText(/no voucher|belum ada|empty|0 results/i);
  }

  async expectValidationError() {
    await expect(this.page.locator('text=/error|validation|required|wajib|invalid/i')).toBeVisible({ timeout: 3000 });
  }

  async expectUrl(pathPattern) {
    await expect(this.page).toHaveURL(pathPattern);
  }
}

module.exports = { MerchantVoucherPage };
