import * as React from "react";

import { PianoKeyboard } from "../../Utils/PianoKeyboard";
import { createFlashCardId, FlashCard, FlashCardId, FlashCardSide } from "../../../FlashCard";
import { FlashCardSet, FlashCardStudySessionInfo } from "../../../FlashCardSet";

import { Pitch } from '../../../lib/TheoryLib/Pitch';
import { PitchLetter } from "../../../lib/TheoryLib/PitchLetter";

import { PianoKeysAnswerSelect } from '../../Utils/PianoKeysAnswerSelect';
import { commonKeyPitchesOctave0 } from "../../../lib/TheoryLib/Key";
import { TableRow, TableCell, Checkbox, Table, TableHead, TableBody, Grid } from "@material-ui/core";
import { arrayContains, toggleArrayElement } from "../../../lib/Core/ArrayUtils";

const chordNoteIntervalsAndNames = [
  { interval: 0, name: "1" },
  { interval: 1, name: "♭9" },
  { interval: 2, name: "9" },
  { interval: 3, name: "♭3" },
  { interval: 4, name: "3" },
  { interval: 5, name: "11" },
  { interval: 6, name: "#11" },
  { interval: 7, name: "5" },
  { interval: 8, name: "♭13" },
  { interval: 9, name: "13" },
  { interval: 10, name: "♭7" },
  { interval: 11, name: "7" },
];

const octaveNumber = 4;
const lowestPitch = new Pitch(PitchLetter.C, 0, octaveNumber);
const highestPitch = new Pitch(PitchLetter.B, 0, octaveNumber);

const pianoMaxWidth = 300;

interface IConfigData {
  enabledChordRootPitches: Array<Pitch>;
}

const initialConfigData: IConfigData = {
  enabledChordRootPitches: [commonKeyPitchesOctave0[0]]
};

export function forEachRelativeChordNote(callbackFn: (rootPitch: Pitch, interval: number, name: string, i: number) => void) {
  for (const rootPitch of commonKeyPitchesOctave0) {
    for (let i = 0; i < chordNoteIntervalsAndNames.length; i++) {
      const p = chordNoteIntervalsAndNames[i];
      callbackFn(rootPitch, p.interval, p.name, i);
    }
  }
}

export function configDataToEnabledFlashCardIds(
  flashCardSet: FlashCardSet, flashCards: Array<FlashCard>, configData: IConfigData
): Array<FlashCardId> {
  let index = 0;
  const newEnabledFlashCardIds = new Array<FlashCardId>();

  forEachRelativeChordNote((rootPitch, interval, name, i) => {
    if (arrayContains(configData.enabledChordRootPitches, rootPitch)) {
      newEnabledFlashCardIds.push(flashCards[index].id);
    }

    index++;
  });

  return newEnabledFlashCardIds;
}

export interface IRelativeChordNotesFlashCardMultiSelectProps {
  studySessionInfo: FlashCardStudySessionInfo;
  onChange?: (newValue: Array<FlashCardId>, newConfigData: any) => void;
}
export interface IRelativeChordNotesFlashCardMultiSelectState {}
export class RelativeChordNotesFlashCardMultiSelect extends React.Component<IRelativeChordNotesFlashCardMultiSelectProps, IRelativeChordNotesFlashCardMultiSelectState> {
  public render(): JSX.Element {
    const configData = this.props.studySessionInfo.configData as IConfigData;
    
    const rootPitchCheckboxTableRows = commonKeyPitchesOctave0
      .map((pitch, i) => {
        const isChecked = configData.enabledChordRootPitches.indexOf(pitch) >= 0;
        const isEnabled = !isChecked || (configData.enabledChordRootPitches.length > 1);

        return (
          <TableRow key={i}>
            <TableCell><Checkbox checked={isChecked} onChange={event => this.toggleRootPitchEnabled(pitch)} disabled={!isEnabled} /></TableCell>
            <TableCell>{pitch.toString(false, true)}</TableCell>
          </TableRow>
        );
      }, this);
    const chordRootNoteCheckboxes = (
      <Table className="table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Chord</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rootPitchCheckboxTableRows}
        </TableBody>
      </Table>
    );

    return (
      <Grid container spacing={32}>
        <Grid item xs={12}>{chordRootNoteCheckboxes}</Grid>
      </Grid>
    );
  }
  
  private toggleRootPitchEnabled(rootPitch: Pitch) {
    const configData = this.props.studySessionInfo.configData as IConfigData;
    const newEnabledChordRootPitches = toggleArrayElement(
      configData.enabledChordRootPitches,
      rootPitch
    );
    
    if (newEnabledChordRootPitches.length > 0) {
      const newConfigData: IConfigData = {
        enabledChordRootPitches: newEnabledChordRootPitches
      };
      this.onChange(newConfigData);
    }
  }
  private onChange(newConfigData: IConfigData) {
    if (!this.props.onChange) { return; }

    const newEnabledFlashCardIds = configDataToEnabledFlashCardIds(
      this.props.studySessionInfo.flashCardSet, this.props.studySessionInfo.flashCards, newConfigData
    );
    this.props.onChange(newEnabledFlashCardIds, newConfigData);
  }
}

function renderAnswerSelect(
  info: FlashCardStudySessionInfo
) {
  const correctAnswer = [(info.currentFlashCard.frontSide.data as Pitch)];
  
  return <PianoKeysAnswerSelect
    maxWidth={pianoMaxWidth} lowestPitch={lowestPitch} highestPitch={highestPitch}
    correctAnswer={correctAnswer}
    onAnswer={info.onAnswer} lastCorrectAnswer={info.lastCorrectAnswer}
    incorrectAnswers={info.incorrectAnswers} instantConfirm={true} wrapOctave={true} />;
}

function createFlashCardSet(): FlashCardSet {
  const renderFlashCardMultiSelect = (
    studySessionInfo: FlashCardStudySessionInfo,
    onChange: (newValue: Array<FlashCardId>, newConfigData: any) => void
  ): JSX.Element => {
    return (
    <RelativeChordNotesFlashCardMultiSelect
      studySessionInfo={studySessionInfo}
      onChange={onChange}
    />
    );
  };

  const flashCardSetId = "RelativeChordNotes";
  const flashCardSet = new FlashCardSet(
    flashCardSetId,
    "Relative Chord Notes",
    () => createFlashCards(flashCardSetId));
  flashCardSet.renderAnswerSelect = renderAnswerSelect;
  flashCardSet.configDataToEnabledFlashCardIds = configDataToEnabledFlashCardIds;
  flashCardSet.getInitialConfigData = () => Object.assign({}, initialConfigData);
  flashCardSet.renderFlashCardMultiSelect = renderFlashCardMultiSelect;

  return flashCardSet;
}

function createFlashCards(flashCardSetId: string): FlashCard[] {
  const flashCards: Array<FlashCard> = [];

  forEachRelativeChordNote((rootPitch, interval, name, i) => {
    const pitch = Pitch.addHalfSteps(rootPitch, interval);
    pitch.octaveNumber = octaveNumber;

    flashCards.push(
      new FlashCard(
        createFlashCardId(flashCardSetId, { rootPitchClass: rootPitch.class, interval: interval }),
        new FlashCardSide(
          `${name} of ${rootPitch.toString(false, true)}`,
          pitch
        ),
        new FlashCardSide(
          () => (
            <PianoKeyboard
              maxWidth={pianoMaxWidth}
              lowestPitch={lowestPitch}
              highestPitch={highestPitch}
              pressedPitches={[pitch]}
            />
          )
        )
      )
    );
  });

  return flashCards;
}

export const flashCardSet = createFlashCardSet();