import * as FlashCardUtils from "../Utils";
import { FlashCard } from "../../../FlashCard";
import { FlashCardSet } from "../../../FlashCardSet";

const flashCardSetId = "chordProgressionsQuiz";

function createFlashCardSet(): FlashCardSet {
  const flashCardSet = new FlashCardSet(flashCardSetId, "Chord Progressions Quiz", createFlashCards);
  flashCardSet.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  flashCardSet.containerHeight = "160px";

  return flashCardSet;
}
export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "cp" }),
      "_ are simply sequences of chords.", "chord progressions"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "cp,i" }),
      "_ are often written with roman numeral notation instead of with pitch letters, allowing chord progressions to be described _ of the key they are played in.", "chord progressions, independent"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "fifth" }),
      "One of the most common patterns in chord progressions is the descending _", "fifth"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "dominant" }),
      "Another name for the V chord is the _ chord.", "dominant"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "tonic" }),
      "Another name for the I chord is the _ chord.", "tonic"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "mustBeRoot" }),
      "Do chord progressions require all chords to be played in root position?", "no"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "V7" }),
      "The V7 chord consists of scale degrees _", "5, 7, 2, 4"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "I" }),
      "The I chord consists of scale degrees _", "1, 3, 5"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "V7" }),
      "The V7 chord is tense because of the dissonant _ interval between scale degrees 7 and 4, and because it contains the _", "tritone, leading tone"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "vIAnyChords" }),
      "Is the V - I chord progression applicable to any chords a fifth apart?", "yes"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "chordSub" }),
      "_ is simply replacing a chord in a chord progression with a similar chord.", "chord substitution"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "notes,resolve" }),
      "Chords are considered \"similar\" if they share many _ or if they _ in similar ways to the next chord in a chord progression.", "notes, resolve"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "3rdApart" }),
      "Triads a _ apart have 2 of 3 notes in common, and therefore are good candidates for chord substitution.", "3rd"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "importantTones" }),
      "For chords without an altered 5th, the chord tones in order of importance are _", "root & 3rd, 7th, 9th & 11th & 13th, 5th"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "3rdImportant" }),
      "The _ is important because it determines whether the chord is major or minor, which plays a huge role in how the chord sounds.", "3rd"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "5thImportant" }),
      "Though the 5th is not an important chord tone in most chords, it is important if it is _ in some way", "altered"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "voiceLeading" }),
      "_ is the arrangement of the notes in chords to create smooth, flowing transitions between chords", "voice leading"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "goodVl" }),
      "Good _ can make just about any set of chords work together in a chord progression.", "voice leading"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "smallMoves" }),
      "The most important rule of voice leading is to _ when moving the voices of one chord to the next chord.", "use the smallest possible movements"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "bass" }),
      "Large jumps in the _ voice of chords are sometimes acceptable, as they are more pleasing to the ear than large jumps with other chord voices.", "bass"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "tonicChords" }),
      "The diatonic chords that are considered \"tonic\" chords are:", "I, III, VI"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "preDominantChords" }),
      "The diatonic chords that are considered \"pre-dominant\" chords are:", "II, IV"),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "dominantChords" }),
      "The diatonic chords that are considered \"dominant\" chords are:", "V, VII"),
  ];
}

export const flashCardSet = createFlashCardSet();