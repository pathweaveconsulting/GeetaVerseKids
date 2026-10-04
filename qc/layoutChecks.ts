import { Page } from '@playwright/test';
import { QUESTS } from '../src/quests';
import { Recorder } from './helpers';

// Layout checks shared by the QC playthrough (which records findings) and
// layout.spec.ts (which fails on them)

export async function checkMapNodes(page: Page, rec: Recorder, completed: number) {
  // Quest circles, labels, the companion and landmarks must not sit on top of
  // each other, and every label must show the quest's full name
  await page.waitForTimeout(3200); // let the companion finish walking
  const layout = await page.evaluate(() => {
    const rect = (el: Element) => {
      const r = el.getBoundingClientRect();
      return [r.left, r.top, r.right, r.bottom];
    };
    const quests = Array.from({ length: 10 }, (_, i) => {
      const node = document.querySelector(`#quest-node-${i + 1}`)!;
      const circle = node.querySelector('[data-node-circle]') ?? node;
      const label = document.querySelector(`[data-quest-label="${i + 1}"]`)!;
      const clipped = label.scrollWidth > label.clientWidth + 1 || label.scrollHeight > label.clientHeight + 1;
      return { id: i + 1, circle: rect(circle), label: rect(label), text: (label.textContent || '').trim(), clipped };
    });
    const companionEl = document.querySelector('#companion-map-avatar');
    const companion = companionEl ? rect(companionEl) : null;
    const companionInLabel = companionEl?.closest('[data-quest-label]')?.getAttribute('data-quest-label') ?? null;
    const landmarks = Array.from(document.querySelectorAll('[data-map-landmark]')).map((el) => ({ name: (el.textContent || '').trim(), box: rect(el) }));
    return { quests, companion, companionInLabel, landmarks };
  });
  const hit = (a: number[], b: number[]) => a[0] < b[2] - 1 && b[0] < a[2] - 1 && a[1] < b[3] - 1 && b[1] < a[3] - 1;
  const { quests, companion, companionInLabel, landmarks } = layout;
  for (const q of quests) {
    const title = QUESTS[q.id - 1].title;
    if (!q.text.includes(title)) rec.add('map-labels', `Quest ${q.id} label reads "${q.text}", not the full name "${title}"`, 'map');
    if (q.clipped) rec.add('map-labels', `Quest ${q.id} label is cut off`, 'map');
  }
  for (let i = 0; i < quests.length; i++) {
    for (let j = i + 1; j < quests.length; j++) {
      const [a, b] = [quests[i], quests[j]];
      if (hit(a.circle, b.circle)) rec.add('map-overlap', `Quest ${a.id} and ${b.id} buttons overlap`, 'map');
      if (hit(a.label, b.label)) rec.add('map-overlap', `Quest ${a.id} and ${b.id} labels overlap`, 'map');
      if (hit(a.circle, b.label) || hit(b.circle, a.label)) rec.add('map-overlap', `Quest ${a.id}/${b.id}: a button overlaps the other's label`, 'map');
    }
  }
  if (companion) {
    for (const q of quests) {
      if (hit(companion, q.circle)) rec.add('map-overlap', `The companion covers the Quest ${q.id} button`, 'map');
      if (String(q.id) !== companionInLabel && hit(companion, q.label)) rec.add('map-overlap', `The companion covers the Quest ${q.id} label`, 'map');
    }
  }
  for (const l of landmarks) {
    for (const q of quests) {
      if (hit(l.box, q.circle) || hit(l.box, q.label)) rec.add('map-overlap', `Landmark "${l.name}" overlaps Quest ${q.id}`, 'map');
    }
    if (companion && hit(l.box, companion)) rec.add('map-overlap', `Landmark "${l.name}" overlaps the companion`, 'map');
  }
  void completed;
}

export async function checkStoryStage(page: Page, rec: Recorder) {
  // Every character and name on the story stage is fully inside the stage and its own tile
  const problems = await page.evaluate(() => {
    const out: string[] = [];
    const stage = document.querySelector('#story-stage')!.parentElement!.getBoundingClientRect();
    const vw = document.documentElement.clientWidth;
    document.querySelectorAll('#story-stage > button').forEach((tile) => {
      const name = (tile.textContent || '').trim();
      const t = tile.getBoundingClientRect();
      if (t.left < stage.left - 1 || t.right > stage.right + 1 || t.right > vw) out.push(`"${name}" sticks out of the stage`);
      const label = tile.querySelector('[id^="portrait-label-"] span')!;
      const l = label.getBoundingClientRect();
      if (l.left < t.left - 1 || l.right > t.right + 1) out.push(`"${name}" name is wider than its card`);
      if (label.scrollWidth > label.clientWidth + 1) out.push(`"${name}" name is cut off`);
    });
    return out;
  });
  problems.forEach((p) => rec.add('story-stage', p, 'q1-step1-story'));
}

export async function checkWisdomStep(page: Page, rec: Recorder) {
  // The lesson is part of the page scroll and comes before the Next button
  const info = await page.evaluate(() => {
    const card = document.querySelector('#wisdom-card') as HTMLElement;
    const style = getComputedStyle(card);
    const lesson = Array.from(card.querySelectorAll('span')).find((s) => s.textContent?.includes("Today's Adapted Lesson"))!;
    const nextBtn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent?.includes('Next Step'))!;
    return {
      scrolls: /(auto|scroll)/.test(style.overflowY) && card.scrollHeight > card.clientHeight + 1,
      lessonBottom: lesson.parentElement!.getBoundingClientRect().bottom + window.scrollY,
      nextTop: nextBtn.getBoundingClientRect().top + window.scrollY
    };
  });
  if (info.scrolls) rec.add('wisdom-step', 'The Wisdom card scrolls on its own instead of with the page', 'q1-step2');
  if (info.lessonBottom > info.nextTop) rec.add('wisdom-step', 'The Next button comes before the end of the lesson', 'q1-step2');
}
