import { ReactNode } from 'react';
import { flushSync } from 'react-dom';
import { Root } from 'react-dom/client';

export const renderRootAndNotify = (
  root: Pick<Root, 'render'>,
  children: ReactNode,
  notify: () => void
) => {
  flushSync(() => root.render(children));
  notify();
};
