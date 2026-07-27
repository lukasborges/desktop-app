import { ModalWrapper, ThemeTypes } from '@getstation/theme';
import * as remote from '@electron/remote';
import * as React from 'react';
// @ts-ignore: no declaration file
import injectSheet from 'react-jss';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getFocus } from '../app/selectors';
import { StationState } from '../types';
import { resolveApplicationRoutingChooser } from '../ui/duck';
import { getApplicationRoutingChooser } from '../ui/selectors';
import { ApplicationRoutingChoice } from './types';

const currentWindowId = remote.getCurrentWindow().id;

interface Chooser {
  requestId: string,
  url: string,
  applications: ApplicationRoutingChoice[],
}

interface Classes {
  panel: string,
  header: string,
  eyebrow: string,
  title: string,
  description: string,
  url: string,
  choices: string,
  choice: string,
  icon: string,
  fallbackIcon: string,
  choiceText: string,
  applicationName: string,
  applicationDescription: string,
  chevron: string,
  footer: string,
  cancel: string,
}

interface StateProps {
  chooser: Chooser | null,
  isFocusedWindow: boolean,
  classes?: Classes,
}

interface DispatchProps {
  resolve: typeof resolveApplicationRoutingChooser,
}

type Props = StateProps & DispatchProps;

const styles = (_theme: ThemeTypes) => ({
  panel: {
    width: 480,
    overflow: 'hidden',
    color: '#f7f8fa',
    background: '#202226',
    border: '1px solid rgba(255, 255, 255, .09)',
    borderRadius: 16,
    boxShadow: '0 24px 80px rgba(0, 0, 0, .55)',
  },
  header: {
    padding: '24px 24px 18px',
    borderBottom: '1px solid rgba(255, 255, 255, .07)',
  },
  eyebrow: {
    marginBottom: 7,
    color: '#9fa6b2',
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '.08em',
    textTransform: 'uppercase',
  },
  title: {
    margin: 0,
    fontSize: 21,
    fontWeight: 600,
    lineHeight: 1.25,
  },
  description: {
    margin: '7px 0 0',
    color: '#aeb4bf',
    fontSize: 13,
    lineHeight: 1.45,
  },
  url: {
    display: 'block',
    boxSizing: 'border-box',
    width: '100%',
    marginTop: 15,
    padding: '9px 11px',
    overflow: 'hidden',
    color: '#c9ced7',
    background: 'rgba(255, 255, 255, .045)',
    border: '1px solid rgba(255, 255, 255, .07)',
    borderRadius: 8,
    fontFamily: 'monospace',
    fontSize: 11,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  choices: {
    display: 'flex',
    flexDirection: 'column',
    gap: 9,
    maxHeight: 340,
    padding: '16px 18px',
    overflowY: 'auto',
  },
  choice: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: 12,
    color: '#f7f8fa',
    textAlign: 'left',
    background: '#292c31',
    border: '1px solid rgba(255, 255, 255, .08)',
    borderRadius: 11,
    cursor: 'pointer',
    transition: 'background 140ms ease, border-color 140ms ease, transform 140ms ease',
    '&:hover, &:focus': {
      background: '#32363d',
      borderColor: 'rgba(125, 151, 255, .65)',
      outline: 'none',
      transform: 'translateY(-1px)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
  },
  icon: {
    width: 38,
    height: 38,
    flexShrink: 0,
    objectFit: 'cover',
    background: '#3a3d44',
    borderRadius: 10,
  },
  fallbackIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 38,
    height: 38,
    flexShrink: 0,
    color: 'white',
    background: 'linear-gradient(135deg, #6877e8, #7355c7)',
    borderRadius: 10,
    fontSize: 16,
    fontWeight: 600,
  },
  choiceText: {
    minWidth: 0,
    flex: 1,
    marginLeft: 12,
  },
  applicationName: {
    overflow: 'hidden',
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 1.35,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  applicationDescription: {
    marginTop: 3,
    overflow: 'hidden',
    color: '#aeb4bf',
    fontSize: 12,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  chevron: {
    marginLeft: 12,
    color: '#8f97a4',
    fontSize: 24,
    fontWeight: 300,
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '12px 18px 16px',
    borderTop: '1px solid rgba(255, 255, 255, .07)',
  },
  cancel: {
    padding: '8px 14px',
    color: '#c7ccd5',
    background: 'transparent',
    border: 0,
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 13,
    '&:hover, &:focus': {
      color: 'white',
      background: 'rgba(255, 255, 255, .07)',
      outline: 'none',
    },
  },
});

const compactUrl = (rawUrl: string) => {
  try {
    const url = new URL(rawUrl);
    return `${url.hostname}${url.pathname}`;
  } catch (_error) {
    return rawUrl;
  }
};

@injectSheet(styles)
class ApplicationRoutingChooser extends React.PureComponent<Props> {
  renderChoice = (application: ApplicationRoutingChoice, index: number) => {
    const { chooser, classes, resolve } = this.props;
    if (!chooser) return null;

    return (
      <button
        key={application.applicationId}
        type="button"
        className={classes!.choice}
        autoFocus={index === 0}
        onClick={() => resolve(chooser.requestId, application.applicationId)}
      >
        {application.iconURL
          ? <img className={classes!.icon} src={application.iconURL} />
          : <span className={classes!.fallbackIcon}>{application.name.charAt(0)}</span>
        }
        <span className={classes!.choiceText}>
          <span className={classes!.applicationName}>{application.name}</span>
          <span className={classes!.applicationDescription}>{application.description}</span>
        </span>
        <span className={classes!.chevron}>›</span>
      </button>
    );
  }

  render() {
    const { chooser, isFocusedWindow, classes, resolve } = this.props;
    if (!chooser || !isFocusedWindow) return null;

    const cancel = () => resolve(chooser.requestId);

    return (
      <ModalWrapper onClickOutside={cancel}>
        <section className={classes!.panel} role="dialog" aria-modal="true" aria-labelledby="application-routing-title">
          <header className={classes!.header}>
            <div className={classes!.eyebrow}>Open link</div>
            <h2 id="application-routing-title" className={classes!.title}>Choose an account</h2>
            <p className={classes!.description}>
              More than one installed application can open this link.
            </p>
            <span className={classes!.url} title={chooser.url}>{compactUrl(chooser.url)}</span>
          </header>

          <div className={classes!.choices}>
            {chooser.applications.map(this.renderChoice)}
          </div>

          <footer className={classes!.footer}>
            <button type="button" className={classes!.cancel} onClick={cancel}>Cancel</button>
          </footer>
        </section>
      </ModalWrapper>
    );
  }
}

export default connect<StateProps, DispatchProps, {}>(
  (state: StationState) => ({
    chooser: getApplicationRoutingChooser(state),
    isFocusedWindow: getFocus(state) === currentWindowId,
  }),
  dispatch => bindActionCreators({
    resolve: resolveApplicationRoutingChooser,
  }, dispatch),
)(ApplicationRoutingChooser);
