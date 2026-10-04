import { test, expect, Page } from '@playwright/test';
import { QUESTS } from '../src/quests';
import { Recorder, seedProgress } from './helpers';

// Sound is optional: whatever goes wrong with audio, speech or fonts, a child
// can still play. These tests are strict.

function expectNoCrashes(rec: Recorder) {
  const crashes = rec.findings.filter((f) => f.kind === 'uncaught-exception');
  expect(crashes.map((c) => c.detail)).toEqual([]);
}

// From a fresh start: create a profile, play quest 1 and claim its reward
async function playFirstQuest(page: Page) {
  await page.locator('#btn-start-adventure').click();
  await expect(page.locator('#avatar-creation-screen')).toBeVisible();
  await page.getByPlaceholder(/magical name/).fill('Tester');
  await page.getByRole('button', { name: /Mayur/ }).click();
  await page.getByRole('button', { name: /Save & Enter/ }).click();
  await expect(page.locator('#home-screen-bg')).toBeVisible();
  await page.getByRole('button', { name: /START ADVENTURE/ }).click();
  await expect(page.locator('#quest-play-wrapper')).toBeVisible();

  const next = page.getByRole('button', { name: /Next Step/ });
  await next.click();
  await page.getByRole('button', { name: /Tap to Unveil/ }).click();
  await next.click();
  await next.click();
  const right = QUESTS[0].challengeStep.options.find((o) => o.isCorrect)!;
  await page.locator('button', { hasText: right.text.slice(0, 40) }).click();
  await next.click();
  await page.getByRole('button', { name: /Grow Wisdom Tree/ }).click();
  await expect(page.locator('#reward-screen-wrapper')).toBeVisible();
  await page.getByRole('button', { name: /Launch Crystal/ }).click();
  await expect(page.locator('h3').filter({ hasText: 'You Unlocked' })).toBeVisible({ timeout: 6000 });
}

const FAILURES: Array<{ name: string; note: RegExp; setup: () => void }> = [
  {
    name: 'no Web Audio at all',
    note: /Sound is off/,
    setup: () => {
      Object.defineProperty(window, 'AudioContext', { value: undefined, configurable: true });
      Object.defineProperty(window, 'webkitAudioContext', { value: undefined, configurable: true });
    }
  },
  {
    name: 'audio engine fails to start',
    note: /Sound is off/,
    setup: () => {
      const Failing = function () {
        throw new DOMException('The audio device could not be opened', 'NotSupportedError');
      };
      Object.defineProperty(window, 'AudioContext', { value: Failing, configurable: true });
    }
  },
  {
    name: 'autoplay rules refuse to start audio',
    note: /Sound is off/,
    setup: () => {
      Object.defineProperty(BaseAudioContext.prototype, 'state', { get: () => 'suspended', configurable: true });
      AudioContext.prototype.resume = () => Promise.reject(new DOMException('Autoplay blocked', 'NotAllowedError'));
    }
  },
  {
    name: 'audio breaks while playing',
    note: /Sound is off/,
    setup: () => {
      BaseAudioContext.prototype.createOscillator = () => {
        throw new DOMException('Audio device lost', 'InvalidStateError');
      };
    }
  },
  {
    name: 'no speech narration',
    note: /Voice narration isn't available/,
    setup: () => {
      Object.defineProperty(window, 'speechSynthesis', { value: undefined, configurable: true });
    }
  }
];

for (const failure of FAILURES) {
  test(`audio failure (${failure.name}): still playable, with a friendly note`, async ({ page }, info) => {
    const rec = new Recorder(page, info, `audio-${failure.name.replace(/\W+/g, '-')}`);
    await page.addInitScript(failure.setup);
    await page.goto('/');
    await playFirstQuest(page);
    await expect(page.locator('#sound-note')).toContainText(failure.note);
    await rec.capture('reward-with-sound-note', { audit: false });

    // The chimes and other sounds stay silent without errors
    await page.getByRole('button', { name: /View in Sanctuary/ }).click();
    await page.getByRole('button', { name: /Play Garden Chimes/ }).click();
    await page.waitForTimeout(3000);
    await expect(page.locator('#sound-note')).toBeVisible();

    // The note can be closed
    await page.getByRole('button', { name: 'Close sound note' }).click();
    await expect(page.locator('#sound-note')).toHaveCount(0);
    rec.save();
    expectNoCrashes(rec);
  });
}

test('no sound note when audio works', async ({ page }, info) => {
  const rec = new Recorder(page, info, 'audio-working');
  await page.goto('/');
  await playFirstQuest(page);
  await expect(page.locator('#sound-note')).toHaveCount(0);
  rec.save();
  expectNoCrashes(rec);
});

