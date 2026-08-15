import { ThemeTypes as Theme } from '@getstation/theme';
import * as remote from '@electron/remote';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';

const releaseNotesHTML = require('!!raw-loader!../../app/resources/release-notes.html').default;

export interface Classes {
  container: string,
  header: string,
  logo: string,
  title: string,
  description: string,
  body: string,
  content: string,
  newVersion: string,
  updateIcon: string,
  updateTitle: string,
  updateDescription: string,
  actions: string,
  button: string,
  suggestedButton: string,
  flatButton: string,
}

export interface Props {
  classes?: Classes,
  updateAvailable: boolean,
  releaseName: string,
  onClickOpenReleaseNotes: () => any,
  onClickRemindLater: () => any,
}

const styles = (theme: Theme) => ({
  container: {
    position: 'relative',
  },
  header: {
    padding: 20,
    borderBottom: '1px solid var(--app-border)',
    backgroundColor: 'var(--app-active)',
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  title: {
    marginTop: 30,
    ...theme.fontMixin(23),
  },
  description: {
    opacity: .4,
  },
  body: {
    padding: 20,
  },
  content: {
    '& h2': {
      margin: [10, 0],
      ...theme.fontMixin(13, 'bold'),
      color: 'var(--app-text-muted)',
      textTransform: 'uppercase',
    },
    '& ul': {
      marginBottom: 40,
    },
    '& li': {
      listStyleType: 'disc',
      marginLeft: 18,
      ...theme.fontMixin(13),
      marginBottom: 5,
    },
  },
  newVersion: {
    padding: [16, 8, 8],
    textAlign: 'center',
  },
  updateIcon: {
    width: 56,
    height: 56,
    margin: [0, 'auto', 16],
    display: 'grid',
    placeItems: 'center',
    borderRadius: '50%',
    color: 'var(--app-accent)',
    background: 'color-mix(in srgb, var(--app-accent) 14%, transparent)',
    fontSize: 26,
    fontWeight: 700,
  },
  updateTitle: {
    margin: 0,
    color: 'var(--app-text-primary)',
    fontSize: 16,
    fontWeight: 700,
    lineHeight: 1.35,
  },
  updateDescription: {
    margin: [6, 0, 20],
    color: 'var(--app-text-secondary)',
    fontSize: 13,
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
  },
  button: {
    width: '100%',
    minHeight: 36,
    padding: [0, 16],
    border: 0,
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    '&:focus-visible': {
      outline: '2px solid var(--app-accent)',
      outlineOffset: 2,
    },
  },
  suggestedButton: {
    color: '#fff',
    background: 'var(--app-accent)',
    '&:hover': { filter: 'brightness(1.08)' },
  },
  flatButton: {
    marginTop: 8,
    color: 'var(--app-text-primary)',
    background: 'var(--app-active)',
    '&:hover': { filter: 'brightness(1.08)' },
  },
});

@injectSheet(styles)
export default class AutoUpdateSubdock extends React.PureComponent<Props, {}> {
  render() {
    const { classes, updateAvailable, releaseName, onClickOpenReleaseNotes, onClickRemindLater } = this.props;

    return (
      <div className={classes!.container}>
        <div className={classes!.header}>
          <img className={classes!.logo} src="static/logos/platform-app-icon.svg" alt="" />
          <h1 className={classes!.title}>What's new on {remote.app.name}?</h1>
          <p className={classes!.description}>
            You're now on version {remote.app.getVersion()}
          </p>
        </div>

        <div className={classes!.body}>
          { updateAvailable ?
            <div className={classes!.newVersion}>
              <div className={classes!.updateIcon} aria-hidden="true">&#8595;</div>
              <h2 className={classes!.updateTitle}>A new version is available</h2>
              <p className={classes!.updateDescription}>Platform {releaseName} is ready to download.</p>
              <div className={classes!.actions}>
                <button className={`${classes!.button} ${classes!.suggestedButton}`} type="button" onClick={onClickOpenReleaseNotes}>
                  View Downloads
                </button>
                <button className={`${classes!.button} ${classes!.flatButton}`} type="button" onClick={onClickRemindLater}>
                  Remind Me Later
                </button>
              </div>
            </div>
            :
            <div className={classes!.content} dangerouslySetInnerHTML={{ __html: releaseNotesHTML }} />
          }
        </div>
      </div>
    );
  }
}
