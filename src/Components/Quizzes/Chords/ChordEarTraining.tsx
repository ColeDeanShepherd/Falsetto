import * as React from "react";
import { Checkbox, TableRow, TableCell, Table, TableHead, TableBody, Grid, Button } from "@material-ui/core";

import * as Utils from "../../../Utils";
import * as FlashCardUtils from "../Utils";
import { FlashCard } from "../../../FlashCard";
import { FlashCardSet } from "../../../FlashCardSet";
import { Pitch } from "../../../Pitch";
import { PitchLetter } from "../../../PitchLetter";
import { Chord, ChordType } from "../../../Chord";
import { playPitches } from "../../../Piano";

const flashCardSetId = "chordEarTraining";

const minPitch = new Pitch(PitchLetter.C, -1, 2);
const maxPitch = new Pitch(PitchLetter.C, 1, 6);
const rootPitches = Utils.range(minPitch.midiNumber, maxPitch.midiNumber)
  .map(midiNumber => Pitch.createFromMidiNumber(midiNumber));
const chordTypes = ChordType.Triads
  .concat(ChordType.SimpleSeventhChords);

  export interface IFlashCardFrontSideProps {
    chordType: ChordType;
  }
export interface IFlashCardFrontSideState {
  pitches: Array<Pitch>;
}
export class FlashCardFrontSide extends React.Component<IFlashCardFrontSideProps, IFlashCardFrontSideState> {
  public constructor(props: IFlashCardFrontSideProps) {
    super(props);
    
    const rootPitch = Utils.randomElement(rootPitches);

    this.state = {
      pitches: new Chord(this.props.chordType, rootPitch).getPitches()
    };
  }

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
    playPitches(this.state.pitches);
  }
}

interface IConfigData {
  enabledChordTypes: string[];
}

export function configDataToEnabledQuestionIds(configData: IConfigData): Array<number> {
  const newEnabledFlashCardIndices = new Array<number>();

  let i = 0;

  for (const chordType of chordTypes) {
    if (Utils.arrayContains(configData.enabledChordTypes, chordType.name)) {
      newEnabledFlashCardIndices.push(i);
    }

    i++;
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
      enabledChordTypes: chordTypes.map(c => c.name)
    };
  }
  public render(): JSX.Element {
    const chordTypeCheckboxTableRows = chordTypes
      .map((chordType, i) => {
        const isChecked = this.props.configData.enabledChordTypes.indexOf(chordType.name) >= 0;
        const isEnabled = !isChecked || (this.props.configData.enabledChordTypes.length > 1);

        return (
          <TableRow key={i}>
            <TableCell><Checkbox checked={isChecked} onChange={event => this.toggleChordEnabled(chordType.name)} disabled={!isEnabled} /></TableCell>
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
  
  private toggleChordEnabled(chordType: string) {
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

    const newEnabledFlashCardIndices = configDataToEnabledQuestionIds(newConfigData);
    this.props.onChange(newEnabledFlashCardIndices, newConfigData);
  }
}

export function createFlashCards(): Array<FlashCard> {
  let i = 0;

  const flashCards = new Array<FlashCard>();

  for (const chordType of chordTypes) {
    const iCopy = i;
    i++;

    const deserializedId = {
      set: flashCardSetId,
      chord: `${chordType.name}`
    };
    const id = JSON.stringify(deserializedId);

    flashCards.push(FlashCard.fromRenderFns(
      id,
      () => <FlashCardFrontSide key={iCopy} chordType={chordType} />,
      chordType.name
    ));
  }

  return flashCards;
}
export function createFlashCardSet(): FlashCardSet {
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
    enabledChordTypes: chordTypes.map(c => c.name)
  };
  
  const flashCardSet = new FlashCardSet(flashCardSetId,
    "Chord Ear Training",
    createFlashCards
  );
  flashCardSet.initialSelectedFlashCardIndices = configDataToEnabledQuestionIds(initialConfigData);
  flashCardSet.initialConfigData = initialConfigData;
  flashCardSet.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  flashCardSet.enableInvertFlashCards = false;
  flashCardSet.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  flashCardSet.containerHeight = "100px";

  return flashCardSet;
}