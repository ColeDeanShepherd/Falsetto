import * as React from 'react';
import { Card, CardContent, Typography, Button, Checkbox } from '@material-ui/core';
import * as Vex from 'vexflow';

import * as Utils from '../../Utils';
import * as FlashCardUtils from "./Utils";
import { VexFlowComponent } from "../VexFlowComponent";
import { PitchLetter } from "../../PitchLetter";
import { FlashCard } from '../../FlashCard';
import { renderFlashCardSide } from "../FlashCard";
import { Pitch } from '../../Pitch';
import { FlashCardGroup } from '../../FlashCardGroup';
import { AnswerDifficulty } from '../../StudyAlgorithm';

const clefs = [
  {
    name: "treble",
    bottomLinePitch: new Pitch(PitchLetter.E, 0, 4)
  },
  {
    name: "bass",
    bottomLinePitch: new Pitch(PitchLetter.G, 0, 2)
  }
];

export function createFlashCardGroup(): FlashCardGroup {
  const flashCards = createFlashCards();
  const initialConfigData: IConfigData = {
    isTrebleClefEnabled: true,
    isBassClefEnabled: true,
    areAccidentalsEnabled: false
  };
  const renderFlashCardMultiSelect = (
    selectedFlashCardIndices: number[],
    configData: any,
    onChange: (newValue: number[], newConfigData: any) => void
  ): JSX.Element => {
    return <SheetMusicNotesFlashCardMultiSelect
      flashCards={flashCards}
      configData={configData}
      selectedFlashCardIndices={selectedFlashCardIndices}
      onChange={onChange}
    />;
  }

  const flashCardGroup = new FlashCardGroup("Sheet Music Notes", flashCards);
  flashCardGroup.enableInvertFlashCards = false;
  flashCardGroup.initialSelectedFlashCardIndices = configDataToEnabledQuestionIds(initialConfigData);
  flashCardGroup.initialConfigData = initialConfigData;
  flashCardGroup.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  flashCardGroup.renderAnswerSelect = renderNoteAnswerSelect;
  flashCardGroup.moreInfoUri = "https://www.joytunes.com/blog/music-fun/best-way-memorize-piano-notes/";

  return flashCardGroup;
}
export function createFlashCards(): FlashCard[] {
  return allPitchesMap((clef, pitch) => {
    const pitchAccidentalString = pitch.getAccidentalString();
    const vexFlowPitchString = pitch.toVexFlowString();
    
    const isTrebleNote = (clef === "treble");
    const trebleNotes = [
      new Vex.Flow.StaveNote({
        clef: "treble",
        keys: isTrebleNote ? [vexFlowPitchString] : ["b/4"],
        duration: isTrebleNote ? "w" : "wr"
      })
    ];
    const bassNotes = [
      new Vex.Flow.StaveNote({
        clef: "bass",
        keys: !isTrebleNote ? [vexFlowPitchString] : ["d/3"],
        duration: !isTrebleNote ? "w" : "wr"
      })
    ];

    if (pitch.signedAccidental !== 0) {
      if (isTrebleNote) {
        for (const note of trebleNotes) {
          note.addAccidental(0, new Vex.Flow.Accidental(pitchAccidentalString));
        }
      } else {
        for (const note of bassNotes) {
          note.addAccidental(0, new Vex.Flow.Accidental(pitchAccidentalString));
        }
      }
    }

    return FlashCard.fromRenderFns(
      () => (  
        <SheetMusicSingleNote
          width={150} height={200}
          trebleNotes={trebleNotes}
          bassNotes={bassNotes}
        />
      ),
      `${PitchLetter[pitch.letter]}${pitchAccidentalString}`
    );
  });
}
export function allPitchesMap<TResult>(mapFn: (clef: string, pitch: Pitch, index: number) => TResult): Array<TResult> {
  const result = new Array<TResult>();

  let i = 0;
  clefs.forEach(clef => {
    Utils.range(0, 20).forEach(pitchLetterOffset => {
      Utils.range(-1, 1).forEach(signedAccidental => {
        const pitch = Pitch.addPitchLetters(clef.bottomLinePitch, -6 + pitchLetterOffset);
        pitch.signedAccidental = signedAccidental;
        
        result.push(mapFn(clef.name, pitch, i));
        i++;
      })
    });
  });

  return result;
}
function configDataToEnabledQuestionIds(configData: IConfigData): Array<number> {
  return allPitchesMap((clef, pitch, i) => {
    if (!configData.isTrebleClefEnabled && (clef === "treble")) {
      return -1;
    }
    
    if (!configData.isBassClefEnabled && (clef === "bass")) {
      return -1;
    }

    if (!configData.areAccidentalsEnabled && (pitch.signedAccidental !== 0)) {
      return -1;
    }

    return i;
  })
    .filter(i => i >= 0);
}
export function renderNoteAnswerSelect(
  flashCards: FlashCard[],
  enabledFlashCardIndices: number[],
  areFlashCardsInverted: boolean,
  flashCard: FlashCard,
  onAnswer: (answerDifficulty: AnswerDifficulty) => void
): JSX.Element {
  const sharpNotes = ["A#", "B#", "C#", "D#", "E#", "F#", "G#"];
  const naturalNotes = ["A", "B", "C", "D", "E", "F", "G"];
  const flatNotes = ["Ab", "Bb", "Cb", "Db", "Eb", "Fb", "Gb"];
  return (
    <div>
      {FlashCardUtils.renderStringAnswerSelect(sharpNotes, flashCards, enabledFlashCardIndices, areFlashCardsInverted, flashCard, onAnswer)}
      {FlashCardUtils.renderStringAnswerSelect(naturalNotes, flashCards, enabledFlashCardIndices, areFlashCardsInverted, flashCard, onAnswer)}
      {FlashCardUtils.renderStringAnswerSelect(flatNotes, flashCards, enabledFlashCardIndices, areFlashCardsInverted, flashCard, onAnswer)}
    </div>
  );
}