test('Garden Chimes reuse one audio engine for 30 seconds', async ({ page }, info) => {
  const rec = new Recorder(page, info, 'audio-chimes');
  await page.addInitScript(() => {
    const Original = window.AudioContext;
    const w = window as unknown as { __contexts: number; __notes: number };
    w.__contexts = 0;
    w.__notes = 0;
    window.AudioContext = class extends Original {
      constructor(...args: ConstructorParameters<typeof AudioContext>) {
        super(...args);
        w.__contexts += 1;
      }
      createOscillator() {
        w.__notes += 1;
        return super.createOscillator();
      }
    };
  });
  await seedProgress(page, 3);
  await page.locator('#btn-start-adventure').click();
  await page.getByRole('button', { name: /Wisdom Tree/ }).first().click();
  await page.waitForSelector('#sanctuary-screen');
  await page.getByRole('button', { name: /Play Garden Chimes/ }).click();
  await page.waitForTimeout(1000);

  const read = () => page.evaluate(() => {
    const w = window as unknown as { __contexts: number; __notes: number };
    return { contexts: w.__contexts, notes: w.__notes };
  });
  const start = await read();
  await page.waitForTimeout(30000);
  const end = await read();

  // Chimes kept playing (about one note every 1.4s) on the same single engine
  expect(end.notes - start.notes).toBeGreaterThanOrEqual(15);
  expect(end.contexts).toBe(start.contexts);
  expect(end.contexts).toBeLessThanOrEqual(1);
  rec.save();
  expectNoCrashes(rec);
});

test('readable when the font files never load', async ({ page }, info) => {
  const rec = new Recorder(page, info, 'fonts-hang');
  // A flaky connection that never delivers the font files
  await page.route(/\.woff2(\?|$)/, () => new Promise(() => {}));
  const started = Date.now();
  await page.goto('/', { waitUntil: 'commit' });
  await expect(page.locator('#landing-title')).toBeVisible({ timeout: 3000 });
  expect(Date.now() - started).toBeLessThan(3000);
  const font = await page.locator('#landing-title').evaluate((el) => getComputedStyle(el).fontFamily);
  expect(font).toMatch(/system-ui|sans-serif/);
  await page.locator('#btn-start-adventure').click();
  await expect(page.locator('#avatar-creation-screen')).toBeVisible();
  rec.save();
});

test('readable when the font files fail to load', async ({ page }, info) => {
  const rec = new Recorder(page, info, 'fonts-blocked');
  await page.route(/\.woff2(\?|$)/, (route) => route.abort());
  await page.goto('/');
  await expect(page.locator('#landing-title')).toBeVisible();
  const box = await page.locator('#landing-title').boundingBox();
  expect(box!.height).toBeGreaterThan(30);
  await rec.capture('landing-without-fonts', { audit: false });
  rec.save();
});

test('chant practice makes no false claims', async ({ page }, info) => {
  const rec = new Recorder(page, info, 'chant-honesty');
  await seedProgress(page, 0);
  await page.locator('#btn-start-adventure').click();
  await page.getByRole('button', { name: /START ADVENTURE/ }).click();
  await page.getByRole('button', { name: /Next Step/ }).click();
  await page.getByRole('button', { name: /Tap to Unveil/ }).click();
  await page.getByRole('button', { name: /Practice Chanting/ }).click();
  const chant = page.getByRole('button', { name: /My turn to chant/ });
  for (let line = 0; line < (QUESTS[0].chantSteps?.length ?? 0); line++) {
    await chant.click();
    await expect(page.getByRole('button', { name: /Say it out loud/ })).toBeVisible();
    await expect(page.getByText(/Listening/i)).toHaveCount(0);
    await page.waitForTimeout(2600);
  }
  await expect(page.getByText('You practised every line')).toBeVisible();
  await expect(page.getByText(/Bonus|\+\s*\d+\s*XP/)).toHaveCount(0);
  rec.save();
});

test('no stray markdown asterisks', async ({ page }, info) => {
  const rec = new Recorder(page, info, 'no-asterisks');
  await seedProgress(page, 0);
  await page.locator('#btn-start-adventure').click();
  await page.getByRole('button', { name: /Knowledge River/ }).click();
  await expect(page.getByText(/^🧑‍👩‍👧 Parent Corner$/)).toBeVisible();
  expect(await page.locator('body').innerText()).not.toContain('**');

  await page.locator('.fixed button').first().click();
  await seedProgress(page, 3);
  await page.locator('#btn-start-adventure').click();
  await page.getByRole('button', { name: /Knowledge River/ }).click();
  await page.waitForTimeout(500);
  expect(await page.locator('body').innerText()).not.toContain('**');
  rec.save();
});
