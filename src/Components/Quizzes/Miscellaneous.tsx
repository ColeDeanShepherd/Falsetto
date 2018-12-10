import { FlashCard } from "../../FlashCard";

export function createFlashCards(): FlashCard[] {
  return [
    new FlashCard("suspended chords are", "chords where the 3rd has been replaced by a 2nd or (usually) a 4th"),
    new FlashCard("In Jazz, sus chords act as substitutes for _ or _ chords and are usually extended to _ or _ chords.", "ii or V7 chords, 9sus or ♭9sus chords"),
    new FlashCard("sus chords can be useful becase a _ is an unavailable tension over the regular _ chord, but it is a chord tone over the _ chord", "♮11, V7, V7sus"),

    
    new FlashCard("", ""),
    new FlashCard("", ""),
    new FlashCard("", "")
    //new FlashCard("", "")
  ];
}