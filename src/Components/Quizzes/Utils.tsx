import * as React from "react";
import { Button } from "@material-ui/core";

import * as Utils from "../../Utils";
import { FlashCard, FlashCardSide, FlashCardSideRenderFn } from "../../FlashCard";
import { callFlashCardSideRenderFn } from "../../Components/FlashCard";
import { AnswerDifficulty } from "../../StudyAlgorithm";

export function renderNoteAnswerSelect(
  width: number, height: number,
  flashCards: FlashCard[],
  enabledFlashCardIndices: number[],
  areFlashCardsInverted: boolean,
  flashCardIndex: number,
  flashCard: FlashCard,
  onAnswer: (answerDifficulty: AnswerDifficulty, answer: any) => void,
  lastCorrectAnswer: any
): JSX.Element {
  const naturalNotes = ["A", "B", "C", "D", "E", "F", "G"];
  const accidentalNotes = ["A#/B♭", "C#/D♭", "D#/E♭", "F#/G♭", "G#/A♭"];
  return (
    <div>
      {renderStringAnswerSelectInternal(`${flashCardIndex}.0`, accidentalNotes, flashCard, onAnswer, lastCorrectAnswer)}
      {renderStringAnswerSelectInternal(`${flashCardIndex}.1`, naturalNotes, flashCard, onAnswer, lastCorrectAnswer)}
    </div>
  );
}
export function renderStringAnswerSelect(
  width: number, height: number,
  answers: string[],
  flashCards: FlashCard[],
  enabledFlashCardIndices: number[],
  areFlashCardsInverted: boolean,
  flashCardIndex: number,
  flashCard: FlashCard,
  onAnswer: (answerDifficulty: AnswerDifficulty, answer: any) => void,
  lastCorrectAnswer: any
): JSX.Element {
  return renderStringAnswerSelectInternal(flashCardIndex.toString(), answers, flashCard, onAnswer, lastCorrectAnswer);
}

export function renderStringAnswerSelectInternal(
  key: string,
  answers: string[],
  flashCard: FlashCard,
  onAnswer: (answerDifficulty: AnswerDifficulty, answer: any) => void,
  lastCorrectAnswer: any
): JSX.Element {
  return <StringAnswerSelect key={key} answers={answers} flashCard={flashCard} onAnswer={onAnswer} lastCorrectAnswer={lastCorrectAnswer} />;
}

export interface StringAnswerSelectProps {
  answers: string[],
  flashCard: FlashCard,
  onAnswer: (answerDifficulty: AnswerDifficulty, answer: any) => void,
  lastCorrectAnswer: any
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

export interface FlashCardSideAnswerSelectProps {
  flashCards: FlashCard[];
  enabledFlashCardIndices: number[];
  flashCard: FlashCard;
  onAnswer: (answerDifficulty: AnswerDifficulty, answer: any) => void;
  lastCorrectAnswer: any;
}
export interface FlashCardSideAnswerSelectState {
  incorrectAnswers: Array<FlashCardSideRenderFn>;
}
export class FlashCardSideAnswerSelect extends React.Component<FlashCardSideAnswerSelectProps, FlashCardSideAnswerSelectState> {
  public constructor(props: FlashCardSideAnswerSelectProps) {
    super(props);

    this.state = {
      incorrectAnswers: []
    };
  }
  public render(): JSX.Element {
    const distinctFlashCardSideRenderFns = Utils.uniq(
      this.props.flashCards
        .filter((_, i) => Utils.arrayContains(this.props.enabledFlashCardIndices, i))
        .map(fc => fc.backSide.renderFn)
    );
  
    // TODO: calculate
    const maxButtonWidth = 300;
    const maxButtonHeight = 300;
  
    return (
      <div>
        {distinctFlashCardSideRenderFns.map((fcs, i) => {
          const isIncorrectAnswer = Utils.arrayContains(this.state.incorrectAnswers, fcs);

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
            </Button>);
        })}
      </div>
    );
  }

  private onAnswerClick(fcs: FlashCardSideRenderFn) {
    const flashCardSideRenderFn = this.props.flashCard.backSide.renderFn;
    
    if (fcs === flashCardSideRenderFn) {
      this.props.onAnswer(AnswerDifficulty.Easy, flashCardSideRenderFn);
    }
    else {
      this.setState({ incorrectAnswers: this.state.incorrectAnswers.concat([fcs]) });
      this.props.onAnswer(AnswerDifficulty.Incorrect, flashCardSideRenderFn);
    }
  }
}

export function renderDistinctFlashCardSideAnswerSelect(
  width: number, height: number,
  flashCards: FlashCard[],
  enabledFlashCardIndices: number[],
  areFlashCardsInverted: boolean,
  flashCardIndex: number,
  flashCard: FlashCard,
  onAnswer: (answerDifficulty: AnswerDifficulty, answer: any) => void,
  lastCorrectAnswer: any
): JSX.Element {
  return renderDistinctFlashCardSideAnswerSelectInternal(
    flashCardIndex.toString(),
    flashCards,
    enabledFlashCardIndices,
    flashCard,
    onAnswer,
    lastCorrectAnswer
  );
}
export function renderDistinctFlashCardSideAnswerSelectInternal(
  key: string,
  flashCards: FlashCard[],
  enabledFlashCardIndices: number[],
  flashCard: FlashCard,
  onAnswer: (answerDifficulty: AnswerDifficulty, answer: any) => void,
  lastCorrectAnswer: any
): JSX.Element {
  return <FlashCardSideAnswerSelect
    key={key}
    flashCards={flashCards}
    enabledFlashCardIndices={enabledFlashCardIndices}
    flashCard={flashCard}
    onAnswer={onAnswer}
    lastCorrectAnswer={lastCorrectAnswer}
  />;
}