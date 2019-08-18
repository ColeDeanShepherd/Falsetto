import * as React from "react";
import { TextField } from "@material-ui/core";

import * as Utils from "../../../Utils";
import { Size2D } from "../../../Size2D";
import * as FlashCardUtils from "../Utils";
import {
  GuitarFretboard,
  standard6StringGuitarTuning
} from "../../Utils/GuitarFretboard";
import { FlashCard, FlashCardId } from "../../../FlashCard";
import { FlashCardSet, FlashCardStudySessionInfo } from "../../../FlashCardSet";
import { StringedInstrumentNote } from '../../../GuitarNote';

const flashCardSetId = "guitarNotes";

const guitarTuning = standard6StringGuitarTuning;

const MAX_MAX_FRET_NUMBER = 11;

interface IConfigData {
  maxFret: number
};

function forEachNote(callbackFn: (stringIndex: number, fretNumber: number, i: number) => void) {
  let i = 0;

  for (let stringIndex = 0; stringIndex < guitarTuning.stringCount; stringIndex++) {
    for (let fretNumber = 0; fretNumber <= MAX_MAX_FRET_NUMBER; fretNumber++) {
      callbackFn(stringIndex, fretNumber, i);
      i++;
    }
  }
}
export function configDataToEnabledFlashCardIds(
  flashCardSet: FlashCardSet, flashCards: Array<FlashCard>, configData: any
): Array<FlashCardId> {
  const flashCardIds = new Array<FlashCardId>();

  forEachNote((_, fretNumber, i) => {
    if (fretNumber <= configData.maxFret) {
      flashCardIds.push(flashCards[i].id);
    }
  });

  return flashCardIds;
}

export interface IGuitarNotesFlashCardMultiSelectProps {
  studySessionInfo: FlashCardStudySessionInfo;
  onChange?: (newValue: Array<FlashCardId>, newConfigData: any) => void;
}
export interface IGuitarNotesFlashCardMultiSelectState {}
export class GuitarNotesFlashCardMultiSelect extends React.Component<IGuitarNotesFlashCardMultiSelectProps, IGuitarNotesFlashCardMultiSelectState> {
  public render(): JSX.Element {
    const configData = this.props.studySessionInfo.configData as IConfigData;
    return (
      <TextField
        label="Max. Fret"
        value={configData.maxFret}
        onChange={event => this.onMaxFretStringChange(event.target.value)}
        type="number"
        InputLabelProps={{
          shrink: true,
        }}
        margin="normal"
      />
    );
  }
  
  private onMaxFretStringChange(newValue: string) {
    if (!this.props.onChange) { return; }
    
    const maxFret = parseInt(newValue, 10);
    if (isNaN(maxFret)) { return; }

    const clampedMaxFret = Utils.clamp(maxFret, 0, MAX_MAX_FRET_NUMBER);

    const newConfigData: IConfigData = {
      maxFret: clampedMaxFret
    }
    const newEnabledFlashCardIds = configDataToEnabledFlashCardIds(
      this.props.studySessionInfo.flashCardSet, this.props.studySessionInfo.flashCards, newConfigData
    );
    this.props.onChange(newEnabledFlashCardIds, newConfigData);
  }
}

export function createFlashCardSet(guitarNotes?: Array<StringedInstrumentNote>): FlashCardSet {
  const renderFlashCardMultiSelect = (
    studySessionInfo: FlashCardStudySessionInfo,
    onChange: (newValue: Array<FlashCardId>, newConfigData: any) => void
  ): JSX.Element => {
    return <GuitarNotesFlashCardMultiSelect
      studySessionInfo={studySessionInfo}
      onChange={onChange}
    />;
  };

  const initialConfigData: IConfigData = {
    maxFret: 11
  };

  const flashCardSet = new FlashCardSet(flashCardSetId, "Guitar Notes", () => createFlashCards(guitarNotes));
  flashCardSet.configDataToEnabledFlashCardIds = configDataToEnabledFlashCardIds;
  flashCardSet.initialConfigData = initialConfigData;
  flashCardSet.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  flashCardSet.renderAnswerSelect = FlashCardUtils.renderNoteAnswerSelect;
  flashCardSet.moreInfoUri = "https://medium.com/@aslushnikov/memorizing-fretboard-a9f4f28dbf03";
  flashCardSet.containerHeight = "120px";

  return flashCardSet;
}

export function createFlashCards(guitarNotes?: Array<StringedInstrumentNote>): FlashCard[] {
  const MAX_FRET_NUMBER = 11;
  guitarNotes = !guitarNotes
    ? Utils.flattenArrays(Utils.range(0, guitarTuning.stringCount - 1)
    .map(stringIndex => Utils.range(0, MAX_FRET_NUMBER)
      .map(fretNumber => {
        return guitarTuning.getNote(
          stringIndex, fretNumber
        );
      })
    ))
    : guitarNotes;

  return guitarNotes
    .map(guitarNote => {
      const deserializedId = {
        set: flashCardSetId,
        tuning: guitarTuning.openStringPitches.map(p => p.toString(true, false)),
        stringIndex: guitarNote.stringIndex,
        fretNumber: guitarNote.getFretNumber(guitarTuning)
      };
      const id = JSON.stringify(deserializedId);

      return FlashCard.fromRenderFns(
        id,
        (width, height) => {
          const size = Utils.shrinkRectToFit(
            new Size2D(width, height),
            new Size2D(400, 140)
          );
  
          return (
            <GuitarFretboard
              width={size.width} height={size.height}
              tuning={guitarTuning}
              pressedNotes={[guitarNote]}
            />
          );
        },
        guitarNote.pitch.toOneAccidentalAmbiguousString(false, true)
      );
    });
}