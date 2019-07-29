import * as React from "react";
import { TextField } from "@material-ui/core";

import * as Utils from "../../../Utils";
import { Size2D } from "../../../Size2D";
import * as FlashCardUtils from "../Utils";
import {
  ViolinFingerboard,
  standardViolinTuning
} from "../../Utils/GuitarFretboard";
import { FlashCard } from "../../../FlashCard";
import { FlashCardGroup } from "../../../FlashCardGroup";
import { StringedInstrumentNote } from '../../../GuitarNote';

interface IConfigData {
  maxFret: number
};

export function configDataToEnabledQuestionIds(configData: IConfigData): Array<number> {
  const notesPerString = 12;

  const enabledFlashCardIds = new Array<number>();
  for (let stringIndex = 0; stringIndex < standardViolinTuning.stringCount; stringIndex++) {
    for (let fretNumber = 0; fretNumber <= configData.maxFret; fretNumber++) {
      enabledFlashCardIds.push((notesPerString * stringIndex) + fretNumber);
    }
  }

  return enabledFlashCardIds;
}

export interface IViolinNotesFlashCardMultiSelectProps {
  flashCards: FlashCard[];
  configData: IConfigData;
  selectedFlashCardIndices: number[];
  onChange?: (newValue: number[], newConfigData: any) => void;
}
export interface IViolinNotesFlashCardMultiSelectState {}
export class ViolinNotesFlashCardMultiSelect extends React.Component<IViolinNotesFlashCardMultiSelectProps, IViolinNotesFlashCardMultiSelectState> {
  public render(): JSX.Element {
    return (
      <TextField
        label="Max. Fret"
        value={this.props.configData.maxFret}
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

    const clampedMaxFret = Utils.clamp(maxFret, 0, 11);

    const newConfigData: IConfigData = {
      maxFret: clampedMaxFret
    }
    const newEnabledFlashCardIndices = configDataToEnabledQuestionIds(newConfigData);
    this.props.onChange(newEnabledFlashCardIndices, newConfigData);
  }
}

export function createFlashCardGroup(notes?: Array<StringedInstrumentNote>): FlashCardGroup {
  const renderFlashCardMultiSelect = (
    flashCards: Array<FlashCard>,
    selectedFlashCardIndices: number[],
    configData: any,
    onChange: (newValue: number[], newConfigData: any) => void
  ): JSX.Element => {
    return <ViolinNotesFlashCardMultiSelect
      flashCards={flashCards}
      configData={configData}
      selectedFlashCardIndices={selectedFlashCardIndices}
      onChange={onChange}
    />;
  };

  const initialConfigData: IConfigData = {
    maxFret: 11
  };

  const group = new FlashCardGroup("Violin Notes", () => createFlashCards(notes));
  group.initialSelectedFlashCardIndices = configDataToEnabledQuestionIds(initialConfigData);
  group.initialConfigData = initialConfigData;
  group.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  group.renderAnswerSelect = FlashCardUtils.renderNoteAnswerSelect;
  group.enableInvertFlashCards = false;
  //group.moreInfoUri = "https://medium.com/@aslushnikov/memorizing-fretboard-a9f4f28dbf03";
  group.containerHeight = "120px";

  return group;
}

export function createFlashCards(notes?: Array<StringedInstrumentNote>): FlashCard[] {
  const MAX_FRET_NUMBER = 11;
  notes = !notes
    ? Utils.flattenArrays(Utils.range(0, standardViolinTuning.stringCount - 1)
    .map(stringIndex => Utils.range(0, MAX_FRET_NUMBER)
      .map(fretNumber => {
        return standardViolinTuning.getNote(
          stringIndex, fretNumber
        );
      })
    ))
    : notes;

  return notes
    .map(note => FlashCard.fromRenderFns(
      (width, height) => {
        const size = Utils.shrinkRectToFit(
          new Size2D(width, height),
          new Size2D(400, 140)
        );

        return (
          <ViolinFingerboard
            width={size.width} height={size.height}
            tuning={standardViolinTuning}
            pressedNotes={[note]}
          />
        );
      },
      note.pitch.toOneAccidentalAmbiguousString(false, true)
    ));
}