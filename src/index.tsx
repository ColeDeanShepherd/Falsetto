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