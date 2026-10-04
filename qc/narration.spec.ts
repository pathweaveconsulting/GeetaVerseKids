import { test, expect, Page } from '@playwright/test';
import { QUESTS } from '../src/quests';
import { FakeVoice, Recorder, installFakeSpeech, spokenLines } from './helpers';

// Narration privacy: only on-device voices (localService: true) may ever
// speak. Without one, nothing is spoken, a read-along note shows and the app
// stays fully playable.

const CLOUD_VOICES: FakeVoice[] = [
  { name: 'Google UK English Female', lang: 'en-GB', localService: false },
  { name: 'Google हिन्दी', lang: 'hi-IN', localService: false },
  { name: 'Microsoft Heera Online (Natural)', lang: 'en-IN', localService: false }
];
const LOCAL_VOICE: FakeVoice = { name: 'On-device English (India)', lang: 'en-IN', localService: true };

function expectNoCrashes(rec: Recorder) {
  expect(rec.findings.filter((f) => f.kind === 'uncaught-exception').map((f) => f.detail)).toEqual([]);
}

// Create a profile and play quest 1 to its reward, triggering plenty of
// narration: the Home welcome, every quest step, character taps and feedback
async function playQuestOne(page: Page) {
  await page.goto('/');
  await page.locator('#btn-start-adventure').click();
  await page.getByPlaceholder(/magical name/).fill('Tester');
  await page.getByRole('button', { name: /Save & Enter/ }).click();
  await expect(page.locator('#home-screen-bg')).toBeVisible();
  await page.waitForTimeout(2000); // the welcome line is spoken after a short delay
  await page.getByRole('button', { name: /START ADVENTURE/ }).click();

  await page.locator('#story-stage button').first().click(); // tap a character to hear them
  await page.waitForTimeout(300);
  const next = page.getByRole('button', { name: /Next Step/ });
  await next.click();
  await page.getByRole('button', { name: /Tap to Unveil/ }).click();
  await page.getByRole('button', { name: /Practice Chanting/ }).click();
  await page.getByRole('button', { name: /Listen Line/ }).click();
  await page.waitForTimeout(300);
  await next.click();
  await next.click();
  const right = QUESTS[0].challengeStep.options.find((o) => o.isCorrect)!;
  await page.locator('button', { hasText: right.text.slice(0, 40) }).click();
  await page.waitForTimeout(300);
  await next.click();
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: /Grow Wisdom Tree/ }).click();
  await page.getByRole('button', { name: /Launch Crystal/ }).click();
  await expect(page.locator('h3').filter({ hasText: 'You Unlocked' })).toBeVisible({ timeout: 6000 });
}

test('only cloud voices: speak is never called', async ({ page }, info) => {
  const rec = new Recorder(page, info, 'narration-cloud-only');
  await installFakeSpeech(page, CLOUD_VOICES);
  await playQuestOne(page);
  expect(await spokenLines(page)).toEqual([]);
  await expect(page.locator('#sound-note')).toContainText(/Voice narration isn't available/);
  rec.save();
  expectNoCrashes(rec);
});

test('cloud voices that load late: speak is never called', async ({ page }, info) => {
  const rec = new Recorder(page, info, 'narration-cloud-late');
  await installFakeSpeech(page, CLOUD_VOICES, 600);
  await playQuestOne(page);
  expect(await spokenLines(page)).toEqual([]);
  await expect(page.locator('#sound-note')).toContainText(/Voice narration isn't available/);
  rec.save();
  expectNoCrashes(rec);
});

test('no voices at all: speak is never called', async ({ page }, info) => {
  const rec = new Recorder(page, info, 'narration-no-voices');
  await installFakeSpeech(page, []);
  await playQuestOne(page);
  expect(await spokenLines(page)).toEqual([]);
  await expect(page.locator('#sound-note')).toContainText(/Voice narration isn't available/);
  rec.save();
  expectNoCrashes(rec);
});

test('an on-device voice is used when one exists', async ({ page }, info) => {
  const rec = new Recorder(page, info, 'narration-local');
  await installFakeSpeech(page, [...CLOUD_VOICES, LOCAL_VOICE]);
  await playQuestOne(page);
  const spoken = await spokenLines(page);
  expect(spoken.length).toBeGreaterThan(3);
  expect(spoken.filter((s) => s.voice !== LOCAL_VOICE.name)).toEqual([]);
  expect(spoken.some((s) => s.text.includes('Tester'))).toBe(true); // the welcome, with the name, stayed on the device
  await expect(page.locator('#sound-note')).toHaveCount(0);
  rec.save();
  expectNoCrashes(rec);
});

test('an on-device voice that loads late is waited for and used', async ({ page }, info) => {
  const rec = new Recorder(page, info, 'narration-local-late');
  await installFakeSpeech(page, [...CLOUD_VOICES, LOCAL_VOICE], 600);
  await playQuestOne(page);
  const spoken = await spokenLines(page);
  expect(spoken.length).toBeGreaterThan(3);
  expect(spoken.filter((s) => s.voice !== LOCAL_VOICE.name)).toEqual([]);
  await expect(page.locator('#sound-note')).toHaveCount(0);
  rec.save();
  expectNoCrashes(rec);
});

test('an on-device voice that arrives after the wait is picked up later', async ({ page }, info) => {
  const rec = new Recorder(page, info, 'narration-local-very-late');
  await installFakeSpeech(page, [LOCAL_VOICE], 3000);
  await page.goto('/');
  await expect(page.locator('#sound-note')).toContainText(/Voice narration isn't available/, { timeout: 2500 });
  expect(await spokenLines(page)).toEqual([]);
  // Once the voice arrives the note goes away and narration resumes, on-device only
  await expect(page.locator('#sound-note')).toHaveCount(0, { timeout: 4000 });
  await page.locator('#btn-start-adventure').click();
  await page.getByPlaceholder(/magical name/).fill('Tester');
  await page.getByRole('button', { name: /Save & Enter/ }).click();
  await expect.poll(async () => (await spokenLines(page)).length, { timeout: 4000 }).toBeGreaterThan(0);
  expect((await spokenLines(page)).every((s) => s.voice === LOCAL_VOICE.name)).toBe(true);
  rec.save();
  expectNoCrashes(rec);
});
