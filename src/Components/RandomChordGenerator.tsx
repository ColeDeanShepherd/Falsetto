import * as React from "react";
import { Checkbox, TableRow, TableCell, Table, TableHead, TableBody, Grid } from "@material-ui/core";

import * as Utils from "../Utils";
import { FlashCard } from "../FlashCard";
import { FlashCardGroup } from "../FlashCardGroup";
import { ChordType } from '../Chord';

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

export function configDataToEnabledQuestionIds(configData: IConfigData): Array<number> {
  return Utils.flattenArrays<boolean>(chordRoots
    .map(chordRoot => ChordType.All
      .map(chordType =>
        Utils.arrayContains(configData.enabledChordRoots, chordRoot) &&
        Utils.arrayContains(configData.enabledChordTypes, chordType.name))
    )
  )
    .map((x, i) => x ? i : -1)
    .filter(i => i >= 0);
}

export interface IRandomChordGeneratorFlashCardMultiSelectProps {
  flashCards: FlashCard[];
  configData: IConfigData;
  selectedFlashCardIndices: number[];
  onChange?: (newValue: number[], newConfigData: any) => void;
}
export interface IRandomChordGeneratorFlashCardMultiSelectState {}
export class RandomChordGeneratorFlashCardMultiSelect extends React.Component<IRandomChordGeneratorFlashCardMultiSelectProps, IRandomChordGeneratorFlashCardMultiSelectState> {
  public render(): JSX.Element {
    const chordRootCheckboxTableRows = chordRoots
      .map((chordRoot, i) => {
        const isChecked = this.props.configData.enabledChordRoots.indexOf(chordRoot) >= 0;
        const isEnabled = !isChecked || (this.props.configData.enabledChordRoots.length > 1);

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
        const isChecked = this.props.configData.enabledChordTypes.indexOf(chordType.name) >= 0;
        const isEnabled = !isChecked || (this.props.configData.enabledChordTypes.length > 1);

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
    const newEnabledChordRoots = Utils.toggleArrayElement(
      this.props.configData.enabledChordRoots,
      chordRoot
    );
    
    if (newEnabledChordRoots.length > 0) {
      const newConfigData: IConfigData = {
        enabledChordRoots: newEnabledChordRoots,
        enabledChordTypes: this.props.configData.enabledChordTypes
      };
      this.onChange(newConfigData);
    }
  }
  private toggleChordTypeEnabled(chordType: string) {
    const newEnabledChordTypes = Utils.toggleArrayElement(
      this.props.configData.enabledChordTypes,
      chordType
    );
    
    if (newEnabledChordTypes.length > 0) {
      const newConfigData: IConfigData = {
        enabledChordRoots: this.props.configData.enabledChordRoots,
        enabledChordTypes: newEnabledChordTypes
      };
      this.onChange(newConfigData);
    }
  }
  private onChange(newConfigData: IConfigData) {
    if (!this.props.onChange) { return; }

    const newEnabledFlashCardIndices = configDataToEnabledQuestionIds(newConfigData);
    this.props.onChange(newEnabledFlashCardIndices, newConfigData);
  }
}

export function createFlashCards(): Array<FlashCard> {
  return Utils.flattenArrays<FlashCard>(chordRoots
    .map(chordRoot => ChordType.All
      .map(chordType => FlashCard.fromRenderFns(chordRoot + chordType.name, chordType.formulaString))
    )
  );
}
export function createFlashCardGroup(): FlashCardGroup {
  const renderFlashCardMultiSelect = (
    flashCards: Array<FlashCard>,
    selectedFlashCardIndices: number[],
    configData: any,
    onChange: (newValue: number[], newConfigData: any) => void
  ): JSX.Element => {
    return (
    <RandomChordGeneratorFlashCardMultiSelect
      flashCards={flashCards}
      configData={configData}
      selectedFlashCardIndices={selectedFlashCardIndices}
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
  
  const group = new FlashCardGroup(
    "Random Chord Generator",
    createFlashCards
  );
  group.enableInvertFlashCards = false;
  group.initialSelectedFlashCardIndices = configDataToEnabledQuestionIds(initialConfigData);
  group.initialConfigData = initialConfigData;
  group.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  group.containerHeight = "80px";

  return group;
}