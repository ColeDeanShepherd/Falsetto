import "core-js";
import "whatwg-fetch";
import "pepjs";

import "bootstrap/dist/css/bootstrap-reboot.min.css";
import "./index.css";

import { Auth0Provider } from "./react-auth0-wrapper";
import { Auth0InjectorView } from './Auth0Injector/Auth0InjectorView';

import * as React from "react";
import * as ReactDOM from "react-dom";

import { createMuiTheme, MuiThemeProvider } from "@material-ui/core";

import registerServiceWorker from "./registerServiceWorker";

import { getErrorDescription } from './Error';
import { authDomain, authClientId, authAudience, isDevelopment } from './Config';
import { DependencyInjector } from './DependencyInjector';
import { IAnalytics } from './Analytics';
import { polyfillWebAudio } from "./Audio/Audio";

import { checkFlashCardSetIds, checkFlashCardIds } from './FlashCardGraph';

import { AppModel } from './App/Model';
import { AppView } from "./App/View";

const analytics = DependencyInjector.instance.getRequiredService<IAnalytics>("IAnalytics");

window.onerror = (msg, file, line, col, error) => {
  const fatal = true;
  getErrorDescription(msg, file, line, col, error)
    .then(errorDescription => analytics.trackException(errorDescription, fatal));
};

const theme = createMuiTheme({
  /*typography: {
    useNextVariants: true,
  },*/
  overrides: {
    MuiTableCell: {
      root: {
        padding: "4px"
      }
    },
    MuiButton: {
      root: {
        minWidth: 0,
        padding: "6px 12px"
      }
    }
  }
});

polyfillWebAudio();

analytics.trackPageView();

if (isDevelopment()) {
  checkFlashCardSetIds();
  checkFlashCardIds();
}

const app = new AppModel();

window.addEventListener("beforeunload", (e) => {
  app.dispose();
});

// A function that routes the user to the right place
// after login
// TODO: uncomment when authentication is re-enabled
/*const onRedirectCallback = (appState: any) => {
  window.history.replaceState(
    {},
    document.title,
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname
  );
};

const rootElement = (
  <Auth0Provider
    onRedirectCallback={onRedirectCallback}
    initOptions={{
      domain: authDomain,
      client_id: authClientId,
      redirect_uri: window.location.origin,
      audience: authAudience
    }}
  >
    <Auth0InjectorView />
    <MuiThemeProvider theme={theme}>
      <AppView />
    </MuiThemeProvider>
  </Auth0Provider>
);*/

const rootElement = (
  <MuiThemeProvider theme={theme}>
    <AppView />
  </MuiThemeProvider>
);

ReactDOM.render(
  rootElement,
  document.getElementById("root") as HTMLElement
);

//registerServiceWorker();