export interface ISheetMusicSingleNoteProps {
  width: number;
  height: number;
  trebleNotes: Array<Vex.Flow.StaveNote>;
  bassNotes: Array<Vex.Flow.StaveNote>;
}
export class SheetMusicSingleNote extends React.Component<ISheetMusicSingleNoteProps, {}> {
  public render(): JSX.Element {
    const vexFlowRender = this.vexFlowRender.bind(this);
    return <VexFlowComponent width={this.props.width} height={this.props.height} vexFlowRender={vexFlowRender} />;
  }

  private vexFlowRender(context: Vex.IRenderContext) {
    context.setFont("Arial", 10).setBackgroundFillStyle("#eed");

    // Create the staves
    const staveLength = this.props.width;
    const staveX = 20;

    const topStaff = new Vex.Flow.Stave(staveX, 0, staveLength);
    topStaff.addClef('treble');
    //topStaff.addTimeSignature("4/4");

    const bottomStaff = new Vex.Flow.Stave(staveX, 80, staveLength);
    bottomStaff.addClef('bass');
    //bottomStaff.addTimeSignature("4/4");

    const brace = new Vex.Flow.StaveConnector(topStaff, bottomStaff).setType(3);
    const lineLeft = new Vex.Flow.StaveConnector(topStaff, bottomStaff).setType(1);
    const lineRight = new Vex.Flow.StaveConnector(topStaff, bottomStaff).setType(6);

    topStaff.setContext(context).draw();
    bottomStaff.setContext(context).draw();

    brace.setContext(context).draw();
    lineLeft.setContext(context).draw();
    lineRight.setContext(context).draw();

    const voiceTreble = new Vex.Flow.Voice({num_beats:4, beat_value: 4, resolution:Vex.Flow.RESOLUTION});
    const voiceBass = new Vex.Flow.Voice({num_beats:4, beat_value: 4, resolution:Vex.Flow.RESOLUTION});
    
    voiceTreble.addTickables(this.props.trebleNotes).setStave(topStaff);
    voiceBass.addTickables(this.props.bassNotes).setStave(bottomStaff);
    
    const formatter = new Vex.Flow.Formatter();
    
    // Make sure the staves have the same starting point for notes
    const startX = Math.max(topStaff.getNoteStartX(), bottomStaff.getNoteStartX());
    topStaff.setNoteStartX(startX);
    bottomStaff.setNoteStartX(startX);
    
    // the treble and bass are joined independently but formatted together
    formatter.joinVoices([voiceTreble]);
    formatter.joinVoices([voiceBass]);
    formatter.format([voiceTreble, voiceBass], staveLength - (startX - staveX));
    
    voiceTreble.draw(context);
    voiceBass.draw(context);
  }
}

