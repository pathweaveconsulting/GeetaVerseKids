// Copies the curated reference screenshots from the latest QC output
// (qc-output/, git-ignored) into qc-report/reference/, which is kept in git.
// Run through `npm run qc:update-reference`, which first runs the tests that
// produce them. Normal QC runs never write to qc-report/reference/.
import fs from 'fs';
import path from 'path';

const OUTPUT = path.resolve('qc-output/screenshots');
const REFERENCE = path.resolve('qc-report/reference');

// [width, screenshot name without its run-order number, reference file name]
const REFERENCE_SET: Array<[string, string, string]> = [
  ['phone', 'landing', 'phone-01-landing.jpg'],
  ['phone', 'home-new-player', 'phone-02-home.jpg'],
  ['phone', 'map-new-player', 'phone-03-quest-map.jpg'],
  ['phone', 'q1-step1-story', 'phone-04-quest1-story-scene.jpg'],
  ['phone', 'q1-step2-wisdom-and-chant', 'phone-05-lesson-wisdom-step.jpg'],
  ['phone', 'reward-q1', 'phone-06-reward-quest1.jpg'],
  ['phone', 'sanctuary-after-q10', 'phone-07-sanctuary-all-10-decorations.jpg'],
  ['phone', 'audio-no-Web-Audio-at-all-01-reward-with-sound-note', 'phone-08-sound-off-note.jpg'],
  ['laptop', 'map-new-player', 'laptop-01-quest-map.jpg'],
  ['laptop', 'sanctuary-after-q10', 'laptop-02-sanctuary-all-10-decorations.jpg']
];

const missing: string[] = [];
const copies: Array<[string, string]> = [];
for (const [width, name, target] of REFERENCE_SET) {
  const dir = path.join(OUTPUT, width);
  // Playthrough screenshots are numbered by capture order ("26-sanctuary-after-q10.jpg");
  // other tests' names are already unique
  const pattern = new RegExp(`^(\\d+-)?${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\.jpg$`);
  const found = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => pattern.test(f)) : [];
  if (found.length !== 1) missing.push(`${width}/${name} (found ${found.length})`);
  else copies.push([path.join(dir, found[0]), path.join(REFERENCE, target)]);
}

if (missing.length) {
  console.error(`Reference screenshots not found in qc-output/, nothing was changed:\n  ${missing.join('\n  ')}`);
  process.exit(1);
}
fs.mkdirSync(REFERENCE, { recursive: true });
for (const [from, to] of copies) {
  fs.copyFileSync(from, to);
  console.log(`${path.relative(process.cwd(), from)} -> ${path.relative(process.cwd(), to)}`);
}
console.log(`Updated ${copies.length} reference screenshots.`);
