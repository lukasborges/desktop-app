import * as classNames from 'classnames';
import * as React from 'react';

interface Props {
  className?: string,
  label?: string,
  onClick: () => void,
}

const UtilityViewClose = ({ className, label = 'Close', onClick }: Props) => (
  <button
    aria-label={label}
    className={classNames('station-utility-view-close', className)}
    onClick={onClick}
    title={`${label} (Esc)`}
    type="button"
  >
    <svg aria-hidden="true" viewBox="0 0 16 16">
      <path d="M4 4h1c.254.012.512.129.719.313L8 6.593l2.313-2.28c.265-.231.445-.305.687-.313h1v1c0 .285-.035.55-.25.75L9.47 8.031l2.25 2.25c.187.188.281.453.281.719v1h-1c-.266 0-.531-.094-.719-.281L8 9.437l-2.281 2.282A1.02 1.02 0 0 1 5 12H4v-1c0-.266.094-.531.281-.719l2.282-2.25L4.28 5.75A.94.94 0 0 1 4 5Z" />
    </svg>
  </button>
);

export default UtilityViewClose;
