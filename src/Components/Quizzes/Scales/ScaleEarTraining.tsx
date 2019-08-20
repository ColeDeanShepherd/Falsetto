import * as React from "react";
import { Checkbox, TableRow, TableCell, Table, TableHead, TableBody, Grid, Button } from "@material-ui/core";

import * as Utils from "../../../Utils";
import * as FlashCardUtils from "../Utils";
import { FlashCard, FlashCardId } from "../../../FlashCard";
import { FlashCardSet, FlashCardStudySessionInfo } from "../../../FlashCardSet";
import { Pitch, pitchRange } from "../../../Pitch";
import { PitchLetter } from "../../../PitchLetter";
import { playPitchesSequentially } from "../../../Piano";
import { ScaleType } from "../../../Scale";
import { ChordScaleFormula, ChordScaleFormulaPart } from '../../../ChordScaleFormula';

const flashCardSetId = "scaleEarTraining";

const minPitch = new Pitch(PitchLetter.C, -1, 2);
const maxPitch = new Pitch(PitchLetter.C, 1, 6);
const rootPitches = Utils.range(minPitch.midiNumber, maxPitch.midiNumber)
  .map(midiNumber => Pitch.createFromMidiNumber(midiNumber));

// TODO: instead of generating all flash cards ahead of time, dynamically generate each one

export interface IFlashCardFrontSideProps {
  scaleType: ScaleType;
}
export interface IFlashCardFrontSideState {
  pitches: Array<Pitch>;
}
export class FlashCardFrontSide extends React.Component<IFlashCardFrontSideProps, IFlashCardFrontSideState> {
  public constructor(props: IFlashCardFrontSideProps) {
    super(props);

    const rootPitch = Utils.randomElement(rootPitches);
    const pitches = new ChordScaleFormula(
      this.props.scaleType.formula.parts
        .concat(new ChordScaleFormulaPart(8, 0, false))
    ).getPitches(rootPitch);

    this.state = {
      pitches: pitches
    };
  }

  public componentWillUnmount() {
    if (this.playAudioCancelFn) {
      this.playAudioCancelFn();
    }
  }

  public render(): JSX.Element {
    return (
      <div>
        <Button
          onClick={event => this.playAudio()}
          variant="contained"
        >
          Play Sound
        </Button>
      </div>
    );
  }

  private playAudioCancelFn: (() => void) | null = null;

  private playAudio(): void {
    if (this.playAudioCancelFn) {
      this.playAudioCancelFn();
      this.playAudioCancelFn = null;
    }

    const cutOffSounds = true;
    this.playAudioCancelFn = playPitchesSequentially(this.state.pitches, 500, cutOffSounds);
  }
}

interface IConfigData {
  enabledScaleTypes: string[];
}

export function forEachScaleType(callbackFn: (scaleType: ScaleType, i: number) => void) {
  let i = 0;

  for (const scaleType of ScaleType.All) {
    callbackFn(scaleType, i);

    i++;
  }
}
export function configDataToEnabledFlashCardIds(
  flashCardSet: FlashCardSet, flashCards: Array<FlashCard>, configData: IConfigData
): Array<FlashCardId> {
  const newEnabledFlashCardIds = new Array<FlashCardId>();

  forEachScaleType((scaleType, i) => {
    if (Utils.arrayContains(configData.enabledScaleTypes, scaleType.name)) {
      newEnabledFlashCardIds.push(flashCards[i].id);
    }

    i++;
  });

  return newEnabledFlashCardIds;
}

export interface IScaleNotesFlashCardMultiSelectProps {
  studySessionInfo: FlashCardStudySessionInfo;
  onChange?: (newValue: Array<FlashCardId>, newConfigData: any) => void;
}
export interface IScaleNotesFlashCardMultiSelectState {}
export class ScaleNotesFlashCardMultiSelect extends React.Component<IScaleNotesFlashCardMultiSelectProps, IScaleNotesFlashCardMultiSelectState> {
  public constructor(props: IScaleNotesFlashCardMultiSelectProps) {
    super(props);

    this.state = {
      enabledScaleTypes: ScaleType.All.map(c => c.name)
    };
  }
  public render(): JSX.Element {
    const configData = this.props.studySessionInfo.configData as IConfigData;
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
        <Grid item xs={12}>{scaleTypeCheckboxes}</Grid>
      </Grid>
    );
  }
  
  private toggleScaleEnabled(scale: string) {
    const configData = this.props.studySessionInfo.configData as IConfigData;
    const newEnabledScaleTypes = Utils.toggleArrayElement(
      configData.enabledScaleTypes,
      scale
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

export function createFlashCards(): Array<FlashCard> {
  let i = 0;

  const flashCards = new Array<FlashCard>();

  for (const scaleType of ScaleType.All) {
    const iCopy = i;
    i++;

    const deserializedId = {
      set: flashCardSetId,
      scale: `${scaleType.name}`
    };
    const id = JSON.stringify(deserializedId);

    flashCards.push(FlashCard.fromRenderFns(
      id,
      () => <FlashCardFrontSide key={iCopy} scaleType={scaleType} />,
      scaleType.name
    ));
  }

  return flashCards;
}
export function createFlashCardSet(): FlashCardSet {
  const renderFlashCardMultiSelect = (
    studySessionInfo: FlashCardStudySessionInfo,
    onChange: (newValue: Array<FlashCardId>, newConfigData: any) => void
  ): JSX.Element => {
    return (
    <ScaleNotesFlashCardMultiSelect
      studySessionInfo={studySessionInfo}
      onChange={onChange}
    />
    );
  };

  const initialConfigData: IConfigData = {
    enabledScaleTypes: ScaleType.All
      .filter((_, scaleIndex) => scaleIndex <= 7)
      .map(scale => scale.name)
  };
  
  const flashCardSet = new FlashCardSet(flashCardSetId,
    "Scale Ear Training",
    createFlashCards
  );
  flashCardSet.configDataToEnabledFlashCardIds = configDataToEnabledFlashCardIds;
  flashCardSet.initialConfigData = initialConfigData;
  flashCardSet.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  flashCardSet.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  flashCardSet.containerHeight = "110px";

  return flashCardSet;
}