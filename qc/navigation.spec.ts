import { test, expect, Page } from '@playwright/test';
import { QUESTS } from '../src/quests';
import { GAME_STATE_KEY, SESSION_KEY } from '../src/session';
import { Recorder, readState, seedProgress } from './helpers';

// Back/forward, refresh and replay behaviour. Unlike app.spec.ts these are
// strict: any failure here is a regression.

const next = (page: Page) => page.getByRole('button', { name: /Next Step/ });
const stepBadge = (page: Page, text: RegExp) => page.locator('#quest-play-wrapper main').getByText(text).first();

async function toStep(page: Page, questId: number, step: number) {
  const quest = QUESTS[questId - 1];
  for (let current = 1; current < step; current++) {
    if (current === 2 && (await page.getByRole('button', { name: /Tap to Unveil/ }).count())) {
      await page.getByRole('button', { name: /Tap to Unveil/ }).click();
    }
    if (current === 4) {
      const right = quest.challengeStep.options.find((o) => o.isCorrect)!;
      await page.locator('button', { hasText: right.text.slice(0, 40) }).click();
    }
    await next(page).click({ force: true });
    await page.waitForTimeout(400);
  }
}

async function finishQuest(page: Page, questId: number) {
  await toStep(page, questId, 5);
  await page.getByRole('button', { name: /Grow Wisdom Tree/ }).click();
  await page.waitForSelector('#reward-screen-wrapper');
}

function expectNoCrashes(rec: Recorder) {
  const crashes = rec.findings.filter((f) => f.kind === 'uncaught-exception');
  expect(crashes, JSON.stringify(crashes)).toHaveLength(0);
}

test('back button moves between app screens', async ({ page }, info) => {
  const rec = new Recorder(page, info, 'nav-back');
  await seedProgress(page, 1);
  await page.locator('#btn-start-adventure').click();
  await page.waitForSelector('#home-screen-bg');
  await page.getByRole('button', { name: /World Map/ }).click();
  await page.waitForSelector('#world-map-screen');
  await page.locator('#quest-node-2').click({ force: true });
  await page.waitForSelector('#quest-play-wrapper');
  await toStep(page, 2, 2);
  await expect(stepBadge(page, /Wisdom Scroll/)).toBeVisible();

  // Back walks through the app's own screens
  await page.goBack();
  await expect(page.locator('#world-map-screen')).toBeVisible();
  await page.goBack();
  await expect(page.locator('#home-screen-bg')).toBeVisible();
  await page.goBack();
  await expect(page.locator('#landing-screen')).toBeVisible();
  await rec.capture('back-to-landing', { audit: false });

  // Forward returns, and the quest resumes where it was left
  await page.goForward();
  await expect(page.locator('#home-screen-bg')).toBeVisible();
  await page.goForward();
  await expect(page.locator('#world-map-screen')).toBeVisible();
  await page.goForward();
  await expect(page.locator('#quest-play-wrapper')).toBeVisible();
  await expect(stepBadge(page, /Wisdom Scroll/)).toBeVisible();

  // Exit Quest goes back to where the quest was started (the map)
  await page.getByRole('button', { name: /Exit Quest/ }).click();
  await expect(page.locator('#world-map-screen')).toBeVisible();

  // Back from the Reward screen skips the finished quest and the celebration
  await page.locator('#quest-node-2').click({ force: true });
  await page.waitForSelector('#quest-play-wrapper');
  await finishQuest(page, 2);
  await page.goBack();
  await expect(page.locator('#world-map-screen')).toBeVisible();
  await expect(page.locator('#quest-play-wrapper')).toHaveCount(0);
  await page.goForward();
  await page.waitForTimeout(800);
  await expect(page.locator('#reward-screen-wrapper')).toHaveCount(0);
  expect((await readState(page)).xp).toBe(100);
  rec.save();
  expectNoCrashes(rec);
});

