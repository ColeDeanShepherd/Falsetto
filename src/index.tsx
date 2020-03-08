import "core-js";

import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./Components/App";
import "./index.css";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core";
import { polyfillWebAudio } from "./Audio";
import registerServiceWorker from "./registerServiceWorker";
import { isDevelopment } from './Config';
import { checkFlashCardSetIds, checkFlashCardIds } from './FlashCardGraph';
import { getErrorDescription } from './Error';
import { DependencyInjector } from './DependencyInjector';
import { IAnalytics } from './Analytics';

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
const rootElement = (
  <MuiThemeProvider theme={theme}>
    <App isEmbedded={false} />
  </MuiThemeProvider>
);

ReactDOM.render(
  rootElement,
  document.getElementById("root") as HTMLElement
);

//registerServiceWorker();