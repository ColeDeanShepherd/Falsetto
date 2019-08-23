import * as React from "react";
import { TextField } from "@material-ui/core";

import * as Utils from "../../Utils";
import { FlashCardId, FlashCard } from "../../FlashCard";
import { FlashCardStudySessionInfo, FlashCardSet } from "../../FlashCardSet";
import { StringedInstrumentTuning } from './StringedInstrumentTuning';
import { StringedInstrumentNote } from '../../StringedInstrumentNote';

export interface IConfigData {
  maxFret: number
};

export function forEachNote(
  tuning: StringedInstrumentTuning, maxMaxFretNumber: number,
  callbackFn: (stringIndex: number, fretNumber: number, i: number) => void
) {
  let i = 0;

  for (let stringIndex = 0; stringIndex < tuning.stringCount; stringIndex++) {
    for (let fretNumber = 0; fretNumber <= maxMaxFretNumber; fretNumber++) {
      callbackFn(stringIndex, fretNumber, i);
      i++;
    }
  }
}
export function configDataToEnabledFlashCardIds(
  tuning: StringedInstrumentTuning, maxMaxFretNumber: number,
  flashCardSet: FlashCardSet, flashCards: Array<FlashCard>, configData: IConfigData
): Array<FlashCardId> {
  const flashCardIds = new Array<FlashCardId>();

  forEachNote(
    tuning, maxMaxFretNumber,
    (_, fretNumber, i) => {
      if (fretNumber <= configData.maxFret) {
        flashCardIds.push(flashCards[i].id);
      }
    }
  );

  return flashCardIds;
}

export interface IStringedInstrumentNotesFlashCardMultiSelectProps {
  tuning: StringedInstrumentTuning;
  maxMaxFretNumber: number;
  studySessionInfo: FlashCardStudySessionInfo;
  onChange?: (newValue: Array<FlashCardId>, newConfigData: any) => void;
}
export interface IStringedInstrumentNotesFlashCardMultiSelectState {
  maxFretNumberString: string;
}
export class StringedInstrumentNotesFlashCardMultiSelect extends React.Component<IStringedInstrumentNotesFlashCardMultiSelectProps, IStringedInstrumentNotesFlashCardMultiSelectState> {
  public constructor(props: IStringedInstrumentNotesFlashCardMultiSelectProps) {
    super(props);
    
    const configData = this.props.studySessionInfo.configData as IConfigData;

    this.state = {
      maxFretNumberString: configData.maxFret.toString()
    };
  }

  public componentWillReceiveProps(nextProps: IStringedInstrumentNotesFlashCardMultiSelectProps) {
    const configData = nextProps.studySessionInfo.configData as IConfigData;
    this.setState({ maxFretNumberString: configData.maxFret.toString() });
  }

  public render(): JSX.Element {
    return (
      <TextField
        label="Max. Fret"
        value={this.state.maxFretNumberString}
        onChange={event => this.onMaxFretStringChange(event.target.value)}
        onBlur={event => this.onMaxFretStringInputBlur()}
        type="number"
        InputLabelProps={{
          shrink: true,
        }}
        margin="normal"
      />
    );
  }
  
  private onMaxFretStringChange(newValue: string) {
    this.setState({ maxFretNumberString: newValue });

    if (!this.props.onChange) { return; }
    
    const maxFret = parseInt(newValue, 10);
    if (isNaN(maxFret)) { return; }

    const clampedMaxFret = Utils.clamp(maxFret, 0, this.props.maxMaxFretNumber);

    const newConfigData: IConfigData = {
      maxFret: clampedMaxFret
    }
    const newEnabledFlashCardIds = configDataToEnabledFlashCardIds(
      this.props.tuning,
      this.props.maxMaxFretNumber, this.props.studySessionInfo.flashCardSet,
      this.props.studySessionInfo.flashCards, newConfigData
    );
    this.props.onChange(newEnabledFlashCardIds, newConfigData);
  }
  private onMaxFretStringInputBlur() {
    const maxFret = parseInt(this.state.maxFretNumberString, 10);
    const newMaxFretNumberString = isNaN(maxFret)
      ? (this.props.studySessionInfo.configData as IConfigData).maxFret.toString()
      : maxFret.toString();
    this.setState({ maxFretNumberString: newMaxFretNumberString });
  }
}

export function createFlashCards(
  flashCardSetId: string,
  tuning: StringedInstrumentTuning,
  maxMaxFretNumber: number,
  flashCardFrontSideRenderFn: (
    tuning: StringedInstrumentTuning,
    maxMaxFretNumber: number,
    note: StringedInstrumentNote
  ) => JSX.Element,
  notes?: Array<StringedInstrumentNote>
): FlashCard[] {
  notes = !notes
    ? Utils.flattenArrays(Utils.range(0, tuning.stringCount - 1)
    .map(stringIndex => Utils.range(0, maxMaxFretNumber)
      .map(fretNumber => {
        return tuning.getNote(
          stringIndex, fretNumber
        );
      })
    ))
    : notes;

  return notes
    .map(note => {
      const deserializedId = {
        set: flashCardSetId,
        tuning: tuning.openStringPitches.map(p => p.toString(true, false)),
        stringIndex: note.stringIndex,
        fretNumber: note.getFretNumber(tuning)
      };
      const id = JSON.stringify(deserializedId);

      return FlashCard.fromRenderFns(
        id,
        size => flashCardFrontSideRenderFn(tuning, maxMaxFretNumber, note),
        note.pitch.toOneAccidentalAmbiguousString(false, true)
      );
    });
}