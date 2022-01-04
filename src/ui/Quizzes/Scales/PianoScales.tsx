import * as React from "react";
import wu from "wu";

import { Pitch, getPitchesInRange, createPitchFromMidiNumber, createPitch, getMidiNumber } from "../../../lib/TheoryLib/Pitch";
import { PitchLetter } from "../../../lib/TheoryLib/PitchLetter";
import { PianoKeyboard, PianoKeyboardMetrics, renderPianoKeyboardKeyLabels } from "../../Utils/PianoKeyboard";
import { FlashCard, FlashCardSide, FlashCardId, createFlashCardId } from "../../../FlashCard";
import { FlashCardSet, FlashCardStudySessionInfo, FlashCardLevel } from "../../../FlashCardSet";
import { ScaleAnswerSelect } from "../../Utils/ScaleAnswerSelect";
import { ChordScaleFormula, ChordScaleFormulaPart } from '../../../lib/TheoryLib/ChordScaleFormula';
import { CheckboxColumnsFlashCardMultiSelect, CheckboxColumn, CheckboxColumnCell } from '../../Utils/CheckboxColumnsFlashCardMultiSelect';
import { arrayContains } from '../../../lib/Core/ArrayUtils';
import { mod } from '../../../lib/Core/MathUtils';
import { AllScaleTypes, ScaleType, scaleTypeLevels } from "../../../lib/TheoryLib/ScaleType";
import { ambiguousKeyPitchStringsSymbols } from "../../../lib/TheoryLib/PitchName";

const flashCardSetId = "pianoScalesOrderedNotes";

interface IConfigData {
  enabledRootPitches: string[];
  enabledScaleTypes: string[];
}

export function forEachScale(callbackFn: (scaleType: ScaleType, rootPitchStr: string, i: number) => void) {
  let i = 0;

  for (const scaleType of AllScaleTypes) {
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
      arrayContains(configData.enabledRootPitches, rootPitchStr) &&
      arrayContains(configData.enabledScaleTypes, scaleType.name)
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
      AllScaleTypes
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
    enabledScaleTypes: AllScaleTypes
      .filter((_, scaleIndex) => scaleIndex <= 7)
      .map(scale => scale.name)
  });
  flashCardSet.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  flashCardSet.renderAnswerSelect = renderAnswerSelect;
  flashCardSet.createFlashCardLevels = (flashCardSet: FlashCardSet, flashCards: Array<FlashCard>) => (
    scaleTypeLevels
      .map(level => new FlashCardLevel(
        level.name,
        flashCards
          .filter(fc => {
            const scaleType = fc.backSide.data as ScaleType;
            return arrayContains(level.scaleTypes, scaleType);
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
  const flashCards = new Array<FlashCard>();

  forEachScale((scaleType, rootPitchStr, i) => {
    const halfStepsFromC = mod(i - 3, 12);
    const rootPitch = createPitchFromMidiNumber(getMidiNumber(createPitch(PitchLetter.C, 0, 4)) + halfStepsFromC);
    const formula = new ChordScaleFormula(scaleType.formula.parts.concat(new ChordScaleFormulaPart(8, 0, false)));
    const pitches = formula.getPitchClasses(rootPitch);
    const pitchMidiNumbersNoOctave = new Set<number>(pitches.map(p => p.midiNumberNoOctave));
    const lowestPitch = createPitch(PitchLetter.C, 0, 4);
    const highestPitch = createPitch(PitchLetter.B, 0, 5);
    const pressedPitches = wu(getPitchesInRange(lowestPitch, highestPitch))
      .filter(p => pitchMidiNumbersNoOctave.has(p.midiNumberNoOctave))
      .toArray();

    const flashCard = new FlashCard(
      createFlashCardId(flashCardSetId, { scale: `${rootPitch.toString(false)} ${scaleType.name}` }),
      new FlashCardSide(
        size => (
          <PianoKeyboard
            maxWidth={240}
            lowestPitch={lowestPitch}
            highestPitch={highestPitch}
            pressedPitches={pressedPitches}
            renderExtrasFn={metrics => renderScaleDegree1LabelExtras(metrics, rootPitch)}
          />
        ),
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
  const activeScales = AllScaleTypes
    .filter(scaleType => arrayContains(configData.enabledScaleTypes, scaleType.name));
  const rootPitchStrings = configData.enabledRootPitches;
  
  return <ScaleAnswerSelect
    key={correctAnswer} scales={activeScales} ambiguousPitchStringsSymbols={rootPitchStrings} correctAnswer={correctAnswer}
    onAnswer={info.onAnswer} lastCorrectAnswer={info.lastCorrectAnswer}
    incorrectAnswers={info.incorrectAnswers} />;
}

export function renderScaleDegree1LabelExtras(metrics: PianoKeyboardMetrics, rootPitch: Pitch): JSX.Element {
  return renderPianoKeyboardKeyLabels(
    metrics,
    /*useSharps*/ undefined,
    /*getLabels*/
    p => (p.midiNumberNoOctave === rootPitch.midiNumberNoOctave)
      ? ["1"]
      : null)
}

export const flashCardSet = createFlashCardSet();