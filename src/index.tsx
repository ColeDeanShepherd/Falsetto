import "core-js";

import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./Components/App";
import { FlashCardGroup } from "./FlashCardGroup";
import { StudyFlashCards } from "./Components/StudyFlashCards";
import "./index.css";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core";
import registerServiceWorker from "./registerServiceWorker";

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

const currentFlashCardGroup: FlashCardGroup | undefined = undefined;

const renderRootElementFn = (currentFlashCardGroup: FlashCardGroup | undefined) =>
  !currentFlashCardGroup
    ? <App />
    : <StudyFlashCards
        key={currentFlashCardGroup.route}
        title={currentFlashCardGroup.name}
        flashCards={currentFlashCardGroup.createFlashCards()}
        containerHeight={currentFlashCardGroup.containerHeight}
        initialSelectedFlashCardIndices={currentFlashCardGroup.initialSelectedFlashCardIndices}
        initialConfigData={currentFlashCardGroup.initialConfigData}
        renderFlashCardMultiSelect={currentFlashCardGroup.renderFlashCardMultiSelect}
        renderAnswerSelect={currentFlashCardGroup.renderAnswerSelect}
        enableInvertFlashCards={currentFlashCardGroup.enableInvertFlashCards}
        customNextFlashCardIdFilter={currentFlashCardGroup.customNextFlashCardIdFilter}
        showWatermark={true}
      />;
const rootElement = (
  <MuiThemeProvider theme={theme}>
    {renderRootElementFn(currentFlashCardGroup)}
  </MuiThemeProvider>
);

ReactDOM.render(
  rootElement,
  document.getElementById("root") as HTMLElement
);

//registerServiceWorker();