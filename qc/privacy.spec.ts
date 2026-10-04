import { test, expect, Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { QUESTS } from '../src/quests';
import { Recorder } from './helpers';

// Privacy and honesty checks against the production build (served by
// `vite preview` on port 4181, see playwright.config.ts)

const BUILT_APP = 'http://localhost:4181';

// Addresses that appear in the bundle but are never requested: XML namespace
// names, React's error-docs link inside error messages, a licence comment
const HARMLESS_URLS = [
  /^http:\/\/www\.w3\.org\//,
  /^https:\/\/react\.dev\/errors\//,
  /^https:\/\/tailwindcss\.com$/
];

test('the build contains no third-party addresses it could load', () => {
  const dist = path.resolve('dist');
  const found = new Set<string>();
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.(html|js|css|json|webmanifest)$/.test(entry.name)) {
        for (const m of fs.readFileSync(full, 'utf8').matchAll(/https?:\/\/[A-Za-z0-9.-]+[^"'`\s)\\]*/g)) found.add(m[0]);
      }
    }
  };
  walk(dist);
  const suspicious = [...found].filter((url) => !HARMLESS_URLS.some((ok) => ok.test(url)));
  expect(suspicious).toEqual([]);
});

// Play through every screen of the built app, recording every request
async function tourBuiltApp(page: Page) {
  await page.goto(BUILT_APP);
  await page.locator('#btn-start-adventure').click();
  await page.getByPlaceholder(/magical name/).fill('Tester');
  await page.getByRole('button', { name: /Save & Enter/ }).click();
  await expect(page.locator('#home-screen-bg')).toBeVisible();

  await page.locator('#level-button').click();
  await page.getByRole('button', { name: /^Keep/ }).click();
  await page.getByRole('button', { name: /Knowledge River/ }).click();
  await page.locator('.fixed button').first().click();
  await page.getByRole('button', { name: /World Map/ }).click();
  await page.locator('#quest-node-1').click({ force: true });

  const next = page.getByRole('button', { name: /Next Step/ });
  await next.click();
  await page.getByRole('button', { name: /Tap to Unveil/ }).click();
  await page.getByRole('button', { name: /Practice Chanting/ }).click();
  await page.getByRole('button', { name: /Listen Line/ }).click();
  await next.click();
  await next.click();
  const right = QUESTS[0].challengeStep.options.find((o) => o.isCorrect)!;
  await page.locator('button', { hasText: right.text.slice(0, 40) }).click();
  await next.click();
  await page.getByRole('button', { name: /Grow Wisdom Tree/ }).click();
  await page.getByRole('button', { name: /Launch Crystal/ }).click();
  await page.getByRole('button', { name: /View in Sanctuary/ }).click({ timeout: 8000 });
  await page.getByRole('button', { name: /Play Garden Chimes/ }).click();
  await page.waitForTimeout(2000);
  await page.reload();
  await expect(page.locator('#sanctuary-screen')).toBeVisible();
}

test('the built app makes no third-party network requests', async ({ page }, info) => {
  const rec = new Recorder(page, info, 'privacy-requests');
  const requests: string[] = [];
  page.on('request', (req) => requests.push(req.url()));
  await tourBuiltApp(page);

  const own = new URL(BUILT_APP).origin;
  const thirdParty = requests.filter((url) => !url.startsWith(own) && !url.startsWith('data:') && !url.startsWith('blob:'));
  expect(thirdParty).toEqual([]);

  // The fonts come from our own server and are actually in use
  expect(requests.some((url) => url.startsWith(own) && url.endsWith('.woff2'))).toBe(true);
  expect(await page.evaluate(() => document.fonts.check('16px Quicksand') && document.fonts.check('16px Fredoka'))).toBe(true);
  rec.save();
});

test('privacy and offline wording is accurate', async ({ page }, info) => {
  const rec = new Recorder(page, info, 'privacy-wording');
  await page.goto(BUILT_APP);
  const landing = await page.locator('body').innerText();
  expect(landing).toContain('Progress is saved only on this device');
  expect(landing.toLowerCase()).not.toContain('offline');

  await page.locator('#btn-start-adventure').click();
  await expect(page.locator('#avatar-creation-screen')).toBeVisible();
  await expect(page.locator('#landing-screen')).toHaveCount(0);
  const profile = await page.locator('body').innerText();
  expect(profile).toContain('no tracking');
  expect(profile).toContain('saved only on this device');
  expect(profile.toLowerCase()).not.toContain('offline');

  // No app text anywhere claims offline use
  const source = fs.readdirSync('src/screens').map((f) => fs.readFileSync(path.join('src/screens', f), 'utf8')).join('\n');
  expect(source.toLowerCase()).not.toMatch(/offline[- ]first|works offline/);
  rec.save();
});
