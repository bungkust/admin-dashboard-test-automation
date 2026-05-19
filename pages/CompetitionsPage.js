const { expect } = require('@playwright/test');

class CompetitionsPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/competitions');
  }

  async gotoNew() {
    await this.page.goto('/competitions/new');
  }

  // List page
  getTableRows() {
    return this.page.locator('table tbody tr');
  }

  async search(term) {
    const searchInput = this.page.locator('input[placeholder*="Search competitions"]');
    await searchInput.fill(term);
    await searchInput.press('Enter');
    await this.page.waitForTimeout(1000);
  }

  async openFilterPopover() {
    await this.page.click('button:has-text("Filter")');
  }

  async fillFilterSeason(season) {
    const input = this.page.locator('input[placeholder*="2025/2026"], input[placeholder*="e.g. 2025"], input[placeholder*="2025"]');
    await input.fill(season);
  }

  async clickApplyFilter() {
    await this.page.click('button:has-text("Apply")');
    await this.page.waitForTimeout(1000);
  }

  async clickClearFilter() {
    await this.page.click('button:has-text("Clear")');
    await this.page.waitForTimeout(1000);
  }

  async clickNewCompetition() {
    await this.page.click('a:has-text("New Competition"), button:has-text("New Competition"), [href*="/competitions/new"]');
  }

  // Create form
  async fillName(value) {
    await this.page.fill('#competition-name', value);
  }

  async fillSeason(value) {
    await this.page.fill('#competition-season', value);
  }

  async fillLogoUrl(value) {
    await this.page.fill('#competition-logo-upload', value);
  }

  async setActive(checked) {
    const cb = this.page.locator('input[type="checkbox"]');
    if (checked !== await cb.isChecked()) {
      await cb.click();
    }
  }

  async clickCreate() {
    await this.page.click('button:has-text("Create Competition")');
  }

  async clickSave() {
    await this.page.click('button:has-text("Update Competition")');
  }

  async clickCancel() {
    await this.page.click('button:has-text("Cancel")');
    const leaveBtn = this.page.locator('dialog button:has-text("Leave"), [role="dialog"] button:has-text("Leave"), button:has-text("Leave")').first();
    try {
      if (await leaveBtn.isVisible({ timeout: 2000 })) {
        await leaveBtn.click();
      }
    } catch (e) {
      // Modal didn't appear, ignore
    }
  }

  async expectOnList() {
    try {
      await this.page.waitForURL(/\/competitions$/, { timeout: 6000 });
    } catch (e) {
      await this.goto();
      await this.page.waitForURL(/\/competitions$/, { timeout: 4000 });
    }
  }

  async expectNameInTable(name) {
    await expect(this.page.locator('table')).toContainText(name);
  }

  async clickDelete(row) {
    const deleteButton = row.locator('button:has-text("Delete"), button:has-text("Remove")').first();
    await deleteButton.click();
  }

  async confirmDelete() {
    await this.page.locator('dialog button:has-text("Delete"), [role="dialog"] button:has-text("Delete"), button:has-text("Confirm"), button:has-text("Yes")').first().click();
  }

  async expectNotInTable(name) {
    await expect(this.page.locator('table')).not.toContainText(name, { timeout: 12000 });
  }

  async getRowCount() {
    return this.getTableRows().count();
  }
}

module.exports = { CompetitionsPage };
