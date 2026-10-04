import { test, expect, Page } from '@playwright/test';
import { QUESTS } from '../src/quests';
import { DECORATIONS } from '../src/decorations';
import { Recorder, DECORATION_GROUP_ID, readState, seedProgress } from './helpers';
import { checkMapNodes, checkStoryStage, checkWisdomStep } from './layoutChecks';

// Full QC pass. Fails only on hard breakages; everything else is recorded as
// a finding in qc-report/findings/ for the written report.

const PROFILE: Record<string, { companion: string; age: RegExp }> = {
  phone: { companion: 'Veeru', age: /Explorer/ },
  tablet: { companion: 'Gauri', age: /Seeker/ },
  laptop: { companion: 'Gaja', age: /Guide/ }
};

async function decorationsInTree(page: Page, scope: string) {
  return page.locator(`${scope} svg [id^="dec-"]`).evaluateAll((els) => els.map((e) => e.id));
}

async function playQuest(page: Page, rec: Recorder, questId: number, opts: { screenshots: boolean }) {
  const quest = QUESTS[questId - 1];
  const next = page.getByRole('button', { name: /Next Step/ });
  await page.waitForSelector('#quest-play-wrapper');
  if (opts.screenshots) {
    await rec.capture(`q${questId}-step1-story`);
    await checkStoryStage(page, rec);
  }

  await rec.tap(next, `q${questId} Next (story)`);
  if (opts.screenshots) await rec.capture(`q${questId}-step2-leaf`);
  await rec.tap(page.getByRole('button', { name: /Tap to Unveil/ }), `q${questId} unveil leaf`);
  if (opts.screenshots) {
    await rec.tap(page.getByRole('button', { name: /Practice Chanting/ }), 'chant lab');
    await rec.tap(page.getByRole('button', { name: /My turn to chant/ }), 'My turn to chant');
    await page.waitForTimeout(2800);
    await rec.capture(`q${questId}-step2-wisdom-and-chant`);
    await checkWisdomStep(page, rec);
  }

  await rec.tap(next, `q${questId} Next (wisdom)`);
  if (opts.screenshots) await rec.capture(`q${questId}-step3-example`);
  await rec.tap(next, `q${questId} Next (example)`);

  const wrong = quest.challengeStep.options.find((o) => !o.isCorrect)!;
  const right = quest.challengeStep.options.find((o) => o.isCorrect)!;
  if (opts.screenshots) {
    await rec.tap(page.locator('button', { hasText: wrong.text.slice(0, 40) }), `q${questId} wrong answer`);
    await expect(page.getByText(/Solve Challenge first/)).toBeVisible();
    await rec.capture(`q${questId}-step4-wrong-answer`);
  }
  await rec.tap(page.locator('button', { hasText: right.text.slice(0, 40) }), `q${questId} correct answer`);
  if (opts.screenshots) await rec.capture(`q${questId}-step4-correct-answer`);
  await rec.tap(next, `q${questId} Next (challenge)`);

  // Step 5 names the reward item
  const step5Item = await page.locator('h4').filter({ hasText: quest.rewardItem })
    .waitFor({ timeout: 3000 }).then(() => 1, () => 0);
  if (step5Item === 0) rec.add('reward-mismatch', `Quest ${questId} step 5 doesn't show "${quest.rewardItem}"`, `q${questId}-step5`);
  if (opts.screenshots) await rec.capture(`q${questId}-step5-reward`);
  await rec.tap(page.getByRole('button', { name: /Grow Wisdom Tree/ }), `q${questId} Grow Wisdom Tree`);
}

async function checkRewardScreen(page: Page, rec: Recorder, questId: number, expectNew: boolean) {
  const decoration = DECORATIONS.find((d) => d.questId === questId)!;
  const quest = QUESTS[questId - 1];
  await page.waitForSelector('#reward-screen-wrapper');
  rec.setScreen(`reward-q${questId}`);
  await page.waitForTimeout(600);
  const before = await decorationsInTree(page, '#tree-preview-reward');
  await rec.tap(page.getByRole('button', { name: /Launch Crystal/ }), `q${questId} launch crystal`);
  const unlockedText = page.locator('h3').filter({ hasText: 'You Unlocked' });
  await unlockedText.waitFor({ timeout: 8000 });
  const after = await decorationsInTree(page, '#tree-preview-reward');
  const added = after.filter((id) => !before.includes(id));
  const expectedId = DECORATION_GROUP_ID[decoration.art];

  if (expectNew) {
    if (added.length !== 1 || added[0] !== expectedId) {
      rec.add('decoration-unlock', `Quest ${questId}: expected ${expectedId} to appear, got [${added.join(', ')}]`);
    }
  } else if (added.length > 0) {
    rec.add('decoration-unlock', `Replayed quest ${questId}: unexpected new decorations [${added.join(', ')}]`);
  }
  const text = (await unlockedText.textContent()) || '';
  if (!text.includes(decoration.name) || decoration.name !== quest.rewardItem) {
    rec.add('reward-mismatch', `Quest ${questId} Reward screen says "${text.trim()}", expected "${quest.rewardItem}"`);
  }
  await expect(page.getByRole('button', { name: /Open World Map/ })).toBeEnabled({ timeout: 4000 });
  return text.trim();
}

