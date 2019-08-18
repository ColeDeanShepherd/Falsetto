import * as React from "react";
import { Checkbox, TableRow, TableCell, Table, TableHead, TableBody, Grid } from "@material-ui/core";

import * as Utils from "../../../Utils";
import * as FlashCardUtils from "../Utils";
import { FlashCard, FlashCardId } from "../../../FlashCard";
import { FlashCardSet, FlashCardStudySessionInfo } from "../../../FlashCardSet";
import { Pitch, pitchRange } from "../../../Pitch";
import { PitchLetter } from "../../../PitchLetter";
import { SheetMusicChord } from "./SheetMusicChords";
import { Chord, ChordType } from "../../../Chord";

const flashCardSetId = "sheetChords";

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
const chordTypes = [ChordType.Power]
  .concat(ChordType.Triads)
  .concat(ChordType.SimpleSeventhChords);

interface IConfigData {
  enabledChordTypes: string[];
  enabledRootPitches: Pitch[];
}

export function forEachChord(
  callbackFn: (rootPitch: Pitch, chordType: ChordType, i: number) => void
) {
  let i = 0;

  for (const rootPitch of rootPitches) {
    for (const chordType of chordTypes) {
      callbackFn(rootPitch, chordType, i);
      i++;
    }
  }
}
export function configDataToEnabledFlashCardIds(
  flashCardSet: FlashCardSet, flashCards: Array<FlashCard>, configData: any
): Array<FlashCardId> {
  const newEnabledFlashCardIds = new Array<FlashCardId>();

  forEachChord((rootPitch, chordType, i) => {
    if (
      Utils.arrayContains(configData.enabledRootPitches, rootPitch) &&
      Utils.arrayContains(configData.enabledChordTypes, chordType.name)
    ) {
      const pitches = new Chord(chordType, rootPitch).getPitches();
      
      // VexFlow doesn't allow triple sharps/flats
      if (pitches.every(pitch => Math.abs(pitch.signedAccidental) < 3)) {
        newEnabledFlashCardIds.push(flashCards[i].id);
      }
    }
  });

  return newEnabledFlashCardIds;
}

export interface IChordNotesFlashCardMultiSelectProps {
  studySessionInfo: FlashCardStudySessionInfo;
  onChange?: (newValue: Array<FlashCardId>, newConfigData: any) => void;
}
export interface IChordNotesFlashCardMultiSelectState {}
export class ChordNotesFlashCardMultiSelect extends React.Component<IChordNotesFlashCardMultiSelectProps, IChordNotesFlashCardMultiSelectState> {
  public constructor(props: IChordNotesFlashCardMultiSelectProps) {
    super(props);

    this.state = {
      enabledChordTypes: chordTypes.map(c => c.name),
      enabledRootPitches: rootPitches.slice()
    };
  }
  public render(): JSX.Element {
    const configData = this.props.studySessionInfo.configData as IConfigData;
    const rootPitchCheckboxTableRows = rootPitches
      .map((rootPitch, i) => {
        const isChecked = configData.enabledRootPitches.indexOf(rootPitch) >= 0;
        const isEnabled = !isChecked || (configData.enabledRootPitches.length > 1);

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

    const chordTypeCheckboxTableRows = chordTypes
      .map((chordType, i) => {
        const isChecked = configData.enabledChordTypes.indexOf(chordType.name) >= 0;
        const isEnabled = !isChecked || (configData.enabledChordTypes.length > 1);

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
        <Grid item xs={6}>{rootPitchCheckboxes}</Grid>
        <Grid item xs={6}>{chordTypeCheckboxes}</Grid>
      </Grid>
    );
  }
  
  private toggleRootPitchEnabled(rootPitch: Pitch) {
    const configData = this.props.studySessionInfo.configData as IConfigData;
    const newEnabledRootPitches = Utils.toggleArrayElement(
      configData.enabledRootPitches,
      rootPitch
    );
    
    if (newEnabledRootPitches.length > 0) {
      const newConfigData: IConfigData = {
        enabledRootPitches: newEnabledRootPitches,
        enabledChordTypes: configData.enabledChordTypes
      };
      this.onChange(newConfigData);
    }
  }
  private toggleChordEnabled(chordType: string) {
    const configData = this.props.studySessionInfo.configData as IConfigData;
    const newEnabledChords = Utils.toggleArrayElement(
      configData.enabledChordTypes,
      chordType
    );
    
    if (newEnabledChords.length > 0) {
      const newConfigData: IConfigData = {
        enabledRootPitches: configData.enabledRootPitches,
        enabledChordTypes: newEnabledChords
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

export function createFlashCards(): Array<FlashCard> {
  const flashCards = new Array<FlashCard>();

  for (const rootPitch of rootPitches) {
    for (const chordType of chordTypes) {
      const pitches = new Chord(chordType, rootPitch).getPitches();

      flashCards.push(FlashCard.fromRenderFns(
        JSON.stringify({ set: flashCardSetId, chord: `${rootPitch.toString(true)} ${chordType.name}` }),
        (width, height) => (
          <div>
            <SheetMusicChord
              width={300} height={200}
              pitches={pitches}
            />
          </div>
        ),
        chordType.name
      ));
    }
  }

  return flashCards;
}
export function createFlashCardSet(): FlashCardSet {
  const renderFlashCardMultiSelect = (
    studySessionInfo: FlashCardStudySessionInfo,
    onChange: (newValue: Array<FlashCardId>, newConfigData: any) => void
  ): JSX.Element => {
    return (
    <ChordNotesFlashCardMultiSelect
      studySessionInfo={studySessionInfo}
      onChange={onChange}
    />
    );
  };

  const initialConfigData: IConfigData = {
    enabledRootPitches: rootPitches.slice(),
    enabledChordTypes: chordTypes.map(chordType => chordType.name)
  };
  
  const flashCardSet = new FlashCardSet(flashCardSetId,
    "Sheet Music Chords",
    createFlashCards
  );
  flashCardSet.configDataToEnabledFlashCardIds = configDataToEnabledFlashCardIds;
  flashCardSet.initialConfigData = initialConfigData;
  flashCardSet.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  flashCardSet.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;

  return flashCardSet;
}