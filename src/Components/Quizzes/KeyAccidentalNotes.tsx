import * as FlashCardUtils from "src/Components/Quizzes/Utils";
import { FlashCard } from 'src/FlashCard';
import { FlashCardGroup } from 'src/FlashCardGroup';

export function createFlashCardGroup(): FlashCardGroup {
  const flashCards = createFlashCards();
  const flashCardGroup = new FlashCardGroup("Key Accidental Notes", flashCards);
  flashCardGroup.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;

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