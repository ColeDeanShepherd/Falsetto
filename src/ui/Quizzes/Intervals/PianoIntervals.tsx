import * as React from "react";
import { Checkbox, TableRow, TableCell, Table, TableHead, TableBody } from "@material-ui/core";

import * as FlashCardUtils from "../Utils";
import { createFlashCardId, FlashCard, FlashCardId, FlashCardSide } from "../../../FlashCard";
import { FlashCardSet, FlashCardStudySessionInfo, FlashCardLevel } from "../../../FlashCardSet";
import { Pitch } from "../../../lib/TheoryLib/Pitch";
import { PitchLetter } from "../../../lib/TheoryLib/PitchLetter";
import { PianoKeyboard } from "../../Utils/PianoKeyboard";
import { createIntervalLevels } from '../../../lib/TheoryLib/Interval';
import { arrayContains, toggleArrayElement } from '../../../lib/Core/ArrayUtils';

const pianoKeyboardMaxHeight = 120;
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

export function configDataToEnabledFlashCardIds(
  flashCardSet: FlashCardSet, flashCards: Array<FlashCard>, configData: IConfigData
): Array<FlashCardId> {
  const newEnabledFlashCardIds = new Array<FlashCardId>();

  let i = 0;

  forEachInterval((pitches, intervalString) => {
    if (
      arrayContains(configData.enabledIntervals, intervalString) &&
      (configData.allowAccidentals || pitches.every(p => p.isNatural))
    ) {
      newEnabledFlashCardIds.push(flashCards[i].id);
    }

    i++;
  });

  return newEnabledFlashCardIds;
}

export interface IIntervalsFlashCardMultiSelectProps {
  studySessionInfo: FlashCardStudySessionInfo;
  onChange?: (newValue: Array<FlashCardId>, newConfigData: any) => void;
}
export interface IIntervalsFlashCardMultiSelectState {}
export class IntervalsFlashCardMultiSelect extends React.Component<IIntervalsFlashCardMultiSelectProps, IIntervalsFlashCardMultiSelectState> {
  public render(): JSX.Element {
    const configData = this.props.studySessionInfo.configData as IConfigData;
    const onAllowAccidentalsChange = this.onAllowAccidentalsChange.bind(this);

    const intervalCheckboxTableRows = intervals
      .map((interval, i) => {
        const isChecked = configData.enabledIntervals.indexOf(interval) >= 0;
        const isEnabled = !isChecked || (configData.enabledIntervals.length > 1);

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
            checked={configData.allowAccidentals}
            onChange={onAllowAccidentalsChange}
          />
          Allow Accidentals
        </div>
        <div>{intervalCheckboxes}</div>
      </div>
    );
  }

  private toggleIntervalEnabled(interval: string) {
    const configData = this.props.studySessionInfo.configData as IConfigData;
    const newEnabledIntervals = toggleArrayElement(
      configData.enabledIntervals,
      interval
    );
    
    if (newEnabledIntervals.length > 0) {
      const newConfigData: IConfigData = {
        enabledIntervals: newEnabledIntervals,
        allowAccidentals: configData.allowAccidentals
      };
      this.onChange(newConfigData);
    }
  }
  private onAllowAccidentalsChange(event: React.ChangeEvent, checked: boolean) {
    const configData = this.props.studySessionInfo.configData as IConfigData;
    if (!this.props.onChange) { return; }

    const newConfigData: IConfigData = {
      enabledIntervals: configData.enabledIntervals,
      allowAccidentals: checked
    };
    this.onChange(newConfigData);
  }
  private onChange(newConfigData: IConfigData) {
    if (!this.props.onChange) { return; }

    const newEnabledFlashCardIds = configDataToEnabledFlashCardIds(
      this.props.studySessionInfo.flashCardSet, this.props.studySessionInfo.flashCards, newConfigData
    );
    this.props.onChange(newEnabledFlashCardIds, newConfigData);
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
  info: FlashCardStudySessionInfo
): JSX.Element {
  const enabledIntervals = (info.configData as IConfigData).enabledIntervals;

  return (
    <div>
      {FlashCardUtils.renderStringAnswerSelect(enabledIntervals, info)}
    </div>
  );
}

export function createFlashCards(): Array<FlashCard> {
  const flashCards = new Array<FlashCard>();

  forEachInterval((pitches, intervalString) => {
    flashCards.push(new FlashCard(
      createFlashCardId(flashCardSetId, { pitches: pitches.map(p => p.toString(true, false)) }),
      new FlashCardSide(
        size => {
          return (
            <div>
              <PianoKeyboard
                maxHeight={pianoKeyboardMaxHeight}
                lowestPitch={minPitch}
                highestPitch={maxPitch}
                pressedPitches={pitches}
              />
            </div>
          );
        }
      ),
      new FlashCardSide(
        intervalString,
        intervalString
      )
    ));
  });

  return flashCards;
}
function createFlashCardSet(): FlashCardSet {
  const renderFlashCardMultiSelect = (
    studySessionInfo: FlashCardStudySessionInfo,
    onChange: (newValue: Array<FlashCardId>, newConfigData: any) => void
  ): JSX.Element => {
    return (
    <IntervalsFlashCardMultiSelect
      studySessionInfo={studySessionInfo}
      onChange={onChange}
    />
    );
  };

  const flashCardSet = new FlashCardSet(flashCardSetId,
    "Piano Intervals",
    createFlashCards
  );
  flashCardSet.configDataToEnabledFlashCardIds = configDataToEnabledFlashCardIds;
  flashCardSet.getInitialConfigData = (): IConfigData => ({
    enabledIntervals: intervals.slice(),
    allowAccidentals: true
  });
  flashCardSet.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  flashCardSet.renderAnswerSelect = renderAnswerSelect;
  flashCardSet.createFlashCardLevels = (flashCardSet: FlashCardSet, flashCards: Array<FlashCard>) => (
    createIntervalLevels(false, false)
      .map(level => new FlashCardLevel(
        level.name,
        flashCards
          .filter(fc => {
            const intervalString = fc.backSide.data as string;
            return arrayContains(level.intervalStrings, intervalString);
          })
          .map(fc => fc.id),
        (curConfigData: IConfigData) => (
          {
            enabledIntervals: level.intervalStrings.slice(),
            allowAccidentals: true
          } as IConfigData
        )
      ))
  );

  return flashCardSet;
}

export const flashCardSet = createFlashCardSet();