import * as React from 'react';
import { Card, CardContent, Typography, Button, Checkbox, TableRow, TableCell, Table, TableHead, TableBody, Grid } from '@material-ui/core';

import * as Utils from '../Utils';
import { FlashCard } from '../FlashCard';
import { FlashCardGroup } from '../FlashCardGroup';

const chordRoots = [
  'Cb',
  'C',
  'C#',
  'Db',
  'D',
  'Eb',
  'E',
  'F',
  'F#',
  'Gb',
  'G',
  'Ab',
  'A',
  'Bb',
  'B'
];
const chordTypes = [
  {
    name: "power",
    notes:  "1 5"
  },
  
  {
    name: "major",
    notes:  "1 3 5"
  },
  {
    name: "minor",
    notes:  "1 b3 5"
  },
  {
    name: "diminished",
    notes:  "1 b3 b5"
  },
  {
    name: "augmented",
    notes:  "1 3 #5"
  },
  {
    name: "sus2",
    notes:  "1 2 5"
  },
  {
    name: "sus4",
    notes:  "1 4 5"
  },
  
  {
    name: "6",
    notes:  "1 3 5 6"
  },
  {
    name: "m6",
    notes:  "1 b3 5 6"
  },
  
  {
    name: "Maj7",
    notes:  "1 3 5 7"
  },
  {
    name: "7",
    notes:  "1 3 5 b7"
  },
  {
    name: "m7",
    notes:  "1 b3 5 b7"
  },
  {
    name: "mMaj7",
    notes:  "1 b3 5 7"
  },
  {
    name: "dim7",
    notes:  "1 b3 b5 bb7"
  },
  {
    name: "m7b5",
    notes:  "1 b3 b5 b7"
  },
  {
    name: "aug7",
    notes:  "1 3 #5 b7"
  },
  {
    name: "Maj7#5",
    notes:  "1 3 #5 7"
  },
  
  {
    name: "lydian",
    notes:  "1 #4 5"
  },
  {
    name: "sus4b5",
    notes:  "1 4 5b"
  },
  {
    name: "phrygian",
    notes:  "1 b2 5"
  },
  {
    name: "quartal",
    notes:  "1 4 b7"
  }
];

interface IConfigData {
  enabledChordRoots: string[];
  enabledChordTypes: string[];
}

export function configDataToEnabledQuestionIds(configData: IConfigData): Array<number> {
  return Utils.flattenArrays<boolean>(chordRoots
    .map(chordRoot => chordTypes
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
    
    const chordTypeCheckboxTableRows = chordTypes
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

export function createFlashCardGroup(): FlashCardGroup {
  const flashCards = Utils.flattenArrays<FlashCard>(chordRoots
    .map(chordRoot => chordTypes
      .map(chordType => new FlashCard(chordRoot + chordType.name, chordType.notes))
    )
  );
    
  const renderFlashCardMultiSelect = (
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
    enabledChordTypes: chordTypes
      .map(ct => ct.name)
      .filter((_, i) => (i >= 1) && (i <= 16))
  };
  
  const group = new FlashCardGroup(
    "Random Chord Generator",
    flashCards
  );
  group.enableInvertFlashCards = false;
  group.initialSelectedFlashCardIndices = configDataToEnabledQuestionIds(initialConfigData);
  group.initialConfigData = initialConfigData;
  group.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  return group;
}