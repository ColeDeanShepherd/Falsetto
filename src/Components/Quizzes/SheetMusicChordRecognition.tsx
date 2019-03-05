import * as React from "react";
import { Checkbox, TableRow, TableCell, Table, TableHead, TableBody, Grid } from "@material-ui/core";

import * as Utils from "../../Utils";
import * as FlashCardUtils from "../../Components/Quizzes/Utils";
import { FlashCard } from "../../FlashCard";
import { FlashCardGroup } from "../../FlashCardGroup";
import { Pitch, pitchRange } from "../../Pitch";
import { PitchLetter } from "../../PitchLetter";
import { SheetMusicChord } from "../../Components/Quizzes/SheetMusicChords";
import { Chord } from "../../Chord";

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
const rootPitches = pitchRange(minPitch, maxPitch, -1, 1)
  .filter(pitch =>
    allowedPitches.some(allowedPitch =>
      (pitch.letter === allowedPitch.letter) &&
      (pitch.signedAccidental === allowedPitch.signedAccidental)
    )
  );
const chords = [
  {
    type: "power",
    formulaString: "1 5"
  },
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
    type: "Maj7",
    formulaString: "1 3 5 7"
  },
  {
    type: "7",
    formulaString: "1 3 5 b7"
  },
  {
    type: "m7",
    formulaString: "1 b3 5 b7"
  },
  {
    type: "mMaj7",
    formulaString: "1 b3 5 7"
  },
  {
    type: "m7b5",
    formulaString: "1 b3 b5 b7"
  },
  {
    type: "dim7",
    formulaString: "1 b3 b5 bb7"
  }
];

interface IConfigData {
  enabledChordTypes: string[];
  enabledRootPitches: Pitch[];
}

export function configDataToEnabledQuestionIds(configData: IConfigData): Array<number> {
  const newEnabledFlashCardIndices = new Array<number>();

  let i = 0;

  for (const rootPitch of rootPitches) {
    for (const chord of chords) {
      const chordType = chord.type;
      if (
        Utils.arrayContains(configData.enabledRootPitches, rootPitch) &&
        Utils.arrayContains(configData.enabledChordTypes, chordType)
      ) {
        const pitches = Chord.fromPitchAndFormulaString(rootPitch, chord.formulaString)
          .pitches;
        
        // VexFlow doesn't allow triple sharps/flats
        if (pitches.every(pitch => Math.abs(pitch.signedAccidental) < 3)) {
          newEnabledFlashCardIndices.push(i);
        }
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
      enabledChordTypes: chords.map(c => c.type),
      enabledRootPitches: rootPitches.slice()
    };
  }
  public render(): JSX.Element {
    const rootPitchCheckboxTableRows = rootPitches
      .map((rootPitch, i) => {
        const isChecked = this.props.configData.enabledRootPitches.indexOf(rootPitch) >= 0;
        const isEnabled = !isChecked || (this.props.configData.enabledRootPitches.length > 1);

        return (
          <TableRow key={i}>
            <TableCell><Checkbox checked={isChecked} onChange={event => this.toggleRootPitchEnabled(rootPitch)} disabled={!isEnabled} /></TableCell>
            <TableCell>{rootPitch.toString(false)}</TableCell>
          </TableRow>
        );
      }, this);
    const rootPitchCheckboxes = (
      <Table className="table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Root Pitch</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rootPitchCheckboxTableRows}
        </TableBody>
      </Table>
    );

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
        <Grid item xs={6}>{rootPitchCheckboxes}</Grid>
        <Grid item xs={6}>{chordTypeCheckboxes}</Grid>
      </Grid>
    );
  }
  
  private toggleRootPitchEnabled(rootPitch: Pitch) {
    const newEnabledRootPitches = Utils.toggleArrayElement(
      this.props.configData.enabledRootPitches,
      rootPitch
    );
    
    if (newEnabledRootPitches.length > 0) {
      const newConfigData: IConfigData = {
        enabledRootPitches: newEnabledRootPitches,
        enabledChordTypes: this.props.configData.enabledChordTypes
      };
      this.onChange(newConfigData);
    }
  }
  private toggleChordEnabled(chord: string) {
    const newEnabledChords = Utils.toggleArrayElement(
      this.props.configData.enabledChordTypes,
      chord
    );
    
    if (newEnabledChords.length > 0) {
      const newConfigData: IConfigData = {
        enabledRootPitches: this.props.configData.enabledRootPitches,
        enabledChordTypes: newEnabledChords
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
  const flashCards = new Array<FlashCard>();

  for (const rootPitch of rootPitches) {
    for (const chord of chords) {
      const pitches = Chord.fromPitchAndFormulaString(rootPitch, chord.formulaString)
        .pitches;

      flashCards.push(FlashCard.fromRenderFns(
        (width, height) => (
          <div>
            <SheetMusicChord
              width={300} height={200}
              pitches={pitches}
            />
          </div>
        ),
        chord.type
      ));
    }
  }

  const renderFlashCardMultiSelect = (
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
    enabledRootPitches: rootPitches.slice(),
    enabledChordTypes: chords.map(chord => chord.type)
  };
  
  const group = new FlashCardGroup(
    "Sheet Music Chords",
    flashCards
  );
  group.initialSelectedFlashCardIndices = configDataToEnabledQuestionIds(initialConfigData);
  group.initialConfigData = initialConfigData;
  group.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  group.enableInvertFlashCards = false;
  group.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;

  return group;
}