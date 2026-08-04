import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Subject } from 'rxjs';

// tslint:disable-next-line:no-import-side-effect
import '../../../theme/css/app.global.css';
import { getSearchParams } from '../../../webui/helpers';
import { WebUIGradientProvider } from '../../../webui/WebUIGradientProvider';
import MultiInstanceConfigurator from './MultiInstanceConfigurator';
import PlatformThemeProvider from '../../../theme/PlatformThemeProvider';
import { initializeAppearanceDocumentTheme } from '../../../theme/appearanceDocument';

initializeAppearanceDocumentTheme();

const params = getSearchParams();
const manifestURL = params.get('manifestURL')!;
const applicationId = params.get('applicationId')!;

const themeColorsObservable = new Subject<any>();
window.bxApi.theme.addThemeColorsChangeListener(
  (_: any, result: any) => themeColorsObservable.next(result)
);

ReactDOM.render(
  <PlatformThemeProvider>
    <WebUIGradientProvider themeColorsObservable={themeColorsObservable}>
      <MultiInstanceConfigurator
        applicationId={applicationId}
        manifestURL={manifestURL}
      />
    </WebUIGradientProvider>
  </PlatformThemeProvider>,
  document.getElementById('root')
);
