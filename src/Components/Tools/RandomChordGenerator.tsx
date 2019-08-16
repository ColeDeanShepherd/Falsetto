import * as React from "react";
import { Checkbox, TableRow, TableCell, Table, TableHead, TableBody, Grid } from "@material-ui/core";

import * as Utils from "../../Utils";
import { FlashCard, FlashCardId } from "../../FlashCard";
import { FlashCardSet, FlashCardStudySessionInfo } from "../../FlashCardSet";
import { ChordType } from '../../Chord';
import { Pitch } from '../../Pitch';

const flashCardSetId = "randomChords";

const chordRoots = [
  "Cb",
  "C",
  "C#",
  "Db",
  "D",
  "Eb",
  "E",
  "F",
  "F#",
  "Gb",
  "G",
  "Ab",
  "A",
  "Bb",
  "B"
];

interface IConfigData {
  enabledChordRoots: string[];
  enabledChordTypes: string[];
}

export function forEachChord(callbackFn: (chordRoot: string, chordType: ChordType, i: number) => void) {
  let i = 0;

  for (const chordRoot of chordRoots) {
    for (const chordType of ChordType.All) {
      callbackFn(chordRoot, chordType, i);
      i++
    }
  }
}
export function configDataToEnabledFlashCardIds(
  info: FlashCardStudySessionInfo, configData: IConfigData
): Array<FlashCardId> {
  const flashCardIds = new Array<FlashCardId>();

  forEachChord((chordRoot, chordType, i) => {
    if (
      Utils.arrayContains(configData.enabledChordRoots, chordRoot) &&
      Utils.arrayContains(configData.enabledChordTypes, chordType.name)
    ) {
      flashCardIds.push(info.flashCards[i].id);
    }
  });

  return flashCardIds;
}

export interface IRandomChordGeneratorFlashCardMultiSelectProps {
  studySessionInfo: FlashCardStudySessionInfo;
  onChange?: (newValue: Array<FlashCardId>, newConfigData: any) => void;
}
export interface IRandomChordGeneratorFlashCardMultiSelectState {}
export class RandomChordGeneratorFlashCardMultiSelect extends React.Component<IRandomChordGeneratorFlashCardMultiSelectProps, IRandomChordGeneratorFlashCardMultiSelectState> {
  public render(): JSX.Element {
    const configData = this.props.studySessionInfo.configData as IConfigData;
    const chordRootCheckboxTableRows = chordRoots
      .map((chordRoot, i) => {
        const isChecked = configData.enabledChordRoots.indexOf(chordRoot) >= 0;
        const isEnabled = !isChecked || (configData.enabledChordRoots.length > 1);

        return (
          <TableRow key={i}>
            <TableCell><Checkbox checked={isChecked} onChange={event => this.toggleChordRootEnabled(chordRoot)} disabled={!isEnabled} /></TableCell>
            <TableCell>{chordRoot}</TableCell>
          </TableRow>
        );
      }, this);
    const chordRootCheckboxes = (
      <Table className="table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Chord Root</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {chordRootCheckboxTableRows}
        </TableBody>
      </Table>
    );
    
    const chordTypeCheckboxTableRows = ChordType.All
      .map((chordType, i) => {
        const isChecked = configData.enabledChordTypes.indexOf(chordType.name) >= 0;
        const isEnabled = !isChecked || (configData.enabledChordTypes.length > 1);

        return (
          <TableRow key={i}>
            <TableCell><Checkbox checked={isChecked} onChange={event => this.toggleChordTypeEnabled(chordType.name)} disabled={!isEnabled} /></TableCell>
            <TableCell>{chordType.name}</TableCell>
          </TableRow>
        );
      }, this);
    const chordTypeCheckboxes = (
      <Table className="table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Chord Type</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {chordTypeCheckboxTableRows}
        </TableBody>
      </Table>
    );

    return (
      <Grid container spacing={32}>
        <Grid item xs={6}>{chordRootCheckboxes}</Grid>
        <Grid item xs={6}>{chordTypeCheckboxes}</Grid>
      </Grid>
    );
  }

  private toggleChordRootEnabled(chordRoot: string) {
    const configData = this.props.studySessionInfo.configData as IConfigData;
    const newEnabledChordRoots = Utils.toggleArrayElement(
      configData.enabledChordRoots,
      chordRoot
    );
    
    if (newEnabledChordRoots.length > 0) {
      const newConfigData: IConfigData = {
        enabledChordRoots: newEnabledChordRoots,
        enabledChordTypes: configData.enabledChordTypes
      };
      this.onChange(newConfigData);
    }
  }
  private toggleChordTypeEnabled(chordType: string) {
    const configData = this.props.studySessionInfo.configData as IConfigData;
    const newEnabledChordTypes = Utils.toggleArrayElement(
      configData.enabledChordTypes,
      chordType
    );
    
    if (newEnabledChordTypes.length > 0) {
      const newConfigData: IConfigData = {
        enabledChordRoots: configData.enabledChordRoots,
        enabledChordTypes: newEnabledChordTypes
      };
      this.onChange(newConfigData);
    }
  }
  private onChange(newConfigData: IConfigData) {
    if (!this.props.onChange) { return; }

    const newEnabledFlashCardIds = configDataToEnabledFlashCardIds(
      this.props.studySessionInfo, newConfigData
    );
    this.props.onChange(newEnabledFlashCardIds, newConfigData);
  }
}

export function createFlashCards(): Array<FlashCard> {
  const flashCards = new Array<FlashCard>();

  forEachChord((chordRoot, chordType, i) => {
    const flashCard = FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, chord: chordRoot + " " + chordType.name }),
      chordRoot + " " + chordType.name,
      chordType.formula.toString()
    );
    flashCards.push(flashCard);
  });
  
  return flashCards;
}
export function createFlashCardSet(): FlashCardSet {
  const renderFlashCardMultiSelect = (
    studySessionInfo: FlashCardStudySessionInfo,
    onChange: (newValue: Array<FlashCardId>, newConfigData: any) => void
  ): JSX.Element => {
    return (
    <RandomChordGeneratorFlashCardMultiSelect
      studySessionInfo={studySessionInfo}
      onChange={onChange}
    />
    );
  };

  const initialConfigData: IConfigData = {
    enabledChordRoots: chordRoots.slice(),
    enabledChordTypes: ChordType.All
      .map(ct => ct.name)
      .filter((_, i) => (i >= 1) && (i <= 16))
  };
  
  const flashCardSet = new FlashCardSet(flashCardSetId,
    "Random Chord Generator",
    createFlashCards
  );
  flashCardSet.enableInvertFlashCards = false;
  flashCardSet.configDataToEnabledFlashCardIds = configDataToEnabledFlashCardIds;
  flashCardSet.initialConfigData = initialConfigData;
  flashCardSet.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  flashCardSet.containerHeight = "80px";

  return flashCardSet;
}