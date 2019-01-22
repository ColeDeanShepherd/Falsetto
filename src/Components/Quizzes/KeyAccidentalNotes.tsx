import * as React from 'react';

import * as FlashCardUtils from "src/Components/Quizzes/Utils";
import { FlashCard } from 'src/FlashCard';
import { FlashCardGroup } from 'src/FlashCardGroup';
import { AnswerDifficulty } from 'src/StudyAlgorithm';

export function renderAnswerSelect(
  flashCards: FlashCard[],
  enabledFlashCardIndices: number[],
  areFlashCardsInverted: boolean,
  flashCard: FlashCard,
  onAnswer: (answerDifficulty: AnswerDifficulty) => void
): JSX.Element {
  const row0 = ["none"];
  const row1 = ["F♯", "F♯, C♯", "F♯, C♯, G♯", "F♯, C♯, G♯, D♯", "F♯, C♯, G♯, D♯, A♯", "F♯, C♯, G♯, D♯, A♯, E♯", "F♯, C♯, G♯, D♯, A♯, E♯, B♯"];
  const row2 = ["B♭", "B♭, E♭", "B♭, E♭, A♭", "B♭, E♭, A♭, D♭", "B♭, E♭, A♭, D♭, G♭", "B♭, E♭, A♭, D♭, G♭, C♭", "B♭, E♭, A♭, D♭, G♭, C♭, F♭"];

  return (
    <div>
      {FlashCardUtils.renderStringAnswerSelect(row0, flashCards, enabledFlashCardIndices, areFlashCardsInverted, flashCard, onAnswer)}
      {FlashCardUtils.renderStringAnswerSelect(row1, flashCards, enabledFlashCardIndices, areFlashCardsInverted, flashCard, onAnswer)}
      {FlashCardUtils.renderStringAnswerSelect(row2, flashCards, enabledFlashCardIndices, areFlashCardsInverted, flashCard, onAnswer)}
    </div>
  );
}

export function createFlashCardGroup(): FlashCardGroup {
  const flashCards = createFlashCards();
  const flashCardGroup = new FlashCardGroup("Key Accidental Notes", flashCards);
  flashCardGroup.renderAnswerSelect = renderAnswerSelect;
  flashCardGroup.moreInfoUri = "http://myguitarpal.com/the-order-of-sharps-and-flats/";

  return flashCardGroup;
}

export function createFlashCards(): FlashCard[] {
  return [
    new FlashCard("C Major", "none"),
    new FlashCard("C# Major", "F♯, C♯, G♯, D♯, A♯, E♯, B♯"),
    new FlashCard("Db Major", "B♭, E♭, A♭, D♭, G♭"),
    new FlashCard("D Major", "F♯, C♯"),
    new FlashCard("Eb Major", "B♭, E♭, A♭"),
    new FlashCard("E Major", "F♯, C♯, G♯, D♯"),
    new FlashCard("F Major", "B♭"),
    new FlashCard("F# Major", "F♯, C♯, G♯, D♯, A♯, E♯"),
    new FlashCard("Gb Major", "B♭, E♭, A♭, D♭, G♭, C♭"),
    new FlashCard("G Major", "F♯"),
    new FlashCard("Ab Major", "B♭, E♭, A♭, D♭"),
    new FlashCard("A Major", "F♯, C♯, G♯"),
    new FlashCard("Bb Major", "B♭, E♭"),
    new FlashCard("B Major", "F♯, C♯, G♯, D♯, A♯"),
    new FlashCard("Cb Major", "B♭, E♭, A♭, D♭, G♭, C♭, F♭"),

    new FlashCard("A Minor", "none"),
    new FlashCard("A# Minor", "F♯, C♯, G♯, D♯, A♯, E♯, B♯"),
    new FlashCard("Bb Minor", "B♭, E♭, A♭, D♭, G♭"),
    new FlashCard("B Minor", "F♯, C♯"),
    new FlashCard("C Minor", "B♭, E♭, A♭"),
    new FlashCard("C# Minor", "F♯, C♯, G♯, D♯"),
    new FlashCard("D Minor", "B♭"),
    new FlashCard("D# Minor", "F♯, C♯, G♯, D♯, A♯, E♯"),
    new FlashCard("Eb Minor", "B♭, E♭, A♭, D♭, G♭, C♭"),
    new FlashCard("E Minor", "F♯"),
    new FlashCard("F Minor", "B♭, E♭, A♭, D♭"),
    new FlashCard("F# Minor", "F♯, C♯, G♯"),
    new FlashCard("G Minor", "B♭, E♭"),
    new FlashCard("G# Minor", "F♯, C♯, G♯, D♯, A♯"),
    new FlashCard("Ab Minor", "B♭, E♭, A♭, D♭, G♭, C♭, F♭")
  ];
}