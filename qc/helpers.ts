import { Page, Locator, TestInfo } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// Everything a QC run generates goes here; it is git-ignored. The curated
// reference screenshots in qc-report/reference/ are only written by
// `npm run qc:update-reference`.
export const OUTPUT_DIR = path.resolve('qc-output');
export const STORAGE_KEY = 'geetaverse_kids_game_state_v1';

// WisdomTree's SVG group id for each decoration art key
export const DECORATION_GROUP_ID: Record<string, string> = {
  lamp: 'dec-lamp-group',
  chimes: 'dec-chimes-group',
  lotus: 'dec-plant-group',
  mat: 'dec-meditation-tree-group',
  pebbles: 'dec-pebbles-group',
  bench: 'dec-bench-group',
  leaf: 'dec-leaf-group',
  lantern: 'dec-lantern-group',
  fountain: 'dec-fountain-group',
  sapling: 'dec-sapling-group'
};

export interface Finding {
  viewport: string;
  test: string;
  screen: string;
  kind: string;
  detail: string;
}

// Collects console errors, page errors, failed requests and layout problems
// for one test, and writes them to qc-output/findings/ when done.
export class Recorder {
  findings: Finding[] = [];
  private shotIndex = 0;
  private screen = 'start';

  constructor(private page: Page, private info: TestInfo, private testName: string) {
    page.on('console', (msg) => {
      if (msg.type() === 'error') this.add('console-error', msg.text());
      if (msg.type() === 'warning' && /Warning:|React/.test(msg.text())) this.add('react-warning', msg.text());
    });
    page.on('pageerror', (err) => this.add('uncaught-exception', `${err.name}: ${err.message}`));
    page.on('requestfailed', (req) => this.add('request-failed', `${req.url()} (${req.failure()?.errorText})`));
    page.on('response', (res) => {
      if (res.status() >= 400) this.add('http-error', `${res.status()} ${res.url()}`);
    });
  }

  get viewport() {
    return this.info.project.name;
  }

  setScreen(screen: string) {
    this.screen = screen;
  }

  add(kind: string, detail: string, screen = this.screen) {
    this.findings.push({ viewport: this.viewport, test: this.testName, screen, kind, detail: detail.slice(0, 400) });
  }

  // Screenshot plus layout checks for the current screen
  async capture(name: string, opts: { audit?: boolean } = {}) {
    this.setScreen(name);
    await this.page.waitForTimeout(700); // let screen transitions settle
    const dir = path.join(OUTPUT_DIR, 'screenshots', this.viewport);
    fs.mkdirSync(dir, { recursive: true });
    this.shotIndex += 1;
    const prefix = this.testName === 'playthrough' ? '' : `${this.testName}-`;
    const file = path.join(dir, `${prefix}${String(this.shotIndex).padStart(2, '0')}-${name}.jpg`);
    await this.page.screenshot({ path: file, fullPage: true, type: 'jpeg', quality: 60 });
    if (opts.audit !== false) await this.audit();
  }

