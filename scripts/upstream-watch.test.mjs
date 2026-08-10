import assert from 'node:assert/strict';
import test from 'node:test';

import {
  classifyChange,
  collectLatestState,
  issueBody,
  parseState,
  radarIssueTitle,
  renderReport,
  UPSTREAMS,
} from './upstream-watch.mjs';

test('reads the persisted state from the issue marker', () => {
  assert.deepEqual(
    parseState('body\n<!-- upstream-state:{"ingenium":"abc","mathijs":"def"} -->'),
    { ingenium: 'abc', mathijs: 'def' },
  );
  assert.deepEqual(parseState('body without state'), {});
  assert.deepEqual(parseState('<!-- upstream-state:not-json -->'), {});
});

test('collects the newest split state per upstream and ignores the retired aggregate marker', () => {
  assert.deepEqual(collectLatestState([
    { body: '<!-- upstream-state:{"ingenium":"new"} -->' },
    { body: '<!-- upstream-state:{"mathijs":"current"} -->' },
    { body: '<!-- upstream-state:{"ingenium":"old"} -->' },
    { body: '<!-- upstream-state:{"ingenium":"legacy","mathijs":"legacy","oddball":"legacy"} -->' },
  ]), {
    ingenium: 'new',
    mathijs: 'current',
  });
});

test('monitors the selected active forks in priority order', () => {
  assert.deepEqual(
    UPSTREAMS.map(({ id, repository, role }) => ({ id, repository, role })),
    [
      { id: 'ingenium', repository: 'agenciaingenium/desktop-app', role: 'primary' },
      { id: 'mathijs', repository: 'Mathijs003/station-app', role: 'secondary' },
      { id: 'oddball', repository: 'oddballza/desktop-app', role: 'experimental' },
    ],
  );
});

test('rejects system tray and auto-launch regressions', () => {
  const result = classifyChange(
    [{ commit: { message: 'Restore minimize to tray and auto launch' } }],
    [{ filename: 'packages/app/src/tray.ts' }],
  );

  assert.equal(result.conflict, true);
  assert.equal(result.risk, 'high');
  assert.match(result.recommendation, /Reject/);
});

test('classifies isolated documentation changes as low risk', () => {
  const result = classifyChange(
    [{ commit: { message: 'Document how to build Electron on macOS' } }],
    [{ filename: 'README.md' }],
  );

  assert.equal(result.conflict, false);
  assert.equal(result.risk, 'low');
  assert.match(result.recommendation, /cherry-pick/);
});

test('renders repository, commit, risk, and recommendation', () => {
  const result = {
    upstream: UPSTREAMS[0],
    head: { branch: 'main', sha: '1234567890abcdef' },
    changes: {
      commits: [{
        sha: '1234567890abcdef',
        html_url: 'https://example.test/commit/1234567',
        commit: { message: 'Fix persistence', author: { name: 'Dev' } },
        author: { login: 'dev' },
      }],
      files: [{ filename: 'packages/app/persistence.ts' }],
      totalCommits: 1,
      warning: null,
    },
  };
  const report = renderReport([result], new Date('2026-07-20T12:00:00Z'));

  assert.match(report, /agenciaingenium\/desktop-app/);
  assert.match(report, /1234567/);
  assert.match(report, /Risk/);
  assert.match(report, /Recommendation/);
  assert.match(report, /persistence/);
  assert.equal(radarIssueTitle(result), '[Upstream Radar] agenciaingenium/desktop-app @ 1234567');
  assert.match(issueBody(result, report), /Triage checklist/);
  assert.match(issueBody(result, report), /"ingenium":"1234567890abcdef"/);
});
