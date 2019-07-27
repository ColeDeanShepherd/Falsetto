import * as React from "react";
import { Button } from "@material-ui/core";

import * as Utils from "../../Utils";
import { FlashCard, FlashCardSide, FlashCardSideRenderFn } from "../../FlashCard";
import { callFlashCardSideRenderFn } from "../../Components/FlashCard";
import { AnswerDifficulty } from "../../StudyAlgorithm";
import { RenderAnswerSelectArgs } from '../../FlashCardGroup';

export function renderNoteAnswerSelect(
  state: RenderAnswerSelectArgs
): JSX.Element {
  const naturalNotes = ["A", "B", "C", "D", "E", "F", "G"];
  const accidentalNotes = ["A#/B♭", "C#/D♭", "D#/E♭", "F#/G♭", "G#/A♭"];
  return (
    <div>
      {renderStringAnswerSelectInternal(
        `${state.currentFlashCardId}.0`, accidentalNotes, state
      )}
      {renderStringAnswerSelectInternal(
        `${state.currentFlashCardId}.1`, naturalNotes, state
        )}
    </div>
  );
}
export function renderStringAnswerSelect(
  answers: string[],
  state: RenderAnswerSelectArgs
): JSX.Element {
  return renderStringAnswerSelectInternal(
    state.currentFlashCardId.toString(), answers, state
  );
}

export function renderStringAnswerSelectInternal(
  key: string,
  answers: string[],
  state: RenderAnswerSelectArgs
): JSX.Element {
  return <StringAnswerSelect
    key={key} answers={answers} flashCard={state.currentFlashCard} onAnswer={state.onAnswer}
    lastCorrectAnswer={state.lastCorrectAnswer} incorrectAnswers={state.incorrectAnswers} />;
}

export interface StringAnswerSelectProps {
  answers: string[],
  flashCard: FlashCard,
  onAnswer: (answerDifficulty: AnswerDifficulty, answer: any) => void,
  lastCorrectAnswer: any,
  incorrectAnswers: Array<any>
}
export interface StringAnswerSelectState {
  incorrectAnswers: Array<string>;
}
export class StringAnswerSelect extends React.Component<StringAnswerSelectProps, StringAnswerSelectState> {
  public constructor(props: StringAnswerSelectProps) {
    super(props);

    this.state = {
      incorrectAnswers: []
    };
  }
  public render(): JSX.Element {
    return (
      <div>
        {this.props.answers.map(a => {
          const isIncorrectAnswer = Utils.arrayContains(this.state.incorrectAnswers, a);

          return (
            <Button
              key={a}
              variant="contained"
              color={!Utils.arrayContains(this.state.incorrectAnswers, a) ? "default" : "secondary"}
              onClick={_ => this.onAnswerClick(a)}
              className={((a === this.props.lastCorrectAnswer) && !isIncorrectAnswer) ? "background-green-to-initial" : ""}
              style={{ textTransform: "none" }}
            >
              {a}
            </Button>);
        })}
      </div>
    );
  }

  private onAnswerClick(answer: string) {
    const correctAnswer = this.props.flashCard.backSide.renderFn as string;

    if (answer === correctAnswer) {
      this.props.onAnswer(AnswerDifficulty.Easy, correctAnswer);
    }
    else {
      this.setState({ incorrectAnswers: this.state.incorrectAnswers.concat([answer]) });
      this.props.onAnswer(AnswerDifficulty.Incorrect, correctAnswer);
    }
  }
}

export const AnswerButton: React.FunctionComponent<{
  answer: any,
  incorrectAnswers: Array<any>,
  lastCorrectAnswer: any,
  onClick: () => void,
  disabled?: boolean
}> = props => {
  const isIncorrectAnswer = Utils.arrayContains(props.incorrectAnswers, props.answer);
  
  return (
    <Button
      variant="contained"
      color={!isIncorrectAnswer ? "default" : "secondary"}
      onClick={props.onClick}
      className={((props.answer === props.lastCorrectAnswer) && !isIncorrectAnswer) ? "background-green-to-initial" : ""}
      style={{ textTransform: "none" }}
      disabled={(props.disabled !== undefined) ? props.disabled : false}
    >
      {props.children}
    </Button>
  );
};

