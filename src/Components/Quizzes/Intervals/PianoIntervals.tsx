import * as React from "react";
import { Checkbox, TableRow, TableCell, Table, TableHead, TableBody } from "@material-ui/core";

import * as Utils from "../../../Utils";
import { Vector2D } from '../../../Vector2D';
import { Size2D } from "../../../Size2D";
import { Rect2D } from '../../../Rect2D';
import * as FlashCardUtils from "../Utils";
import { FlashCard } from "../../../FlashCard";
import { FlashCardGroup, RenderAnswerSelectArgs } from "../../../FlashCardGroup";
import { Pitch } from "../../../Pitch";
import { PitchLetter } from "../../../PitchLetter";
import { PianoKeyboard } from "../../Utils/PianoKeyboard";
import { AnswerDifficulty } from '../../../StudyAlgorithm';

const minPitch = new Pitch(PitchLetter.C, 0, 4);
const maxPitch = new Pitch(PitchLetter.B, 0, 5);

const intervals = [
  "m2",
  "M2",
  "m3",
  "M3",
  "P4",
  "A4/d5",
  "P5",
  "m6",
  "M6",
  "m7",
  "M7",
  "P8"
];

const flashCardSetId = "pianoIntervals";

interface IConfigData {
  enabledIntervals: string[];
  allowAccidentals: boolean;
};

export function configDataToEnabledQuestionIds(configData: IConfigData): Array<number> {
  const newEnabledFlashCardIndices = new Array<number>();

  let i = 0;

  forEachInterval((pitches, intervalString) => {
    if (
      Utils.arrayContains(configData.enabledIntervals, intervalString) &&
      (configData.allowAccidentals || pitches.every(p => p.isNatural))
    ) {
      newEnabledFlashCardIndices.push(i);
    }

    i++;
  });

  return newEnabledFlashCardIndices;
}

export interface IIntervalsFlashCardMultiSelectProps {
  flashCards: FlashCard[];
  configData: IConfigData;
  selectedFlashCardIndices: number[];
  onChange?: (newValue: number[], newConfigData: any) => void;
}
export interface IIntervalsFlashCardMultiSelectState {}
export class IntervalsFlashCardMultiSelect extends React.Component<IIntervalsFlashCardMultiSelectProps, IIntervalsFlashCardMultiSelectState> {
  public render(): JSX.Element {
    const onAllowAccidentalsChange = this.onAllowAccidentalsChange.bind(this);

    const intervalCheckboxTableRows = intervals
      .map((interval, i) => {
        const isChecked = this.props.configData.enabledIntervals.indexOf(interval) >= 0;
        const isEnabled = !isChecked || (this.props.configData.enabledIntervals.length > 1);

        return (
          <TableRow key={i}>
            <TableCell><Checkbox checked={isChecked} onChange={event => this.toggleIntervalEnabled(interval)} disabled={!isEnabled} /></TableCell>
            <TableCell>{interval}</TableCell>
          </TableRow>
        );
      }, this);
    const intervalCheckboxes = (
      <Table className="table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Interval</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {intervalCheckboxTableRows}
        </TableBody>
      </Table>
    );

    return (
      <div>
        <div style={{marginTop: "1em"}}>
          <Checkbox
            checked={this.props.configData.allowAccidentals}
            onChange={onAllowAccidentalsChange}
          />
          Allow Accidentals
        </div>
        <div>{intervalCheckboxes}</div>
      </div>
    );
  }

  private toggleIntervalEnabled(interval: string) {
    const newEnabledIntervals = Utils.toggleArrayElement(
      this.props.configData.enabledIntervals,
      interval
    );
    
    if (newEnabledIntervals.length > 0) {
      const newConfigData: IConfigData = {
        enabledIntervals: newEnabledIntervals,
        allowAccidentals: this.props.configData.allowAccidentals
      };
      this.onChange(newConfigData);
    }
  }
  private onAllowAccidentalsChange(event: React.ChangeEvent, checked: boolean) {
    if (!this.props.onChange) { return; }

    const newConfigData: IConfigData = {
      enabledIntervals: this.props.configData.enabledIntervals,
      allowAccidentals: checked
    };
    this.onChange(newConfigData);
  }
  private onChange(newConfigData: IConfigData) {
    if (!this.props.onChange) { return; }

    const newEnabledFlashCardIndices = configDataToEnabledQuestionIds(newConfigData);
    this.props.onChange(newEnabledFlashCardIndices, newConfigData);
  }
}

function forEachInterval(fn: (pitches: Array<Pitch>, intervalString: string) => void) {
  const minPitchMidiNumber = minPitch.midiNumber;
  const maxPitchMidiNumber = maxPitch.midiNumber;

  for (let pitch1MidiNumber = minPitchMidiNumber; pitch1MidiNumber < maxPitchMidiNumber; pitch1MidiNumber++) {
    for (let pitch2MidiNumber = pitch1MidiNumber + 1; pitch2MidiNumber <= maxPitchMidiNumber; pitch2MidiNumber++) {
      if (pitch1MidiNumber === pitch2MidiNumber) { continue; }

      const halfSteps = pitch2MidiNumber - pitch1MidiNumber;
      if (halfSteps > 12) { continue; }
      
      const lowPitch = Pitch.createFromMidiNumber(pitch1MidiNumber);
      const highPitch = Pitch.createFromMidiNumber(pitch2MidiNumber);
      const intervalString = intervals[halfSteps - 1];

      fn([lowPitch, highPitch], intervalString);
    }
  }
}

export function renderAnswerSelect(
  state: RenderAnswerSelectArgs
): JSX.Element {
  return (
    <div>
      {FlashCardUtils.renderStringAnswerSelect(intervals, state)}
    </div>
  );
}

export function createFlashCards(): Array<FlashCard> {
  const flashCards = new Array<FlashCard>();

  forEachInterval((pitches, intervalString) => {
    const deserializedId = {
      set: flashCardSetId,
      midiNumbers: pitches.map(p => p.midiNumber)
    };
    const id = JSON.stringify(deserializedId);

    flashCards.push(FlashCard.fromRenderFns(
      id,
      (width, height) => {
        const size = Utils.shrinkRectToFit(
          new Size2D(width, height),
          new Size2D(400, 100)
        );
        
        return (
          <div>
            <PianoKeyboard
              rect={new Rect2D(size, new Vector2D(0, 0))}
              lowestPitch={minPitch}
              highestPitch={maxPitch}
              pressedPitches={pitches}
            />
          </div>
        );
      },
      intervalString
    ));
  });

  return flashCards;
}
export function createFlashCardGroup(): FlashCardGroup {

  const renderFlashCardMultiSelect = (
    flashCards: Array<FlashCard>,
    selectedFlashCardIndices: number[],
    configData: any,
    onChange: (newValue: number[], newConfigData: any) => void
  ): JSX.Element => {
    return (
    <IntervalsFlashCardMultiSelect
      flashCards={flashCards}
      configData={configData}
      selectedFlashCardIndices={selectedFlashCardIndices}
      onChange={onChange}
    />
    );
  };

  const initialConfigData: IConfigData = {
    enabledIntervals: intervals.slice(),
    allowAccidentals: true
  };
  
  const group = new FlashCardGroup(flashCardSetId,
    "Piano Intervals",
    createFlashCards
  );
  group.initialSelectedFlashCardIndices = configDataToEnabledQuestionIds(initialConfigData);
  group.initialConfigData = initialConfigData;
  group.enableInvertFlashCards = false;
  group.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  group.renderAnswerSelect = renderAnswerSelect;
  group.containerHeight = "100px";

  return group;
}