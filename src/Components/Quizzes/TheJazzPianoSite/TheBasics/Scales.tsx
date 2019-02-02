import { FlashCard } from "../../../../FlashCard";
import * as PianoNotes from "../../PianoNotes";

export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns("A scale is _.", "any subset of the 12 notes within an octave, organised in a sequence (i.e. starting and ending on the same note)"),
    FlashCard.fromRenderFns("A scale starts on a given note (the _ note) and goes up in set intervals (semitones, tones, etc.).", "root"),
    FlashCard.fromRenderFns("We are able to transpose the same scale to a different note by repeating the same _ but starting and ending on the different _ note.", "sequence of intervals, root"),
    FlashCard.fromRenderFns("The scales most commonly used in Traditional Western Music are the:", "Major Scale, Natural Minor Scale, Melodic Minor Scale, Harmonic Minor Scale"),
    FlashCard.fromRenderFns("The scale that contains all 12 notes is called the _.", "Chromatic Scale"),
    FlashCard.fromRenderFns("The most commonly used scale in Western Music is the _ scale", "Major"),
    FlashCard.fromRenderFns("From the root note, the major scale follows the interval pattern:", "Tone, Tone, Semitone, Tone, Tone, Tone, Semitone"),
    FlashCard.fromRenderFns("The degrees of the _ Scale are used as the base from which all other scale and chord degrees are derived.", "Major"),
    FlashCard.fromRenderFns("What notes make up the natural minor scale?", "1 2 b3 4 5 b6 b7"),
    FlashCard.fromRenderFns("The major and natural minor scale types are called ‘_ scales‘. If you play only using the notes from one of these scales, you are playing ‘_’. While if you play using notes outside of one of these two scales, you are playing ‘_’.", "diatonic, diatonically, chromatically"),
    FlashCard.fromRenderFns("", ""),
    FlashCard.fromRenderFns("", ""),
    FlashCard.fromRenderFns("", ""),
  ].concat(PianoNotes.createFlashCards())
}