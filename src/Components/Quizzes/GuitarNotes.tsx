import * as React from "react";
import { TextField } from "@material-ui/core";

import * as Utils from "../../Utils";
import { Size2D } from "../../Size2D";
import * as FlashCardUtils from "./Utils";
import {
  GuitarFretboard,
  STRING_COUNT,
  standardGuitarTuning,
  GuitarNote
} from "../GuitarFretboard";
import { FlashCard } from "../../FlashCard";
import { FlashCardGroup } from "../../FlashCardGroup";

interface IConfigData {
  maxFret: number
};

export function configDataToEnabledQuestionIds(configData: IConfigData): Array<number> {
  const notesPerString = 12;

  const enabledFlashCardIndices = new Array<number>();
  for (let stringIndex = 0; stringIndex < STRING_COUNT; stringIndex++) {
    for (let fretNumber = 0; fretNumber <= configData.maxFret; fretNumber++) {
      enabledFlashCardIndices.push((notesPerString * stringIndex) + fretNumber);
    }
  }

  return enabledFlashCardIndices;
}

export interface IGuitarNotesFlashCardMultiSelectProps {
  flashCards: FlashCard[];
  configData: IConfigData;
  selectedFlashCardIndices: number[];
  onChange?: (newValue: number[], newConfigData: any) => void;
}
export interface IGuitarNotesFlashCardMultiSelectState {}
export class GuitarNotesFlashCardMultiSelect extends React.Component<IGuitarNotesFlashCardMultiSelectProps, IGuitarNotesFlashCardMultiSelectState> {
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

export function createFlashCardGroup(guitarNotes?: Array<GuitarNote>): FlashCardGroup {
  const renderFlashCardMultiSelect = (
    flashCards: Array<FlashCard>,
    selectedFlashCardIndices: number[],
    configData: any,
    onChange: (newValue: number[], newConfigData: any) => void
  ): JSX.Element => {
    return <GuitarNotesFlashCardMultiSelect
      flashCards={flashCards}
      configData={configData}
      selectedFlashCardIndices={selectedFlashCardIndices}
      onChange={onChange}
    />;
  };

  const initialConfigData: IConfigData = {
    maxFret: 11
  };

  const group = new FlashCardGroup("Guitar Notes", () => createFlashCards(guitarNotes));
  group.initialSelectedFlashCardIndices = configDataToEnabledQuestionIds(initialConfigData);
  group.initialConfigData = initialConfigData;
  group.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  group.renderAnswerSelect = FlashCardUtils.renderNoteAnswerSelect;
  group.enableInvertFlashCards = false;
  group.moreInfoUri = "https://medium.com/@aslushnikov/memorizing-fretboard-a9f4f28dbf03";
  group.containerHeight = "120px";

  return group;
}

export function createFlashCards(guitarNotes?: Array<GuitarNote>): FlashCard[] {
  const MAX_FRET_NUMBER = 11;
  guitarNotes = !guitarNotes
    ? Utils.flattenArrays(Utils.range(0, STRING_COUNT - 1)
    .map(stringIndex => Utils.range(0, MAX_FRET_NUMBER)
      .map(fretNumber => {
        return standardGuitarTuning.getNote(
          stringIndex, fretNumber
        );
      })
    ))
    : guitarNotes;

  return guitarNotes
    .map(guitarNote => FlashCard.fromRenderFns(
      (width, height) => {
        const size = Utils.shrinkRectToFit(
          new Size2D(width, height),
          new Size2D(400, 140)
        );

        return (
          <GuitarFretboard
            width={size.width} height={size.height}
            pressedNotes={[guitarNote]}
          />
        );
      },
      guitarNote.pitch.toOneAccidentalAmbiguousString(false, true)
    ));
}