export interface FlashCardSideAnswerSelectProps {
  answers: Array<FlashCardSideRenderFn>;
  enabledFlashCardIds: number[];
  flashCard: FlashCard;
  onAnswer: (answerDifficulty: AnswerDifficulty, answer: any) => void;
  lastCorrectAnswer: any;
  incorrectAnswers: Array<any>;
}
export class FlashCardSideAnswerSelect extends React.Component<FlashCardSideAnswerSelectProps, {}> {
  public render(): JSX.Element {
    // TODO: calculate
    const maxButtonWidth = 300;
    const maxButtonHeight = 300;
  
    return (
      <div>
        {this.props.answers.map((fcs, i) => {
          const isIncorrectAnswer = Utils.arrayContains(this.props.incorrectAnswers, fcs);

          return (
            <Button
              key={i}
              variant="contained"
              color={!isIncorrectAnswer ? "default" : "secondary"}
              onClick={_ => this.onAnswerClick(fcs)}
              className={((fcs === this.props.lastCorrectAnswer) && !isIncorrectAnswer) ? "background-green-to-initial" : ""}
              style={{ textTransform: "none" }}
            >
              {callFlashCardSideRenderFn(maxButtonWidth, maxButtonHeight, fcs)}
            </Button>
          );
        })}
      </div>
    );
  }

  private onAnswerClick(fcs: FlashCardSideRenderFn) {
    const flashCardSideRenderFn = this.props.flashCard.backSide.renderFn;
    
    if (fcs === flashCardSideRenderFn) {
      this.props.onAnswer(AnswerDifficulty.Easy, fcs);
    }
    else {
      this.props.onAnswer(AnswerDifficulty.Incorrect, fcs);
    }
  }
}

export function renderMultiRowDistinctFlashCardSideAnswerSelect(
  state: RenderAnswerSelectArgs,
  rowLengths: Array<number>
): JSX.Element {
  const answers = Utils.uniq(
    state.flashCards
      .filter((_, i) => Utils.arrayContains(state.enabledFlashCardIds, i))
      .map(fc => fc.backSide.renderFn)
  );

  let rowIndex = 0;
  let startIndex = 0;
  const answerRows = new Array<JSX.Element>();

  while (startIndex < answers.length) {
    const rowAnswers = (rowIndex < rowLengths.length)
      ? answers.slice(startIndex, startIndex + rowLengths[rowIndex])
      : answers.slice(answers.length - startIndex);

    answerRows.push(renderDistinctFlashCardSideAnswerSelectInternal(
      `${state.currentFlashCardId}.${rowIndex}`,
      rowAnswers,
      state
    ));

    rowIndex++;
    startIndex += rowAnswers.length;
  }

  return (
    <div>
      {answerRows}
    </div>
  );
}

export function renderDistinctFlashCardSideAnswerSelect(
  state: RenderAnswerSelectArgs
): JSX.Element {
  const distinctFlashCardSideRenderFns = Utils.uniq(
    state.flashCards
      .filter((_, i) => Utils.arrayContains(state.enabledFlashCardIds, i))
      .map(fc => fc.backSide.renderFn)
  );

  return renderDistinctFlashCardSideAnswerSelectInternal(
    state.currentFlashCardId.toString(),
    distinctFlashCardSideRenderFns,
    state
  );
}
export function renderDistinctFlashCardSideAnswerSelectInternal(
  key: string,
  answers: Array<FlashCardSideRenderFn>,
  state: RenderAnswerSelectArgs
): JSX.Element {
  return <FlashCardSideAnswerSelect
    key={key}
    answers={answers}
    enabledFlashCardIds={state.enabledFlashCardIds}
    flashCard={state.currentFlashCard}
    onAnswer={state.onAnswer}
    lastCorrectAnswer={state.lastCorrectAnswer}
    incorrectAnswers={state.incorrectAnswers}
  />;
}