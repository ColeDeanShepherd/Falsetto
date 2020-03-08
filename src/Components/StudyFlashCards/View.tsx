import * as React from "react";

import { FlashCardSet } from '../../FlashCardSet';
import { StudyFlashCards } from '../StudyFlashCards';
import App from '../App';

export function createStudyFlashCardSetComponent(
  flashCardSet: FlashCardSet, isEmbedded: boolean, hideMoreInfoUri: boolean,
  title?: string, style?: any, enableSettings?: boolean
): JSX.Element {
  const flashCards = flashCardSet.createFlashCards();
  const flashCardLevels = (flashCardSet.createFlashCardLevels !== undefined)
    ? flashCardSet.createFlashCardLevels(flashCardSet, flashCards)
    : [];

  return (
    <StudyFlashCards
      key={flashCardSet.route}
      database={App.instance.database}
      userManager={App.instance.userManager}
      title={title ? title : flashCardSet.name}
      flashCardSet={flashCardSet}
      flashCards={flashCards}
      hideMoreInfoUri={hideMoreInfoUri}
      enableSettings={enableSettings}
      flashCardLevels={flashCardLevels}
      isEmbedded={isEmbedded}
      style={style}
    />
  );
}
