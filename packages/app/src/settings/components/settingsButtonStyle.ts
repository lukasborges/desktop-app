export const settingsButtonStyle = {
  minHeight: 30,
  padding: '0 14px !important',
  border: '1px solid var(--app-border-strong) !important',
  borderRadius: '6px !important',
  background: 'var(--app-surface-raised) !important',
  color: 'var(--app-text-primary) !important',
  boxShadow: '0 1px 2px var(--app-shadow) !important',
  fontSize: '12px !important',
  fontWeight: '600 !important',
  lineHeight: '28px !important',
  transition: 'background-color 120ms ease, border-color 120ms ease, box-shadow 120ms ease',
  '&:hover:not(:disabled)': {
    background: 'var(--app-hover) !important',
    borderColor: 'var(--app-text-muted) !important',
  },
  '&:active:not(:disabled)': {
    background: 'var(--app-pressed) !important',
    boxShadow: 'none !important',
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
