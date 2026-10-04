# GeetaVerse Kids: QC report

## Status update (after the navigation, layout, audio, honesty and privacy fixes)

_Re-run on 2026-10-04 at commit `6e06058`: all 108 tests passed at phone, tablet and laptop widths (23.4 minutes). The screenshots and findings in this folder are from this run. The original report follows below, unchanged; the table marks what has been fixed since._

| # | Problem | Status |
|---|---|---|
| 1 | Back button leaves the app | ✅ Fixed: Back and Forward move between app screens. Back from a Reward screen returns to where the quest started, without replaying the celebration. |
| 2 | Refresh loses the child's place | ✅ Fixed: the screen, quest step and opened wisdom leaf are restored. Corrupted or blocked storage falls back safely. |
| 3 | Map hides Quest 1 and is cluttered on phones | ✅ Fixed: phones and tablets get a winding trail with full names, and the companion shows as an "is here" chip. The laptop map is re-plotted with full names and the companion above the next node. |
| 4 | Story stage doesn't fit on phones | ✅ Fixed: two-column grid, and names wrap inside their cards. |
| 5 | Wisdom step scrolls inside its own card | ✅ Fixed: the lesson is part of the page and comes before Next. |
| 6 | Small buttons | ✅ Fixed: every button is at least 44×44px. The Level button shows the current level and asks before changing it. |
| 7 | Fake chant bonus / "Listening…" | ✅ Fixed: no bonus or "saved" claims, and the button now says "Say it out loud!" with no microphone icon. |
| 8 | Replay says "You Unlocked" again | ✅ Fixed: a replay says "Great practice!" and skips the unlock animation. |
| 9 | Constant bouncing | ✅ Fixed: the bounce stops after 4 seconds, and reduced-motion settings are respected. |
| 10 | Garden Chimes leak audio | ✅ Fixed: the chimes reuse the app's single audio engine, and a test checks it stays at one over 30 seconds. |
| 11 | App stuck if audio can't start | ✅ Fixed: any audio failure turns sound off and the app stays fully playable, with a small "Sound is off" note. Tested with five failure modes. |
| 12 | Refresh on the Reward screen skips the celebration | ✅ Fixed: the Reward screen is restored. |
| 13 | Literal `**` and developer footer | ✅ Fixed: the footer is removed, and "Parent Corner" is a plain heading with no `**` anywhere. |
| 14 | Fonts need internet | ✅ Fixed: fonts load without blocking, with rounded system-font fallbacks. Before this, a hung font request left the built page blank for over 8 seconds; now it appears in about 0.1 s. |

New strict tests guard the fixes:
- `qc/navigation.spec.ts`: Back/Forward, refresh, corrupted storage and replay.
- `qc/layout.spec.ts`: map overlaps and full names, story stage, Wisdom step, 44px buttons, buttons or text pushed off-screen, names split mid-word, the level confirmation, the bounce, and reduced motion.
- `qc/audio.spec.ts`: five audio failure modes played through to quest 1's reward, the chimes audio engine count, hung and blocked Google Fonts, chant wording, and stray asterisks.

All 14 problems from the original report are now fixed.

### Privacy and offline claims