async function checkSanctuary(page: Page, rec: Recorder, completed: number, name: string) {
  await page.waitForSelector('#sanctuary-screen');
  await rec.capture(name);
  const inTree = await decorationsInTree(page, '#sanctuary-screen');
  for (const d of DECORATIONS) {
    // Item rows only (the header also has a "Play Garden Chimes" button)
    const row = page.locator('#sanctuary-screen main button', { hasText: d.name }).filter({ hasText: `Quest ${d.questId}:` });
    const rowCount = await row.count();
    const unlocked = d.questId <= completed;
    if (rowCount !== 1) {
      rec.add('reward-mismatch', `Sanctuary has ${rowCount} rows named "${d.name}" (quest ${d.questId})`);
      continue;
    }
    const active = (await row.textContent())?.includes('Active') ?? false;
    if (active !== unlocked) rec.add('decoration-unlock', `Sanctuary row "${d.name}" active=${active}, expected ${unlocked}`);
    const drawn = inTree.includes(DECORATION_GROUP_ID[d.art]);
    if (drawn !== unlocked) rec.add('decoration-unlock', `Sanctuary tree: ${d.name} drawn=${drawn}, expected ${unlocked}`);
    if (unlocked) {
      await rec.tap(row, `Sanctuary row ${d.name}`);
      // Wait for the detail pane to swap in
      const opened = await page.locator('#sanctuary-screen h4', { hasText: d.name })
        .waitFor({ timeout: 3000 }).then(() => true, () => false);
      const heading = (await page.locator('#sanctuary-screen h4').first().textContent())?.trim();
      if (!opened) rec.add('reward-mismatch', `Tapping Sanctuary row "${d.name}" opened "${heading}"`);
    }
  }
}

test('playthrough', async ({ page }, info) => {
  test.setTimeout(10 * 60 * 1000);
  const rec = new Recorder(page, info, 'playthrough');
  const profile = PROFILE[info.project.name];

  await page.goto('/');
  await rec.capture('landing');
  await rec.tap(page.locator('#btn-start-adventure'), 'Start Adventure');
  await rec.capture('avatar-creation');

  // Empty name is rejected
  await rec.tap(page.getByRole('button', { name: /Save & Enter/ }), 'Save (empty name)');
  await expect(page.getByText(/What is your magical name/)).toBeVisible();
  await rec.capture('avatar-empty-name-error');

  // Longest allowed name, to stress the layout
  await page.getByPlaceholder(/magical name/).fill('Maximilianaaaaaa');
  await rec.tap(page.getByRole('button', { name: new RegExp(profile.companion) }), `companion ${profile.companion}`);
  await rec.tap(page.getByRole('button', { name: profile.age }), 'age group');
  await rec.capture('avatar-filled');
  await rec.tap(page.getByRole('button', { name: /Save & Enter/ }), 'Save profile');
  await page.waitForSelector('#home-screen-bg');
  await rec.capture('home-new-player');

  await rec.tap(page.getByRole('button', { name: /World Map/ }), 'World Map');
  await page.waitForSelector('#world-map-screen');
  await rec.capture('map-new-player');
  await checkMapNodes(page, rec, 0);

  const rewardTexts: Record<number, string> = {};
  for (let q = 1; q <= 10; q++) {
    // Map shows quest q unlocked and q+1 locked
    const node = page.locator(`#quest-node-${q}`);
    if ((await node.textContent())?.includes('🔒')) rec.add('progression', `Quest ${q} is still locked after completing quest ${q - 1}`, 'map');
    if (q < 10 && !(await page.locator(`#quest-node-${q + 1}`).textContent())?.includes('🔒')) {
      rec.add('progression', `Quest ${q + 1} is unlocked before quest ${q} is done`, 'map');
    }
    await rec.tap(node, `map node ${q}`);
    await playQuest(page, rec, q, { screenshots: q === 1 });
    rewardTexts[q] = await checkRewardScreen(page, rec, q, true);
    await rec.capture(`reward-q${q}`);

    const state = await readState(page);
    if (state.xp !== q * 50) rec.add('progression', `After quest ${q}, XP is ${state.xp}, expected ${q * 50}`, `reward-q${q}`);
    if (state.treeHealth !== q * 10) rec.add('progression', `After quest ${q}, tree health is ${state.treeHealth}, expected ${q * 10}`, `reward-q${q}`);

    if (q === 5 || q === 10) {
      await rec.tap(page.getByRole('button', { name: /View in Sanctuary/ }), 'View in Sanctuary');
      await checkSanctuary(page, rec, q, `sanctuary-after-q${q}`);
      if (q === 10) await rec.capture('sanctuary-item-detail');
      await rec.tap(page.getByRole('button', { name: /Back To Camp/ }), 'Sanctuary back');
      await page.waitForSelector('#home-screen-bg');
      if (q === 5) await rec.capture('home-mid-game');
      if (q === 10) {
        await rec.capture('home-all-complete');
        await rec.tap(page.getByRole('button', { name: /Knowledge River/ }), 'Knowledge River');
        await rec.capture('knowledge-river');
        const literalStars = await page.getByText(/\*\*/).count();
        if (literalStars) rec.add('content', `${literalStars} text blocks show literal ** markdown`, 'knowledge-river');
        await rec.tap(page.locator('.fixed button').first(), 'close Knowledge River');
        await rec.tap(page.getByRole('button', { name: /World Map/ }), 'World Map');
        await page.waitForSelector('#world-map-screen');
        await rec.capture('map-all-complete');
        await checkMapNodes(page, rec, 10);
      } else {
        await rec.tap(page.getByRole('button', { name: /World Map/ }), 'World Map');
        await page.waitForSelector('#world-map-screen');
      }
    } else {
      await rec.tap(page.getByRole('button', { name: /Open World Map/ }), 'Open World Map');
      await page.waitForSelector('#world-map-screen');
    }
  }

  // Reward names must agree with the Sanctuary list
  for (const d of DECORATIONS) {
    if (!rewardTexts[d.questId]?.includes(d.name)) {
      rec.add('reward-mismatch', `Reward screen for quest ${d.questId} ("${rewardTexts[d.questId]}") doesn't name Sanctuary item "${d.name}"`, 'summary');
    }
  }
  rec.save();
});