interface IConfigData {
  isTrebleClefEnabled: boolean,
  isBassClefEnabled: boolean,
  areAccidentalsEnabled: boolean
};

export interface ISheetMusicNotesFlashCardMultiSelectProps {
  flashCards: FlashCard[];
  configData: IConfigData;
  selectedFlashCardIndices: number[];
  onChange?: (newValue: number[], newConfigData: any) => void;
}
export interface ISheetMusicNotesFlashCardMultiSelectState {}
export class SheetMusicNotesFlashCardMultiSelect extends React.Component<ISheetMusicNotesFlashCardMultiSelectProps, ISheetMusicNotesFlashCardMultiSelectState> {
  public render(): JSX.Element {
    const onIsTrebleClefEnabledChange = this.onIsTrebleClefEnabledChange.bind(this);
    const onIsBassClefEnabledChange = this.onIsBassClefEnabledChange.bind(this);
    const onAreAccidentalsEnabledChange = this.onAreAccidentalsEnabledChange.bind(this);

    return (
      <div>
        <div>
          <Typography>Treble Clef</Typography>
          <Checkbox
            checked={this.props.configData.isTrebleClefEnabled}
            onChange={onIsTrebleClefEnabledChange}
            disabled={!this.props.configData.isBassClefEnabled}
          />
        </div>
        <div>
          <Typography>Bass Clef</Typography>
          <Checkbox
            checked={this.props.configData.isBassClefEnabled}
            onChange={onIsBassClefEnabledChange}
            disabled={!this.props.configData.isTrebleClefEnabled}
          />
        </div>
        <div>
          <Typography>Accidentals</Typography>
          <Checkbox
            checked={this.props.configData.areAccidentalsEnabled}
            onChange={onAreAccidentalsEnabledChange}
          />
        </div>
      </div>
    );
  }

  private onIsTrebleClefEnabledChange(event: React.ChangeEvent, checked: boolean) {
    if (!this.props.onChange) { return; }

    const newConfigData: IConfigData = {
      isTrebleClefEnabled: checked,
      isBassClefEnabled: this.props.configData.isBassClefEnabled,
      areAccidentalsEnabled: this.props.configData.areAccidentalsEnabled
    };
    const newEnabledFlashCardIndices = configDataToEnabledQuestionIds(newConfigData);
    this.props.onChange(newEnabledFlashCardIndices, newConfigData);
  }
  private onIsBassClefEnabledChange(event: React.ChangeEvent, checked: boolean) {
    if (!this.props.onChange) { return; }

    const newConfigData: IConfigData = {
      isTrebleClefEnabled: this.props.configData.isTrebleClefEnabled,
      isBassClefEnabled: checked,
      areAccidentalsEnabled: this.props.configData.areAccidentalsEnabled
    };
    const newEnabledFlashCardIndices = configDataToEnabledQuestionIds(newConfigData);
    this.props.onChange(newEnabledFlashCardIndices, newConfigData);
  }
  private onAreAccidentalsEnabledChange(event: React.ChangeEvent, checked: boolean) {
    if (!this.props.onChange) { return; }

    const newConfigData: IConfigData = {
      isTrebleClefEnabled: this.props.configData.isTrebleClefEnabled,
      isBassClefEnabled: this.props.configData.isBassClefEnabled,
      areAccidentalsEnabled: checked
    };
    const newEnabledFlashCardIndices = configDataToEnabledQuestionIds(newConfigData);
    this.props.onChange(newEnabledFlashCardIndices, newConfigData);
  }
}