- **No third-party requests:** the fonts are now self-hosted (`src/assets/fonts`, OFL-licensed). `qc/privacy.spec.ts` plays through every screen of the production build and fails on any request that doesn't go to the app's own server. It also scans the build for outside addresses; the only ones are XML namespace names, React's error-docs link and a licence comment, none of which are ever requested.
- **Speech:** narration only ever uses voices that run on the device (`localService: true`). Cloud voices, and the browser's default voice (which may be a cloud voice), are never used, so the spoken text, including the child's name, never leaves the device. The app waits up to 1.5 seconds for voices to load. If no on-device voice exists, it doesn't speak at all: the text stays on screen, a read-along note appears, and everything remains playable. If an on-device voice turns up later, narration resumes with it. `qc/narration.spec.ts` checks this with a fake speech engine: `speak()` is never called when only cloud voices exist (immediately or loading late) or when there are no voices, and only the on-device voice is used when one exists.
- **Wording:** the landing page no longer claims "offline-first", because the app needs a connection to load. It now says "Progress is saved only on this device". The profile page's "no tracking" is accurate: there's no analytics, no cookies, no accounts and no third-party requests, and progress is stored only in the browser's local storage on that device.
- **Still to know:** whoever hosts the app sees normal web-server logs (visitors' IP addresses), as with any website. Nothing else leaves the device.

The tests now also include `qc/privacy.spec.ts` (third-party requests, the build scan, self-hosted fonts in use, and the privacy wording) and `qc/narration.spec.ts` (on-device voices only).

---

## Original report

_Run on 2026-10-04 against branch `claude/reward-pipeline` (commit `17cbd78`), using `npm run qc`. Nothing was fixed._

The automated run played the whole app (onboarding, all 10 quests in order, every Reward screen, the Sanctuary, the Knowledge River, the map, and replay/reset) at three widths: phone (390px), tablet (768px) and laptop (1280px). Separate tests covered refreshing, the Back button and five audio-failure cases. All 27 test runs completed. The findings below come from the recorded checks (`findings/*.json`) and from looking at the 110 screenshots in `screenshots/<width>/`.

## What works

- **Rewards:** each of the 10 quests unlocks its own decoration at every width. The Reward screen name, the Sanctuary list name and the Sanctuary detail all match the quest's reward. No quest unlocked anything twice or nothing.
- **Progression:** quests unlock in order, XP goes up by 50 per quest, and tree health goes up by 10%.
- **Normal play is clean:** there were no JavaScript errors, no React warnings, no broken images and no sideways page scrolling at any width.
- **Other checks:** the empty-name check works. "Restart from Beginning" clears progress. With speech narration unavailable, the app still works, silently.

## Problems, ranked by how likely a child is to hit them

| # | Problem | Who hits it | Evidence |
|---|---|---|---|
| 1 | **The Back button leaves the app.** The app doesn't use browser history, so Back (or Android's back gesture, or an iPad swipe) from any screen exits to the previous page. Pressing Forward reloads the app at the landing page. | Almost every child, the first time they use Back to "go back a step" | `back` test, all widths |
| 2 | **Refreshing or reopening always starts at the landing page.** Completed quests are saved, but a quest in progress is lost, and the child has to tap Start → Home → quest again. Tablets often reload background tabs, so this happens without anyone pressing refresh. | Very likely on tablets and phones | `refresh-01/02` screenshots |
| 3 | **The map hides the first quest and is cluttered on phones.** At every width, the companion (Gaja, Veeru, etc.) stands right on top of the Quest 1 button, which is the only unlocked button for a new player. On phones, quest labels overlap each other and the terrain labels (quests 1/2, 3/4, 9/10). The "Tap any unlocked node" hint covers the Quest 3 button. Labels read "Quest 1: The", "Quest 2: The", "Quest 7: The". The dotted path doesn't connect the buttons. Taps still work, because the overlays let clicks through. | Every new player; worst on phones | `06-map-new-player.jpg` (all widths) |
| 4 | **The story stage doesn't fit on phones.** In step 1 of quests with 4 characters (quest 1), Krishna is cut off at the right edge, "KING DHRITARASHTRA" spills out of its card, and the stage label is truncated to "DHRITA.". | Every phone player, quest 1 | `phone/07-q1-step1-story.jpg` |
| 5 | **The Wisdom step scrolls inside its own card on phones.** The card is limited to 82% of the screen and has its own scrollbar. The lesson and analogy sit below the card's fold, and the page's "Next" button is visible straight away, so it's easy to skip the actual lesson. | Most phone players | `phone/09-q1-step2-wisdom-and-chant.jpg` |
| 6 | **Small buttons for small fingers.** The "Mode" difficulty button is **21px tall**, and tapping it silently changes the difficulty level. "Restart from Beginning" is 29px, "Chant Verse" 32px, and "Exit Quest" and "Narration ON" 34–38px. The usual minimum is 44px. | Likely, especially younger children | `small-tap-target` findings |
| 7 | **The chant practice gives a fake bonus.** It shows "Bonus +50 XP Earned!", but XP stays at exactly 50 after quest 1. "Tap & Chant → Listening…" doesn't use the microphone; it always succeeds after 2.4 s. | Any child who tries chanting, if they check their XP | playthrough XP check, `09-q1-step2-…` |
| 8 | **Replaying a quest says "You Unlocked" again.** Replaying a finished quest gives no XP (correct), but the Reward screen still celebrates "You Unlocked: 🪔 Wisdom Lamp!" and plays the unlock animation for something they already have. | Children who replay favourites | `replay-reset-01-replay-q1-reward.jpg` |
| 9 | **Unlocked quest buttons bounce constantly.** The next quest's button never stops bouncing. That's fine for attention, but harder to tap accurately for young children or those with motor difficulties. There is no reduced-motion setting. | Mild, frequent | `moving-target` findings |
| 10 | **Garden Chimes leak audio.** Playing the Sanctuary chimes creates a new audio engine every 1.4 s (10 in 15 seconds) and never closes them. They stop when you leave the Sanctuary. On long sessions, Safari in particular may stop playing sounds. | Only if chimes are left on | `chimes` test |
| 11 | **The whole app stops if audio can't start.** If the browser has no Web Audio, or creating an audio context fails, **"Start Adventure" does nothing**: the click sound throws an error before the screen changes. If autoplay rules block sound, the app still works but logs errors. | Unlikely on modern devices, but a complete block when it happens | `audio-missing` / `audio-throws` screenshots |
| 12 | **Refreshing on the Reward screen loses the celebration.** The quest is already saved, but the crystal and unlock animation is skipped. | Unlikely | `refresh` test |
| 13 | **Cosmetic text problems.** The Knowledge River footer shows "\*\*Parent Corner\*\*" with literal asterisks. Every screen ends with a developer footer ("Offline-First Sandbox \| Built Beautifully with Custom Synthesized Audio…"). | Seen by everyone; harmless | `29-knowledge-river.jpg` |
| 14 | **Fonts need internet.** The fonts load from Google, so without internet (or on a filtered school network) the app falls back to plain system fonts. That's how they looked in this test environment, and everything stayed readable. | Only offline or on filtered networks | `request-failed` findings |

## What this QC did not cover

- **Real devices:** it only used Chromium with phone and tablet emulation. Safari (iPad and iPhone) is where audio and speech differ most, so a real-device check is worth doing.
- **Sound:** it confirmed that sound and speech calls run without crashing, but nobody listened to how the narration voices sound.

## Re-running

Run `npm run qc`. It starts the dev server itself. On a new machine, run `npx playwright install chromium` once first. The run takes about 13 minutes, and the screenshots and findings in `qc-report/` are overwritten each time.
