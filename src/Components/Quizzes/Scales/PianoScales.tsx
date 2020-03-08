import * as React from "react";

import * as Utils from "../../../Utils";
import { Vector2D } from '../../../Vector2D';
import { Size2D } from "../../../Size2D";
import { Rect2D } from '../../../Rect2D';
import { Pitch, ambiguousKeyPitchStringsSymbols } from "../../../Pitch";
import { PitchLetter } from "../../../PitchLetter";
import { ScaleType, scaleTypeLevels } from "../../../Scale";
import { PianoKeyboard } from "../../Utils/PianoKeyboard";
import { FlashCard, FlashCardSide, FlashCardId } from "../../../FlashCard";
import { FlashCardSet, FlashCardStudySessionInfo, FlashCardLevel } from "../../../FlashCardSet";
import { ScaleAnswerSelect } from "../../Utils/ScaleAnswerSelect";
import { ChordScaleFormula, ChordScaleFormulaPart } from '../../../ChordScaleFormula';
import { CheckboxColumnsFlashCardMultiSelect, CheckboxColumn, CheckboxColumnCell } from '../../Utils/CheckboxColumnsFlashCardMultiSelect';

const flashCardSetId = "pianoScalesOrderedNotes";

interface IConfigData {
  enabledRootPitches: string[];
  enabledScaleTypes: string[];
}

export function forEachScale(callbackFn: (scaleType: ScaleType, rootPitchStr: string, i: number) => void) {
  let i = 0;

  for (const scaleType of ScaleType.All) {
    for (const rootPitchStr of ambiguousKeyPitchStringsSymbols) {
      callbackFn(scaleType, rootPitchStr, i);
      i++;
    }
  }
}
export function configDataToEnabledFlashCardIds(
  flashCardSet: FlashCardSet, flashCards: Array<FlashCard>, configData: IConfigData
  ): Array<FlashCardId> {
  const newEnabledFlashCardIds = new Array<FlashCardId>();

  forEachScale((scaleType, rootPitchStr, i) => {
    if (
      Utils.arrayContains(configData.enabledRootPitches, rootPitchStr) &&
      Utils.arrayContains(configData.enabledScaleTypes, scaleType.name)
    ) {
      newEnabledFlashCardIds.push(flashCards[i].id);
    }
  });

  return newEnabledFlashCardIds;
}
export interface IPianoScalesFlashCardMultiSelectProps {
  studySessionInfo: FlashCardStudySessionInfo;
  onChange?: (newValue: Array<FlashCardId>, newConfigData: any) => void;
}

export interface IPianoScalesFlashCardMultiSelectState {}
export class PianoScalesFlashCardMultiSelect extends React.Component<IPianoScalesFlashCardMultiSelectProps, IPianoScalesFlashCardMultiSelectState> {
  public render(): JSX.Element {
    const configData = this.props.studySessionInfo.configData as IConfigData;
    const selectedCellDatas = [
      configData.enabledRootPitches,
      configData.enabledScaleTypes
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
      "Scale Type",
      ScaleType.All
        .map(s => new CheckboxColumnCell(
          () => <span>{s.name}</span>, s.name
        )),
      (a: string, b: string) => a === b
    )
  ];
  
  private onChange(newSelectedCellDatas: Array<Array<any>>) {
    if (!this.props.onChange) { return; }

    const newConfigData: IConfigData = {
      enabledRootPitches: newSelectedCellDatas[0] as Array<string>,
      enabledScaleTypes: newSelectedCellDatas[1] as Array<string>
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
    studySessionInfo: FlashCardStudySessionInfo,
    onChange: (newValue: Array<FlashCardId>, newConfigData: any) => void
  ): JSX.Element => {
    return (
    <PianoScalesFlashCardMultiSelect
      studySessionInfo={studySessionInfo}
      onChange={onChange}
    />
    );
  };

  const flashCardSet = new FlashCardSet(flashCardSetId, "Piano Scales", createFlashCards);
  flashCardSet.configDataToEnabledFlashCardIds = configDataToEnabledFlashCardIds;
  flashCardSet.getInitialConfigData = (): IConfigData => ({
    enabledRootPitches: ambiguousKeyPitchStringsSymbols.slice(),
    enabledScaleTypes: ScaleType.All
      .filter((_, scaleIndex) => scaleIndex <= 7)
      .map(scale => scale.name)
  });
  flashCardSet.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  flashCardSet.renderAnswerSelect = renderAnswerSelect;
  flashCardSet.containerHeight = "110px";
  flashCardSet.createFlashCardLevels = (flashCardSet: FlashCardSet, flashCards: Array<FlashCard>) => (
    scaleTypeLevels
      .map(level => new FlashCardLevel(
        level.name,
        flashCards
          .filter(fc => {
            const scaleType = fc.backSide.data as ScaleType;
            return Utils.arrayContains(level.scaleTypes, scaleType);
          })
          .map(fc => fc.id),
        (curConfigData: IConfigData) => ({
          enabledRootPitches: ambiguousKeyPitchStringsSymbols.slice(),
          enabledScaleTypes: level.scaleTypes.map(st => st.name)
        } as IConfigData)
      ))
  );

  return flashCardSet;
}
export function createFlashCards(): FlashCard[] {
  const pianoStyle: any = { width: "100%", maxWidth: "400px" };
  const flashCards = new Array<FlashCard>();

  forEachScale((scaleType, rootPitchStr, i) => {
    const halfStepsFromC = Utils.mod(i - 3, 12);
    const rootPitch = Pitch.createFromMidiNumber((new Pitch(PitchLetter.C, 0, 4)).midiNumber + halfStepsFromC);
    const pitches = new ChordScaleFormula(scaleType.formula.parts.concat(new ChordScaleFormulaPart(8, 0, false))).getPitches(rootPitch);
    
    const deserializedId = {
      set: flashCardSetId,
      scale: `${rootPitch.toString(false)} ${scaleType.name}`
    };
    const id = JSON.stringify(deserializedId);

    const flashCard = new FlashCard(
      id,
      new FlashCardSide(
        size => {

          return (
            <PianoKeyboard
              rect={new Rect2D(new Size2D(400, 100), new Vector2D(0, 0))}
              lowestPitch={new Pitch(PitchLetter.C, 0, 4)}
              highestPitch={new Pitch(PitchLetter.B, 0, 5)}
              pressedPitches={pitches}
              style={pianoStyle}
            />
          );
        },
        pitches
      ),
      new FlashCardSide(
        rootPitchStr + " " + scaleType.name,
        scaleType
      )
    );

    flashCards.push(flashCard);
  });

  return flashCards;
}
export function renderAnswerSelect(
  info: FlashCardStudySessionInfo
) {
  const configData = info.configData as IConfigData
  const correctAnswer = info.currentFlashCard.backSide.renderFn as string;
  const activeScales = ScaleType.All
    .filter(scaleType => Utils.arrayContains(configData.enabledScaleTypes, scaleType.name));
  const rootPitchStrings = configData.enabledRootPitches;
  
  return <ScaleAnswerSelect
    key={correctAnswer} scales={activeScales} ambiguousPitchStringsSymbols={rootPitchStrings} correctAnswer={correctAnswer}
    onAnswer={info.onAnswer} lastCorrectAnswer={info.lastCorrectAnswer}
    incorrectAnswers={info.incorrectAnswers} />;
}

export const flashCardSet = createFlashCardSet();