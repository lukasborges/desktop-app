import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const defaultOutput = 'packages/app/src/app/resources/release-notes.html';
const outputArgIndex = process.argv.indexOf('--output');
if (outputArgIndex !== -1 && !process.argv[outputArgIndex + 1]) {
  throw new Error('Missing path after --output');
}
const output = resolve(outputArgIndex === -1 ? defaultOutput : process.argv[outputArgIndex + 1]);

const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const escapeHTML = value => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

let previousTag;
try {
  previousTag = git('describe', '--tags', '--abbrev=0');
} catch {
  previousTag = undefined;
}

const range = previousTag ? `${previousTag}..HEAD` : 'HEAD';
let commits = git('log', range, '--format=%s', '--no-merges')
  .split('\n')
  .map(subject => subject.trim())
  .filter(Boolean);

if (commits.length === 0) {
  commits = [git('log', '-1', '--format=%s')];
}

const items = commits.map(subject => `  <li>${escapeHTML(subject)}</li>`).join('\n');
const html = `<h2>what's new</h2>\n<ul>\n${items}\n</ul>\n`;

writeFileSync(output, html);
console.log(`Generated release notes from ${previousTag || 'repository history'} (${commits.length} commit(s))`);
