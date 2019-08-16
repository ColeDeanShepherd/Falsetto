import * as React from "react";
import { TableRow, TableCell, Table, TableHead, TableBody, Grid, Checkbox } from "@material-ui/core";

import * as Utils from "../../../Utils";
import { Vector2D } from '../../../Vector2D';
import { Size2D } from "../../../Size2D";
import { Rect2D } from '../../../Rect2D';
import { Pitch } from "../../../Pitch";
import { PitchLetter } from "../../../PitchLetter";
import { ScaleType } from "../../../Scale";
import { PianoKeyboard } from "../../Utils/PianoKeyboard";
import { FlashCard, FlashCardSide, FlashCardId } from "../../../FlashCard";
import { FlashCardSet, FlashCardStudySessionInfo } from "../../../FlashCardSet";
import { PianoKeysAnswerSelect } from "../../Utils/PianoKeysAnswerSelect";
import { ScaleAnswerSelect } from "../../Utils/ScaleAnswerSelect";
import { ChordScaleFormula, ChordScaleFormulaPart } from '../../../ChordScaleFormula';

const flashCardSetId = "pianoScalesOrderedNotes";

const rootPitchStrs = ["Ab", "A", "Bb", "B/Cb", "C", "C#/Db", "D", "Eb", "E", "F", "F#/Gb", "G"];

interface IConfigData {
  enabledRootPitches: string[];
  enabledScaleTypes: string[];
}

