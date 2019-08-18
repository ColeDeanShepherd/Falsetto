import * as React from "react";
import { TextField } from "@material-ui/core";

import * as Utils from "../../../Utils";
import { Size2D } from "../../../Size2D";
import * as FlashCardUtils from "../Utils";
import { ViolinFingerboard } from "../../Utils/GuitarFretboard";
import { standardViolinTuning } from "../../Utils/StringedInstrumentTuning";
import { FlashCard, FlashCardId } from "../../../FlashCard";
import { FlashCardSet, FlashCardStudySessionInfo } from "../../../FlashCardSet";
import { StringedInstrumentNote } from '../../../GuitarNote';

const flashCardSetId = "violinNotes";

const violinTuning = standardViolinTuning;

const DEFAULT_MAX_FRET_NUMBER = 13;

interface IConfigData {
  maxFret: number
};

function forEachNote(callbackFn: (stringIndex: number, fretNumber: number, i: number) => void) {
  let i = 0;

  for (let stringIndex = 0; stringIndex < violinTuning.stringCount; stringIndex++) {
    for (let fretNumber = 0; fretNumber <= DEFAULT_MAX_FRET_NUMBER; fretNumber++) {
      callbackFn(stringIndex, fretNumber, i);
      i++;
    }
  }
}
export function configDataToEnabledFlashCardIds(
  flashCardSet: FlashCardSet, flashCards: Array<FlashCard>, configData: IConfigData
): Array<FlashCardId> {
  const flashCardIds = new Array<FlashCardId>();

  forEachNote((_, fretNumber, i) => {
    if (fretNumber <= configData.maxFret) {
      flashCardIds.push(flashCards[i].id);
    }
  });

  return flashCardIds;
}

export interface IViolinNotesFlashCardMultiSelectProps {
  studySessionInfo: FlashCardStudySessionInfo;
  onChange?: (newValue: Array<FlashCardId>, newConfigData: any) => void;
}
export interface IViolinNotesFlashCardMultiSelectState {}
export class ViolinNotesFlashCardMultiSelect extends React.Component<IViolinNotesFlashCardMultiSelectProps, IViolinNotesFlashCardMultiSelectState> {
  public render(): JSX.Element {
    const configData = this.props.studySessionInfo.configData as IConfigData;

    return (
      <TextField
        label={"Max. \"Fret\""}
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

    const clampedMaxFret = Utils.clamp(maxFret, 0, DEFAULT_MAX_FRET_NUMBER);

    const newConfigData: IConfigData = {
      maxFret: clampedMaxFret
    }
    const newEnabledFlashCardIds = configDataToEnabledFlashCardIds(
      this.props.studySessionInfo.flashCardSet, this.props.studySessionInfo.flashCards, newConfigData
    );
    this.props.onChange(newEnabledFlashCardIds, newConfigData);
  }
}

export function createFlashCardSet(notes?: Array<StringedInstrumentNote>): FlashCardSet {
  const renderFlashCardMultiSelect = (
    studySessionInfo: FlashCardStudySessionInfo,
    onChange: (newValue: Array<FlashCardId>, newConfigData: any) => void
  ): JSX.Element => {
    return <ViolinNotesFlashCardMultiSelect
      studySessionInfo={studySessionInfo}
      onChange={onChange}
    />;
  };

  const initialConfigData: IConfigData = {
    maxFret: DEFAULT_MAX_FRET_NUMBER
  };

  const flashCardSet = new FlashCardSet(flashCardSetId, "Violin Notes", () => createFlashCards(notes));
  flashCardSet.configDataToEnabledFlashCardIds = configDataToEnabledFlashCardIds;
  flashCardSet.initialConfigData = initialConfigData;
  flashCardSet.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  flashCardSet.renderAnswerSelect = FlashCardUtils.renderNoteAnswerSelect;
  //flashCardSet.moreInfoUri = "https://medium.com/@aslushnikov/memorizing-fretboard-a9f4f28dbf03";
  flashCardSet.containerHeight = "160px";

  return flashCardSet;
}

export function createFlashCards(notes?: Array<StringedInstrumentNote>): FlashCard[] {
  notes = !notes
    ? Utils.flattenArrays(Utils.range(0, violinTuning.stringCount - 1)
    .map(stringIndex => Utils.range(0, DEFAULT_MAX_FRET_NUMBER)
      .map(fretNumber => {
        return violinTuning.getNote(
          stringIndex, fretNumber
        );
      })
    ))
    : notes;

  return notes
    .map(note => {
      const deserializedId = {
        set: flashCardSetId,
        tuning: violinTuning.openStringPitches.map(p => p.toString(true, false)),
        stringIndex: note.stringIndex,
        fretNumber: note.getFretNumber(violinTuning)
      };
      const id = JSON.stringify(deserializedId);

      return FlashCard.fromRenderFns(
        id,
        (width, height) => {
          const size = new Size2D(500, 140);
          const style: any = { width: "100%", maxWidth: `${size.width}px` };
  
          return (
            <ViolinFingerboard
              width={size.width} height={size.height}
              tuning={violinTuning}
              fretCount={DEFAULT_MAX_FRET_NUMBER}
              pressedNotes={[note]}
              style={style}
            />
          );
        },
        note.pitch.toOneAccidentalAmbiguousString(false, true)
      );
    });
}