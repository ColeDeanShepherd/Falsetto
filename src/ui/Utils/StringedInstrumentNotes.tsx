import * as React from "react";
import { TextField, Checkbox } from "@material-ui/core";

import * as Utils from "../../lib/Core/Utils";
import { FlashCardId, FlashCard, FlashCardSide, createFlashCardId } from "../../FlashCard";
import { FlashCardStudySessionInfo, FlashCardSet } from "../../FlashCardSet";
import { StringedInstrumentTuning } from '../../lib/TheoryLib/StringedInstrumentTuning';
import { StringedInstrumentNote } from '../../lib/TheoryLib/StringedInstrumentNote';
import { flattenArrays, arrayContains, immutableToggleArrayElement } from '../../lib/Core/ArrayUtils';
import { clamp, range } from '../../lib/Core/MathUtils';
import { immutableToggleSetElement } from "../../lib/Core/SetUtils";
import { getOrdinalNumeral } from '../../lib/Core/Utils';

export interface IConfigData {
  maxFret: number;
  enabledStringIndexes: Set<number>;
};

export function forEachNote(
  tuning: StringedInstrumentTuning, maxMaxFretNumber: number, notes: Array<StringedInstrumentNote> | undefined,
  callbackFn: (stringIndex: number, fretNumber: number, i: number) => void
) {
  let i = 0;

  for (let stringIndex = 0; stringIndex < tuning.stringCount; stringIndex++) {
    for (let fretNumber = 0; fretNumber <= maxMaxFretNumber; fretNumber++) {
      if (notes) {
        const note = tuning.getNote(stringIndex, fretNumber);
        if (!notes.some(n => n.equals(note))) {
          continue;
        }
      }

      callbackFn(stringIndex, fretNumber, i);
      i++;
    }
  }
}
export function configDataToEnabledFlashCardIds(
  tuning: StringedInstrumentTuning, maxMaxFretNumber: number, notes: Array<StringedInstrumentNote> | undefined,
  flashCardSet: FlashCardSet, flashCards: Array<FlashCard>, configData: IConfigData
): Array<FlashCardId> {
  const flashCardIds = new Array<FlashCardId>();

  forEachNote(
    tuning, maxMaxFretNumber, notes,
    (stringIndex, fretNumber, i) => {
      if ((fretNumber <= configData.maxFret) && (configData.enabledStringIndexes.has(stringIndex))) {
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
  notes?: Array<StringedInstrumentNote>;
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
    const { tuning } = this.props;
    
    const configData = this.props.studySessionInfo.configData as IConfigData;

    return (
      <div>
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
        {tuning.openStringPitches.map((_, i) => {
          const stringIndex = (tuning.stringCount - 1) - i;
          const isChecked = configData.enabledStringIndexes.has(stringIndex)

          return (
            <p><Checkbox checked={isChecked} onChange={event => this.toggleStringEnabled(stringIndex)} />
            {getOrdinalNumeral(tuning.stringCount - stringIndex)} string</p>
          );
        })}
      </div>
    );
  }
  
  private onMaxFretStringChange(newValue: string) {
    this.setState({ maxFretNumberString: newValue });

    if (!this.props.onChange) { return; }
    
    const maxFret = parseInt(newValue, 10);
    if (isNaN(maxFret)) { return; }

    const clampedMaxFret = clamp(maxFret, 0, this.props.maxMaxFretNumber);

    const oldConfigData = this.props.studySessionInfo.configData as IConfigData;

    const newConfigData: IConfigData = {
      maxFret: clampedMaxFret,
      enabledStringIndexes: oldConfigData.enabledStringIndexes
    }
    const newEnabledFlashCardIds = configDataToEnabledFlashCardIds(
      this.props.tuning,
      this.props.maxMaxFretNumber, this.props.notes, this.props.studySessionInfo.flashCardSet,
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

  private toggleStringEnabled(stringIndex: number) {
    if (!this.props.onChange) { return; }

    const oldConfigData = this.props.studySessionInfo.configData as IConfigData;

    const newConfigData: IConfigData = {
      maxFret: oldConfigData.maxFret,
      enabledStringIndexes: immutableToggleSetElement(oldConfigData.enabledStringIndexes, stringIndex)
    };
    const newEnabledFlashCardIds = configDataToEnabledFlashCardIds(
      this.props.tuning,
      this.props.maxMaxFretNumber, this.props.notes, this.props.studySessionInfo.flashCardSet,
      this.props.studySessionInfo.flashCards, newConfigData
    );
    this.props.onChange(newEnabledFlashCardIds, newConfigData);
  }
}

export function getNoteFlashCardId(
  flashCardSetId: string,
  tuning: StringedInstrumentTuning,
  note: StringedInstrumentNote
): string {
  return createFlashCardId(
    flashCardSetId,
    {
      tuning: tuning.openStringPitches.map(p => p.toString(true, false)),
      stringIndex: note.stringIndex,
      fretNumber: note.getFretNumber(tuning)
    }
  );
}

export function createFlashCards(
  flashCardSetId: string,
  tuning: StringedInstrumentTuning,
  maxMaxFretNumber: number,
  flashCardBackSideRenderFn: (
    tuning: StringedInstrumentTuning,
    maxMaxFretNumber: number,
    note: StringedInstrumentNote
  ) => JSX.Element,
  notes?: Array<StringedInstrumentNote>
): FlashCard[] {
  notes = !notes
    ? flattenArrays(range(0, tuning.stringCount - 1)
    .map(stringIndex => range(0, maxMaxFretNumber)
      .map(fretNumber => {
        return tuning.getNote(
          stringIndex, fretNumber
        );
      })
    ))
    : notes;

  return notes
    .map(note => {
      const id = getNoteFlashCardId(flashCardSetId, tuning, note);

      const pitchString = note.pitch.toOneAccidentalAmbiguousString(false, true);

      return new FlashCard(
        id,
        new FlashCardSide(
          `${pitchString} on ${Utils.getOrdinalNumeral(tuning.stringCount - note.stringIndex)} string`,
          note
        ),
        new FlashCardSide(
          size => flashCardBackSideRenderFn(tuning, maxMaxFretNumber, note),
          note
        ),
      );
    });
}