import * as React from "react";
import { TableRow, TableCell, Table, TableHead, TableBody, Grid, Checkbox } from "@material-ui/core";

import * as Utils from "../../../Utils";
import { Size2D } from "../../../Size2D";
import { ScaleType, Scale } from "../../../Scale";
import { FlashCard, FlashCardSide, FlashCardId } from "../../../FlashCard";
import { FlashCardSet, FlashCardStudySessionInfo } from "../../../FlashCardSet";
import { Pitch } from "../../../Pitch";
import { PitchLetter } from "../../../PitchLetter";
import { getStandardGuitarTuning } from "../../Utils/StringedInstrumentTuning";
import { ChordScaleFormula, ChordScaleFormulaPart } from '../../../ChordScaleFormula';
import { GuitarScaleViewer } from '../../Utils/GuitarScaleViewer';
import { renderDistinctFlashCardSideAnswerSelect } from '../Utils';

const flashCardSetId = "guitarScalesOrderedNotes";

const guitarTuning = getStandardGuitarTuning(6);

interface IConfigData {
  enabledScaleTypes: Array<ScaleType>;
}

export function forEachScaleType(callbackFn: (scaleType: ScaleType, i: number) => void) {
  for (let i = 0; i < ScaleType.All.length; i++) {
    const scaleType = ScaleType.All[i];
    callbackFn(scaleType, i);
  }
}
export function configDataToEnabledFlashCardIds(
  flashCardSet: FlashCardSet, flashCards: Array<FlashCard>, configData: IConfigData
): Array<FlashCardId> {
  const newEnabledFlashCardIds = new Array<FlashCardId>();

  forEachScaleType((scaleType, i) => {
    if (Utils.arrayContains(configData.enabledScaleTypes, scaleType)) {
      newEnabledFlashCardIds.push(flashCards[i].id);
    }
  });

  return newEnabledFlashCardIds;
}

export interface IGuitarScalesFlashCardMultiSelectProps {
  studySessionInfo: FlashCardStudySessionInfo;
  onChange?: (newValue: Array<FlashCardId>, newConfigData: any) => void;
}
export interface IGuitarScalesFlashCardMultiSelectState {}
export class GuitarScalesFlashCardMultiSelect extends React.Component<IGuitarScalesFlashCardMultiSelectProps, IGuitarScalesFlashCardMultiSelectState> {
  public render(): JSX.Element {
    const configData = this.props.studySessionInfo.configData as IConfigData;
    
    const scaleTypeCheckboxTableRows = ScaleType.All
      .map((scaleType, i) => {
        const isChecked = configData.enabledScaleTypes.indexOf(scaleType) >= 0;
        const isEnabled = !isChecked || (configData.enabledScaleTypes.length > 1);

        return (
          <TableRow key={i}>
            <TableCell><Checkbox checked={isChecked} onChange={event => this.toggleScaleEnabled(scaleType)} disabled={!isEnabled} /></TableCell>
            <TableCell>{scaleType.name}</TableCell>
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
        <Grid item xs={12}>{scaleTypeCheckboxes}</Grid>
      </Grid>
    );
  }
  
  private toggleScaleEnabled(scaleType: ScaleType) {
    const configData = this.props.studySessionInfo.configData as IConfigData;
    const newEnabledScaleTypes = Utils.toggleArrayElement(
      configData.enabledScaleTypes,
      scaleType
    );
    
    if (newEnabledScaleTypes.length > 0) {
      const newConfigData: IConfigData = {
        enabledScaleTypes: newEnabledScaleTypes
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

export function createFlashCardSet(title?: string, initialScaleTypes?: Array<ScaleType>): FlashCardSet {
  title = (title !== undefined) ? title : "Guitar Scales";

  const renderFlashCardMultiSelect = (
    studySessionInfo: FlashCardStudySessionInfo,
    onChange: (newValue: Array<FlashCardId>, newConfigData: any) => void
  ): JSX.Element => {
    return (
    <GuitarScalesFlashCardMultiSelect
      studySessionInfo={studySessionInfo}
      onChange={onChange}
    />
    );
  };

  const initialConfigData: IConfigData = {
    enabledScaleTypes: !initialScaleTypes
      ? ScaleType.All
        .filter((_, scaleIndex) => scaleIndex <= 7)
      : initialScaleTypes
        .map(scaleType => Utils.unwrapValueOrUndefined(ScaleType.All.find(st => st.equals(scaleType))))
  };

  const flashCardSet = new FlashCardSet(flashCardSetId, title, createFlashCards);
  flashCardSet.configDataToEnabledFlashCardIds = configDataToEnabledFlashCardIds;
  flashCardSet.initialConfigData = initialConfigData;
  flashCardSet.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  flashCardSet.renderAnswerSelect = renderDistinctFlashCardSideAnswerSelect;
  flashCardSet.containerHeight = "180px";

  return flashCardSet;
}
export function createFlashCards(): Array<FlashCard> {
  const flashCards = new Array<FlashCard>();

  forEachScaleType((scaleType, i) => {
    const rootPitch = new Pitch(PitchLetter.F, 0, 2);
    const pitches = new ChordScaleFormula(scaleType.formula.parts.concat(new ChordScaleFormulaPart(8, 0, false))).getPitches(rootPitch);
    const deserializedId = {
      set: flashCardSetId,
      scale: scaleType.name
    };
    const id = JSON.stringify(deserializedId);

    const scale = new Scale(scaleType, rootPitch);

    flashCards.push(new FlashCard(
      id,
      new FlashCardSide(
        size => {
          return (
            <div>
              <GuitarScaleViewer scale={scale} renderAllScaleShapes={false} tuning={guitarTuning} size={new Size2D(400, 140)} />
            </div>
          );
        },
        pitches
      ),
      new FlashCardSide(scaleType.name)
    ));
  });

  return flashCards;
}