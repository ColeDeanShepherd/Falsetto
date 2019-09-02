import * as React from "react";

import * as Utils from "../../Utils";
import { FlashCard, FlashCardId, FlashCardSide } from "../../FlashCard";
import { FlashCardSet, FlashCardStudySessionInfo, FlashCardLevel } from "../../FlashCardSet";
import { ChordType, chordTypeLevels } from '../../Chord';
import { CheckboxColumnsFlashCardMultiSelect, CheckboxColumnCell, CheckboxColumn } from '../Utils/CheckboxColumnsFlashCardMultiSelect';
import { getValidKeyPitches } from '../../Key';
import { Pitch } from '../../Pitch';

const flashCardSetId = "randomChords";

const chordRootPitches = getValidKeyPitches(4);

interface IConfigData {
  enabledChordRootPitches: Pitch[];
  enabledChordTypes: ChordType[];
}

export function forEachChord(callbackFn: (chordRootPitch: Pitch, chordType: ChordType, i: number) => void) {
  let i = 0;

  for (const chordRootPitch of chordRootPitches) {
    for (const chordType of ChordType.All) {
      callbackFn(chordRootPitch, chordType, i);
      i++
    }
  }
}
export function configDataToEnabledFlashCardIds(
  flashCardSet: FlashCardSet, flashCards: Array<FlashCard>, configData: IConfigData
): Array<FlashCardId> {
  const flashCardIds = new Array<FlashCardId>();

  forEachChord((chordRootPitch, chordType, i) => {
    if (
      Utils.arrayContains(configData.enabledChordRootPitches, chordRootPitch) &&
      Utils.arrayContains(configData.enabledChordTypes, chordType)
    ) {
      flashCardIds.push(flashCards[i].id);
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
    const selectedCellDatas = [
      configData.enabledChordRootPitches,
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
      chordRootPitches
        .map(crp => new CheckboxColumnCell(
          () => <span>{crp.toString(false, true)}</span>, crp
        )),
      (a: Pitch, b: Pitch) => a === b
    ),
    new CheckboxColumn(
      "Chord Type",
      ChordType.All
        .map(ct => new CheckboxColumnCell(
          () => <span>{ct.name}</span>, ct
        )),
      (a: ChordType, b: ChordType) => a === b
    )
  ];
  
  private onChange(newSelectedCellDatas: Array<Array<any>>) {
    if (!this.props.onChange) { return; }

    const newConfigData: IConfigData = {
      enabledChordRootPitches: newSelectedCellDatas[0] as Array<Pitch>,
      enabledChordTypes: newSelectedCellDatas[1] as Array<ChordType>
    };

    const newEnabledFlashCardIds = configDataToEnabledFlashCardIds(
      this.props.studySessionInfo.flashCardSet, this.props.studySessionInfo.flashCards,
      newConfigData
    );
    this.props.onChange(newEnabledFlashCardIds, newConfigData);
  }
}

const initialConfigData: IConfigData = {
  enabledChordRootPitches: chordRootPitches.slice(),
  enabledChordTypes: ChordType.All
    .filter((_, i) => i <= 16)
};

export function createFlashCards(): Array<FlashCard> {
  const flashCards = new Array<FlashCard>();

  forEachChord((chordRootPitch, chordType, i) => {
    const flashCard = new FlashCard(
      JSON.stringify({ set: flashCardSetId, chord: chordRootPitch.toString(false, true) + " " + chordType.name }),
      new FlashCardSide(
        chordRootPitch.toString(false, true) + " " + chordType.name
      ),
      new FlashCardSide(
        chordType.getPitches(chordRootPitch).map(p => p.toString(false, true)).join(" "),
        chordType
      )
    );
    flashCards.push(flashCard);
  });
  
  return flashCards;
}
function createFlashCardSet(): FlashCardSet {
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
  
  const flashCardSet = new FlashCardSet(flashCardSetId,
    "Random Chord Generator",
    createFlashCards
  );
  flashCardSet.configDataToEnabledFlashCardIds = configDataToEnabledFlashCardIds;
  flashCardSet.initialConfigData = initialConfigData;
  flashCardSet.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  flashCardSet.containerHeight = "80px";
  flashCardSet.createFlashCardLevels = (flashCardSet: FlashCardSet, flashCards: Array<FlashCard>) => (
    chordTypeLevels
      .map(ctl =>
        new FlashCardLevel(
          ctl.name,
          flashCards
            .filter(fc => Utils.arrayContains(ctl.chordTypes, fc.backSide.data as ChordType))
            .map(fc => fc.id),
          (curConfigData: IConfigData) => ({
            enabledChordRootPitches: chordRootPitches.slice(),
            enabledChordTypes: ctl.chordTypes.slice()
          } as IConfigData)
        )
      )
  );

  return flashCardSet;
}

export const flashCardSet = createFlashCardSet();