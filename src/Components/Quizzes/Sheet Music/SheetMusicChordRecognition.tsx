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
import { Size2D } from '../../../Size2D';
import { CheckboxColumnsFlashCardMultiSelect, CheckboxColumn, CheckboxColumnCell } from '../../Utils/CheckboxColumnsFlashCardMultiSelect';

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
  enabledRootPitches: Pitch[];
  enabledChordTypes: string[];
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
  flashCardSet: FlashCardSet, flashCards: Array<FlashCard>, configData: IConfigData
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
      enabledRootPitches: rootPitches.slice(),
      enabledChordTypes: chordTypes.map(c => c.name)
    };
  }
  public render(): JSX.Element {
    const configData = this.props.studySessionInfo.configData as IConfigData;
    const selectedCellDatas = [
      configData.enabledRootPitches,
      configData.enabledChordTypes
    ];
    const boundOnChange = this.onChange.bind(this);

    return (
      <CheckboxColumnsFlashCardMultiSelect
        columns={this.columns}
        selectedCellDatas={selectedCellDatas}
        onChange={boundOnChange}
      />
    );
  }
  
  private columns: Array<CheckboxColumn> = [
    new CheckboxColumn(
      "Root Pitch",
      rootPitches
        .map(rp => new CheckboxColumnCell(
          () => <span>{rp.toString(false, true)}</span>, rp
        )),
      (a: Pitch, b: Pitch) => a === b
    ),
    new CheckboxColumn(
      "Chord Type",
      chordTypes
        .map(ct => new CheckboxColumnCell(
          () => <span>{ct.name}</span>, ct.name
        )),
      (a: string, b: string) => a === b
    )
  ];
  
  private onChange(newSelectedCellDatas: Array<Array<any>>) {
    if (!this.props.onChange) { return; }

    const newConfigData: IConfigData = {
      enabledRootPitches: newSelectedCellDatas[0] as Array<Pitch>,
      enabledChordTypes: newSelectedCellDatas[1] as Array<string>
    };

    const newEnabledFlashCardIds = configDataToEnabledFlashCardIds(
      this.props.studySessionInfo.flashCardSet, this.props.studySessionInfo.flashCards,
      newConfigData
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
              size={new Size2D(300, 200)}
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