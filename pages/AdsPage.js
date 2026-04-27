const { expect } = require('@playwright/test');

class AdsPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/ads');
  }

  async gotoNew() {
    await this.page.goto('/ads/new');
  }

  async gotoEdit(id) {
    await this.page.goto(`/ads/${id}/edit`);
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

  async clickFilter() {
    await this.page.click('button:has-text("Filter")');
  }

  async clickNewAd() {
    await this.page.click('a:has-text("New Ad"), button:has-text("New Ad"), [href*="/ads/new"]');
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

  async clickNextPagination() {
    await this.page.click('button:has-text("Next"), button:has-text("→")');
  }

  async clickPreviousPagination() {
    await this.page.click('button:has-text("Previous"), button:has-text("←")');
  }

  // --- Form ---
  async fillTitle(value) {
    await this.page.fill('#ad-title', value);
  }

  async selectAdType(type) {
    // type options: Banner, Interstitial, Rewarded, Native, Reels
    await this.page.selectOption('#ad-type', { label: type });
  }

  async selectAdProvider(provider) {
    // provider options: AdMob, Custom, Direct
    await this.page.selectOption('#ad-provider', { label: provider });
  }

  async selectPlatform(platform) {
    // platform options: Android, iOS, Web, All Platforms
    await this.page.selectOption('#ad-platform', { label: platform });
  }

  async fillDestinationUrl(value) {
    await this.page.fill('#ad-destination-url', value);
  }

  async fillImageUrl(value) {
    await this.page.fill('#ad-image-url', value);
  }

  async fillPriority(value) {
    await this.page.fill('#ad-priority', String(value));
  }

  async fillStartDate(value) {
    await this.page.fill('#ad-start-date', value);
  }

  async fillEndDate(value) {
    await this.page.fill('#ad-end-date', value);
  }

  async setOpenInAppWebview(checked) {
    const cb = this.page.locator('#ad-webview-open, input[type="checkbox"]').first();
    if (checked !== await cb.isChecked()) {
      await cb.click();
    }
  }

  async clickCreateAd() {
    await this.page.click('button:has-text("Create Ad")');
  }

  async clickSaveAd() {
    await this.page.click('button:has-text("Save Ad")');
  }

  async clickCancel() {
    await this.page.click('button:has-text("Cancel")');
  }

  async clickBackToAds() {
    await this.page.click('button:has-text("Back to Ads")');
  }

  // --- Assertions ---
  async expectInTable(title) {
    await expect(this.page.locator('table')).toContainText(title);
  }

  async expectNotInTable(title) {
    await expect(this.page.locator('table')).not.toContainText(title);
  }

  async expectEmptyState() {
    await expect(this.page.locator('table')).toContainText(/no ad|belum ada|empty|0 results/i);
  }

  async expectValidationError() {
    await expect(this.page.locator('text=/error|validation|required|wajib|invalid/i')).toBeVisible({ timeout: 3000 });
  }

  async expectUrl(pathPattern) {
    await expect(this.page).toHaveURL(pathPattern);
  }
}

module.exports = { AdsPage };
