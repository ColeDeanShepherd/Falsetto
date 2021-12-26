import * as React from "react";

import { PianoKeyboard } from "../../Utils/PianoKeyboard";
import { FlashCard, FlashCardSide, FlashCardId, createFlashCardId } from "../../../FlashCard";
import { FlashCardSet, FlashCardStudySessionInfo, FlashCardLevel } from "../../../FlashCardSet";
import { Pitch, ambiguousKeyPitchStringsSymbols } from "../../../lib/TheoryLib/Pitch";
import { PitchLetter } from "../../../lib/TheoryLib/PitchLetter";
import { Chord } from "../../../lib/TheoryLib/Chord";
import { ChordType, chordTypeLevels } from "../../../lib/TheoryLib/ChordType";
import { CheckboxColumnsFlashCardMultiSelect, CheckboxColumn, CheckboxColumnCell } from '../../Utils/CheckboxColumnsFlashCardMultiSelect';
import { arrayContains, flattenArrays } from '../../../lib/Core/ArrayUtils';
import { mod } from '../../../lib/Core/MathUtils';
import { PianoKeysAnswerSelect } from "../../Utils/PianoKeysAnswerSelect";

const flashCardSetId = "pianoChords";

const pianoLowestPitch = new Pitch(PitchLetter.C, 0, 4);
const pianoHighestPitch = new Pitch(PitchLetter.B, 0, 5);

const pianoMaxWidth = 300;

interface IConfigData {
  enabledRootPitches: string[];
  enabledChordTypes: string[];
}

export function forEachChord(
  chordTypes: Array<ChordType>,
  callbackFn: (rootPitchString: string, chordType: ChordType, i: number) => void
) {
  let i = 0;

  for (const rootPitchStr of ambiguousKeyPitchStringsSymbols) {
    for (const chordType of chordTypes) {
      callbackFn(rootPitchStr, chordType, i);
      i++;
    }
  }
}

export function configDataToEnabledFlashCardIds(
  flashCardSet: FlashCardSet, chordTypes: Array<ChordType>, flashCards: Array<FlashCard>, configData: IConfigData
): Array<FlashCardId> {
  const newEnabledFlashCardIds = new Array<FlashCardId>();

  forEachChord(chordTypes, (rootPitchStr, chordType, i) => {
    if (
      arrayContains(configData.enabledRootPitches, rootPitchStr) &&
      arrayContains(configData.enabledChordTypes, chordType.name)
    ) {
      newEnabledFlashCardIds.push(flashCards[i].id);
    }
  });

  return newEnabledFlashCardIds;
}

export interface IPianoChordsFlashCardMultiSelectProps {
  studySessionInfo: FlashCardStudySessionInfo,
  onChange?: (newValue: Array<FlashCardId>, newConfigData: any) => void;
}

export interface IPianoChordsFlashCardMultiSelectState {}

export class PianoChordsFlashCardMultiSelect extends React.Component<IPianoChordsFlashCardMultiSelectProps, IPianoChordsFlashCardMultiSelectState> {
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
      ambiguousKeyPitchStringsSymbols
        .map(rp => new CheckboxColumnCell(
          () => <span>{rp}</span>, rp
        )),
      (a: string, b: string) => a === b
    ),
    new CheckboxColumn(
      "Chord Type",
      ChordType.All
        .map(ct => new CheckboxColumnCell(
          () => <span>{ct.name}</span>, ct.name
        )),
      (a: string, b: string) => a === b
    )
  ];
  
  private onChange(newSelectedCellDatas: Array<Array<any>>) {
    if (!this.props.onChange) { return; }

    const newConfigData: IConfigData = {
      enabledRootPitches: newSelectedCellDatas[0] as Array<string>,
      enabledChordTypes: newSelectedCellDatas[1] as Array<string>
    };

    const newEnabledFlashCardIds = configDataToEnabledFlashCardIds(
      this.props.studySessionInfo.flashCardSet, ChordType.All, this.props.studySessionInfo.flashCards,
      newConfigData
    );
    this.props.onChange(newEnabledFlashCardIds, newConfigData);
  }
}

