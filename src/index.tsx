// polyfills
import "core-js";
import "whatwg-fetch";
import "pepjs";
import { polyfillWebAudio } from "./Audio/Audio";

// create-react-app
import registerServiceWorker from "./registerServiceWorker";

import * as React from "react";
import * as ReactDOM from "react-dom";

import { getErrorDescription } from './Error';
import { isDevelopment } from './Config';
import { DependencyInjector } from './DependencyInjector';
import { IAnalytics } from './Analytics';

import { checkFlashCardSetIds, checkFlashCardIds } from './FlashCardGraph';

import { createTheme, MuiThemeProvider } from "@material-ui/core";

import { AppModel } from './App/Model';
import { AppView } from "./ui/App/View";

// css
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

const analytics = DependencyInjector.instance.getRequiredService<IAnalytics>("IAnalytics");

window.onerror = (msg, file, line, col, error) => {
  const fatal = true;
  getErrorDescription(msg, file, line, col, error)
    .then(errorDescription => analytics.trackException(errorDescription, fatal));
};

const theme = createTheme({
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