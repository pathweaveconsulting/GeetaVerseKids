# GeetaVerse Kids: Repository Audit

_Audited on 2026-10-04 at commit `d936dc6`._

## Summary

GeetaVerse Kids is a client-only React 19 + Vite 6 + Tailwind 4 single-page app, exported from Google AI Studio. It has about 5.2k lines of TSX, 10 quests based on Bhagavad Gita 1.1–2.7, and progress is saved to `localStorage`. The production build succeeds, and `npm audit` reports 0 vulnerabilities in runtime dependencies.

The main risks:

1. The typecheck guards very little, because `@types/react` isn't installed.
2. Rewards and decorations stop working after quest 5.
3. The Sanctuary chimes leak audio contexts.
4. Some user-facing text promises things the app doesn't do: "+50 XP", "no tracking", "offline-first", "Listening…".
5. There are no tests, no CI, no README, and no lockfile.

| Check | Result |
|---|---|
| `npm run build` | ✅ passes (one 506 kB JS chunk, triggers the >500 kB warning) |
| `npm run lint` (`tsc --noEmit`) | ✅ passes, but only because React is untyped (see H1) |
| `tsc` with `@types/react` added | ❌ 3 errors (motion `ease` / `Variants` typing) |
| `npm audit --omit=dev` | ✅ 0 vulnerabilities |
| Tests / CI | none |

---

## High

**H1. Typecheck is effectively disabled.** `@types/react` and `@types/react-dom` are missing from `package.json`. As a result, `react` resolves to `any`, and `npm run lint` can't catch prop or JSX mistakes. When the types are added, `tsc` reports 3 real errors:
- `src/components/AvatarViewer.tsx:32`
- `src/components/CharacterPortrait.tsx:45`
- `src/components/CompanionViewer.tsx:62`

In each case, `ease: "easeInOut"` widens to `string`. `tsconfig.json` also lacks `"strict": true`.

**H2. Decorations and rewards break after quest 5.**
- In `src/App.tsx:117`, quests 6–10 map to the same 5 decoration keys as quests 1–5. Quests 6–10 never unlock anything new.
- In `src/screens/RewardPage.tsx`, the "before" decoration list and the new item key are derived from `quest.id` rather than from the saved state. The key map only covers 1–5, so for quests 6–10 the fallback is `'lamp'`. The Reward screen then animates a decoration that was already owned.
- The item names don't line up across screens. The quest's `rewardItem` is "Garden Chimes", "Lotus Pond", "Sunset Bench" and so on, but the Sanctuary's `DECORATION_DETAILS` lists "Patience Lotus Plant", "Wisdom Scroll Shelf" and others. A child is told "You unlocked Garden Chimes!" and then finds something else in the Sanctuary.
- The Sanctuary's source text doesn't match the quests either. For example, it says "Earned from Veeru (Quest 2)" and cites Gita 2.58, 2.47, 2.14 and 18.20, none of which are taught in any quest.

**H3. AudioContext leak in Sanctuary chimes.** `src/screens/WisdomSanctuary.tsx:91` creates a **new `AudioContext` every 1.4 s** and never closes it. Browsers limit how many contexts can exist, and each one holds audio hardware resources. Within about a minute, the chimes go silent or other sounds fail. Fix: reuse the shared context in `utils/audio.ts`.

**H4. No tests, CI, README, LICENSE or lockfile.** `package-lock.json` isn't committed, and every dependency uses a `^` range, so builds aren't reproducible.

## Medium: bugs and correctness

