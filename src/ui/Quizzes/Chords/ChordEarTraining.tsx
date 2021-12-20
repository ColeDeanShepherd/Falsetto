import * as React from "react";
import { Checkbox, TableRow, TableCell, Table, TableHead, TableBody, Grid } from "@material-ui/core";

import * as FlashCardUtils from "../Utils";
import { createFlashCardId, FlashCard, FlashCardId, FlashCardSide } from "../../../FlashCard";
import { FlashCardSet, FlashCardStudySessionInfo, FlashCardLevel } from "../../../FlashCardSet";
import { Pitch } from "../../../lib/TheoryLib/Pitch";
import { PitchLetter } from "../../../lib/TheoryLib/PitchLetter";
import { Chord } from "../../../lib/TheoryLib/Chord";
import { ChordType, chordTypeLevels } from "../../../lib/TheoryLib/ChordType";
import { playPitches } from "../../../Audio/PianoAudio";
import { range } from '../../../lib/Core/MathUtils';
import { randomElement } from '../../../lib/Core/Random';
import { arrayContains, toggleArrayElement } from '../../../lib/Core/ArrayUtils';
import { Button } from "../../../ui/Button/Button";

const flashCardSetId = "chordEarTraining";

const minPitch = new Pitch(PitchLetter.C, -1, 2);
const maxPitch = new Pitch(PitchLetter.C, 1, 6);
const rootPitches = range(minPitch.midiNumber, maxPitch.midiNumber)
  .map(midiNumber => Pitch.createFromMidiNumber(midiNumber));
const chordTypes = ChordType.All;

export interface IFlashCardFrontSideProps {
  chordType: ChordType;
}
export interface IFlashCardFrontSideState {
  pitches: Array<Pitch>;
}
export class FlashCardFrontSide extends React.Component<IFlashCardFrontSideProps, IFlashCardFrontSideState> {
  public constructor(props: IFlashCardFrontSideProps) {
    super(props);
    
    const rootPitch = randomElement(rootPitches);

    this.state = {
      pitches: new Chord(this.props.chordType, rootPitch).getPitches()
    };
  }

  public render(): JSX.Element {
    return (
      <div>
        <Button
          onClick={event => this.playAudio()}
        >
          Play Sound
        </Button>
      </div>
    );
  }

  private playAudio(): void {
    playPitches(this.state.pitches);
  }
}

interface IConfigData {
  enabledChordTypes: string[];
}

export function configDataToEnabledFlashCardIds(
  flashCardSet: FlashCardSet, flashCards: Array<FlashCard>, configData: IConfigData
): Array<FlashCardId> {
  const newEnabledFlashCardIds = new Array<FlashCardId>();

  for (let i = 0; i < chordTypes.length; i++) {
    const chordType = chordTypes[i];
    
    if (arrayContains(configData.enabledChordTypes, chordType.name)) {
      newEnabledFlashCardIds.push(flashCards[i].id);
    }
  }

  return newEnabledFlashCardIds;
}

export interface IChordNotesFlashCardMultiSelectProps {
  studySessionInfo: FlashCardStudySessionInfo,
  onChange?: (newValue: Array<FlashCardId>, newConfigData: any) => void;
}
export interface IChordNotesFlashCardMultiSelectState {}
export class ChordNotesFlashCardMultiSelect extends React.Component<IChordNotesFlashCardMultiSelectProps, IChordNotesFlashCardMultiSelectState> {
  public constructor(props: IChordNotesFlashCardMultiSelectProps) {
    super(props);

    this.state = {
      enabledChordTypes: chordTypes.map(c => c.name)
    };
  }
  public render(): JSX.Element {
    const chordTypeCheckboxTableRows = chordTypes
      .map((chordType, i) => {
        const isChecked = this.props.studySessionInfo.configData.enabledChordTypes.indexOf(chordType.name) >= 0;
        const isEnabled = !isChecked || (this.props.studySessionInfo.configData.enabledChordTypes.length > 1);

        return (
          <TableRow key={i}>
            <TableCell><Checkbox checked={isChecked} onChange={event => this.toggleChordEnabled(chordType.name)} disabled={!isEnabled} /></TableCell>
            <TableCell>{chordType.name}</TableCell>
          </TableRow>
        );
      }, this);
    const chordTypeCheckboxes = (
      <Table className="table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Chord</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {chordTypeCheckboxTableRows}
        </TableBody>
      </Table>
    );

    return (
      <Grid container spacing={32}>
        <Grid item xs={12}>{chordTypeCheckboxes}</Grid>
      </Grid>
    );
  }
  
  private toggleChordEnabled(chordType: string) {
    const newEnabledChordTypes = toggleArrayElement(
      (this.props.studySessionInfo.configData as IConfigData).enabledChordTypes,
      chordType
    );
    
    if (newEnabledChordTypes.length > 0) {
      const newConfigData: IConfigData = {
        enabledChordTypes: newEnabledChordTypes
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

  for (const chordType of chordTypes) {
    const iCopy = i;
    i++;

    flashCards.push(new FlashCard(
      createFlashCardId(flashCardSetId, { chord: `${chordType.name}`}),
      new FlashCardSide(
        () => <FlashCardFrontSide key={iCopy} chordType={chordType} />
      ),
      new FlashCardSide(
        chordType.name,
        chordType
      )
    ));
  }

  return flashCards;
}
function createFlashCardSet(): FlashCardSet {
  const renderFlashCardMultiSelect = (
    info: FlashCardStudySessionInfo,
    onChange: (newValue: Array<FlashCardId>, newConfigData: any) => void
  ): JSX.Element => {
    return (
    <ChordNotesFlashCardMultiSelect
      studySessionInfo={info}
      onChange={onChange}
    />
    );
  };
  
  const flashCardSet = new FlashCardSet(flashCardSetId,
    "Chord Ear Training",
    createFlashCards
  );
  flashCardSet.configDataToEnabledFlashCardIds = configDataToEnabledFlashCardIds;
  flashCardSet.getInitialConfigData = (): IConfigData => ({
    enabledChordTypes: chordTypes.map(c => c.name)
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
            enabledChordTypes: ctl.chordTypes.map(ct => ct.name)
          } as IConfigData)
        )
      )
  );

  return flashCardSet;
}

export const flashCardSet = createFlashCardSet();