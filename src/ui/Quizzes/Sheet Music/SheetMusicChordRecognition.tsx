import * as React from "react";

import * as FlashCardUtils from "../Utils";
import { FlashCard, FlashCardId, FlashCardSide } from "../../../FlashCard";
import { FlashCardSet, FlashCardStudySessionInfo, FlashCardLevel } from "../../../FlashCardSet";
import { Pitch, getAmbiguousPitchRange } from "../../../lib/TheoryLib/Pitch";
import { PitchLetter } from "../../../lib/TheoryLib/PitchLetter";
import { SheetMusicChord } from "./SheetMusicChords";
import { Chord } from "../../../lib/TheoryLib/Chord";
import { ChordType, chordTypeLevels } from "../../../lib/TheoryLib/ChordType";
import { Size2D } from '../../../lib/Core/Size2D';
import { CheckboxColumnsFlashCardMultiSelect, CheckboxColumn, CheckboxColumnCell } from '../../Utils/CheckboxColumnsFlashCardMultiSelect';
import { arrayContains } from '../../../lib/Core/ArrayUtils';

const flashCardSetId = "sheetChords";

const allowedRootPitches = [
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
const rootPitches = getAmbiguousPitchRange(minPitch, maxPitch, -1, 1)
  .filter(pitch =>
    allowedRootPitches.some(allowedPitch =>
      (pitch.letter === allowedPitch.letter) &&
      (pitch.signedAccidental === allowedPitch.signedAccidental)
    )
  );
const chordTypes = ChordType.All;

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
      configData.enabledRootPitches.some(erp => erp.equalsNoOctave(rootPitch)) &&
      arrayContains(configData.enabledChordTypes, chordType.name)
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
export class ChordNotesFlashCardMultiSelect extends React.Component<IChordNotesFlashCardMultiSelectProps, {}> {
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
      allowedRootPitches
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
      const deserializedId = { set: flashCardSetId, chord: `${rootPitch.toString(true)} ${chordType.name}` };
      const id = JSON.stringify(deserializedId);
      const pitches = new Chord(chordType, rootPitch).getPitches();

      flashCards.push(new FlashCard(
        id,
        new FlashCardSide(
          size => (
            <div>
              <SheetMusicChord
                size={new Size2D(300, 200)}
                pitches={pitches}
              />
            </div>
          )
        ),
        new FlashCardSide(
          chordType.name,
          chordType
        )
      ));
    }
  }

  return flashCards;
}
function createFlashCardSet(): FlashCardSet {
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

  const flashCardSet = new FlashCardSet(flashCardSetId,
    "Sheet Music Chords",
    createFlashCards
  );
  flashCardSet.configDataToEnabledFlashCardIds = configDataToEnabledFlashCardIds;
  flashCardSet.getInitialConfigData = (): IConfigData => ({
    enabledRootPitches: allowedRootPitches.slice(),
    enabledChordTypes: chordTypes.map(chordType => chordType.name)
  });
  flashCardSet.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  flashCardSet.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  flashCardSet.createFlashCardLevels = (flashCardSet: FlashCardSet, flashCards: Array<FlashCard>) => (
    chordTypeLevels
      .map(ctl =>
        new FlashCardLevel(
          ctl.name,
          flashCards
            .filter(fc => arrayContains(ctl.chordTypes, fc.backSide.data as ChordType))
            .map(fc => fc.id),
          (curConfigData: IConfigData) => ({
            enabledRootPitches: allowedRootPitches.slice(),
            enabledChordTypes: ctl.chordTypes.map(ct => ct.name)
          } as IConfigData)
        )
      )
  );

  return flashCardSet;
}

export const flashCardSet = createFlashCardSet();