- **Map labels are all "The".** `src/screens/WorldMap.tsx:213` uses `quest.title.split(' ')[0]`, so the labels read "Quest 1: The", "Quest 2: The", "Quest 7: The".
- **Map path doesn't line up with the nodes.** The SVG path in `WorldMap.tsx` uses fixed pixel coordinates (up to 750×420) with no `viewBox`, while the nodes are positioned in percentages. The path only matches one container size. The `dash` keyframe it references (`WorldMap.tsx:117`) isn't defined anywhere, so the animated overlay never moves. On phones, 10 nodes with 140 px labels inside a 500 px-tall canvas overlap.
- **Story narration is wrong.** `src/screens/QuestPage.tsx:78` always says "Krishna looks at Arjuna and advises: {narratorQuote}". Many of those quotes are spoken by companions instead. For example, quest 2 reads "Krishna… advises: Mayur spreads his feathers". For quest 1, the narration repeats "Krishna looks at Arjuna" twice. The quotes also name specific companions (Mayur, Gauri, Gaja, Veeru), whichever companion the child picked.
- **"Bonus +50 XP Earned!" is never awarded.** The chant lab at `QuestPage.tsx:511` shows the message, but nothing adds the XP.
- **The "Tap & Chant / Listening…" button doesn't listen.** It is a 2.4 s timer that always succeeds. Either label it honestly or implement it.
- **Voice gender matching is inverted for female voices.** In `src/utils/audio.ts:283`, `isMaleName` matches `'male'` and `'man'`, which also match "female" and "woman". Gaja, Mayur and Veeru can therefore get a female voice. `getVoices()` is also empty on the first call in Chrome (voices load asynchronously), so the first line of narration uses the default voice.
- **The emoji-strip regex is too broad.** `[‑-⛿]` also removes curly quotes, dashes, `…`, `₹`, arrows and so on.
- **The correct quiz answer is always the second option.** It is option `b` in all 10 quests, so children will learn the pattern. Shuffle the options when rendering.
- **Saved state is barely validated.** `App.tsx:46` only checks `avatar`, `companion` and `avatarName`. If `completedQuests` is missing or malformed in an older save, Home crashes. The storage key is versioned (`_v1`), but there is no migration path.
- **Literal Markdown appears in JSX.** `HomeScreen.tsx:349` and `:427` render `**Wisdom Leaf**` and `**Parent Corner**` with the asterisks visible.
- **Dead branch.** `HomeScreen.tsx:372` checks `rewardCrystal.includes('Action')`, which no quest matches.
- **Hard-coded `10`.** `HomeScreen` hard-codes `10` and `/ 10`; the progress math in `App.tsx` assumes 10 quests, and the decoration counters (`WisdomTree.tsx:406`, `WisdomSanctuary.tsx:207`) show `/ 5`. Use `QUESTS.length` and the size of `DECORATION_DETAILS` instead.
- **Double-tap race on the Reward crystal.** The crystal stays clickable while its exit animation plays, so `triggerFlyAnimation` can run twice. None of the `setTimeout`s in `RewardPage`, `QuestPage` or `HomeScreen` are cleared on unmount.
- **`confirm()` may be blocked.** The reset button uses `confirm()` (`HomeScreen.tsx:63`), which sandboxed iframes such as AI Studio previews block silently, so reset can't be triggered there.
- **Random values recomputed on render.** `Math.random()` runs inside render for the particles in `RewardPage`, `LandingPage` and `WisdomTree`, so they jump around on every state change.

## Medium: content accuracy

- **Verse numbering is inconsistent.** Most verses use Gita Press numbering: 1.30 *gāṇḍīvaṁ*, 1.31 *na ca śreyo*, 1.46 *yadi mām*, 1.47 *evam uktvā*. Quest 8's *kula-kṣaye praṇaśyanti* is labelled **1.39**, which is the ISKCON number; in the Gita Press numbering it is 1.40. The quests are also out of verse order: quest 7 is 1.46 and comes before quest 8 at 1.39/1.40.
- **Questionable Sanctuary citation.** "Courageous Progression (Gita 18.20)" doesn't match what that verse says, which concerns *sāttvika* knowledge. Have someone check all the Sanctuary citations against a source.

## Medium: privacy, accessibility, UX claims (children's app)

