export const settingsButtonStyle = {
  appearance: 'none',
  boxSizing: 'border-box',
  height: '34px !important',
  minHeight: 34,
  padding: '0 16px !important',
  border: '1px solid var(--app-border) !important',
  borderRadius: '6px !important',
  background: 'var(--app-surface-subtle) !important',
  color: 'var(--app-text-primary) !important',
  boxShadow: '0 1px 2px var(--app-shadow-soft) !important',
  fontSize: '13px !important',
  fontWeight: '600 !important',
  lineHeight: '32px !important',
  transition: 'background-color 120ms ease, border-color 120ms ease, box-shadow 120ms ease, transform 80ms ease',
  '&:hover:not(:disabled)': {
    background: 'var(--app-active) !important',
    borderColor: 'var(--app-border-strong) !important',
  },
  '&:active:not(:disabled)': {
    background: 'var(--app-pressed) !important',
    boxShadow: 'inset 0 1px 2px var(--app-shadow-soft) !important',
    transform: 'translateY(1px)',
  },
  '&:focus-visible': {
    outline: '2px solid var(--app-accent) !important',
    outlineOffset: 2,
  },
  '&:disabled': {
    cursor: 'default',
    opacity: 0.55,
  },
};
