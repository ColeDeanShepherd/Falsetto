import * as React from "react";
import { Checkbox, TableRow, TableCell, Table, TableHead, TableBody, Grid, Button } from "@material-ui/core";

import * as Utils from "../../Utils";
import * as FlashCardUtils from "./Utils";
import { FlashCard } from "../../FlashCard";
import { FlashCardGroup } from "../../FlashCardGroup";
import { Pitch, pitchRange } from "../../Pitch";
import { PitchLetter } from "../../PitchLetter";
import { Chord } from "../../Chord";
import { playPitches } from "../../Piano";

const minPitch = new Pitch(PitchLetter.C, -1, 2);
const maxPitch = new Pitch(PitchLetter.C, 1, 6);
const rootPitches = pitchRange(minPitch, maxPitch, -1, 1);
const chords = [
  {
    type: "major",
    formulaString: "1 3 5"
  },
  {
    type: "minor",
    formulaString: "1 b3 5"
  },
  {
    type: "diminished",
    formulaString: "1 b3 b5"
  },
  {
    type: "augmented",
    formulaString: "1 3 #5"
  },
  {
    type: "sus2",
    formulaString: "1 2 5"
  },
  {
    type: "sus4",
    formulaString: "1 4 5"
  },
  {
    type: "major 7",
    formulaString: "1 3 5 7"
  },
  {
    type: "7",
    formulaString: "1 3 5 b7"
  },
  {
    type: "minor 7",
    formulaString: "1 b3 5 b7"
  },
  {
    type: "minor/major 7",
    formulaString: "1 b3 5 7"
  },
  {
    type: "half-diminished 7",
    formulaString: "1 b3 b5 b7"
  },
  {
    type: "diminished 7",
    formulaString: "1 b3 b5 bb7"
  }
];

export interface IFlashCardFrontSideProps {
  pitches: Array<Pitch>;
}
export class FlashCardFrontSide extends React.Component<IFlashCardFrontSideProps, {}> {
  public render(): JSX.Element {
    return (
      <div>
        <Button
          onClick={event => this.playAudio()}
          variant="contained"
        >
          Play Sound
        </Button>
      </div>
    );
  }

  private playAudio(): void {
    playPitches(this.props.pitches);
  }
}

interface IConfigData {
  enabledChordTypes: string[];
}

export function configDataToEnabledQuestionIds(configData: IConfigData): Array<number> {
  const newEnabledFlashCardIndices = new Array<number>();

  let i = 0;

  for (const rootPitch of rootPitches) {
    for (const chord of chords) {
      const chordType = chord.type;
      if (Utils.arrayContains(configData.enabledChordTypes, chordType)) {
        newEnabledFlashCardIndices.push(i);
      }

      i++;
    }
  }

  return newEnabledFlashCardIndices;
}

export interface IChordNotesFlashCardMultiSelectProps {
  flashCards: FlashCard[];
  configData: IConfigData;
  selectedFlashCardIndices: number[];
  onChange?: (newValue: number[], newConfigData: any) => void;
}
export interface IChordNotesFlashCardMultiSelectState {}
export class ChordNotesFlashCardMultiSelect extends React.Component<IChordNotesFlashCardMultiSelectProps, IChordNotesFlashCardMultiSelectState> {
  public constructor(props: IChordNotesFlashCardMultiSelectProps) {
    super(props);

    this.state = {
      enabledChordTypes: chords.map(c => c.type)
    };
  }
  public render(): JSX.Element {
    const chordTypeCheckboxTableRows = chords
      .map((chord, i) => {
        const isChecked = this.props.configData.enabledChordTypes.indexOf(chord.type) >= 0;
        const isEnabled = !isChecked || (this.props.configData.enabledChordTypes.length > 1);

        return (
          <TableRow key={i}>
            <TableCell><Checkbox checked={isChecked} onChange={event => this.toggleChordEnabled(chord.type)} disabled={!isEnabled} /></TableCell>
            <TableCell>{chord.type}</TableCell>
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
  
  private toggleChordEnabled(chord: string) {
    const newEnabledChordTypes = Utils.toggleArrayElement(
      this.props.configData.enabledChordTypes,
      chord
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

    const newEnabledFlashCardIndices = configDataToEnabledQuestionIds(newConfigData);
    this.props.onChange(newEnabledFlashCardIndices, newConfigData);
  }
}

export function createFlashCards(): Array<FlashCard> {
  let i = 0;

  const flashCards = new Array<FlashCard>();

  for (const rootPitch of rootPitches) {
    for (const chord of chords) {
      const pitches = Chord.fromPitchAndFormulaString(rootPitch, chord.formulaString)
        .pitches;
      
      const iCopy = i;
      i++;

      flashCards.push(FlashCard.fromRenderFns(
        () => <FlashCardFrontSide key={iCopy} pitches={pitches} />,
        chord.type
      ));
    }
  }

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
    <ChordNotesFlashCardMultiSelect
      flashCards={flashCards}
      configData={configData}
      selectedFlashCardIndices={selectedFlashCardIndices}
      onChange={onChange}
    />
    );
  };

  const initialConfigData: IConfigData = {
    enabledChordTypes: chords.map(c => c.type)
  };
  
  const group = new FlashCardGroup(
    "Chord Ear Training",
    createFlashCards
  );
  group.initialSelectedFlashCardIndices = configDataToEnabledQuestionIds(initialConfigData);
  group.initialConfigData = initialConfigData;
  group.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  group.enableInvertFlashCards = false;
  group.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  group.containerHeight = "100px";

  return group;
}