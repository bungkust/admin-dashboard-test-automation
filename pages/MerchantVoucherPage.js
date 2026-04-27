const { expect } = require('@playwright/test');

class MerchantVoucherPage {
  constructor(page) {
    this.page = page;
    this._savedStartDate = null;
    this._savedExpiryDate = null;
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
  // React controlled inputs — must use JS to set value + fire events
  async _setReactValue(selector, value) {
    await this.page.waitForSelector(selector, { timeout: 10000 });
    await this.page.evaluate(
      ([sel, val]) => {
        const el = document.querySelector(sel);
        const native = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
        native.call(el, val);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      },
      [selector, value]
    );
  }

  async _setReactTextarea(selector, value) {
    await this.page.waitForSelector(selector, { timeout: 10000 });
    await this.page.evaluate(
      ([sel, val]) => {
        const el = document.querySelector(sel);
        const native = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set;
        native.call(el, val);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      },
      [selector, value]
    );
  }

  async fillTitle(value) {
    await this._setReactValue('#voucher-title', value);
  }

  async fillDescription(value) {
    await this._setReactTextarea('#voucher-description', value);
  }

  async fillGuideline(value) {
    await this._setReactTextarea('#voucher-guideline', value);
  }

  async fillTermCondition(value) {
    await this._setReactTextarea('#voucher-term-condition', value);
  }

  async fillBannerUrl(value) {
    await this._setReactValue('#voucher-banner', value);
  }

  async setActive(checked) {
    const cb = this.page.locator('#voucher-is-active, input[type="checkbox"]').first();
    if (checked !== await cb.isChecked()) {
      await cb.click();
    }
  }

  async fillStartDate(value) {
    // type="date" expects YYYY-MM-DD, no T
    const normalized = value.replace('T', '-').substring(0, 10);
    this._savedStartDate = normalized;
    await this._setReactValue('#voucher-start-at', normalized);
  }

  async fillExpiryDate(value) {
    // type="date" expects YYYY-MM-DD, no T
    const normalized = value.replace('T', '-').substring(0, 10);
    this._savedExpiryDate = normalized;
    await this._setReactValue('#voucher-expire-at', normalized);
  }

  async clickCreateVoucher() {
    // Atomically fill any empty dates + submit to prevent React from clearing them
    await this.page.evaluate(
      ([start, expiry]) => {
        const ns = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
        const s = document.querySelector('#voucher-start-at');
        const e = document.querySelector('#voucher-expire-at');
        if (s && !s.value && start) { ns.call(s, start); s.dispatchEvent(new Event('input', { bubbles: true })); }
        if (e && !e.value && expiry) { ns.call(e, expiry); e.dispatchEvent(new Event('input', { bubbles: true })); }
        Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Create Voucher'))?.click();
      },
      [this._savedStartDate, this._savedExpiryDate]
    );
  }

  async clickSaveVoucher() {
    // Edit page uses "Save Changes" or "Update Voucher"
    await this.page.click('button:has-text("Save Voucher"), button:has-text("Save Changes"), button:has-text("Update Voucher")');
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
