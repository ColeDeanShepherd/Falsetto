import * as React from "react";

import { Vector2D } from '../../../lib/Core/Vector2D';
import { Size2D } from "../../../lib/Core/Size2D";
import { Rect2D } from '../../../lib/Core/Rect2D';
import { PianoKeyboard } from "../../Utils/PianoKeyboard";
import { FlashCard, FlashCardSide, FlashCardId } from "../../../FlashCard";
import { FlashCardSet, FlashCardStudySessionInfo, FlashCardLevel } from "../../../FlashCardSet";
import { AnswerDifficulty } from "../../../Study/AnswerDifficulty";
import { Pitch, ambiguousKeyPitchStringsSymbols } from "../../../lib/TheoryLib/Pitch";
import { PitchLetter } from "../../../lib/TheoryLib/PitchLetter";
import { Button, Typography } from "@material-ui/core";
import { Chord, ChordType, chordTypeLevels } from "../../../lib/TheoryLib/Chord";
import { CheckboxColumnsFlashCardMultiSelect, CheckboxColumn, CheckboxColumnCell } from '../../Utils/CheckboxColumnsFlashCardMultiSelect';
import { arrayContains, flattenArrays } from '../../../lib/Core/ArrayUtils';
import { mod } from '../../../lib/Core/MathUtils';
import { getPianoKeyboardAspectRatio } from '../../Utils/PianoUtils';
import { PianoKeysAnswerSelect } from "../../Utils/PianoKeysAnswerSelect";

const flashCardSetId = "pianoChords";

const pianoLowestPitch = new Pitch(PitchLetter.C, 0, 4);
const pianoHighestPitch = new Pitch(PitchLetter.B, 0, 5);

const pianoAspectRatio = getPianoKeyboardAspectRatio(/*octaveCount*/ 2);
const pianoMaxWidth = 300;
const pianoStyle = { width: `${pianoMaxWidth}px`, maxWidth: "100%", height: "auto" };

interface IConfigData {
  enabledRootPitches: string[];
  enabledChordTypes: string[];
}

export function forEachChord(callbackFn: (rootPitchString: string, chordType: ChordType, i: number) => void) {
  let i = 0;

  for (const rootPitchStr of ambiguousKeyPitchStringsSymbols) {
    for (const chordType of ChordType.All) {
      callbackFn(rootPitchStr, chordType, i);
      i++;
    }
  }
}

export function configDataToEnabledFlashCardIds(
  flashCardSet: FlashCardSet, flashCards: Array<FlashCard>, configData: IConfigData
): Array<FlashCardId> {
  const newEnabledFlashCardIds = new Array<FlashCardId>();

  forEachChord((rootPitchStr, chordType, i) => {
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
      this.props.studySessionInfo.flashCardSet, this.props.studySessionInfo.flashCards,
      newConfigData
    );
    this.props.onChange(newEnabledFlashCardIds, newConfigData);
  }
}

function createFlashCardSet(): FlashCardSet {
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

  const flashCardSet = new FlashCardSet(flashCardSetId, "Piano Chords", createFlashCards);
  flashCardSet.configDataToEnabledFlashCardIds = configDataToEnabledFlashCardIds;
  flashCardSet.getInitialConfigData = (): IConfigData => ({
    enabledRootPitches: ambiguousKeyPitchStringsSymbols.slice(),
    enabledChordTypes: ChordType.All
      .filter((_, chordIndex) => chordIndex <= 8)
      .map(chord => chord.name)
  });
  flashCardSet.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  flashCardSet.renderAnswerSelect = renderAnswerSelect;
  flashCardSet.containerHeight = "150px";
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

  return flashCardSet;
}

export function createFlashCards(): FlashCard[] {
  return flattenArrays<FlashCard>(
    ambiguousKeyPitchStringsSymbols.map((rootPitchStr, i) =>
      ChordType.All.map(chordType => {
        const halfStepsFromC = mod(i - 3, 12);
        const rootPitch = Pitch.createFromMidiNumber((new Pitch(PitchLetter.C, 0, 4)).midiNumber + halfStepsFromC);
        const pitches = new Chord(chordType, rootPitch).getPitches();
        const deserializedId = {
          set: flashCardSetId,
          chord: `${rootPitch.toString(false)} ${chordType.name}`
        };
        const id = JSON.stringify(deserializedId);

        return new FlashCard(
          id,

          new FlashCardSide(
            rootPitchStr + " " + chordType.name,
            pitches
          ),

          new FlashCardSide(
            size => {
              return (
                <PianoKeyboard
                  rect={new Rect2D(new Size2D(pianoAspectRatio * 100, 100), new Vector2D(0, 0))}
                  lowestPitch={pianoLowestPitch}
                  highestPitch={pianoHighestPitch}
                  pressedPitches={pitches}
                  style={pianoStyle}
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
    aspectRatio={pianoAspectRatio} maxWidth={pianoMaxWidth} lowestPitch={pianoLowestPitch} highestPitch={pianoHighestPitch}
    correctAnswer={correctAnswer}
    onAnswer={info.onAnswer} lastCorrectAnswer={info.lastCorrectAnswer}
    incorrectAnswers={info.incorrectAnswers} instantConfirm={false} wrapOctave={true} />;
}

export const flashCardSet = createFlashCardSet();