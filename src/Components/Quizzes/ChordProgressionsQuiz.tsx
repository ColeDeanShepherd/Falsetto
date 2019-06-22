import * as FlashCardUtils from "./Utils";
import { FlashCard } from "../../FlashCard";
import { FlashCardGroup } from "../../FlashCardGroup";

export function createFlashCardGroup(): FlashCardGroup {
  const flashCardGroup = new FlashCardGroup("Chord Progressions Quiz", createFlashCards);
  flashCardGroup.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  flashCardGroup.containerHeight = "160px";

  return flashCardGroup;
}
export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns("_ are simply sequences of chords.", "chord progressions"),
    FlashCard.fromRenderFns("_ are often written with roman numeral notation instead of with pitch letters, allowing chord progressions to be described _ of the key they are played in.", "chord progressions, independent"),
    FlashCard.fromRenderFns("One of the most common patterns in chord progressions is the descending _", "fifth"),
    FlashCard.fromRenderFns("Another name for the V chord is the _ chord.", "dominant"),
    FlashCard.fromRenderFns("Another name for the I chord is the _ chord.", "tonic"),
    FlashCard.fromRenderFns("Do chord progressions require all chords to be played in root position?", "no"),
    FlashCard.fromRenderFns("The V7 chord consists of scale degrees _", "5, 7, 2, 4"),
    FlashCard.fromRenderFns("The I chord consists of scale degrees _", "1, 3, 5"),
    FlashCard.fromRenderFns("The V7 chord is tense because of the dissonant _ interval between scale degrees 7 and 4, and because it contains the _", "tritone, leading tone"),
    FlashCard.fromRenderFns("Is the V - I chord progression applicable to any chords a fifth apart?", "yes"),
    FlashCard.fromRenderFns("_ is simply replacing a chord in a chord progression with a similar chord.", "chord substitution"),
    FlashCard.fromRenderFns("Chords are considered \"similar\" if they share many _ or if they _ in similar ways to the next chord in a chord progression.", "notes, resolve"),
    FlashCard.fromRenderFns("Triads a _ apart have 2 of 3 notes in common, and therefore are good candidates for chord substitution.", "3rd"),
    FlashCard.fromRenderFns("For chords without an altered 5th, the chord tones in order of importance are _", "root & 3rd, 7th, 9th & 11th & 13th, 5th"),
    FlashCard.fromRenderFns("The _ is important because it determines whether the chord is major or minor, which plays a huge role in how the chord sounds.", "3rd"),
    FlashCard.fromRenderFns("Though the 5th is not an important chord tone in most chords, it is important if it is _ in some way", "altered"),
    FlashCard.fromRenderFns("_ is the arrangement of the notes in chords to create smooth, flowing transitions between chords", "voice leading"),
    FlashCard.fromRenderFns("Good _ can make just about any set of chords work together in a chord progression.", "voice leading"),
    FlashCard.fromRenderFns("The most important rule of voice leading is to _ when moving the voices of one chord to the next chord.", "use the smallest possible movements"),
    FlashCard.fromRenderFns("Large jumps in the _ voice of chords are sometimes acceptable, as they are more pleasing to the ear than large jumps with other chord voices.", "bass"),
    FlashCard.fromRenderFns("The diatonic chords that are considered \"tonic\" chords are:", "I, III, VI"),
    FlashCard.fromRenderFns("The diatonic chords that are considered \"pre-dominant\" chords are:", "II, IV"),
    FlashCard.fromRenderFns("The diatonic chords that are considered \"dominant\" chords are:", "V, VII"),
  ];
}