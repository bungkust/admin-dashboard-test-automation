const { test, expect } = require('@playwright/test');
const { AdsPage } = require('../../pages/AdsPage');
const { common } = require('../../utils/common');

test.describe('Ads Module', () => {
  test.use({ loggedInPage: common.loggedInPage });

  test.describe('Ads - Create', () => {

    test.beforeEach(async ({ loggedInPage }) => {
      const adsPage = new AdsPage(loggedInPage);
      await adsPage.gotoNew();
    });

    test('TC-ADS-001 - Create ad with valid data', async ({ loggedInPage }) => {
      const adsPage = new AdsPage(loggedInPage);
      await adsPage.fillTitle('Summer Sale Banner');
      await adsPage.selectAdType('Banner');
      await adsPage.selectAdProvider('AdMob');
      await adsPage.selectPlatform('All');
      await adsPage.fillDestinationUrl('https://example.com/summer');
      await adsPage.fillImageUrl('https://example.com/banner.png');
      await adsPage.fillPriority('1');
      await adsPage.fillStartDate('2026-01-01');
      await adsPage.fillEndDate('2026-12-31');
      await adsPage.clickCreateAd();
      await adsPage.expectUrl(/\/ads$/);
      await adsPage.expectInTable('Summer Sale Banner');
    });

    test('TC-ADS-002 - Create ad with only required fields', async ({ loggedInPage }) => {
      const adsPage = new AdsPage(loggedInPage);
      await adsPage.fillTitle('Minimal Ad');
      await adsPage.selectAdType('Interstitial');
      await adsPage.selectAdProvider('Facebook');
      await adsPage.selectPlatform('Android');
      await adsPage.fillDestinationUrl('https://example.com/minimal');
      await adsPage.clickCreateAd();
      await adsPage.expectUrl(/\/ads$/);
      await adsPage.expectInTable('Minimal Ad');
    });

    test('TC-ADS-003 - Create ad with empty title shows error', async ({ loggedInPage }) => {
      const adsPage = new AdsPage(loggedInPage);
      await adsPage.selectAdType('Banner');
      await adsPage.selectAdProvider('AdMob');
      await adsPage.selectPlatform('All');
      await adsPage.fillDestinationUrl('https://example.com/test');
      await adsPage.clickCreateAd();
      await adsPage.expectValidationError();
    });

    test('TC-ADS-004 - Create ad with empty destination URL shows error', async ({ loggedInPage }) => {
      const adsPage = new AdsPage(loggedInPage);
      await adsPage.fillTitle('No URL Ad');
      await adsPage.selectAdType('Native');
      await adsPage.selectAdProvider('Unity');
      await adsPage.selectPlatform('iOS');
      await adsPage.clickCreateAd();
      await adsPage.expectValidationError();
    });

    test('TC-ADS-005 - Cancel ad creation returns to ads list', async ({ loggedInPage }) => {
      const adsPage = new AdsPage(loggedInPage);
      await adsPage.fillTitle('Cancelled Ad');
      await adsPage.selectAdType('Rewarded');
      await adsPage.selectAdProvider('AdMob');
      await adsPage.selectPlatform('Web');
      await adsPage.fillDestinationUrl('https://example.com/cancelled');
      await adsPage.clickCancel();
      await adsPage.expectUrl(/\/ads$/);
      await adsPage.expectNotInTable('Cancelled Ad');
    });

    test('TC-ADS-006 - Create ad with Banner type', async ({ loggedInPage }) => {
      const adsPage = new AdsPage(loggedInPage);
      await adsPage.fillTitle('Banner Ad Test');
      await adsPage.selectAdType('Banner');
      await adsPage.selectAdProvider('AdMob');
      await adsPage.selectPlatform('All');
      await adsPage.fillDestinationUrl('https://example.com/banner');
      await adsPage.clickCreateAd();
      await adsPage.expectInTable('Banner Ad Test');
    });

    test('TC-ADS-007 - Create ad with Interstitial type', async ({ loggedInPage }) => {
      const adsPage = new AdsPage(loggedInPage);
      await adsPage.fillTitle('Interstitial Ad Test');
      await adsPage.selectAdType('Interstitial');
      await adsPage.selectAdProvider('Facebook');
      await adsPage.selectPlatform('Android');
      await adsPage.fillDestinationUrl('https://example.com/interstitial');
      await adsPage.clickCreateAd();
      await adsPage.expectInTable('Interstitial Ad Test');
    });

    test('TC-ADS-008 - Create ad with Rewarded type', async ({ loggedInPage }) => {
      const adsPage = new AdsPage(loggedInPage);
      await adsPage.fillTitle('Rewarded Ad Test');
      await adsPage.selectAdType('Rewarded');
      await adsPage.selectAdProvider('Unity');
      await adsPage.selectPlatform('iOS');
      await adsPage.fillDestinationUrl('https://example.com/rewarded');
      await adsPage.clickCreateAd();
      await adsPage.expectInTable('Rewarded Ad Test');
    });

    test('TC-ADS-009 - Create ad with Native type', async ({ loggedInPage }) => {
      const adsPage = new AdsPage(loggedInPage);
      await adsPage.fillTitle('Native Ad Test');
      await adsPage.selectAdType('Native');
      await adsPage.selectAdProvider('AdMob');
      await adsPage.selectPlatform('All');
      await adsPage.fillDestinationUrl('https://example.com/native');
      await adsPage.clickCreateAd();
      await adsPage.expectInTable('Native Ad Test');
    });

    test('TC-ADS-010 - Create ad with Splash type', async ({ loggedInPage }) => {
      const adsPage = new AdsPage(loggedInPage);
      await adsPage.fillTitle('Splash Ad Test');
      await adsPage.selectAdType('Splash');
      await adsPage.selectAdProvider('Facebook');
      await adsPage.selectPlatform('Web');
      await adsPage.fillDestinationUrl('https://example.com/splash');
      await adsPage.clickCreateAd();
      await adsPage.expectInTable('Splash Ad Test');
    });

    test('TC-ADS-011 - Create ad with AdMob provider', async ({ loggedInPage }) => {
      const adsPage = new AdsPage(loggedInPage);
      await adsPage.fillTitle('AdMob Provider Test');
      await adsPage.selectAdType('Banner');
      await adsPage.selectAdProvider('AdMob');
      await adsPage.selectPlatform('All');
      await adsPage.fillDestinationUrl('https://example.com/admob');
      await adsPage.clickCreateAd();
      await adsPage.expectInTable('AdMob Provider Test');
    });

    test('TC-ADS-012 - Create ad with Facebook provider', async ({ loggedInPage }) => {
      const adsPage = new AdsPage(loggedInPage);
      await adsPage.fillTitle('Facebook Provider Test');
      await adsPage.selectAdType('Interstitial');
      await adsPage.selectAdProvider('Facebook');
      await adsPage.selectPlatform('Android');
      await adsPage.fillDestinationUrl('https://example.com/facebook');
      await adsPage.clickCreateAd();
      await adsPage.expectInTable('Facebook Provider Test');
    });

    test('TC-ADS-013 - Create ad with Unity provider', async ({ loggedInPage }) => {
      const adsPage = new AdsPage(loggedInPage);
      await adsPage.fillTitle('Unity Provider Test');
      await adsPage.selectAdType('Rewarded');
      await adsPage.selectAdProvider('Unity');
      await adsPage.selectPlatform('iOS');
      await adsPage.fillDestinationUrl('https://example.com/unity');
      await adsPage.clickCreateAd();
      await adsPage.expectInTable('Unity Provider Test');
    });

    test('TC-ADS-014 - Create ad with Android platform', async ({ loggedInPage }) => {
      const adsPage = new AdsPage(loggedInPage);
      await adsPage.fillTitle('Android Platform Test');
      await adsPage.selectAdType('Banner');
      await adsPage.selectAdProvider('AdMob');
      await adsPage.selectPlatform('Android');
      await adsPage.fillDestinationUrl('https://example.com/android');
      await adsPage.clickCreateAd();
      await adsPage.expectInTable('Android Platform Test');
    });

    test('TC-ADS-015 - Create ad with iOS platform', async ({ loggedInPage }) => {
      const adsPage = new AdsPage(loggedInPage);
      await adsPage.fillTitle('iOS Platform Test');
      await adsPage.selectAdType('Banner');
      await adsPage.selectAdProvider('AdMob');
      await adsPage.selectPlatform('iOS');
      await adsPage.fillDestinationUrl('https://example.com/ios');
      await adsPage.clickCreateAd();
      await adsPage.expectInTable('iOS Platform Test');
    });

    test('TC-ADS-016 - Create ad with Web platform', async ({ loggedInPage }) => {
      const adsPage = new AdsPage(loggedInPage);
      await adsPage.fillTitle('Web Platform Test');
      await adsPage.selectAdType('Banner');
      await adsPage.selectAdProvider('AdMob');
      await adsPage.selectPlatform('Web');
      await adsPage.fillDestinationUrl('https://example.com/web');
      await adsPage.clickCreateAd();
      await adsPage.expectInTable('Web Platform Test');
    });

    test('TC-ADS-017 - Create ad with All platforms', async ({ loggedInPage }) => {
      const adsPage = new AdsPage(loggedInPage);
      await adsPage.fillTitle('All Platforms Test');
      await adsPage.selectAdType('Banner');
      await adsPage.selectAdProvider('AdMob');
      await adsPage.selectPlatform('All');
      await adsPage.fillDestinationUrl('https://example.com/all');
      await adsPage.clickCreateAd();
      await adsPage.expectInTable('All Platforms Test');
    });

    test('TC-ADS-018 - Create ad with custom priority value', async ({ loggedInPage }) => {
      const adsPage = new AdsPage(loggedInPage);
      await adsPage.fillTitle('High Priority Ad');
      await adsPage.selectAdType('Interstitial');
      await adsPage.selectAdProvider('AdMob');
      await adsPage.selectPlatform('All');
      await adsPage.fillDestinationUrl('https://example.com/priority');
      await adsPage.fillPriority('10');
      await adsPage.clickCreateAd();
      await adsPage.expectInTable('High Priority Ad');
    });

    test('TC-ADS-019 - Create ad with start and end date', async ({ loggedInPage }) => {
      const adsPage = new AdsPage(loggedInPage);
      await adsPage.fillTitle('Dated Ad Test');
      await adsPage.selectAdType('Banner');
      await adsPage.selectAdProvider('AdMob');
      await adsPage.selectPlatform('All');
      await adsPage.fillDestinationUrl('https://example.com/dated');
      await adsPage.fillStartDate('2026-06-01');
      await adsPage.fillEndDate('2026-08-31');
      await adsPage.clickCreateAd();
      await adsPage.expectInTable('Dated Ad Test');
    });

    test('TC-ADS-020 - Create ad with open in app webview enabled', async ({ loggedInPage }) => {
      const adsPage = new AdsPage(loggedInPage);
      await adsPage.fillTitle('In App Webview Ad');
      await adsPage.selectAdType('Banner');
      await adsPage.selectAdProvider('AdMob');
      await adsPage.selectPlatform('All');
      await adsPage.fillDestinationUrl('https://example.com/webview');
      await adsPage.setOpenInAppWebview(true);
      await adsPage.clickCreateAd();
      await adsPage.expectInTable('In App Webview Ad');
    });

    test('TC-ADS-021 - Create ad with image URL', async ({ loggedInPage }) => {
      const adsPage = new AdsPage(loggedInPage);
      await adsPage.fillTitle('Image Ad Test');
      await adsPage.selectAdType('Banner');
      await adsPage.selectAdProvider('AdMob');
      await adsPage.selectPlatform('All');
      await adsPage.fillDestinationUrl('https://example.com/imagead');
      await adsPage.fillImageUrl('https://example.com/ad-image.png');
      await adsPage.clickCreateAd();
      await adsPage.expectInTable('Image Ad Test');
    });

    test('TC-ADS-022 - Create multiple ads sequentially', async ({ loggedInPage }) => {
      const adsPage = new AdsPage(loggedInPage);
      const adTitles = ['Sequential Ad 1', 'Sequential Ad 2', 'Sequential Ad 3'];
      for (const title of adTitles) {
        await adsPage.gotoNew();
        await adsPage.fillTitle(title);
        await adsPage.selectAdType('Banner');
        await adsPage.selectAdProvider('AdMob');
        await adsPage.selectPlatform('All');
        await adsPage.fillDestinationUrl('https://example.com/' + title.replace(/\s/g, '-'));
        await adsPage.clickCreateAd();
        await adsPage.expectInTable(title);
      }
    });
  });

  test.describe('Ads - Edit', () => {

    test.beforeEach(async ({ loggedInPage }) => {
      const adsPage = new AdsPage(loggedInPage);
      await adsPage.goto();
      // Create a test ad to edit
      await adsPage.clickNewAd();
      await adsPage.fillTitle('Ad To Edit');
      await adsPage.selectAdType('Banner');
      await adsPage.selectAdProvider('AdMob');
      await adsPage.selectPlatform('All');
      await adsPage.fillDestinationUrl('https://example.com/edit-me');
      await adsPage.clickCreateAd();
      await adsPage.expectInTable('Ad To Edit');
    });

    test('TC-ADS-023 - Edit ad title', async ({ loggedInPage }) => {
      const adsPage = new AdsPage(loggedInPage);
      await adsPage.goto();
      const rows = await adsPage.getTableRows();
      const targetRow = rows.filter({ hasText: 'Ad To Edit' }).first();
      await adsPage.clickEdit(targetRow);
      await adsPage.fillTitle('Edited Ad Title');
      await adsPage.clickSaveAd();
      await adsPage.expectInTable('Edited Ad Title');
      await adsPage.expectNotInTable('Ad To Edit');
    });

    test('TC-ADS-024 - Edit ad type', async ({ loggedInPage }) => {
      const adsPage = new AdsPage(loggedInPage);
      await adsPage.goto();
      const rows = await adsPage.getTableRows();
      const targetRow = rows.filter({ hasText: 'Ad To Edit' }).first();
      await adsPage.clickEdit(targetRow);
      await adsPage.selectAdType('Interstitial');
      await adsPage.clickSaveAd();
      await adsPage.expectInTable('Ad To Edit');
    });

    test('TC-ADS-025 - Edit ad provider', async ({ loggedInPage }) => {
      const adsPage = new AdsPage(loggedInPage);
      await adsPage.goto();
      const rows = await adsPage.getTableRows();
      const targetRow = rows.filter({ hasText: 'Ad To Edit' }).first();
      await adsPage.clickEdit(targetRow);
      await adsPage.selectAdProvider('Facebook');
      await adsPage.clickSaveAd();
      await adsPage.expectInTable('Ad To Edit');
    });

    test('TC-ADS-026 - Edit ad platform', async ({ loggedInPage }) => {
      const adsPage = new AdsPage(loggedInPage);
      await adsPage.goto();
      const rows = await adsPage.getTableRows();
      const targetRow = rows.filter({ hasText: 'Ad To Edit' }).first();
      await adsPage.clickEdit(targetRow);
      await adsPage.selectPlatform('iOS');
      await adsPage.clickSaveAd();
      await adsPage.expectInTable('Ad To Edit');
    });

    test('TC-ADS-027 - Edit ad destination URL', async ({ loggedInPage }) => {
      const adsPage = new AdsPage(loggedInPage);
      await adsPage.goto();
      const rows = await adsPage.getTableRows();
      const targetRow = rows.filter({ hasText: 'Ad To Edit' }).first();
      await adsPage.clickEdit(targetRow);
      await adsPage.fillDestinationUrl('https://example.com/edited-destination');
      await adsPage.clickSaveAd();
      await adsPage.expectInTable('Ad To Edit');
    });

    test('TC-ADS-028 - Edit ad image URL', async ({ loggedInPage }) => {
      const adsPage = new AdsPage(loggedInPage);
      await adsPage.goto();
      const rows = await adsPage.getTableRows();
      const targetRow = rows.filter({ hasText: 'Ad To Edit' }).first();
      await adsPage.clickEdit(targetRow);
      await adsPage.fillImageUrl('https://example.com/edited-image.png');
      await adsPage.clickSaveAd();
      await adsPage.expectInTable('Ad To Edit');
    });

    test('TC-ADS-029 - Edit ad priority', async ({ loggedInPage }) => {
      const adsPage = new AdsPage(loggedInPage);
      await adsPage.goto();
      const rows = await adsPage.getTableRows();
      const targetRow = rows.filter({ hasText: 'Ad To Edit' }).first();
      await adsPage.clickEdit(targetRow);
      await adsPage.fillPriority('5');
      await adsPage.clickSaveAd();
      await adsPage.expectInTable('Ad To Edit');
    });

    test('TC-ADS-030 - Edit ad start date', async ({ loggedInPage }) => {
      const adsPage = new AdsPage(loggedInPage);
      await adsPage.goto();
      const rows = await adsPage.getTableRows();
      const targetRow = rows.filter({ hasText: 'Ad To Edit' }).first();
      await adsPage.clickEdit(targetRow);
      await adsPage.fillStartDate('2026-03-01');
      await adsPage.clickSaveAd();
      await adsPage.expectInTable('Ad To Edit');
    });

    test('TC-ADS-031 - Edit ad end date', async ({ loggedInPage }) => {
      const adsPage = new AdsPage(loggedInPage);
      await adsPage.goto();
      const rows = await adsPage.getTableRows();
      const targetRow = rows.filter({ hasText: 'Ad To Edit' }).first();
      await adsPage.clickEdit(targetRow);
      await adsPage.fillEndDate('2026-09-30');
      await adsPage.clickSaveAd();
      await adsPage.expectInTable('Ad To Edit');
    });

    test('TC-ADS-032 - Edit open in app webview setting', async ({ loggedInPage }) => {
      const adsPage = new AdsPage(loggedInPage);
      await adsPage.goto();
      const rows = await adsPage.getTableRows();
      const targetRow = rows.filter({ hasText: 'Ad To Edit' }).first();
      await adsPage.clickEdit(targetRow);
      await adsPage.setOpenInAppWebview(false);
      await adsPage.clickSaveAd();
      await adsPage.expectInTable('Ad To Edit');
    });

    test('TC-ADS-033 - Cancel ad edit returns to list without changes', async ({ loggedInPage }) => {
      const adsPage = new AdsPage(loggedInPage);
      await adsPage.goto();
      const rows = await adsPage.getTableRows();
      const targetRow = rows.filter({ hasText: 'Ad To Edit' }).first();
      await adsPage.clickEdit(targetRow);
      await adsPage.fillTitle('Should Not Be Saved');
      await adsPage.clickCancel();
      await adsPage.expectUrl(/\/ads$/);
      await adsPage.expectNotInTable('Should Not Be Saved');
      await adsPage.expectInTable('Ad To Edit');
    });

    test('TC-ADS-034 - Edit ad with empty title shows error', async ({ loggedInPage }) => {
      const adsPage = new AdsPage(loggedInPage);
      await adsPage.goto();
      const rows = await adsPage.getTableRows();
      const targetRow = rows.filter({ hasText: 'Ad To Edit' }).first();
      await adsPage.clickEdit(targetRow);
      await adsPage.fillTitle('');
      await adsPage.clickSaveAd();
      await adsPage.expectValidationError();
    });

    test('TC-ADS-035 - Edit ad with empty destination URL shows error', async ({ loggedInPage }) => {
      const adsPage = new AdsPage(loggedInPage);
      await adsPage.goto();
      const rows = await adsPage.getTableRows();
      const targetRow = rows.filter({ hasText: 'Ad To Edit' }).first();
      await adsPage.clickEdit(targetRow);
      await adsPage.fillDestinationUrl('');
      await adsPage.clickSaveAd();
      await adsPage.expectValidationError();
    });
  });

  test.describe('Ads - Delete', () => {

    test.beforeEach(async ({ loggedInPage }) => {
      const adsPage = new AdsPage(loggedInPage);
      await adsPage.gotoNew();
      await adsPage.fillTitle('Ad To Delete');
      await adsPage.selectAdType('Banner');
      await adsPage.selectAdProvider('AdMob');
      await adsPage.selectPlatform('All');
      await adsPage.fillDestinationUrl('https://example.com/delete');
      await adsPage.clickCreateAd();
      await adsPage.expectInTable('Ad To Delete');
    });

    test('TC-ADS-036 - Delete ad from list', async ({ loggedInPage }) => {
      const adsPage = new AdsPage(loggedInPage);
      await adsPage.goto();
      const rows = await adsPage.getTableRows();
      const targetRow = rows.filter({ hasText: 'Ad To Delete' }).first();
      await adsPage.clickDelete(targetRow);
      await adsPage.confirmDelete();
      await adsPage.expectNotInTable('Ad To Delete');
    });

    test('TC-ADS-037 - Delete ad with confirmation', async ({ loggedInPage }) => {
      const adsPage = new AdsPage(loggedInPage);
      await adsPage.goto();
      const rows = await adsPage.getTableRows();
      const targetRow = rows.filter({ hasText: 'Ad To Delete' }).first();
      await adsPage.clickDelete(targetRow);
      await adsPage.confirmDelete();
      await adsPage.expectEmptyState();
    });

    test('TC-ADS-038 - Delete last ad shows empty state', async ({ loggedInPage }) => {
      const adsPage = new AdsPage(loggedInPage);
      await adsPage.goto();
      const rows = await adsPage.getTableRows();
      const targetRow = rows.filter({ hasText: 'Ad To Delete' }).first();
      await adsPage.clickDelete(targetRow);
      await adsPage.confirmDelete();
      await adsPage.expectEmptyState();
    });
  });

  test.describe('Ads - List / Navigation', () => {

    test.beforeEach(async ({ loggedInPage }) => {
      const adsPage = new AdsPage(loggedInPage);
      await adsPage.goto();
    });

    test('TC-ADS-039 - Ads list page loads correctly', async ({ loggedInPage }) => {
      const adsPage = new AdsPage(loggedInPage);
      await adsPage.goto();
      await adsPage.expectUrl(/\/ads/);
      await expect(loggedInPage.locator('table')).toBeVisible();
    });

    test('TC-ADS-040 - New Ad button navigates to create form', async ({ loggedInPage }) => {
      const adsPage = new AdsPage(loggedInPage);
      await adsPage.clickNewAd();
      await adsPage.expectUrl(/\/ads\/new/);
    });

    test('TC-ADS-041 - Search ad by title', async ({ loggedInPage }) => {
      const adsPage = new AdsPage(loggedInPage);
      await adsPage.fillTitle('Unique Search Term Ad');
      await adsPage.selectAdType('Banner');
      await adsPage.selectAdProvider('AdMob');
      await adsPage.selectPlatform('All');
      await adsPage.fillDestinationUrl('https://example.com/search');
      await adsPage.clickCreateAd();
      await adsPage.goto();
      await adsPage.search('Unique Search Term Ad');
      await adsPage.expectInTable('Unique Search Term Ad');
    });

    test('TC-ADS-042 - Filter button is clickable', async ({ loggedInPage }) => {
      const adsPage = new AdsPage(loggedInPage);
      await adsPage.clickFilter();
      // Filter panel or results should update
      await expect(loggedInPage.locator('body')).toBeVisible();
    });

    test('TC-ADS-043 - Back to Ads button returns to list', async ({ loggedInPage }) => {
      const adsPage = new AdsPage(loggedInPage);
      await adsPage.gotoNew();
      await adsPage.clickBackToAds();
      await adsPage.expectUrl(/\/ads$/);
    });

    test('TC-ADS-044 - Ads table displays rows', async ({ loggedInPage }) => {
      const adsPage = new AdsPage(loggedInPage);
      await adsPage.goto();
      const rows = await adsPage.getTableRows();
      await expect(rows.first()).toBeVisible();
    });

    test('TC-ADS-045 - Ads list is sorted by priority descending', async ({ loggedInPage }) => {
      const adsPage = new AdsPage(loggedInPage);
      // Create two ads with different priorities
      await adsPage.gotoNew();
      await adsPage.fillTitle('High Priority Ad');
      await adsPage.selectAdType('Banner');
      await adsPage.selectAdProvider('AdMob');
      await adsPage.selectPlatform('All');
      await adsPage.fillDestinationUrl('https://example.com/high');
      await adsPage.fillPriority('100');
      await adsPage.clickCreateAd();
      await adsPage.gotoNew();
      await adsPage.fillTitle('Low Priority Ad');
      await adsPage.selectAdType('Banner');
      await adsPage.selectAdProvider('AdMob');
      await adsPage.selectPlatform('All');
      await adsPage.fillDestinationUrl('https://example.com/low');
      await adsPage.fillPriority('1');
      await adsPage.clickCreateAd();
      await adsPage.goto();
      const rows = await adsPage.getTableRows();
      const firstRow = await rows.first();
      await expect(firstRow).toContainText('High Priority Ad');
    });
  });

  test.describe('Ads - Pagination', () => {

    test.beforeEach(async ({ loggedInPage }) => {
      const adsPage = new AdsPage(loggedInPage);
      // Create enough ads to test pagination
      for (let i = 1; i <= 15; i++) {
        await adsPage.gotoNew();
        await adsPage.fillTitle(`Paginated Ad ${i}`);
        await adsPage.selectAdType('Banner');
        await adsPage.selectAdProvider('AdMob');
        await adsPage.selectPlatform('All');
        await adsPage.fillDestinationUrl(`https://example.com/page${i}`);
        await adsPage.clickCreateAd();
      }
    });

    test('TC-ADS-046 - Next pagination button works', async ({ loggedInPage }) => {
      const adsPage = new AdsPage(loggedInPage);
      await adsPage.goto();
      await adsPage.clickNextPagination();
      await expect(loggedInPage.locator('table')).toBeVisible();
    });

    test('TC-ADS-047 - Previous pagination button works', async ({ loggedInPage }) => {
      const adsPage = new AdsPage(loggedInPage);
      await adsPage.goto();
      await adsPage.clickNextPagination();
      await adsPage.clickPreviousPagination();
      await expect(loggedInPage.locator('table')).toBeVisible();
    });

    test('TC-ADS-048 - Pagination updates table content', async ({ loggedInPage }) => {
      const adsPage = new AdsPage(loggedInPage);
      await adsPage.goto();
      const firstPageText = await loggedInPage.locator('table').textContent();
      await adsPage.clickNextPagination();
      const secondPageText = await loggedInPage.locator('table').textContent();
      expect(secondPageText).not.toBe(firstPageText);
    });
  });

  test.describe('Ads - Edge Cases', () => {

    test('TC-ADS-049 - Create ad with duplicate title is allowed', async ({ loggedInPage }) => {
      const adsPage = new AdsPage(loggedInPage);
      await adsPage.gotoNew();
      await adsPage.fillTitle('Duplicate Title Ad');
      await adsPage.selectAdType('Banner');
      await adsPage.selectAdProvider('AdMob');
      await adsPage.selectPlatform('All');
      await adsPage.fillDestinationUrl('https://example.com/dup1');
      await adsPage.clickCreateAd();
      await adsPage.gotoNew();
      await adsPage.fillTitle('Duplicate Title Ad');
      await adsPage.selectAdType('Interstitial');
      await adsPage.selectAdProvider('Facebook');
      await adsPage.selectPlatform('Android');
      await adsPage.fillDestinationUrl('https://example.com/dup2');
      await adsPage.clickCreateAd();
      await adsPage.expectInTable('Duplicate Title Ad');
    });

    test('TC-ADS-050 - Ad list page handles no results gracefully', async ({ loggedInPage }) => {
      const adsPage = new AdsPage(loggedInPage);
      await adsPage.goto();
      await adsPage.search('NonExistentAdTitleXYZ123');
      // Should either show empty state or no matching rows
      const tableText = await loggedInPage.locator('table').textContent();
      expect(tableText).not.toMatch(/NonExistentAdTitleXYZ123/);
    });
  });
});