export interface ISheetMusicNotesState {
  isShowingFront: boolean;
  trebleNotes: Array<Vex.Flow.StaveNote>;
  bassNotes: Array<Vex.Flow.StaveNote>;
}
export class SheetMusicNotes extends React.Component<{}, ISheetMusicNotesState> {
  constructor(props: {}) {
    super(props);

    const trebleNotes = [];
    const bassNotes = [];

    for (let i = 0; i < 1; i++) {
      const notes = this.getRandomNotes();
      trebleNotes.push(notes.trebleNote);
      bassNotes.push(notes.bassNote);
    }

    this.state = {
      isShowingFront: true,
      trebleNotes: trebleNotes,
      bassNotes: bassNotes
    };
  }

  public render(): JSX.Element {
    const currentNoteName = !this.state.trebleNotes[0].isRest()
      ? this.state.trebleNotes[0].getKeyProps()[0].key
      : this.state.bassNotes[0].getKeyProps()[0].key;
    const flashCard = FlashCard.fromRenderFns(
      () => (
        <SheetMusicSingleNote
          width={300} height={200}
          trebleNotes={this.state.trebleNotes}
          bassNotes={this.state.bassNotes}
        />
      ),
      currentNoteName
    );

    return (
      <Card>
        <CardContent>
          <Typography gutterBottom={true} variant="h5" component="h2">
            Sheet Music Notes
          </Typography>

          {this.state.isShowingFront
            ? <div style={{textAlign: "center", fontSize: "2em"}}>{renderFlashCardSide(flashCard.frontSide)}</div>
            : <div style={{textAlign: "center", fontSize: "2em", height: 200}}>{renderFlashCardSide(flashCard.backSide)}</div>
          }
          
          <Button onClick={event => this.flipFlashCard()} variant="outlined" color="primary">Flip</Button>
          <Button onClick={event => this.moveToNextNote()} variant="outlined" color="primary">Next</Button>
        </CardContent>
      </Card>
    );
  }
  
  private getRandomNotes() {
    const isTrebleNote = Utils.randomBoolean();

    return {
      trebleNote: new Vex.Flow.StaveNote({
        clef: "treble",
        keys: isTrebleNote ? [this.getRandomTreblePitch()] : ["b/4"],
        duration: isTrebleNote ? "w" : "wr"
      }),
      bassNote: new Vex.Flow.StaveNote({
        clef: "bass",
        keys: !isTrebleNote ? [this.getRandomBassPitch()] : ["d/3"],
        duration: !isTrebleNote ? "w" : "wr"
      }),
    };
  }
  private getRandomTreblePitch(): string {
    return this.getRandomStaffPitch(new Pitch(PitchLetter.F, 0, 3));
  }
  private getRandomBassPitch(): string {
    return this.getRandomStaffPitch(new Pitch(PitchLetter.A, 0, 1));
  }
  private getRandomStaffPitch(bottomPitch: Pitch): string {
    const pitch = Pitch.addPitchLetters(bottomPitch, Utils.randomInt(0, 20));
    return `${PitchLetter[pitch.letter].toLowerCase()}/${pitch.octaveNumber}`;
  }

  private flipFlashCard() {
    this.setState({ isShowingFront: !this.state.isShowingFront });
  }
  private moveToNextNote() {
    const notes = this.getRandomNotes();

    const newTrebleNotes = this.state.trebleNotes;
    newTrebleNotes.splice(0, 1);
    newTrebleNotes.push(notes.trebleNote);

    const newBassNotes = this.state.bassNotes;
    newBassNotes.splice(0, 1);
    newBassNotes.push(notes.bassNote);
    
    this.setState({
      isShowingFront: true,
      trebleNotes: newTrebleNotes,
      bassNotes: newBassNotes
    });
  }
}