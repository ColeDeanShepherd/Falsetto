import "core-js";
import "whatwg-fetch";
import "pepjs";

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import * as React from "react";
import * as ReactDOM from "react-dom";

import { createMuiTheme, MuiThemeProvider } from "@material-ui/core";

import registerServiceWorker from "./registerServiceWorker";

import { getErrorDescription } from './Error';
import { isDevelopment, getStripePublishableApiKey } from './Config';
import { DependencyInjector } from './DependencyInjector';
import { IAnalytics } from './Analytics';
import { polyfillWebAudio } from "./Audio/Audio";

import { checkFlashCardSetIds, checkFlashCardIds } from './FlashCardGraph';

import { AppModel } from './App/Model';
import { AppView } from "./ui/App/View";

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

const stripePromise = loadStripe(getStripePublishableApiKey());

const rootElement = (
  <MuiThemeProvider theme={theme}>
    <Elements stripe={stripePromise}>
      <AppView />
    </Elements>
  </MuiThemeProvider>
);

ReactDOM.render(
  rootElement,
  document.getElementById("root") as HTMLElement
);

//registerServiceWorker();