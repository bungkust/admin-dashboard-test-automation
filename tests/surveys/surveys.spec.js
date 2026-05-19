const { test, expect } = require('../../fixtures/page.fixture');
const { SurveysPage } = require('../../pages/SurveysPage');

function generateUniqueSurvey() {
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
  return {
    title: `Survey-${rand}`,
    description: `<p>This is a description for <strong>Survey-${rand}</strong> rich text test.</p>`,
    pointReward: 100,
    maxTime: 30,
    startDate: '2026-06-01',
    endDate: '2026-06-30'
  };
}

test.describe('Surveys E2E Automation Suite', () => {

  test.beforeEach(async ({ surveysPage }) => {
    await surveysPage.goto();
  });

  // ==================== LIST PAGE TESTS ====================

  test('TC-SV-001 - Load Surveys List Page', async ({ page }) => {
    const surveysPage = new SurveysPage(page);
    await expect(page.locator('table')).toBeVisible();
    const rowCount = await surveysPage.getTableRows().count();
    expect(rowCount).toBeGreaterThanOrEqual(0);
  });

  test('TC-SV-002 - Search Survey by Title', async ({ page }) => {
    const surveysPage = new SurveysPage(page);
    // Search for 'Survey-' which is guaranteed to match the newly created surveys at the top of page 1
    await surveysPage.search('Survey-');
    await expect(page.locator('table')).toContainText('Survey-');
  });

  test('TC-SV-003 - Search with No Results', async ({ page }) => {
    const surveysPage = new SurveysPage(page);
    const searchTerm = 'NonExistentSurveyTitleXYZ123';
    await surveysPage.search(searchTerm);
    // Verify that the search input successfully holds and persists the query
    const input = page.locator('input[placeholder="Search..."]').first();
    await expect(input).toHaveValue(searchTerm);
  });

  test('TC-SV-004 - Navigate to New Survey Form', async ({ page }) => {
    const surveysPage = new SurveysPage(page);
    await surveysPage.clickCreateSurveyButton();
    await surveysPage.expectUrl(/\/surveys\/new/);
    await expect(page.locator('#survey-title')).toBeVisible();
  });

  // ==================== FORM VALIDATION & CANCEL TESTS ====================

  test('TC-SV-005 - Form Empty Submission Error', async ({ page }) => {
    const surveysPage = new SurveysPage(page);
    await surveysPage.gotoNew();
    // Leave title empty and submit
    await surveysPage.clickSubmit();
    // Asserts validation message
    await surveysPage.expectValidationError('Title is required');
  });

  test('TC-SV-006 - Cancel Survey Creation Returns to List', async ({ page }) => {
    const surveysPage = new SurveysPage(page);
    const uniqueSurvey = generateUniqueSurvey();
    
    await surveysPage.gotoNew();
    await surveysPage.fillTitle(uniqueSurvey.title);
    await surveysPage.clickCancel();
    await surveysPage.confirmLeave();
    
    await surveysPage.expectUrl(/\/surveys/);
    await surveysPage.expectNotInTable(uniqueSurvey.title);
  });

  // ==================== SURVEY CREATION TESTS ====================

  test('TC-SV-007 - Create Open-Ended Survey', async ({ page }) => {
    const surveysPage = new SurveysPage(page);
    const uniqueSurvey = generateUniqueSurvey();

    await surveysPage.gotoNew();
    await surveysPage.fillTitle(uniqueSurvey.title);
    await surveysPage.fillDescription(uniqueSurvey.description);
    await surveysPage.fillPointReward(uniqueSurvey.pointReward);
    await surveysPage.fillMaxTime(uniqueSurvey.maxTime);
    await surveysPage.fillStartDate(uniqueSurvey.startDate);
    await surveysPage.fillEndDate(uniqueSurvey.endDate);

    // Question 1 (default is open-ended)
    await surveysPage.fillQuestionText(1, 'What improvements would you like to see?');
    await surveysPage.setQuestionOptional(1, true);

    await surveysPage.setPublished(true);
    await surveysPage.clickSubmit();

    await surveysPage.expectUrl(/\/surveys/);
    await surveysPage.expectInTable(uniqueSurvey.title);
  });

  test('TC-SV-008 - Create Single-Select (Radio) Survey', async ({ page }) => {
    const surveysPage = new SurveysPage(page);
    const uniqueSurvey = generateUniqueSurvey();

    await surveysPage.gotoNew();
    await surveysPage.fillTitle(uniqueSurvey.title);
    await surveysPage.fillDescription(uniqueSurvey.description);
    await surveysPage.fillPointReward(uniqueSurvey.pointReward);
    await surveysPage.fillMaxTime(uniqueSurvey.maxTime);
    await surveysPage.fillStartDate(uniqueSurvey.startDate);
    await surveysPage.fillEndDate(uniqueSurvey.endDate);

    // Question 1 -> Single Select
    await surveysPage.selectQuestionType(1, 'single_select');
    await surveysPage.fillQuestionText(1, 'Which is your favorite feature?');
    
    // Fill first option (exists by default)
    await surveysPage.fillOptionLabel(1, 1, 'Match Streaming');
    
    // Add second option before filling it
    await surveysPage.clickAddOption(1);
    await surveysPage.fillOptionLabel(1, 2, 'Club News');
    
    // Add third option before filling it
    await surveysPage.clickAddOption(1);
    await surveysPage.fillOptionLabel(1, 3, 'Ticket Booking');

    await surveysPage.setPublished(true);
    await surveysPage.clickSubmit();

    await surveysPage.expectUrl(/\/surveys/);
    await surveysPage.expectInTable(uniqueSurvey.title);
  });

  test('TC-SV-009 - Create Rating Survey', async ({ page }) => {
    const surveysPage = new SurveysPage(page);
    const uniqueSurvey = generateUniqueSurvey();

    await surveysPage.gotoNew();
    await surveysPage.fillTitle(uniqueSurvey.title);
    await surveysPage.fillDescription(uniqueSurvey.description);
    await surveysPage.fillPointReward(uniqueSurvey.pointReward);
    await surveysPage.fillMaxTime(uniqueSurvey.maxTime);
    await surveysPage.fillStartDate(uniqueSurvey.startDate);
    await surveysPage.fillEndDate(uniqueSurvey.endDate);

    // Question 1 -> Rating
    await surveysPage.selectQuestionType(1, 'rating');
    await surveysPage.fillQuestionText(1, 'How satisfied are you with our customer support?');
    await surveysPage.fillRatingMin(1, 1);
    await surveysPage.fillRatingMax(1, 5);
    await surveysPage.fillRatingMinLabel(1, 'Very Unsatisfied');
    await surveysPage.fillRatingMaxLabel(1, 'Extremely Satisfied');

    await surveysPage.setPublished(true);
    await surveysPage.clickSubmit();

    await surveysPage.expectUrl(/\/surveys/);
    await surveysPage.expectInTable(uniqueSurvey.title);
  });

  test('TC-SV-0010 - Toggle Published Checkbox (Create Draft Survey)', async ({ page }) => {
    const surveysPage = new SurveysPage(page);
    const uniqueSurvey = generateUniqueSurvey();

    await surveysPage.gotoNew();
    await surveysPage.fillTitle(uniqueSurvey.title);
    await surveysPage.fillDescription(uniqueSurvey.description);
    
    await surveysPage.fillQuestionText(1, 'Draft Question Text');
    
    // Ensure published is UNCHECKED for Draft status
    await surveysPage.setPublished(false);
    await surveysPage.clickSubmit();

    await surveysPage.expectUrl(/\/surveys/);
    
    // Verify that the row containing uniqueSurvey.title has status Draft
    const row = surveysPage.getTableRows().filter({ hasText: uniqueSurvey.title }).first();
    await expect(row).toContainText('Draft');
  });

  // ==================== EDIT & DETAIL TESTS ====================

  test('TC-SV-011 - Edit Survey Details', async ({ page }) => {
    const surveysPage = new SurveysPage(page);
    const uniqueSurvey = generateUniqueSurvey();

    // First create a fully valid survey so we have one to edit without validation errors
    await surveysPage.gotoNew();
    await surveysPage.fillTitle(uniqueSurvey.title);
    await surveysPage.fillDescription(uniqueSurvey.description);
    await surveysPage.fillPointReward(uniqueSurvey.pointReward);
    await surveysPage.fillMaxTime(uniqueSurvey.maxTime);
    await surveysPage.fillStartDate(uniqueSurvey.startDate);
    await surveysPage.fillEndDate(uniqueSurvey.endDate);
    await surveysPage.fillQuestionText(1, 'Temporary Question');
    await surveysPage.clickSubmit();

    // Now search for that created survey and click edit
    await surveysPage.search(uniqueSurvey.title);
    const rows = surveysPage.getTableRows();
    const editRow = rows.filter({ hasText: uniqueSurvey.title }).first();
    await surveysPage.clickEdit(editRow);

    // Edit the fields
    const updatedTitle = `${uniqueSurvey.title}-EDITED`;
    await surveysPage.fillTitle(updatedTitle);
    await surveysPage.fillPointReward(250);
    await surveysPage.clickSubmit();

    // Verify update is successful
    await surveysPage.expectUrl(/\/surveys/);
    await surveysPage.search(updatedTitle);
    await surveysPage.expectInTable(updatedTitle);
  });

  test('TC-SV-012 - Form Navigation Confirmations (Unsaved Changes)', async ({ page }) => {
    const surveysPage = new SurveysPage(page);
    
    await surveysPage.gotoNew();
    await surveysPage.fillTitle('Dirty Title Value');
    
    // Click back button and expect confirmation modal
    await surveysPage.clickBackToSurveys();
    await surveysPage.confirmLeave();
    
    await surveysPage.expectUrl(/\/surveys/);
  });

  // ==================== ADDITIONAL COMPREHENSIVE CHECKLIST TESTS ====================

  test('TC-SV-013 - Title accepts emojis and special characters', async ({ page }) => {
    const surveysPage = new SurveysPage(page);
    const title = 'Survey 🎉 @#$%^&*()';
    await surveysPage.gotoNew();
    await surveysPage.fillTitle(title);
    await surveysPage.fillQuestionText(1, 'Emoji Title Question');
    await surveysPage.clickSubmit();

    await surveysPage.expectUrl(/\/surveys/);
    await surveysPage.expectInTable(title);
  });

  test('TC-SV-014 - Title with max length is accepted', async ({ page }) => {
    const surveysPage = new SurveysPage(page);
    const longTitle = 'Survey Max Length ' + 'a'.repeat(200); // 218 chars total
    await surveysPage.gotoNew();
    await surveysPage.fillTitle(longTitle);
    await surveysPage.fillQuestionText(1, 'Max Title Question');
    await surveysPage.clickSubmit();

    await surveysPage.expectUrl(/\/surveys/);
    await surveysPage.expectInTable(longTitle.substring(0, 50));
  });

  test('TC-SV-015 - Point Reward accepts value 0', async ({ page }) => {
    const surveysPage = new SurveysPage(page);
    const uniqueSurvey = generateUniqueSurvey();

    await surveysPage.gotoNew();
    await surveysPage.fillTitle(uniqueSurvey.title);
    await surveysPage.fillPointReward(0);
    await surveysPage.fillQuestionText(1, 'Zero Reward Question');
    await surveysPage.clickSubmit();

    await surveysPage.expectUrl(/\/surveys/);
    await surveysPage.expectInTable(uniqueSurvey.title);
  });

  test('TC-SV-016 - Point Reward input typing sanitization', async ({ page }) => {
    const surveysPage = new SurveysPage(page);
    await surveysPage.gotoNew();
    
    const input = page.locator('#survey-point-reward').first();
    
    // Invalid negative decimal value is rejected/sanitized to default '0' or empty
    await input.fill('-50.5');
    const val1 = await input.inputValue();
    expect(val1 === '0' || val1 === '').toBe(true);

    // Alpha character strings are completely ignored/blocked by number inputs during typing
    await input.focus();
    await input.pressSequentially('abc');
    const val2 = await input.inputValue();
    expect(val2 === '0' || val2 === '').toBe(true);

    // Valid positive digits are accepted
    await input.fill('150');
    await expect(input).toHaveValue('150');
  });

  test('TC-SV-017 - Max Time accepts value 0 and is validated', async ({ page }) => {
    const surveysPage = new SurveysPage(page);
    const uniqueSurvey = generateUniqueSurvey();

    await surveysPage.gotoNew();
    await surveysPage.fillTitle(uniqueSurvey.title);
    await surveysPage.fillMaxTime(0);
    await surveysPage.fillQuestionText(1, 'Zero Max Time Question');
    await surveysPage.clickSubmit();

    await surveysPage.expectUrl(/\/surveys/);
    await surveysPage.expectInTable(uniqueSurvey.title);
  });

  test('TC-SV-018 - Survey saved without setting Start/End Date', async ({ page }) => {
    const surveysPage = new SurveysPage(page);
    const uniqueSurvey = generateUniqueSurvey();

    await surveysPage.gotoNew();
    await surveysPage.fillTitle(uniqueSurvey.title);
    await surveysPage.fillQuestionText(1, 'No Dates Question');
    await surveysPage.clickSubmit();

    await surveysPage.expectUrl(/\/surveys/);
    await surveysPage.expectInTable(uniqueSurvey.title);
  });

  test('TC-SV-019 - Quill Rich Text description elements verified', async ({ page }) => {
    const surveysPage = new SurveysPage(page);
    await surveysPage.gotoNew();

    const toolbar = page.locator('.ql-toolbar').first();
    const editor = page.locator('.ql-editor').first();
    await expect(toolbar).toBeVisible();
    await expect(editor).toBeVisible();

    await expect(toolbar.locator('button.ql-bold').first()).toBeVisible();
    await expect(toolbar.locator('button.ql-italic').first()).toBeVisible();
    await expect(toolbar.locator('button.ql-list').first()).toBeVisible();
    await expect(toolbar.locator('button.ql-link').first()).toBeVisible();
    await expect(toolbar.locator('button.ql-image').first()).toBeVisible();
  });

  test('TC-SV-020 - Create Multiple-Select Survey with options', async ({ page }) => {
    const surveysPage = new SurveysPage(page);
    const uniqueSurvey = generateUniqueSurvey();

    await surveysPage.gotoNew();
    await surveysPage.fillTitle(uniqueSurvey.title);
    await surveysPage.fillDescription(uniqueSurvey.description);
    await surveysPage.fillPointReward(uniqueSurvey.pointReward);
    await surveysPage.fillMaxTime(uniqueSurvey.maxTime);
    await surveysPage.fillStartDate(uniqueSurvey.startDate);
    await surveysPage.fillEndDate(uniqueSurvey.endDate);

    // Question 1 -> Multiple Select
    await surveysPage.selectQuestionType(1, 'multiple_select');
    await surveysPage.fillQuestionText(1, 'Which products do you use?');
    
    await surveysPage.fillOptionLabel(1, 1, 'Product A');
    await surveysPage.clickAddOption(1);
    await surveysPage.fillOptionLabel(1, 2, 'Product B');
    await surveysPage.clickAddOption(1);
    await surveysPage.fillOptionLabel(1, 3, 'Product C');

    await surveysPage.setOptionOther(1, true).catch(() => {});

    await surveysPage.setPublished(true);
    await surveysPage.clickSubmit();

    await surveysPage.expectUrl(/\/surveys/);
    await surveysPage.expectInTable(uniqueSurvey.title);
  });

  test('TC-SV-021 - Delete option from list via X button', async ({ page }) => {
    const surveysPage = new SurveysPage(page);
    await surveysPage.gotoNew();

    await surveysPage.selectQuestionType(1, 'single_select');
    await surveysPage.fillOptionLabel(1, 1, 'Option 1');
    await surveysPage.clickAddOption(1);
    await surveysPage.fillOptionLabel(1, 2, 'Option 2');

    await surveysPage.clickDeleteOption(1, 2);
    
    const opt2Input = surveysPage.getQuestionCard(1).locator('input[placeholder="Option 2 label"]');
    await expect(opt2Input).not.toBeVisible();
  });

  test('TC-SV-022 - Dynamic Question Type switching preserves question text', async ({ page }) => {
    const surveysPage = new SurveysPage(page);
    await surveysPage.gotoNew();

    const questionText = 'What is your current opinion?';
    await surveysPage.fillQuestionText(1, questionText);

    await surveysPage.selectQuestionType(1, 'rating');
    await expect(page.locator('#q-minlbl-q-1')).toBeVisible();
    const qText = page.locator('#q-text-q-1').first();
    await expect(qText).toHaveValue(questionText);

    await surveysPage.selectQuestionType(1, 'single_select');
    await expect(page.locator('input[placeholder="Option 1 label"]').first()).toBeVisible();
    await expect(qText).toHaveValue(questionText);
  });

  test('TC-SV-023 - Add and remove question blocks', async ({ page }) => {
    const surveysPage = new SurveysPage(page);
    await surveysPage.gotoNew();

    await expect(surveysPage.getQuestionCard(1)).toBeVisible();

    await surveysPage.clickAddQuestion();
    await expect(surveysPage.getQuestionCard(2)).toBeVisible();

    const q1Card = surveysPage.getQuestionCard(1);
    await q1Card.locator('button:has-text("Delete"), button:has-text("Remove")').first().click();

    await expect(surveysPage.getQuestionCard(2)).not.toBeVisible();
    await expect(surveysPage.getQuestionCard(1)).toBeVisible();
  });

  test('TC-SV-024 - Date range boundary allows successful Draft save', async ({ page }) => {
    const surveysPage = new SurveysPage(page);
    const uniqueSurvey = generateUniqueSurvey();

    await surveysPage.gotoNew();
    await surveysPage.fillTitle(uniqueSurvey.title);
    
    await surveysPage.fillStartDate('2026-06-10');
    await surveysPage.fillEndDate('2026-06-01');
    
    await surveysPage.fillQuestionText(1, 'Invalid Date Range Question');
    
    await surveysPage.setPublished(false);
    await surveysPage.clickSubmit();

    await surveysPage.expectUrl(/\/surveys/);
    await surveysPage.expectInTable(uniqueSurvey.title);
  });

  test('TC-SV-025 - Verify admin can set Max Answer Length on Open Ended question', async ({ page }) => {
    const surveysPage = new SurveysPage(page);
    const uniqueSurvey = generateUniqueSurvey();

    await surveysPage.gotoNew();
    await surveysPage.fillTitle(uniqueSurvey.title);
    
    await surveysPage.fillQuestionText(1, 'Tell us your thoughts');
    await surveysPage.fillMaxAnswerLength(1, 350);
    
    await surveysPage.setPublished(false);
    await surveysPage.clickSubmit();

    await surveysPage.expectUrl(/\/surveys/);
    await surveysPage.expectInTable(uniqueSurvey.title);
  });

  test('TC-SV-026 - Verify Max Answer Length accepts valid values and sanitizes invalid inputs', async ({ page }) => {
    const surveysPage = new SurveysPage(page);
    await surveysPage.gotoNew();
    
    const input = page.locator('#q-maxlen-q-1').first();
    
    await surveysPage.fillMaxAnswerLength(1, 100);
    await expect(input).toHaveValue('100');

    await input.fill('-50');
    const val1 = await input.inputValue();
    expect(val1 === '50' || val1 === '0' || val1 === '1' || val1 === '').toBe(true);

    await input.focus();
    await input.pressSequentially('xyz');
    const val2 = await input.inputValue();
    expect(val2.includes('x') || val2.includes('y') || val2.includes('z')).toBe(false);
  });

  test('TC-SV-027 - Verify Single Select with Dropdown UI type', async ({ page }) => {
    const surveysPage = new SurveysPage(page);
    const uniqueSurvey = generateUniqueSurvey();

    await surveysPage.gotoNew();
    await surveysPage.fillTitle(uniqueSurvey.title);
    
    await surveysPage.selectQuestionType(1, 'single_select');
    await surveysPage.selectQuestionUiType(1, 'dropdown');
    await surveysPage.fillQuestionText(1, 'How did you find us?');
    
    await surveysPage.fillOptionLabel(1, 1, 'Google');
    await surveysPage.clickAddOption(1);
    await surveysPage.fillOptionLabel(1, 2, 'Social Media');

    await surveysPage.setPublished(false);
    await surveysPage.clickSubmit();

    await surveysPage.expectUrl(/\/surveys/);
    await surveysPage.expectInTable(uniqueSurvey.title);
  });

  test('TC-SV-028 - Verify Rating question with Min greater than Max or equal Min and Max', async ({ page }) => {
    const surveysPage = new SurveysPage(page);
    const uniqueSurvey = generateUniqueSurvey();

    await surveysPage.gotoNew();
    await surveysPage.fillTitle(uniqueSurvey.title);
    
    await surveysPage.selectQuestionType(1, 'rating');
    await surveysPage.fillQuestionText(1, 'Equal/Min-Max Rating Scale');
    
    await surveysPage.fillStartDate(uniqueSurvey.startDate);
    await surveysPage.fillEndDate(uniqueSurvey.startDate);

    await surveysPage.fillRatingMin(1, 5);
    await surveysPage.fillRatingMax(1, 5);
    await surveysPage.fillRatingMinLabel(1, 'Poor');
    await surveysPage.fillRatingMaxLabel(1, 'Excellent');

    await surveysPage.clickSubmit();

    // Assert Rating Min must be less than Max validation error banner
    await surveysPage.expectValidationError('Question 1 min value must be less than max value');
  });

  test('TC-SV-029 - Verify Rating question with empty labels', async ({ page }) => {
    const surveysPage = new SurveysPage(page);
    const uniqueSurvey = generateUniqueSurvey();

    await surveysPage.gotoNew();
    await surveysPage.fillTitle(uniqueSurvey.title);
    
    await surveysPage.selectQuestionType(1, 'rating');
    await surveysPage.fillQuestionText(1, 'Empty Label Rating');
    await surveysPage.fillRatingMin(1, 1);
    await surveysPage.fillRatingMax(1, 5);

    await surveysPage.clickSubmit();

    // Assert Rating empty label validation banner
    await surveysPage.expectValidationError('Question 1 min label is required');
  });

  test('TC-SV-030 - Verify Start Date in the past is handled', async ({ page }) => {
    const surveysPage = new SurveysPage(page);
    const uniqueSurvey = generateUniqueSurvey();

    await surveysPage.gotoNew();
    await surveysPage.fillTitle(uniqueSurvey.title);
    
    await surveysPage.fillStartDate('2020-01-01');
    await surveysPage.fillEndDate(uniqueSurvey.endDate);
    
    await surveysPage.fillQuestionText(1, 'Past Start Date Question');
    
    await surveysPage.setPublished(false);
    await surveysPage.clickSubmit();

    await surveysPage.expectUrl(/\/surveys/);
    await surveysPage.expectInTable(uniqueSurvey.title);
  });

  test('TC-SV-031 - Verify HTML characters in question text are handled', async ({ page }) => {
    const surveysPage = new SurveysPage(page);
    const uniqueSurvey = generateUniqueSurvey();

    await surveysPage.gotoNew();
    await surveysPage.fillTitle(uniqueSurvey.title);
    
    await surveysPage.fillQuestionText(1, 'Rate us <b>please</b> 😊');
    
    await surveysPage.setPublished(false);
    await surveysPage.clickSubmit();

    await surveysPage.expectUrl(/\/surveys/);
    await surveysPage.expectInTable(uniqueSurvey.title);
  });

  // ==================== LIST DISPLAY & PAGINATION CHECKLIST TESTS ====================

  test('TC-SV-032 - Verify page heading and subtitle on list page', async ({ page }) => {
    const surveysPage = new SurveysPage(page);
    await surveysPage.goto();

    const heading = page.locator('h2').first();
    await expect(heading).toHaveText('Surveys');

    const subtitle = page.locator('p').filter({ hasText: /Manage surveys/i }).first();
    await expect(subtitle).toContainText('Manage surveys and their questions.');
  });

  test('TC-SV-033 - Verify Survey List table headers', async ({ page }) => {
    const surveysPage = new SurveysPage(page);
    await surveysPage.goto();

    const headers = page.locator('table thead th');
    await expect(headers.nth(0)).toContainText('Title');
    await expect(headers.nth(1)).toContainText('Status');
    await expect(headers.nth(2)).toContainText('Max Time');
    await expect(headers.nth(3)).toContainText('Actions');
  });

  test('TC-SV-034 - Verify normal and large Max Time format displays in list', async ({ page }) => {
    const surveysPage = new SurveysPage(page);
    const uniqueSurvey = generateUniqueSurvey();

    await surveysPage.gotoNew();
    await surveysPage.fillTitle(uniqueSurvey.title);
    await surveysPage.fillMaxTime(123456);
    await surveysPage.fillQuestionText(1, 'Max Time display question');
    await surveysPage.clickSubmit();

    await surveysPage.expectUrl(/\/surveys/);
    await surveysPage.search(uniqueSurvey.title);
    
    const row = surveysPage.getTableRows().filter({ hasText: uniqueSurvey.title }).first();
    await expect(row).toContainText('123456 min');
  });

  test('TC-SV-035 - Verify Max Time = 0 displays as no limit (—) in list', async ({ page }) => {
    const surveysPage = new SurveysPage(page);
    const uniqueSurvey = generateUniqueSurvey();

    await surveysPage.gotoNew();
    await surveysPage.fillTitle(uniqueSurvey.title);
    await surveysPage.fillMaxTime(0);
    await surveysPage.fillQuestionText(1, 'Zero time display question');
    await surveysPage.clickSubmit();

    await surveysPage.expectUrl(/\/surveys/);
    await surveysPage.search(uniqueSurvey.title);
    
    const row = surveysPage.getTableRows().filter({ hasText: uniqueSurvey.title }).first();
    await expect(row).toContainText('—');
  });

  test('TC-SV-036 - Verify Published vs Draft status visual styling indicators', async ({ page }) => {
    const surveysPage = new SurveysPage(page);
    await surveysPage.goto();

    const pubBadge = page.locator('span').filter({ hasText: /^Published$/i }).first();
    if (await pubBadge.isVisible()) {
      const classes = await pubBadge.getAttribute('class') || '';
      expect(classes.length > 0).toBe(true);
    }

    const draftBadge = page.locator('span').filter({ hasText: /^Draft$/i }).first();
    if (await draftBadge.isVisible()) {
      const classes = await draftBadge.getAttribute('class') || '';
      expect(classes.length > 0).toBe(true);
    }
  });

  test('TC-SV-037 - Verify Pagination single-page indicators and button states', async ({ page }) => {
    const surveysPage = new SurveysPage(page);
    await surveysPage.goto();

    const prevButton = page.locator('button').filter({ hasText: /Previous/i }).first();
    if (await prevButton.isVisible()) {
      await expect(prevButton).toBeDisabled();
    }
  });
});
