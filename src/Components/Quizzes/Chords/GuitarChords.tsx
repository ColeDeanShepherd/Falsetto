import * as React from "react";

import * as Utils from "../../../Utils";
import { Size2D } from "../../../Size2D";
import { FlashCard, FlashCardSide } from "../../../FlashCard";
import { FlashCardSet, FlashCardStudySessionInfo } from "../../../FlashCardSet";
import { Pitch } from "../../../Pitch";
import { PitchLetter } from "../../../PitchLetter";
import { TableRow, TableCell, Table, TableHead, TableBody, Grid, Checkbox, Button, Typography } from "@material-ui/core";
import { ChordType } from "../../../Chord";
import {  renderDistinctFlashCardSideAnswerSelect } from '../Utils';
import { GuitarChordViewer } from '../../Utils/GuitarChordViewer';
import { getStandardGuitarTuning } from '../../Utils/GuitarFretboard';
import { GuitarNotesAnswerSelect } from '../../Utils/GuitarNotesAnswerSelect';

const flashCardSetId = "guitarChordOrderedNotes";

const guitarTuning = getStandardGuitarTuning(6);

interface IConfigData {
  enabledChordTypes: ChordType[];
}

export function configDataToEnabledFlashCardIds(flashCardSet: FlashCardSet, flashCards: Array<FlashCard>, configData: IConfigData): Array<FlashCardId> {
  const newEnabledFlashCardIds = new Array<FlashCardId>();

  //for (const chord of ChordType.All) {
  for (let i = 0; i < ChordType.All.length; i++) {
    const chordType = ChordType.All[i];
    if (Utils.arrayContains(configData.enabledChordTypes, chordType)) {
      newEnabledFlashCardIds.push(i);
    }
  }

  return newEnabledFlashCardIds;
}

export interface IGuitarChordsFlashCardMultiSelectProps {
  flashCards: FlashCard[];
  configData: IConfigData;
  selectedFlashCardIds: Array<FlashCardId>;
  onChange?: (newValue: Array<FlashCardId>, newConfigData: any) => void;
}
export interface IGuitarChordsFlashCardMultiSelectState {}
export class GuitarChordsFlashCardMultiSelect extends React.Component<IGuitarChordsFlashCardMultiSelectProps, IGuitarChordsFlashCardMultiSelectState> {
  public render(): JSX.Element {
    const chordTypeCheckboxTableRows = ChordType.All
      .map((chordType, i) => {
        const isChecked = this.props.configData.enabledChordTypes.indexOf(chordType) >= 0;
        const isEnabled = !isChecked || (this.props.configData.enabledChordTypes.length > 1);

        return (
          <TableRow key={i}>
            <TableCell><Checkbox checked={isChecked} onChange={event => this.toggleChordEnabled(chordType)} disabled={!isEnabled} /></TableCell>
            <TableCell>{chordType.name}</TableCell>
          </TableRow>
        );
      }, this);
    const chordTypeCheckboxes = (
      <Table className="table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Chord</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {chordTypeCheckboxTableRows}
        </TableBody>
      </Table>
    );

    return (
      <Grid container spacing={32}>
        <Grid item xs={12}>{chordTypeCheckboxes}</Grid>
      </Grid>
    );
  }
  
  private toggleChordEnabled(chordType: ChordType) {
    const newEnabledChordTypes = Utils.toggleArrayElement(
      this.props.configData.enabledChordTypes,
      chordType
    );
    
    if (newEnabledChordTypes.length > 0) {
      const newConfigData: IConfigData = {
        enabledChordTypes: newEnabledChordTypes
      };
      this.onChange(newConfigData);
    }
  }
  private onChange(newConfigData: IConfigData) {
    if (!this.props.onChange) { return; }

    const newEnabledFlashCardIds = configDataToEnabledFlashCardIds(newConfigData);
    this.props.onChange(newEnabledFlashCardIds, newConfigData);
  }
}

export function createFlashCardSet(): FlashCardSet {
  const renderFlashCardMultiSelect = (
    flashCards: Array<FlashCard>,
    selectedFlashCardIds: Array<FlashCardId>,
    configData: any,
    onChange: (newValue: Array<FlashCardId>, newConfigData: any) => void
  ): JSX.Element => {
    return (
    <GuitarChordsFlashCardMultiSelect
      flashCards={flashCards}
      configData={configData}
      selectedFlashCardIds={selectedFlashCardIds}
      onChange={onChange}
    />
    );
  };

  const initialConfigData: IConfigData = {
    enabledChordTypes: ChordType.All
      .filter((_, chordIndex) => chordIndex <= 8)
  };

  const flashCardSet = new FlashCardSet(flashCardSetId, "Guitar Chords", createFlashCards);
  flashCardSet.enableInvertFlashCards = false;
  flashCardSet.configDataToEnabledFlashCardIds = configDataToEnabledFlashCardIds configDataToEnabledFlashCardIds(flashCardSet, initialConfigData);
  flashCardSet.initialConfigData = initialConfigData;
  flashCardSet.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  flashCardSet.renderAnswerSelect = renderAnswerSelect;
  flashCardSet.containerHeight = "120px";

  return flashCardSet;
}
export function createFlashCards(): FlashCard[] {
  return ChordType.All.map(chordType => {
    const rootPitch = new Pitch(PitchLetter.F, 0, 2);
    const pitches = chordType.getPitches(rootPitch);
    const deserializedId = {
      set: flashCardSetId,
      chord: chordType.name
    };
    const id = JSON.stringify(deserializedId);
    return new FlashCard(
      id,
      new FlashCardSide(
        (width, height) => {
          const size = Utils.shrinkRectToFit(new Size2D(width, height), new Size2D(400, 140));

          return (
            <GuitarChordViewer
              chordType={chordType}
              rootPitch={rootPitch}
              tuning={guitarTuning}
              size={size} />
          )
        },
        pitches
      ),
      new FlashCardSide(chordType.name)
    );
  });
}
export function renderAnswerSelect(
  info: FlashCardStudySessionInfo
) {
  if (!state.areFlashCardsInverted) {
    return renderDistinctFlashCardSideAnswerSelect(state);
  } else {
    const key = state.currentFlashCard.frontSide.renderFn as string;
    const correctAnswer = state.currentFlashCard.backSide.data[0] as Array<Pitch>;
    return <GuitarNotesAnswerSelect
      key={key} correctAnswer={correctAnswer} onAnswer={state.onAnswer}
      lastCorrectAnswer={state.lastCorrectAnswer} incorrectAnswers={state.incorrectAnswers} />;
  }
}