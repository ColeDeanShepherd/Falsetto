import * as React from "react";
import { Checkbox, TableRow, TableCell, Table, TableHead, TableBody } from "@material-ui/core";

import * as Utils from "../../../lib/Core/Utils";
import * as FlashCardUtils from "../Utils";
import { FlashCard, FlashCardId, FlashCardSide } from "../../../FlashCard";
import { FlashCardSet, FlashCardStudySessionInfo, FlashCardLevel } from "../../../FlashCardSet";
import { Pitch, pitchRange } from "../../../lib/TheoryLib/Pitch";
import { PitchLetter } from "../../../lib/TheoryLib/PitchLetter";
import { SheetMusicChord } from "./SheetMusicChords";
import { Size2D } from '../../../lib/Core/Size2D';
import { Interval, createIntervalLevels } from '../../../lib/TheoryLib/Interval';
import { arrayContains, toggleArrayElement } from '../../../lib/Core/ArrayUtils';

const flashCardSetId = "sheetIntervals";

const allowedPitches = [
  new Pitch(PitchLetter.C, -1, 0),
  new Pitch(PitchLetter.C, 0, 0),
  new Pitch(PitchLetter.C, 1, 0),
  new Pitch(PitchLetter.D, -1, 0),
  new Pitch(PitchLetter.D, 0, 0),
  new Pitch(PitchLetter.E, -1, 0),
  new Pitch(PitchLetter.E, 0, 0),
  new Pitch(PitchLetter.F, 0, 0),
  new Pitch(PitchLetter.F, 1, 0),
  new Pitch(PitchLetter.G, -1, 0),
  new Pitch(PitchLetter.G, 0, 0),
  new Pitch(PitchLetter.A, -1, 0),
  new Pitch(PitchLetter.A, 0, 0),
  new Pitch(PitchLetter.B, -1, 0),
  new Pitch(PitchLetter.B, 0, 0)
];
const minPitch = new Pitch(PitchLetter.C, -1, 2);
const maxPitch = new Pitch(PitchLetter.C, 1, 6);
const firstPitches = pitchRange(minPitch, maxPitch, -1, 1)
  .filter(pitch =>
    allowedPitches.some(allowedPitch =>
      (pitch.letter === allowedPitch.letter) &&
      (pitch.signedAccidental === allowedPitch.signedAccidental)
    )
  );
const intervals = [
  "m2",
  "M2",
  "m3",
  "M3",
  "P4",
  "A4",
  "d5",
  "P5",
  "m6",
  "M6",
  "m7",
  "M7",
  "P8"
];

interface IConfigData {
  enabledIntervals: string[];
  allowAccidentals: boolean;
};

export function configDataToEnabledFlashCardIds(
  flashCardSet: FlashCardSet, flashCards: Array<FlashCard>, configData: IConfigData
): Array<FlashCardId> {
  const newEnabledFlashCardIds = new Array<FlashCardId>();

  forEachInterval((pitches, interval, i) => {
    if (
      arrayContains(configData.enabledIntervals, interval.toString()) &&
      (configData.allowAccidentals || pitches.every(p => p.isNatural))
    ) {
      newEnabledFlashCardIds.push(flashCards[i].id);
    }
  });

  return newEnabledFlashCardIds;
}

function forEachInterval(callbackFn: (pitches: Array<Pitch>, interval: Interval, i: number) => void) {
  let i = 0;

  for (let note1Index = 0; note1Index < firstPitches.length; note1Index++) {
    for (let note2Index = note1Index + 1; note2Index < firstPitches.length; note2Index++) {
      const pitches = [firstPitches[note1Index], firstPitches[note2Index]];
      const interval = Interval.fromPitches(pitches[0], pitches[1]);

      if (arrayContains(intervals, interval.toString())) {
        callbackFn(pitches, interval, i);
        i++;
      }
    }
  }
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

  forEachInterval((pitches, interval) => {
    flashCards.push(new FlashCard(
      JSON.stringify({ set: flashCardSetId, pitches: pitches.map(p => p.toString(true)) }),
      new FlashCardSide(
        size => (
          <div>
            <SheetMusicChord
              size={new Size2D(300, 200)}
              pitches={pitches}
            />
          </div>
        )
      ),
      new FlashCardSide(
        interval.toString(),
        interval.toString()
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
    "Sheet Music Intervals",
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
    createIntervalLevels(false, true)
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