import * as React from "react";

import { uniq, areArraysEqualComparer } from '../../lib/Core/ArrayUtils';

import { Pitch } from "../../lib/TheoryLib/Pitch";

import { AnswerDifficulty } from '../../Study/AnswerDifficulty';

import { areSetsEqual } from '../../lib/Core/SetUtils';
import { PlayablePianoKeyboard, IPlayablePianoKeyboardExports } from './PlayablePianoKeyboard';
import { FlashCardStudySessionInfo } from "../../FlashCardSet";
import { Scale } from "../../lib/TheoryLib/Scale";
import { PianoKeyboardMetrics } from './PianoKeyboard';
import { Button } from "../../ui/Button/Button";

export interface IPianoScaleNotesAnswerSelectProps {
  info: FlashCardStudySessionInfo,
  maxWidth?: number;
  maxHeight?: number;
  lowestPitch: Pitch;
  highestPitch: Pitch;
  scale: Scale;
}

export interface IPianoScaleNotesAnswerSelectState {
  pressedPitches: Array<Pitch>;
}

export class PianoScaleNotesAnswerSelect extends React.Component<IPianoScaleNotesAnswerSelectProps, IPianoScaleNotesAnswerSelectState> {
  public constructor(props: IPianoScaleNotesAnswerSelectProps) {
    super(props);
    
    this.state = {
      pressedPitches: new Array<Pitch>()
    };
  }
  
  // #region React Functions

  public componentWillReceiveProps(nextProps: IPianoScaleNotesAnswerSelectProps) {
    if (!nextProps.scale.equals(this.props.scale)) {
      this.setState({ pressedPitches: new Array<Pitch>() });
    }
  }

  public render(): JSX.Element {
    // TODO: use lastCorrectAnswer

    const { maxWidth, maxHeight, lowestPitch, highestPitch } = this.props;

    return (
      <div>
        <PlayablePianoKeyboard
          maxWidth={maxWidth}
          maxHeight={maxHeight}
          lowestPitch={lowestPitch}
          highestPitch={highestPitch}
          onKeyPress={(pitch, velocity, wasClick) => this.onKeyPress(pitch, wasClick)}
          onKeyRelease={(pitch, wasClick) => this.onKeyRelease(pitch, wasClick)}
          wrapOctave={true}
          allowDragPresses={false}
          renderLayeredExtrasFn={metrics => this.renderPianoKeyboardExtras(metrics)}
        />

        {this.renderConfirmAnswerButton()}
      </div>
    );
  }
  
  private renderConfirmAnswerButton(): JSX.Element {
    const { pressedPitches } = this.state;

    return (
      <div style={{padding: "1em 0"}}>
        <Button
          onClick={event => this.confirmAnswer(pressedPitches)}
          disabled={pressedPitches.length === 0}
        >
          Confirm Answer
        </Button>
      </div>
    );
  }

  private renderPianoKeyboardExtras(metrics: PianoKeyboardMetrics): { whiteKeyLayerExtras: JSX.Element, blackKeyLayerExtras: JSX.Element } {
    const { scale } = this.props;
    const { pressedPitches } = this.state;
    
    const correctMidiNumberNoOctaves = new Set<number>(
      scale.getPitchClasses()
        .map(pitch => pitch.midiNumberNoOctave)
    );
    
    let whiteKeyHighlights = new Array<JSX.Element>();
    let blackKeyHighlights = new Array<JSX.Element>();

    for (let i = 0; i < pressedPitches.length; i++) {
      const pitch = pressedPitches[i];
      const isPitchInScale = correctMidiNumberNoOctaves.has(pitch.midiNumberNoOctave);

      const highlightStyle: any = {
        pointerEvents: "none"
      };

      const keyRect = metrics.getKeyRect(pitch);

      const highlight = (
        <rect
          key={`${i}${pitch.midiNumber}`}
          x={keyRect.left}
          y={keyRect.top}
          width={keyRect.size.width}
          height={keyRect.size.height}
          fill={isPitchInScale ? "green" : "red"}
          fillOpacity={0.6}
          style={highlightStyle} />
      );

      if (pitch.isWhiteKey) {
        whiteKeyHighlights.push(highlight);
      } else {
        blackKeyHighlights.push(highlight);
      }
    }

    return {
      whiteKeyLayerExtras: <g>{whiteKeyHighlights}</g>,
      blackKeyLayerExtras: <g>{blackKeyHighlights}</g>
    };
  }

  // #endregion

  private onKeyPress(pitch: Pitch, wasClick: boolean) {
    const { info, scale } = this.props;
    const { pressedPitches } = this.state;

    // TODO: wrap pressed pitch? send both wrapped and unwrapped pitch?
    const pressedPitchMidiNumbers = new Set<number>(
      pressedPitches
        .map(p => p.midiNumber)
    );
    
    if (!pressedPitchMidiNumbers.has(pitch.midiNumber)) {
      // update state
      this.setState({ pressedPitches: pressedPitches.concat([pitch]) });
      
      // register an incorrect answer if necessary
      const correctMidiNumberNoOctaves = new Set<number>(
        scale.getPitchClasses()
          .map(pitch => pitch.midiNumberNoOctave)
      );
      const isPitchInScale = correctMidiNumberNoOctaves.has(pitch.midiNumberNoOctave);

      if (!isPitchInScale) {
        const selectedPitchMidiNumbersNoOctave = new Set<number>(
          pressedPitches
            .map(p => p.midiNumberNoOctave)
        );

        info.onAnswer(AnswerDifficulty.Incorrect, selectedPitchMidiNumbersNoOctave);
      }
    }
  }
  
  private onKeyRelease(pitch: Pitch, wasClick: boolean) {
  }

  private confirmAnswer(selectedPitches: Array<Pitch>) {
    const { info } = this.props;

    const isCorrect = this.getIsCorrect(selectedPitches);
    const answerDifficulty = isCorrect ? AnswerDifficulty.Easy : AnswerDifficulty.Incorrect;
    const selectedPitchMidiNumbersNoOctave = uniq(
      selectedPitches
        .map(pitch => pitch.midiNumberNoOctave)
    );

    info.onAnswer(answerDifficulty, selectedPitchMidiNumbersNoOctave);
  }

  private getIsCorrect(selectedPitches: Array<Pitch>): boolean {
    const { scale } = this.props;

    const selectedPitchMidiNumbersNoOctave = new Set<number>(
      selectedPitches
        .map(pitch => pitch.midiNumberNoOctave)
    );
    const correctMidiNumberNoOctaves = new Set<number>(
      scale.getPitchClasses()
        .map(pitch => pitch.midiNumberNoOctave)
    );

    const isCorrect = areSetsEqual(selectedPitchMidiNumbersNoOctave, correctMidiNumberNoOctaves);
    return isCorrect;
  }
}