export function forEachScale(callbackFn: (scaleType: ScaleType, rootPitchStr: string, i: number) => void) {
  let i = 0;

  for (const scaleType of ScaleType.All) {
    for (const rootPitchStr of rootPitchStrs) {
      callbackFn(scaleType, rootPitchStr, i);
      i++;
    }
  }
}
export function configDataToEnabledFlashCardIds(
  info: FlashCardStudySessionInfo, configData: IConfigData
  ): Array<FlashCardId> {
  const newEnabledFlashCardIds = new Array<FlashCardId>();

  forEachScale((scaleType, rootPitchStr, i) => {
    if (
      Utils.arrayContains(configData.enabledRootPitches, rootPitchStr) &&
      Utils.arrayContains(configData.enabledScaleTypes, scaleType.name)
    ) {
      newEnabledFlashCardIds.push(info.flashCards[i].id);
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
    const rootPitchCheckboxTableRows = rootPitchStrs
      .map((rootPitch, i) => {
        const isChecked = configData.enabledRootPitches.indexOf(rootPitch) >= 0;
        const isEnabled = !isChecked || (configData.enabledRootPitches.length > 1);

        return (
          <TableRow key={i}>
            <TableCell><Checkbox checked={isChecked} onChange={event => this.toggleRootPitchEnabled(rootPitch)} disabled={!isEnabled} /></TableCell>
            <TableCell>{rootPitch}</TableCell>
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

    const scaleTypeCheckboxTableRows = ScaleType.All
      .map((scale, i) => {
        const isChecked = configData.enabledScaleTypes.indexOf(scale.name) >= 0;
        const isEnabled = !isChecked || (configData.enabledScaleTypes.length > 1);

        return (
          <TableRow key={i}>
            <TableCell><Checkbox checked={isChecked} onChange={event => this.toggleScaleEnabled(scale.name)} disabled={!isEnabled} /></TableCell>
            <TableCell>{scale.name}</TableCell>
          </TableRow>
        );
      }, this);
    const scaleTypeCheckboxes = (
      <Table className="table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Scale</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {scaleTypeCheckboxTableRows}
        </TableBody>
      </Table>
    );

    return (
      <Grid container spacing={32}>
        <Grid item xs={6}>{rootPitchCheckboxes}</Grid>
        <Grid item xs={6}>{scaleTypeCheckboxes}</Grid>
      </Grid>
    );
  }
  
  private toggleRootPitchEnabled(rootPitch: string) {
    const configData = this.props.studySessionInfo.configData as IConfigData;
    const newEnabledRootPitches = Utils.toggleArrayElement(
      configData.enabledRootPitches,
      rootPitch
    );
    
    if (newEnabledRootPitches.length > 0) {
      const newConfigData: IConfigData = {
        enabledRootPitches: newEnabledRootPitches,
        enabledScaleTypes: configData.enabledScaleTypes
      };
      this.onChange(newConfigData);
    }
  }
  private toggleScaleEnabled(scale: string) {
    const configData = this.props.studySessionInfo.configData as IConfigData;
    const newEnabledScaleTypes = Utils.toggleArrayElement(
      configData.enabledScaleTypes,
      scale
    );
    
    if (newEnabledScaleTypes.length > 0) {
      const newConfigData: IConfigData = {
        enabledRootPitches: configData.enabledRootPitches,
        enabledScaleTypes: newEnabledScaleTypes
      };
      this.onChange(newConfigData);
    }
  }
  private onChange(newConfigData: IConfigData) {
    if (!this.props.onChange) { return; }

    const newEnabledFlashCardIds = configDataToEnabledFlashCardIds(
      this.props.studySessionInfo, newConfigData
    );
    this.props.onChange(newEnabledFlashCardIds, newConfigData);
  }
}

export function createFlashCardSet(): FlashCardSet {
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

  const initialConfigData: IConfigData = {
    enabledRootPitches: rootPitchStrs.slice(),
    enabledScaleTypes: ScaleType.All
      .filter((_, scaleIndex) => scaleIndex <= 8)
      .map(scale => scale.name)
  };

  const flashCardSet = new FlashCardSet(flashCardSetId, "Piano Scales", createFlashCards);
  flashCardSet.enableInvertFlashCards = true;
  flashCardSet.configDataToEnabledFlashCardIds = configDataToEnabledFlashCardIds;
  flashCardSet.initialConfigData = initialConfigData;
  flashCardSet.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  flashCardSet.renderAnswerSelect = renderAnswerSelect;
  flashCardSet.containerHeight = "110px";

  return flashCardSet;
}
export function createFlashCards(): FlashCard[] {
  const flashCards = new Array<FlashCard>();

  forEachScale((scaleType, rootPitchStr, i) => {
    const halfStepsFromC = Utils.mod(i - 4, 12);
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
        (width, height) => {
          const size = Utils.shrinkRectToFit(new Size2D(width, height), new Size2D(400, 100));

          return (
            <PianoKeyboard
              rect={new Rect2D(size, new Vector2D(0, 0))}
              lowestPitch={new Pitch(PitchLetter.C, 0, 4)}
              highestPitch={new Pitch(PitchLetter.B, 0, 5)}
              pressedPitches={pitches}
            />
          );
        },
        pitches
      ),
      new FlashCardSide(rootPitchStr + " " + scaleType.name)
    );

    flashCards.push(flashCard);
  });

  return flashCards;
}
export function renderAnswerSelect(
  info: FlashCardStudySessionInfo
) {
  if (!info.areFlashCardsInverted) {
    const configData = info.configData as IConfigData
    const correctAnswer = info.currentFlashCard.backSide.renderFn as string;
    const activeScales = ScaleType.All
      .filter(scaleType => Utils.arrayContains(configData.enabledScaleTypes, scaleType.name));
    return <ScaleAnswerSelect
      key={correctAnswer} scales={activeScales} correctAnswer={correctAnswer}
      onAnswer={info.onAnswer} lastCorrectAnswer={info.lastCorrectAnswer}
      incorrectAnswers={info.incorrectAnswers} />;
  } else {
    const key = info.currentFlashCard.frontSide.renderFn as string;
    const correctAnswer = info.currentFlashCard.backSide.data[0] as Array<Pitch>;
    return <PianoKeysAnswerSelect
      key={key} width={info.width} height={info.height} correctAnswer={correctAnswer}
      onAnswer={info.onAnswer} lastCorrectAnswer={info.lastCorrectAnswer}
      incorrectAnswers={info.incorrectAnswers} />;
  }
}