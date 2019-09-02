import * as React from "react";

import * as Utils from "../../../Utils";
import { Vector2D } from '../../../Vector2D';
import { Size2D } from "../../../Size2D";
import { Rect2D } from '../../../Rect2D';
import { PianoKeyboard } from "../../Utils/PianoKeyboard";
import { FlashCard, FlashCardSide, FlashCardId } from "../../../FlashCard";
import { FlashCardSet, FlashCardStudySessionInfo, FlashCardLevel } from "../../../FlashCardSet";
import { AnswerDifficulty } from "../../../AnswerDifficulty";
import { Pitch, ambiguousKeyPitchStringsSymbols } from "../../../Pitch";
import { PitchLetter } from "../../../PitchLetter";
import { Button, Typography } from "@material-ui/core";
import { Chord, ChordType, chordTypeLevels } from "../../../Chord";
import { CheckboxColumnsFlashCardMultiSelect, CheckboxColumn, CheckboxColumnCell } from '../../Utils/CheckboxColumnsFlashCardMultiSelect';

const flashCardSetId = "pianoChords";

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
      Utils.arrayContains(configData.enabledRootPitches, rootPitchStr) &&
      Utils.arrayContains(configData.enabledChordTypes, chordType.name)
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

export interface IPianoChordsAnswerSelectProps {
  correctAnswer: string;
  onAnswer: (answerDifficulty: AnswerDifficulty, answer: any) => void;
  lastCorrectAnswer: any;
  incorrectAnswers: Array<any>;
  enabledRootPitches: Array<string>;
  enabledChordTypeNames: Array<string>;
}
export interface IPianoChordsAnswerSelectState {
  selectedRootPitch: string | undefined;
  selectedChordType: string | undefined;
}
export class PianoChordsAnswerSelect extends React.Component<IPianoChordsAnswerSelectProps, IPianoChordsAnswerSelectState> {
  public constructor(props: IPianoChordsAnswerSelectProps) {
    super(props);
    
    this.state = {
      selectedRootPitch: undefined,
      selectedChordType: undefined
    };
  }
  public render(): JSX.Element {
    // TODO: use lastCorrectAnswer
    return (
      <div>
        <Typography gutterBottom={true} variant="h6" component="h4">
          Root Pitch
        </Typography>
        <div style={{padding: "1em 0"}}>
          <div>
            {ambiguousKeyPitchStringsSymbols.slice(0, 6)
              .filter(rp => Utils.arrayContains(this.props.enabledRootPitches, rp))
                .map(rootPitchStr => {
                const style: any = { textTransform: "none" };
                
                const isPressed = rootPitchStr === this.state.selectedRootPitch;
                if (isPressed) {
                  style.backgroundColor = "#959595";
                }

                return (
                  <Button
                    key={rootPitchStr}
                    onClick={event => this.onRootPitchClick(rootPitchStr)}
                    variant="contained"
                    style={style}
                  >
                    {rootPitchStr}
                  </Button>
                );
              })}
          </div>
          <div>
            {ambiguousKeyPitchStringsSymbols.slice(6, 12)
              .filter(rp => Utils.arrayContains(this.props.enabledRootPitches, rp))
              .map(rootPitchStr => {
                const style: any = { textTransform: "none" };
                
                const isPressed = rootPitchStr === this.state.selectedRootPitch;
                if (isPressed) {
                  style.backgroundColor = "#959595";
                }

                return (
                  <Button
                    key={rootPitchStr}
                    onClick={event => this.onRootPitchClick(rootPitchStr)}
                    variant="contained"
                    style={style}
                  >
                    {rootPitchStr}
                  </Button>
                );
              })}
          </div>
        </div>
        
        <Typography gutterBottom={true} variant="h6" component="h4">
          Chord
        </Typography>
        <div style={{padding: "1em 0"}}>
          {ChordType.All
            .filter(ct => Utils.arrayContains(this.props.enabledChordTypeNames, ct.name))
            .map(chord => {
              const style: any = { textTransform: "none" };
              
              const isPressed = chord.name === this.state.selectedChordType;
              if (isPressed) {
                style.backgroundColor = "#959595";
              }
              
              return (
                <Button
                  key={chord.name}
                  onClick={event => this.onChordTypeClick(chord.name)}
                  variant="contained"
                  style={style}
                >
                  {chord.name}
                </Button>
              );
            })}
        </div>

        <div style={{padding: "1em 0"}}>
          <Button
            onClick={event => this.confirmAnswer()}
            disabled={!this.state.selectedRootPitch || !this.state.selectedChordType}
            variant="contained"
          >
            Confirm Answer
          </Button>
        </div>
      </div>
    );
  }

  private onRootPitchClick(rootPitch: string) {
    this.setState({ selectedRootPitch: rootPitch });
  }
  private onChordTypeClick(chordType: string) {
    this.setState({ selectedChordType: chordType });
  }
  private confirmAnswer() {
    const selectedAnswer = this.state.selectedRootPitch + " " + this.state.selectedChordType;
    const isCorrect = selectedAnswer === this.props.correctAnswer;
    this.props.onAnswer(isCorrect ? AnswerDifficulty.Easy : AnswerDifficulty.Incorrect, selectedAnswer);
  }
}

const initialConfigData: IConfigData = {
  enabledRootPitches: ambiguousKeyPitchStringsSymbols.slice(),
  enabledChordTypes: ChordType.All
    .filter((_, chordIndex) => chordIndex <= 8)
    .map(chord => chord.name)
};

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
  flashCardSet.initialConfigData = initialConfigData;
  flashCardSet.renderFlashCardMultiSelect = renderFlashCardMultiSelect;
  flashCardSet.renderAnswerSelect = renderAnswerSelect;
  flashCardSet.containerHeight = "120px";
  flashCardSet.createFlashCardLevels = (flashCardSet: FlashCardSet, flashCards: Array<FlashCard>) => (
    chordTypeLevels
      .map(ctl =>
        new FlashCardLevel(
          ctl.name,
          flashCards
            .filter(fc => Utils.arrayContains(ctl.chordTypes, (fc.backSide.data as Chord).type))
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
  const pianoStyle = { width: "400px", maxWidth: "100%" };
  return Utils.flattenArrays<FlashCard>(
    ambiguousKeyPitchStringsSymbols.map((rootPitchStr, i) =>
      ChordType.All.map(chordType => {
        const halfStepsFromC = Utils.mod(i - 3, 12);
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
            rootPitchStr + " " + chordType.name,
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
  const correctAnswer = info.currentFlashCard.backSide.renderFn as string;
  return <PianoChordsAnswerSelect
    key={correctAnswer} correctAnswer={correctAnswer} onAnswer={info.onAnswer}
    lastCorrectAnswer={info.lastCorrectAnswer} incorrectAnswers={info.incorrectAnswers}
    enabledRootPitches={(info.configData as IConfigData).enabledRootPitches}
    enabledChordTypeNames={(info.configData as IConfigData).enabledChordTypes} />;
}

export const flashCardSet = createFlashCardSet();