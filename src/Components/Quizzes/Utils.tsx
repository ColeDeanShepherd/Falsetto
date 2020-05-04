import * as React from "react";
import { Button } from "@material-ui/core";

import * as Utils from "../../lib/Core/Utils";
import { FlashCard, FlashCardSideRenderFn, FlashCardId } from "../../FlashCard";
import { callFlashCardSideRenderFn } from "../../Components/FlashCard";
import { AnswerDifficulty } from "../../Study/AnswerDifficulty";
import { FlashCardStudySessionInfo } from '../../FlashCardSet';
import { Size2D } from '../../lib/Core/Size2D';
import { arrayContains, uniq } from '../../lib/Core/ArrayUtils';

export function renderNoteAnswerSelect(
  info: FlashCardStudySessionInfo
): JSX.Element {
  const naturalNotes = ["A", "B", "C", "D", "E", "F", "G"];
  const accidentalNotes = ["A♯/B♭", "C♯/D♭", "D♯/E♭", "F♯/G♭", "G♯/A♭"];
  return (
    <div>
      {renderStringAnswerSelectInternal(
        `${info.currentFlashCardId}.0`, accidentalNotes, info
      )}
      {renderStringAnswerSelectInternal(
        `${info.currentFlashCardId}.1`, naturalNotes, info
        )}
    </div>
  );
}
export function renderStringAnswerSelect(
  answers: string[],
  info: FlashCardStudySessionInfo
): JSX.Element {
  return renderStringAnswerSelectInternal(
    info.currentFlashCardId.toString(), answers, info
  );
}

export function renderStringAnswerSelectInternal(
  key: string,
  answers: string[],
  info: FlashCardStudySessionInfo
): JSX.Element {
  return <StringAnswerSelect
    key={key} answers={answers} flashCard={info.currentFlashCard} onAnswer={info.onAnswer}
    lastCorrectAnswer={info.lastCorrectAnswer} incorrectAnswers={info.incorrectAnswers} />;
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
          const isIncorrectAnswer = arrayContains(this.state.incorrectAnswers, a);

          return (
            <Button
              key={a}
              variant="contained"
              color={!arrayContains(this.state.incorrectAnswers, a) ? "default" : "secondary"}
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
      this.props.onAnswer(AnswerDifficulty.Easy, answer);
    }
    else {
      this.setState({ incorrectAnswers: this.state.incorrectAnswers.concat([answer]) });
      this.props.onAnswer(AnswerDifficulty.Incorrect, answer);
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
  const isIncorrectAnswer = arrayContains(props.incorrectAnswers, props.answer);
  
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
  enabledFlashCardIds: Array<FlashCardId>;
  flashCard: FlashCard;
  onAnswer: (answerDifficulty: AnswerDifficulty, answer: any) => void;
  lastCorrectAnswer: any;
  incorrectAnswers: Array<any>;
}
export class FlashCardSideAnswerSelect extends React.Component<FlashCardSideAnswerSelectProps, {}> {
  public render(): JSX.Element {
    // TODO: calculate
    const maxButtonSize = new Size2D(300, 300);
  
    return (
      <div>
        {this.props.answers.map((fcs, i) => {
          const isIncorrectAnswer = arrayContains(this.props.incorrectAnswers, fcs);

          return (
            <Button
              key={i}
              variant="contained"
              color={!isIncorrectAnswer ? "default" : "secondary"}
              onClick={_ => this.onAnswerClick(fcs)}
              className={((fcs === this.props.lastCorrectAnswer) && !isIncorrectAnswer) ? "background-green-to-initial" : ""}
              style={{ textTransform: "none" }}
            >
              {callFlashCardSideRenderFn(maxButtonSize, fcs)}
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
  info: FlashCardStudySessionInfo,
  rowLengths: Array<number>
): JSX.Element {
  const answers = uniq(
    info.flashCards
      .filter(fc => arrayContains(info.enabledFlashCardIds, fc.id))
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
      `${info.currentFlashCardId}.${rowIndex}`,
      rowAnswers,
      info
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
  info: FlashCardStudySessionInfo
): JSX.Element {
  const distinctFlashCardSideRenderFns = uniq(
    info.flashCards
      .filter(fc => arrayContains(info.enabledFlashCardIds, fc.id))
      .map(fc => fc.backSide.renderFn)
  );

  return renderDistinctFlashCardSideAnswerSelectInternal(
    info.currentFlashCardId.toString(),
    distinctFlashCardSideRenderFns,
    info
  );
}

export function renderUserDeterminedCorrectnessAnswerSelect(
  info: FlashCardStudySessionInfo
): JSX.Element {
  return (
    <div>
      <Button
        variant="contained"
        onClick={e => info.onAnswer(AnswerDifficulty.Incorrect, null)}
        style={{ textTransform: "none" }}
      >
        I Was Incorrect
      </Button>

      <Button
        variant="contained"
        onClick={e => info.onAnswer(AnswerDifficulty.Easy, null)}
        style={{ textTransform: "none" }}
      >
        I Was Correct
      </Button>
    </div>
  );
}

export function renderDistinctFlashCardSideAnswerSelectInternal(
  key: string,
  answers: Array<FlashCardSideRenderFn>,
  info: FlashCardStudySessionInfo
): JSX.Element {
  return <FlashCardSideAnswerSelect
    key={key}
    answers={answers}
    enabledFlashCardIds={info.enabledFlashCardIds}
    flashCard={info.currentFlashCard}
    onAnswer={info.onAnswer}
    lastCorrectAnswer={info.lastCorrectAnswer}
    incorrectAnswers={info.incorrectAnswers}
  />;
}