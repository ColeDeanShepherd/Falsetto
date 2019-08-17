import * as React from "react";
import { TableRow, TableCell, Table, TableHead, TableBody, Grid, Checkbox } from "@material-ui/core";

import * as Utils from "../../../Utils";
import { Size2D } from "../../../Size2D";
import { FlashCard, FlashCardSide, FlashCardId } from "../../../FlashCard";
import { FlashCardSet, FlashCardStudySessionInfo } from "../../../FlashCardSet";
import { Pitch } from "../../../Pitch";
import { PitchLetter } from "../../../PitchLetter";
import { ChordType } from "../../../Chord";
import {  renderDistinctFlashCardSideAnswerSelect } from '../Utils';
import { GuitarChordViewer } from '../../Utils/GuitarChordViewer';
import { getStandardGuitarTuning } from '../../Utils/GuitarFretboard';
import { GuitarNotesAnswerSelect } from '../../Utils/GuitarNotesAnswerSelect';

const flashCardSetId = "guitarChordOrderedNotes";
const guitarTuning = getStandardGuitarTuning(6);
const chordTypes = ChordType.All;

interface IConfigData {
  enabledChordTypes: ChordType[];
}

export function configDataToEnabledFlashCardIds(
  info: FlashCardStudySessionInfo, configData: IConfigData
): Array<FlashCardId> {
  const newEnabledFlashCardIds = new Array<FlashCardId>();

  for (let i = 0; i < chordTypes.length; i++) {
    const chordType = chordTypes[i];
    if (Utils.arrayContains(configData.enabledChordTypes, chordType)) {
      newEnabledFlashCardIds.push(info.flashCards[i].id);
    }
  }

  return newEnabledFlashCardIds;
}

export interface IGuitarChordsFlashCardMultiSelectProps {
  studySessionInfo: FlashCardStudySessionInfo;
  onChange?: (newValue: Array<FlashCardId>, newConfigData: any) => void;
}
export interface IGuitarChordsFlashCardMultiSelectState {}
export class GuitarChordsFlashCardMultiSelect extends React.Component<IGuitarChordsFlashCardMultiSelectProps, IGuitarChordsFlashCardMultiSelectState> {
  public render(): JSX.Element {
    const configData = (this.props.studySessionInfo.configData as IConfigData);
    const chordTypeCheckboxTableRows = chordTypes
      .map((chordType, i) => {
        const isChecked = configData
          .enabledChordTypes.indexOf(chordType) >= 0;
        const isEnabled = !isChecked || (configData.enabledChordTypes.length > 1);

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
      (this.props.studySessionInfo.configData as IConfigData).enabledChordTypes,
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

    const newEnabledFlashCardIds = configDataToEnabledFlashCardIds(this.props.studySessionInfo, newConfigData);
    this.props.onChange(newEnabledFlashCardIds, newConfigData);
  }
}

export function createFlashCardSet(): FlashCardSet {
  const renderFlashCardMultiSelect = (
    info: FlashCardStudySessionInfo,
    onChange: (newValue: Array<FlashCardId>, newConfigData: any) => void
  ): JSX.Element => {
    return (
    <GuitarChordsFlashCardMultiSelect
      studySessionInfo={info}
      onChange={onChange}
    />
    );
  };

  const initialConfigData: IConfigData = {
    enabledChordTypes: chordTypes
      .filter((_, chordIndex) => chordIndex <= 8)
  };

  const flashCardSet = new FlashCardSet(flashCardSetId, "Guitar Chords", createFlashCards);
  flashCardSet.configDataToEnabledFlashCardIds = configDataToEnabledFlashCardIds;
  flashCardSet.initialConfigData = initialConfigData;
  flashCardSet.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  flashCardSet.renderAnswerSelect = renderDistinctFlashCardSideAnswerSelect;
  flashCardSet.containerHeight = "120px";

  return flashCardSet;
}
export function createFlashCards(): FlashCard[] {
  return chordTypes.map(chordType => {
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