test('back from Home after creating a profile goes to the landing page', async ({ page }, info) => {
  const rec = new Recorder(page, info, 'nav-onboarding');
  await page.goto('/');
  await page.locator('#btn-start-adventure').click();
  await page.getByPlaceholder(/magical name/).fill('Tester');
  await page.getByRole('button', { name: /Save & Enter/ }).click();
  await page.waitForSelector('#home-screen-bg');
  await page.goBack();
  await expect(page.locator('#landing-screen')).toBeVisible();
  await expect(page.locator('#avatar-creation-screen')).toHaveCount(0);
  rec.save();
  expectNoCrashes(rec);
});

test('refresh returns the child to where they were', async ({ page }, info) => {
  const rec = new Recorder(page, info, 'nav-refresh');
  await seedProgress(page, 2);
  await page.locator('#btn-start-adventure').click();
  await page.getByRole('button', { name: /START ADVENTURE/ }).click();
  await page.waitForSelector('#quest-play-wrapper');

  // Mid-quest, with the wisdom leaf already opened
  await toStep(page, 3, 2);
  await page.getByRole('button', { name: /Tap to Unveil/ }).click();
  await page.reload();
  await expect(page.locator('#quest-play-wrapper')).toBeVisible();
  await expect(stepBadge(page, /Wisdom Scroll/)).toBeVisible();
  await expect(page.getByRole('button', { name: /Tap to Unveil/ })).toHaveCount(0);
  await rec.capture('after-refresh-q3-step2', { audit: false });

  await next(page).click();
  await expect(stepBadge(page, /School Arena/)).toBeVisible();
  await page.reload();
  await expect(stepBadge(page, /School Arena/)).toBeVisible();

  // Back still works after a refresh and leaves the quest for Home
  await page.goBack();
  await expect(page.locator('#home-screen-bg')).toBeVisible();

  // Other screens survive a refresh too
  await page.getByRole('button', { name: /World Map/ }).click();
  await page.reload();
  await expect(page.locator('#world-map-screen')).toBeVisible();
  await page.getByRole('button', { name: /Back To Camp/ }).click();
  await page.getByRole('button', { name: /Wisdom Tree/ }).first().click();
  await page.reload();
  await expect(page.locator('#sanctuary-screen')).toBeVisible();

  // Refresh on the Reward screen keeps the celebration without double XP
  await page.getByRole('button', { name: /Back To Camp/ }).click();
  await page.getByRole('button', { name: /START ADVENTURE/ }).click();
  await finishQuest(page, 3);
  await page.reload();
  await expect(page.locator('#reward-screen-wrapper')).toBeVisible();
  await page.getByRole('button', { name: /Launch Crystal/ }).click();
  await expect(page.locator('h3').filter({ hasText: 'You Unlocked' })).toBeVisible({ timeout: 6000 });
  const state = await readState(page);
  expect(state.completedQuests).toEqual([1, 2, 3]);
  expect(state.xp).toBe(150);
  rec.save();
  expectNoCrashes(rec);
});

