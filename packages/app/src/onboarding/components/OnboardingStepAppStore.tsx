import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';

import { MinimalApplication } from '../../applications/graphql/withApplications';
import AppIcon from '../../dock/components/AppIcon';

export interface Classes {
  container: string,
  heading: string,
  title: string,
  subtitle: string,
  errorBanner: string,
  searchContainer: string,
  searchIcon: string,
  searchInput: string,
  appsContainer: string,
  appButton: string,
  selectedApp: string,
  appIcon: string,
  appName: string,
  check: string,
  selectedCheck: string,
  noResults: string,
}

interface Props {
  classes?: Classes,
  applications: MinimalApplication[],
  selectedApplications: (MinimalApplication & { position?: DOMRect })[],
  onHandleApplicationSelect: (
    application: MinimalApplication,
    iconRef?: React.RefObject<HTMLDivElement>,
  ) => any,
  searchInputValue: string,
  handleSearchInputValue: (value: string) => any,
  setupError?: string,
}

@injectSheet({
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    margin: '0 auto',
    maxWidth: 760,
    minHeight: 0,
    padding: '44px 32px 32px',
    width: '100%',
  },
  heading: {
    marginBottom: 24,
    textAlign: 'center',
  },
  title: {
    color: 'var(--app-text-primary)',
    fontSize: 28,
    fontWeight: 700,
    letterSpacing: '-.02em',
    lineHeight: 1.2,
    margin: '0 0 8px',
  },
  subtitle: {
    color: 'var(--app-text-secondary)',
    fontSize: 15,
    lineHeight: 1.45,
    margin: 0,
  },
  errorBanner: {
    background: 'color-mix(in srgb, var(--app-danger) 12%, var(--app-surface-elevated))',
    border: '1px solid color-mix(in srgb, var(--app-danger) 42%, var(--app-border))',
    borderRadius: 9,
    color: 'var(--app-text-primary)',
    fontSize: 13,
    lineHeight: 1.4,
    marginBottom: 16,
    padding: '10px 12px',
    textAlign: 'center',
  },
  searchContainer: {
    alignItems: 'center',
    background: 'var(--app-surface-elevated)',
    border: '1px solid var(--app-border)',
    borderRadius: 10,
    boxShadow: '0 1px 2px var(--app-shadow-soft)',
    display: 'flex',
    flex: '0 0 auto',
    height: 42,
    marginBottom: 20,
    padding: '0 13px',
    transition: 'border-color 120ms ease, box-shadow 120ms ease',
    '&:focus-within': {
      borderColor: 'var(--app-accent)',
      boxShadow: '0 0 0 2px color-mix(in srgb, var(--app-accent) 30%, transparent)',
    },
  },
  searchIcon: {
    border: '2px solid var(--app-text-muted)',
    borderRadius: '50%',
    boxSizing: 'border-box',
    flex: '0 0 auto',
    height: 13,
    marginRight: 11,
    position: 'relative',
    width: 13,
    '&::after': {
      background: 'var(--app-text-muted)',
      borderRadius: 2,
      bottom: -4,
      content: '""',
      height: 6,
      position: 'absolute',
      right: -3,
      transform: 'rotate(-45deg)',
      width: 2,
    },
  },
  searchInput: {
    background: 'transparent',
    border: 0,
    color: 'var(--app-text-primary)',
    fontFamily: 'inherit',
    fontSize: 14,
    height: '100%',
    minWidth: 0,
    outline: 0,
    width: '100%',
    '&::placeholder': {
      color: 'var(--app-text-muted)',
    },
  },
  appsContainer: {
    alignContent: 'start',
    display: 'flex',
    flex: 1,
    flexWrap: 'wrap',
    minHeight: 0,
    overflowY: 'auto',
    padding: '2px 4px 12px 2px',
  },
  appButton: {
    alignItems: 'center',
    background: 'var(--app-surface-elevated)',
    border: '1px solid var(--app-border-subtle)',
    borderRadius: 12,
    color: 'var(--app-text-primary)',
    cursor: 'pointer',
    display: 'flex',
    fontFamily: 'inherit',
    minHeight: 62,
    padding: '10px 12px',
    textAlign: 'left',
    transition: 'background 120ms ease, border-color 120ms ease, box-shadow 120ms ease',
    marginBottom: 12,
    width: 'calc(50% - 6px)',
    '&:nth-child(odd)': {
      marginRight: 6,
    },
    '&:nth-child(even)': {
      marginLeft: 6,
    },
    '&:hover': {
      background: 'var(--app-hover)',
      borderColor: 'var(--app-border)',
    },
    '&:focus-visible': {
      boxShadow: '0 0 0 2px var(--app-accent)',
      outline: 0,
    },
    '@media (max-width: 620px)': {
      marginLeft: '0 !important',
      marginRight: '0 !important',
      width: '100%',
    },
  },
  selectedApp: {
    background: 'color-mix(in srgb, var(--app-accent) 10%, var(--app-surface-elevated))',
    borderColor: 'var(--app-accent)',
    '&:hover': {
      background: 'color-mix(in srgb, var(--app-accent) 14%, var(--app-surface-elevated))',
      borderColor: 'var(--app-accent)',
    },
  },
  appIcon: {
    flex: '0 0 auto',
    height: 36,
    marginRight: 12,
    overflow: 'hidden',
    width: 36,
  },
  appName: {
    flex: 1,
    fontSize: 14,
    fontWeight: 600,
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  check: {
    alignItems: 'center',
    border: '1px solid var(--app-border-strong)',
    borderRadius: '50%',
    color: 'transparent',
    display: 'flex',
    flex: '0 0 auto',
    fontSize: 13,
    fontWeight: 700,
    height: 20,
    justifyContent: 'center',
    marginLeft: 10,
    width: 20,
  },
  selectedCheck: {
    background: 'var(--app-accent)',
    borderColor: 'var(--app-accent)',
    color: '#fff',
  },
  noResults: {
    alignItems: 'center',
    color: 'var(--app-text-secondary)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    lineHeight: 1.5,
    minHeight: 180,
    textAlign: 'center',
    width: '100%',
    '& strong': {
      color: 'var(--app-text-primary)',
      fontSize: 16,
      marginBottom: 4,
    },
  },
})
export default class OnboardingStepAppStore extends React.PureComponent<Props> {
  handleApplicationSelect = (event: React.MouseEvent<HTMLButtonElement>) => {
    const applicationId = event.currentTarget.dataset.applicationId;
    const application = this.props.applications.find(app => app.id === applicationId);
    if (application) this.props.onHandleApplicationSelect(application);
  }

  handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.handleSearchInputValue(event.currentTarget.value);
  }

  render() {
    const {
      classes, applications, searchInputValue, selectedApplications, setupError,
    } = this.props;
    const selectedCount = selectedApplications.length;

    return (
      <main className={classes!.container}>
        <header className={classes!.heading}>
          <h1 className={classes!.title}>Choose your apps</h1>
          <p className={classes!.subtitle} aria-live="polite">
            {selectedCount < 3
              ? `Select at least three apps to build your workspace — ${3 - selectedCount} remaining.`
              : `${selectedCount} apps selected. You can change these later.`}
          </p>
        </header>

        {setupError &&
          <div className={classes!.errorBanner} role="alert">{setupError}</div>
        }

        <label className={classes!.searchContainer}>
          <span className={classes!.searchIcon} aria-hidden="true" />
          <input
            className={classes!.searchInput}
            type="search"
            value={searchInputValue}
            placeholder="Search apps"
            aria-label="Search apps"
            onChange={this.handleSearchChange}
          />
        </label>

        <div className={classes!.appsContainer} role="group" aria-label="Available apps">
          {applications.length === 0 &&
            <div className={classes!.noResults}>
              <strong>No apps found</strong>
              <span>You can request another app from the app store later.</span>
            </div>
          }

          {applications.map((application: MinimalApplication) => {
            const selected = Boolean(selectedApplications.find(app => app.id === application.id));
            const buttonClassName = `${classes!.appButton}${selected ? ` ${classes!.selectedApp}` : ''}`;
            const checkClassName = `${classes!.check}${selected ? ` ${classes!.selectedCheck}` : ''}`;

            return (
              <button
                key={application.id}
                type="button"
                className={buttonClassName}
                aria-pressed={selected}
                data-application-id={application.id}
                onClick={this.handleApplicationSelect}
              >
                <span className={classes!.appIcon}>
                  <AppIcon imgUrl={application.iconURL} themeColor={application.themeColor} size={36} />
                </span>
                <span className={classes!.appName}>{application.name}</span>
                <span className={checkClassName} aria-hidden="true">✓</span>
              </button>
            );
          })}
        </div>

      </main>
    );
  }
}