export function createFlashCardSet(chordTypes: Array<ChordType>): FlashCardSet {
  const renderFlashCardMultiSelect = (
    info: FlashCardStudySessionInfo,
    onChange: (newValue: Array<FlashCardId>, newConfigData: any) => void
  ): JSX.Element => {
    return (
    <PianoChordsFlashCardMultiSelect
      studySessionInfo={info}
      onChange={onChange}
    />
    );
  };

  const flashCardSet = new FlashCardSet(flashCardSetId, "Piano Chords", () => createFlashCards(chordTypes));
  flashCardSet.configDataToEnabledFlashCardIds = (flashCardSet, flashCards, configData) =>
    configDataToEnabledFlashCardIds(flashCardSet, chordTypes, flashCards, configData);
  flashCardSet.getInitialConfigData = (): IConfigData => ({
    enabledRootPitches: ambiguousKeyPitchStringsSymbols.slice(),
    enabledChordTypes: (chordTypes === ChordType.All)
      ? (
        ChordType.All
          .filter((_, chordIndex) => chordIndex <= 8)
          .map(chord => chord.name)
      )
      : chordTypes.map(chord => chord.name)
  });
  flashCardSet.renderFlashCardMultiSelect = (chordTypes === ChordType.All)
    ? renderFlashCardMultiSelect
    : undefined;
  flashCardSet.renderAnswerSelect = renderAnswerSelect;

  if (chordTypes === ChordType.All) {
    flashCardSet.createFlashCardLevels = (flashCardSet: FlashCardSet, flashCards: Array<FlashCard>) => (
      chordTypeLevels
        .map(ctl =>
          new FlashCardLevel(
            ctl.name,
            flashCards
              .filter(fc => arrayContains(ctl.chordTypes, (fc.backSide.data as Chord).type))
              .map(fc => fc.id),
            (curConfigData: IConfigData) => ({
              enabledRootPitches: ambiguousKeyPitchStringsSymbols.slice(),
              enabledChordTypes: ctl.chordTypes.map(ct => ct.name)
            } as IConfigData)
          )
        )
    );
  }

  return flashCardSet;
}

export function createFlashCards(chordTypes: Array<ChordType>): FlashCard[] {
  return flattenArrays<FlashCard>(
    ambiguousKeyPitchStringsSymbols.map((rootPitchStr, i) =>
      chordTypes.map(chordType => {
        const halfStepsFromC = mod(i - 3, 12);
        const rootPitch = Pitch.createFromMidiNumber((new Pitch(PitchLetter.C, 0, 4)).midiNumber + halfStepsFromC);
        const pitches = new Chord(chordType, rootPitch).getPitchClasses();

        return new FlashCard(
          createFlashCardId(flashCardSetId, { chord: `${rootPitch.toString(false)} ${chordType.name}` }),

          new FlashCardSide(
            rootPitchStr + " " + chordType.name,
            pitches
          ),

          new FlashCardSide(
            size => {
              return (
                <PianoKeyboard
                  maxWidth={pianoMaxWidth}
                  lowestPitch={pianoLowestPitch}
                  highestPitch={pianoHighestPitch}
                  pressedPitches={pitches}
                />
              );
            },
            new Chord(chordType, rootPitch)
          )
        );
      })
    )
  );
}

export function renderAnswerSelect(
  info: FlashCardStudySessionInfo
) {
  const correctAnswer = info.currentFlashCard.frontSide.data as Array<Pitch>;

  return <PianoKeysAnswerSelect
    maxWidth={pianoMaxWidth} lowestPitch={pianoLowestPitch} highestPitch={pianoHighestPitch}
    correctAnswer={correctAnswer}
    onAnswer={info.onAnswer} lastCorrectAnswer={info.lastCorrectAnswer}
    incorrectAnswers={info.incorrectAnswers} instantConfirm={false} wrapOctave={true} />;
}

export const flashCardSet = createFlashCardSet(ChordType.All);