- **The "no tracking" and "offline-first" claims are inaccurate.** The page says "No email, no passcodes, no tracking" and "Offline-First" in several places, but `src/index.css:1` loads Google Fonts from `fonts.googleapis.com` on every visit. That sends each visitor's IP address to Google, and the app has no service worker, so it doesn't work offline. Self-host the fonts (for example with `@fontsource`) and either add a PWA service worker or drop the claim.
- **Accessibility gaps.**
  - There are zero `aria-*`, `alt` or `role` attributes in `src/`.
  - Many interactive elements are clickable `div`s or `motion.div`s that can't be reached by keyboard: the character portraits in `QuestPage`, the companion emoji in `HomeScreen`, and the SVG decorations in `WisdomTree`.
  - Icon-only buttons such as the "❌" close button have no accessible name.
  - The name `<label>` in `AvatarCreation` isn't associated with its input.
- **No reduced-motion support.** `prefers-reduced-motion` isn't respected anywhere, despite heavy use of `animate-bounce`, `animate-pulse` and `animate-ping`. Use `useReducedMotion` from `motion`.
- **Very small text.** There are many 8–10 px labels (`text-[8px]`, `text-[9px]`). That is hard to read for 6–8-year-olds.
- **Dev-facing text shipped to users.** The footer in `App.tsx` ("Built Beautifully with Custom Synthesized Audio & Framer Vector graphics") and the "🌟 Playable MVP" badge on the landing page are aimed at developers, not players.

## Low: hygiene

- **Invalid Tailwind classes that silently do nothing:**
  - Shade suffixes that don't exist: `*-205`, `*-250`, `*-150`, `*-805`, `*-850`, `*-905`, `*-955`, `text-slate-450`, `text-indigo-505`. There are about 25 of these.
  - Utilities that don't exist: `bg-radial-gradient`, `shadow-3xl`, `py-0.2`.
  - `.touch-target`, which is used 5 times but never defined.
- **Unused dependencies:** `@google/genai`, `express`, `dotenv`, `@types/express`, `tsx`, `esbuild` and `autoprefixer`.
  - `vite` is listed in both `dependencies` and `devDependencies`.
  - Build tooling (`vite`, `@vitejs/plugin-react`, `@tailwindcss/vite`) sits under `dependencies`.
  - `metadata.json` declares `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`, and `.env.example` documents `GEMINI_API_KEY`, but nothing uses either.
- **Template leftovers:** `"name": "react-example"`, a `clean` script that deletes a non-existent `server.js`, and `experimentalDecorators` / `allowJs` in `tsconfig`. There is also a mojibake comment in `vite.config.ts:18` ("modifyâfile").
- **Duplicated logic:**
  - The age-group wisdom selection is copied 3 times (`QuestPage` twice, `HomeScreen` once).
  - The quest-to-decoration map exists twice (`App`, `RewardPage`).
  - The "ambient atmosphere" backdrop is copy-pasted across 6 screens.
  - The `'explorer' | 'seeker' | 'guide'` union is redeclared in 4 places instead of being a type alias.
  - `QuestChallenge` in `types.ts` is unused.
- **Code-splitting:** the single 506 kB bundle (154 kB gzipped) could be split per screen with `React.lazy`.
- **Leftover AI Studio artefacts:** `assets/.aistudio/.gitignore` contains only `*`, and so does `vite.config.ts`'s `DISABLE_HMR` handling. Decide whether to keep them.

---

## Suggested order of work

1. Add `@types/react` and `@types/react-dom`, fix the 3 type errors, enable `strict`, and commit a lockfile.
2. Fix the reward pipeline (H2): have one source of truth that maps quests to decorations, with 10 entries, and derive Reward and Sanctuary from saved state.
3. Fix the AudioContext leak (H3) and the voice-gender matcher.
4. Fix the map labels, the story narration prefix, the literal `**`, and the phantom +50 XP.
5. Self-host the fonts and correct the privacy and offline wording.
6. Do an accessibility pass: real `<button>`s, `aria-label`s, reduced motion, and larger minimum font size.
7. Add a README, CI (`lint` + `build`), and a few unit tests for the state logic in `App.tsx` and the quest data invariants. The data tests should check that exactly one correct option exists, that IDs are unique, and that every quest has `chantSteps`.
8. Shuffle the quiz options, have the verse numbers reviewed, and remove the unused dependencies.
