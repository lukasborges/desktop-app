import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('download toaster React compatibility', () => {
  test('does not render through the legacy transition package', () => {
    const source = readFileSync(
      resolve(__dirname, '../../../src/dl-toaster/DownloadToaster.tsx'),
      'utf8',
    );

    expect(source).not.toContain("from 'react-transition-group'");
    expect(source).not.toContain('<CSSTransition');
    expect(source).not.toContain('<TransitionGroup');
  });
});
