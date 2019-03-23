import * as React from "react";
import { Button } from "@material-ui/core";

import * as Utils from "../../Utils";
import { FlashCard } from "../../FlashCard";
import { callFlashCardSideRenderFn } from "../../Components/FlashCard";
import { AnswerDifficulty } from "../../StudyAlgorithm";

export function renderNoteAnswerSelect(
  width: number, height: number,
  flashCards: FlashCard[],
  enabledFlashCardIndices: number[],
  areFlashCardsInverted: boolean,
  flashCard: FlashCard,
  onAnswer: (answerDifficulty: AnswerDifficulty) => void
): JSX.Element {
  const naturalNotes = ["A", "B", "C", "D", "E", "F", "G"];
  const accidentalNotes = ["A#/Bb", "C#/Db", "D#/Eb", "F#/Gb", "G#/Ab"];
  return (
    <div>
      {renderStringAnswerSelect(width, height, accidentalNotes, flashCards, enabledFlashCardIndices, areFlashCardsInverted, flashCard, onAnswer)}
      {renderStringAnswerSelect(width, height, naturalNotes, flashCards, enabledFlashCardIndices, areFlashCardsInverted, flashCard, onAnswer)}
    </div>
  );
}
export function renderStringAnswerSelect(
  width: number, height: number,
  answers: string[],
  flashCards: FlashCard[],
  enabledFlashCardIndices: number[],
  areFlashCardsInverted: boolean,
  flashCard: FlashCard,
  onAnswer: (answerDifficulty: AnswerDifficulty) => void
): JSX.Element {
  const correctAnswer = flashCard.backSide.renderFn as string;

  return (
    <div>
      {answers.map(a => (
        <Button
          key={a}
          variant="contained"
          onClick={_ => onAnswer((a === correctAnswer) ? AnswerDifficulty.Easy : AnswerDifficulty.Incorrect)}
          style={{ textTransform: "none" }}
        >
          {a}
        </Button>))}
    </div>
  );
}

export function renderDistinctFlashCardSideAnswerSelect(
  width: number, height: number,
  flashCards: FlashCard[],
  enabledFlashCardIndices: number[],
  areFlashCardsInverted: boolean,
  flashCard: FlashCard,
  onAnswer: (answerDifficulty: AnswerDifficulty) => void
) {
  const distinctFlashCardSideRenderFns = Utils.uniq(
    flashCards
      .filter((_, i) => Utils.arrayContains(enabledFlashCardIndices, i))
      .map(fc => fc.backSide.renderFn)
  );
  const flashCardSideRenderFn = flashCard.backSide.renderFn;

  // TODO: calculate
  const maxButtonWidth = 300;
  const maxButtonHeight = 300;

  return (
    <div>
      {distinctFlashCardSideRenderFns.map((fcs, i) => (
        <Button
          key={i}
          variant="contained"
          onClick={_ => onAnswer((fcs === flashCardSideRenderFn) ? AnswerDifficulty.Easy : AnswerDifficulty.Incorrect)}
          style={{ textTransform: "none" }}
        >
          {callFlashCardSideRenderFn(maxButtonWidth, maxButtonHeight, fcs)}
        </Button>))}
    </div>
  );
}