  async audit() {
    const result = await this.page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const describe = (el: Element) => {
        const id = el.id ? `#${el.id}` : '';
        const text = (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 50);
        return `<${el.tagName.toLowerCase()}${id}> "${text}"`;
      };
      const clippedByAncestor = (el: Element) => {
        let a = el.parentElement;
        while (a && a !== document.body) {
          const cs = getComputedStyle(a);
          if (/(hidden|clip|auto|scroll)/.test(cs.overflowX) || /(hidden|clip)/.test(cs.overflow)) {
            const ar = a.getBoundingClientRect();
            if (ar.right <= vw + 1 && ar.left >= -1) return true;
          }
          a = a.parentElement;
        }
        return false;
      };

      // Horizontal overflow: visible content sticking out past the viewport
      const overflow: string[] = [];
      document.querySelectorAll('body *').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return;
        if ((r.right > vw + 1 || r.left < -1) && !clippedByAncestor(el)) {
          // Report only the outermost offender
          const parent = el.parentElement?.getBoundingClientRect();
          if (parent && (parent.right > vw + 1 || parent.left < -1)) return;
          overflow.push(`${describe(el)} spans ${Math.round(r.left)}..${Math.round(r.right)}px (viewport ${vw}px)`);
        }
      });

      // Buttons and text pushed off the side of the screen, even when a wrapper hides them
      const offscreen: string[] = [];
      document.querySelectorAll('button, a, h1, h2, h3, h4, p, span').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0 || !(el.textContent || '').trim()) return;
        if (getComputedStyle(el).visibility === 'hidden' || el.closest('[aria-hidden="true"]')) return;
        if (el.closest('.pointer-events-none') && el.tagName !== 'BUTTON') return; // decorative layers
        if (r.right > vw + 1 || r.left < -1) offscreen.push(`${describe(el)} is cut off at ${Math.round(r.left)}..${Math.round(r.right)}px (viewport ${vw}px)`);
      });

      // Text that is cut off by truncation / overflow:hidden
      const clipped: string[] = [];
      document.querySelectorAll('body *').forEach((el) => {
        const he = el as HTMLElement;
        if (!he.textContent?.trim() || he.children.length > 0) return;
        const cs = getComputedStyle(he);
        if ((cs.textOverflow === 'ellipsis' || cs.overflow === 'hidden') && he.scrollWidth > he.clientWidth + 1) {
          clipped.push(`"${he.textContent.trim().slice(0, 60)}" shows ${he.clientWidth}px of ${he.scrollWidth}px`);
        }
      });

      // Broken images (the app currently draws with SVG and emoji, so usually none)
      const broken: string[] = [];
      document.querySelectorAll('img').forEach((img) => {
        if (img.complete && img.naturalWidth === 0) broken.push(img.src);
      });

      // Small tap targets (under 44px) on buttons
      const small: string[] = [];
      document.querySelectorAll('button').forEach((b) => {
        const r = b.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return;
        if (r.height < 43.5 || r.width < 43.5) small.push(`${describe(b)} is ${Math.round(r.width)}x${Math.round(r.height)}px`);
      });

      return {
        pageScrollsSideways: document.documentElement.scrollWidth > vw + 1,
        scrollWidth: document.documentElement.scrollWidth,
        vw,
        overflow,
        offscreen,
        clipped,
        broken,
        small
      };
    });
    if (result.pageScrollsSideways) this.add('horizontal-scroll', `page is ${result.scrollWidth}px wide in a ${result.vw}px viewport`);
    result.overflow.forEach((d) => this.add('layout-overflow', d));
    result.offscreen.forEach((d) => this.add('offscreen-content', d));
    result.clipped.forEach((d) => this.add('clipped-text', d));
    result.broken.forEach((d) => this.add('broken-image', d));
    result.small.forEach((d) => this.add('small-tap-target', d));
  }

  // Click like a child would; if something covers the target, record it and force the click
  async tap(locator: Locator, what: string) {
    try {
      await locator.click({ timeout: 4000 });
    } catch (e) {
      const message = String((e as Error).message);
      if (/not stable/.test(message)) {
        // Constantly animating (e.g. bouncing) targets: clickable by a person, just never still
        this.add('moving-target', `${what} never stops moving (bounce animation)`);
        await locator.click({ force: true, timeout: 4000 });
        return;
      }
      const reason = (message.split('\n').find((l) => /intercepts|not visible|outside of the viewport/.test(l)) || message.split('\n')[0]).replace(/\u001b\[\d+m/g, '');
      this.add('not-clickable', `${what}: ${reason.trim()}`);
      await locator.click({ force: true, timeout: 4000 });
    }
  }

  save() {
    const dir = path.join(OUTPUT_DIR, 'findings');
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, `${this.viewport}-${this.testName}.json`), JSON.stringify(this.findings, null, 2));
  }
}

export async function readState(page: Page) {
  return page.evaluate((key) => JSON.parse(localStorage.getItem(key) || 'null'), STORAGE_KEY);
}

// Put a saved game in place, as if the child had already played, starting
// from the landing page (any saved screen is cleared)
export async function seedProgress(page: Page, completed: number) {
  await page.goto('/');
  await page.evaluate(() => localStorage.removeItem('geetaverse_kids_session_v1'));
  await page.evaluate(
    ({ key, n }) =>
      localStorage.setItem(
        key,
        JSON.stringify({
          avatar: 'girl',
          avatarName: 'Tester',
          companion: 'mayur',
          ageGroup: 'seeker',
          xp: n * 50,
          completedQuests: Array.from({ length: n }, (_, i) => i + 1),
          treeHealth: n * 10,
          lastPlayed: new Date().toISOString()
        })
      ),
    { key: STORAGE_KEY, n: completed }
  );
  await page.reload();
}

export interface FakeVoice {
  name: string;
  lang: string;
  localService: boolean;
}

// Replace the browser's speech engine with a fake one that records every
// speak() call in window.__spoken. Voices are available immediately, or
// only after `lateMs` (announced with a voiceschanged event).
export async function installFakeSpeech(page: Page, voices: FakeVoice[], lateMs = 0) {
  await page.addInitScript(
    ({ voices, lateMs }) => {
      const w = window as unknown as { __spoken: Array<{ text: string; voice: string | null }> };
      w.__spoken = [];
      class FakeUtterance {
        text: string;
        voice: FakeVoice | null = null;
        pitch = 1;
        rate = 1;
        lang = '';
        onend: (() => void) | null = null;
        constructor(text: string) {
          this.text = text;
        }
      }
      class FakeSynth extends EventTarget {
        private available: FakeVoice[] = lateMs > 0 ? [] : voices;
        speaking = false;
        pending = false;
        paused = false;
        onvoiceschanged: (() => void) | null = null;
        constructor() {
          super();
          if (lateMs > 0) {
            setTimeout(() => {
              this.available = voices;
              this.dispatchEvent(new Event('voiceschanged'));
            }, lateMs);
          }
        }
        getVoices() {
          return this.available;
        }
        speak(u: FakeUtterance) {
          w.__spoken.push({ text: u.text, voice: u.voice ? u.voice.name : null });
        }
        cancel() {}
        pause() {}
        resume() {}
      }
      Object.defineProperty(window, 'SpeechSynthesisUtterance', { value: FakeUtterance, configurable: true });
      Object.defineProperty(window, 'speechSynthesis', { value: new FakeSynth(), configurable: true });
    },
    { voices, lateMs }
  );
}

export const spokenLines = (page: Page) =>
  page.evaluate(() => (window as unknown as { __spoken: Array<{ text: string; voice: string | null }> }).__spoken);
