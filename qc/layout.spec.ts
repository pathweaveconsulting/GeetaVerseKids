import { test, expect, Page } from '@playwright/test';
import { Recorder, readState, seedProgress } from './helpers';
import { checkMapNodes, checkNamesNotSplit, checkStoryStage, checkWisdomStep } from './layoutChecks';

// Strict layout checks at each viewport: any finding fails the test

function expectClean(rec: Recorder, kinds: string[]) {
  const found = rec.findings.filter((f) => kinds.includes(f.kind));
  expect(found.map((f) => `${f.kind}: ${f.detail}`)).toEqual([]);
}

async function openMap(page: Page, completed: number) {
  await seedProgress(page, completed);
  await page.locator('#btn-start-adventure').click();
  await page.getByRole('button', { name: /World Map/ }).click();
  await page.waitForSelector('#world-map-screen');
}

for (const completed of [0, 4, 9, 10]) {
  test(`map with ${completed} quests done: full names, nothing overlaps`, async ({ page }, info) => {
    const rec = new Recorder(page, info, `layout-map-${completed}`);
    await openMap(page, completed);
    await checkMapNodes(page, rec, completed);
    await rec.audit();
    rec.save();
    expectClean(rec, ['map-labels', 'map-overlap', 'small-tap-target', 'horizontal-scroll', 'layout-overflow', 'offscreen-content', 'uncaught-exception']);
  });
}

test('quest 1 story stage and wisdom step fit the screen', async ({ page }, info) => {
  const rec = new Recorder(page, info, 'layout-quest');
  await seedProgress(page, 0);
  await page.locator('#btn-start-adventure').click();
  await page.getByRole('button', { name: /START ADVENTURE/ }).click();
  await page.waitForSelector('#story-stage');
  await page.waitForTimeout(700);
  await checkStoryStage(page, rec);
  await checkNamesNotSplit(page, rec, 'q1-step1');
  // Krishna may be below the fold on a phone; once scrolled to, he must be fully visible (not clipped)
  const krishna = page.locator('#story-stage #portrait-art-krishna');
  await krishna.scrollIntoViewIfNeeded();
  // (0.95, not 1: the browser's intersection ratio rounds sub-pixel edges;
  // checkStoryStage above verifies the exact geometry)
  await expect(krishna).toBeInViewport({ ratio: 0.95 });
  await rec.audit();
  await page.getByRole('button', { name: /Next Step/ }).click();
  await page.getByRole('button', { name: /Tap to Unveil/ }).click();
  await page.waitForTimeout(700);
  await checkWisdomStep(page, rec);
  await checkNamesNotSplit(page, rec, 'q1-step2');
  await rec.audit();
  rec.save();
  expectClean(rec, ['story-stage', 'wisdom-step', 'split-name', 'small-tap-target', 'clipped-text', 'horizontal-scroll', 'layout-overflow', 'offscreen-content']);
});

test('every screen: buttons are at least 44px', async ({ page }, info) => {
  const rec = new Recorder(page, info, 'layout-buttons');
  await seedProgress(page, 3);
  await rec.audit(); // landing
  await page.locator('#btn-start-adventure').click();
  await page.waitForSelector('#home-screen-bg');
  await page.waitForTimeout(500);
  await rec.audit();
  await page.locator('#level-button').click();
  await rec.audit();
  await page.getByRole('button', { name: /Keep/ }).click();
  await page.getByRole('button', { name: /Knowledge River/ }).click();
  await page.waitForTimeout(500);
  await rec.audit();
  await page.locator('.fixed button').first().click();
  await page.getByRole('button', { name: /Wisdom Tree/ }).first().click();
  await page.waitForSelector('#sanctuary-screen');
  await page.waitForTimeout(500);
  await rec.audit();
  rec.save();
  expectClean(rec, ['small-tap-target', 'offscreen-content', 'layout-overflow']);
});

test('changing the level asks first and shows the current level', async ({ page }, info) => {
  const rec = new Recorder(page, info, 'layout-level');
  await seedProgress(page, 1); // seeded as Seeker
  await page.locator('#btn-start-adventure').click();
  await expect(page.locator('#level-button')).toContainText('Seeker');

  // Pick another level, then back out: nothing changes
  await page.locator('#level-button').click();
  await expect(page.locator('#level-dialog')).toContainText('You are playing as');
  await expect(page.locator('#level-dialog button', { hasText: 'Current' })).toContainText('Seeker');
  await page.locator('#level-dialog button', { hasText: 'Explorer' }).click();
  await expect(page.locator('#level-dialog')).toContainText('Switch to 🎨 Explorer?');
  await page.locator('#level-cancel').click();
  await expect(page.locator('#level-dialog')).toHaveCount(0);
  expect((await readState(page)).ageGroup).toBe('seeker');

  // Confirming switches it
  await page.locator('#level-button').click();
  await page.locator('#level-dialog button', { hasText: 'Guide' }).click();
  await page.locator('#level-confirm').click();
  await expect(page.locator('#level-button')).toContainText('Guide');
  expect((await readState(page)).ageGroup).toBe('guide');
  rec.save();
});

test('next-quest bounce stops after a few seconds', async ({ page }, info) => {
  const rec = new Recorder(page, info, 'layout-bounce');
  await openMap(page, 2);
  // Only quest 3 (the next one) bounces, then it settles
  await expect(page.locator('#world-map-screen .animate-bounce')).toHaveCount(1);
  await expect(page.locator('#quest-node-3.animate-bounce, #quest-node-3 .animate-bounce')).toHaveCount(1);
  await page.waitForTimeout(4500);
  await expect(page.locator('#world-map-screen .animate-bounce')).toHaveCount(0);
  rec.save();
});

test('reduced motion: no bouncing at all', async ({ page }, info) => {
  const rec = new Recorder(page, info, 'layout-reduced-motion');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openMap(page, 2);
  await expect(page.locator('#world-map-screen .animate-bounce')).toHaveCount(0);
  // CSS animations elsewhere are cut to a single, near-instant run
  const duration = await page.evaluate(() => {
    const el = document.querySelector('.animate-pulse, .animate-bounce, .animate-float');
    return el ? getComputedStyle(el).animationDuration : '0s';
  });
  expect(['0s', '1e-05s', '0.00001s']).toContain(duration);
  rec.save();
});

