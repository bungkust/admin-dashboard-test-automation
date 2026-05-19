const { expect } = require('@playwright/test');

class SurveysPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/surveys');
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  async gotoNew() {
    await this.page.goto('/surveys/new');
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  async gotoEdit(id) {
    await this.page.goto(`/surveys/${id}/edit`);
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  // --- List Page Actions ---
  getTableRows() {
    return this.page.locator('table tbody tr');
  }

  async search(term) {
    const input = this.page.locator('input[placeholder="Search..."]').first();
    await input.clear();
    await input.fill(term);
    await input.press('Enter');
    await this.page.waitForLoadState('networkidle').catch(() => {});
    await this.page.waitForTimeout(1000); // Small buffer for search updates
  }

  async clickCreateSurveyButton() {
    await this.page.click('a:has-text("Create Survey"), button:has-text("Create Survey"), [href="/surveys/new"]');
  }

  async clickEdit(row) {
    await row.locator('a:has-text("Edit")').click();
  }

  async clickNextPagination() {
    await this.page.click('button:has-text("Next"), button:has-text("→")');
  }

  async clickPreviousPagination() {
    await this.page.click('button:has-text("Previous"), button:has-text("←")');
  }

  // --- Form Input Fields ---
  async fillTitle(value) {
    await this.page.fill('#survey-title', value);
  }

  async fillDescription(value) {
    // Fill the rich text editor (Quill editor)
    const editor = this.page.locator('.ql-editor').first();
    await editor.clear();
    await editor.fill(value);
  }

  async fillPointReward(value) {
    await this.page.fill('#survey-point-reward', String(value));
  }

  async fillMaxTime(value) {
    await this.page.fill('#survey-max-time', String(value));
  }

  async fillStartDate(value) {
    await this.page.fill('#survey-start-at', value);
  }

  async fillEndDate(value) {
    await this.page.fill('#survey-end-at', value);
  }

  async setPublished(checked) {
    const cb = this.page.locator('#survey-is-published');
    if (checked !== await cb.isChecked()) {
      await cb.click();
    }
  }

  // --- Dynamic Question Actions ---
  async clickAddQuestion() {
    await this.page.click('button:has-text("+ Add Question"), button:has-text("Add Question")');
  }

  getQuestionCard(questionNumber) {
    return this.page.locator('div.bg-gray-50').filter({ hasText: `Question ${questionNumber}` }).first();
  }

  async fillQuestionText(questionNumber, value) {
    await this.page.fill(`#q-text-q-${questionNumber}`, value);
  }

  async setQuestionOptional(questionNumber, checked) {
    const cb = this.page.locator(`#q-optional-q-${questionNumber}`);
    if (checked !== await cb.isChecked()) {
      await cb.click();
    }
  }

  async selectQuestionType(questionNumber, type) {
    // type options: open_ended, single_select, multiple_select, rating
    await this.page.selectOption(`#q-type-q-${questionNumber}`, type);
    await this.page.waitForTimeout(200); // Wait for dynamic layout rendering
  }

  // --- Type Specific Fields ---
  // A. Single Select / Multiple Select
  async selectQuestionUiType(questionNumber, uiType) {
    // uiType options: radio, dropdown
    await this.page.selectOption(`#q-uitype-q-${questionNumber}`, uiType);
  }

  async fillOptionLabel(questionNumber, optionNumber, value) {
    const card = this.getQuestionCard(questionNumber);
    const input = card.locator(`input[placeholder="Option ${optionNumber} label"]`);
    await input.fill(value);
  }

  async clickAddOption(questionNumber) {
    const card = this.getQuestionCard(questionNumber);
    await card.locator('button:has-text("+ Add option")').click();
  }

  async clickDeleteOption(questionNumber, optionNumber) {
    const card = this.getQuestionCard(questionNumber);
    const row = card.locator('div.flex.items-center.gap-2').filter({
      has: this.page.locator(`input[placeholder="Option ${optionNumber} label"]`)
    }).first();
    await row.locator('button:has-text("✕")').click();
  }

  async setOptionOther(questionNumber, checked) {
    const card = this.getQuestionCard(questionNumber);
    const cb = card.locator('input[type="checkbox"]').filter({ hasText: /other/i }).or(
      card.locator('label').filter({ hasText: /other/i }).locator('input[type="checkbox"]')
    ).or(
      card.locator('input[type="checkbox"]').last()
    ).first();
    if (checked !== await cb.isChecked()) {
      await cb.click();
    }
  }

  // C. Open Ended Fields
  async fillMaxAnswerLength(questionNumber, value) {
    await this.page.fill(`#q-maxlen-q-${questionNumber}`, String(value));
  }

  // B. Rating Fields
  async fillRatingMin(questionNumber, value) {
    await this.page.fill(`#q-minval-q-${questionNumber}`, String(value));
  }

  async fillRatingMax(questionNumber, value) {
    await this.page.fill(`#q-maxval-q-${questionNumber}`, String(value));
  }

  async fillRatingMinLabel(questionNumber, value) {
    await this.page.fill(`#q-minlbl-q-${questionNumber}`, value);
  }

  async fillRatingMaxLabel(questionNumber, value) {
    await this.page.fill(`#q-maxlbl-q-${questionNumber}`, value);
  }

  // --- General Form Controls ---
  async clickSubmit() {
    await this.page.locator('button[type="submit"]').click();
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  async clickCancel() {
    await this.page.click('button:has-text("Cancel")');
  }

  async clickBackToSurveys() {
    await this.page.click('button:has-text("Back to Surveys")');
  }

  async confirmLeave() {
    const leaveBtn = this.page.locator('button:has-text("Leave")');
    if (await leaveBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await leaveBtn.click();
    }
  }

  // --- Assertions ---
  async expectInTable(title) {
    await expect(this.page.locator('table')).toContainText(title);
  }

  async expectNotInTable(title) {
    await expect(this.page.locator('table')).not.toContainText(title, { timeout: 10000 });
  }

  async expectEmptyState() {
    await expect(this.page.locator('table')).toContainText(/no survey|belum ada|empty|0 result|tidak ditemukan|tidak ada|kosong/i, { timeout: 5000 }).catch(async () => {
      const rows = this.page.locator('table tbody tr');
      await expect(rows).toHaveCount(0, { timeout: 3000 });
    });
  }

  async expectValidationError(message) {
    await expect(this.page.locator(`text=${message}`)).toBeVisible({ timeout: 5000 });
  }

  async expectUrl(pathPattern) {
    await expect(this.page).toHaveURL(pathPattern);
  }
}

module.exports = { SurveysPage };