test('missing or corrupted saved data never crashes', async ({ page }, info) => {
  const rec = new Recorder(page, info, 'nav-corrupt');
  const profile = { avatar: 'girl', avatarName: 'Tester', companion: 'gauri', xp: 50, completedQuests: [1], treeHealth: 10, lastPlayed: '' };
  const cases: Array<{ name: string; game: string | null; session: string | null; expect: string }> = [
    { name: 'not JSON at all', game: '{not json', session: 'garbage', expect: '#landing-screen' },
    { name: 'wrong types', game: JSON.stringify({ ...profile, completedQuests: 'abc', xp: 'lots' }), session: JSON.stringify({ screen: 'quest', questId: 99 }), expect: '#home-screen-bg' },
    { name: 'unknown screen', game: JSON.stringify(profile), session: JSON.stringify({ screen: 'dragon-lair' }), expect: '#landing-screen' },
    { name: 'locked quest', game: JSON.stringify(profile), session: JSON.stringify({ screen: 'quest', questId: 7, questStep: 3 }), expect: '#home-screen-bg' },
    { name: 'bad quest step', game: JSON.stringify(profile), session: JSON.stringify({ screen: 'quest', questId: 2, questStep: 42 }), expect: '#quest-play-wrapper' },
    { name: 'reward for an unfinished quest', game: JSON.stringify(profile), session: JSON.stringify({ screen: 'reward', reward: { questId: 5 } }), expect: '#home-screen-bg' },
    { name: 'session without a profile', game: null, session: JSON.stringify({ screen: 'sanctuary' }), expect: '#landing-screen' },
    { name: 'unknown companion', game: JSON.stringify({ ...profile, companion: 'dragon' }), session: JSON.stringify({ screen: 'home' }), expect: '#landing-screen' }
  ];
  await page.goto('/');
  for (const c of cases) {
    await page.evaluate(({ c, gameKey, sessionKey }) => {
      localStorage.clear();
      if (c.game !== null) localStorage.setItem(gameKey, c.game);
      if (c.session !== null) localStorage.setItem(sessionKey, c.session);
    }, { c, gameKey: GAME_STATE_KEY, sessionKey: SESSION_KEY });
    await page.reload();
    await expect(page.locator(c.expect), c.name).toBeVisible();
  }
  rec.save();
  expectNoCrashes(rec);
});

test('app works when storage is blocked', async ({ page }, info) => {
  const rec = new Recorder(page, info, 'nav-no-storage');
  await page.addInitScript(() => {
    // e.g. some private-browsing modes
    Storage.prototype.getItem = () => { throw new DOMException('Blocked', 'SecurityError'); };
    Storage.prototype.setItem = () => { throw new DOMException('Blocked', 'SecurityError'); };
  });
  await page.goto('/');
  await page.locator('#btn-start-adventure').click();
  await page.getByPlaceholder(/magical name/).fill('Tester');
  await page.getByRole('button', { name: /Save & Enter/ }).click();
  await expect(page.locator('#home-screen-bg')).toBeVisible();
  rec.save();
  expectNoCrashes(rec);
});

test('replaying a finished quest skips the unlock celebration', async ({ page }, info) => {
  const rec = new Recorder(page, info, 'nav-replay');
  await seedProgress(page, 10);
  await page.locator('#btn-start-adventure').click();
  await page.getByRole('button', { name: /World Map/ }).click();
  await page.locator('#quest-node-1').click({ force: true });
  await page.waitForSelector('#quest-play-wrapper');
  await toStep(page, 1, 5);
  await expect(page.getByText('Quest Complete Again!')).toBeVisible();
  await page.getByRole('button', { name: /Grow Wisdom Tree/ }).click();
  await page.waitForSelector('#reward-screen-wrapper');
  await page.waitForTimeout(800);
  await rec.capture('replay-reward', { audit: false });

  await expect(page.getByText('Great practice!')).toBeVisible();
  await expect(page.getByText(/You Unlocked/)).toHaveCount(0);
  await expect(page.getByRole('button', { name: /Launch Crystal/ })).toHaveCount(0);
  await expect(page.getByRole('button', { name: /Open World Map/ })).toBeEnabled();
  const state = await readState(page);
  expect(state.xp).toBe(500);
  expect(state.completedQuests).toHaveLength(10);

  // Restart from Beginning still clears everything
  await page.getByRole('button', { name: /Open World Map/ }).click();
  await page.getByRole('button', { name: /Back To Camp/ }).click();
  page.once('dialog', (d) => d.accept());
  await page.getByRole('button', { name: /Restart from Beginning/ }).click();
  await expect(page.locator('#landing-screen')).toBeVisible();
  expect(await readState(page)).toBeNull();
  rec.save();
  expectNoCrashes(rec);
});
