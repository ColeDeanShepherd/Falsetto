import * as Utils from "src/Utils";
import { FlashCard } from "../../FlashCard";
import { FlashCardGroup } from 'src/FlashCardGroup';

export function createFlashCardGroup(): FlashCardGroup {
  const flashCards = createFlashCards();
  const flashCardGroup = new FlashCardGroup("Scale Chords", flashCards);
  flashCardGroup.initialSelectedFlashCardIndices = Utils.range(0, 8);

  return flashCardGroup;
}

export function createFlashCards(): FlashCard[] {
  return [
    new FlashCard("Ionian (Major)", "Maj7"),
    new FlashCard("Dorian", "Min7 (nat. 6)"),
    new FlashCard("Phrygian", "Min7, Maj∆/7"),
    new FlashCard("Lydian", "Maj7(#11)"),
    new FlashCard("Mixolydian", "Dom7"),
    new FlashCard("Aeolian (Natural Minor)", "Min7(b6)"),
    new FlashCard("Locrian", "Min7b5"),
    new FlashCard("Melodic Minor", "MinMaj7"),
    new FlashCard("Harmonic Minor", "Minmaj7, o∆/b7"),

    new FlashCard("Tonic Diminished", "Dim7, Maj∆/b9"),
    new FlashCard("Dominant Diminished", "Dom13,b9,#9,b5"),
    new FlashCard("Whole Tone", "Dom7,#5,b5"),
    new FlashCard("Augmented", "Aug∆/7Aug∆"),
    new FlashCard("Major Pentatonic", "Maj(6,7)"),
    new FlashCard("Minor Pentatonic", "Min(7,11)"),
    new FlashCard("Major Blues", "Dom7, Maj(6,7)"),
    new FlashCard("Minor Blues", "Min7, Dom7#9"),
    
    new FlashCard("Dorian b2", "Min7sus4b9"),
    new FlashCard("Lydian Aug.", "Maj7#4#5, Maj∆/b6"),
    new FlashCard("Mixolydian #11", "Dom7b5"),
    new FlashCard("Mixolydian b6", "Dom7b6"),
    new FlashCard("Locrian Nat. 9", "Min9b6"),
    new FlashCard("Altered Dominant", "Dom7b9,#9,b5,#5"),
    new FlashCard("Locrian Nat. 6", "Min7b5"),
    new FlashCard("Ionian Aug.", "Maj7sus4,#5"),
    new FlashCard("Dorian #11", "Min7(#11)"),
    new FlashCard("Phrygian Major", "Dom7sus4,b9, #5"),
    new FlashCard("Lydian #9", "Maj7#9,#11, Maj∆/b9"),
    new FlashCard("Altered Dominant bb7", "Dimo7")
  ];
}