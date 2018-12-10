import { FlashCard } from "../../../../FlashCard";
import * as PianoNotes from "../../../PianoNotes";

export function createFlashCards(): FlashCard[] {
  return [
    new FlashCard("A scale is _.", "any subset of the 12 notes within an octave, organised in a sequence (i.e. starting and ending on the same note)"),
    new FlashCard("A scale starts on a given note (the _ note) and goes up in set intervals (semitones, tones, etc.).", "root"),
    new FlashCard("We are able to transpose the same scale to a different note by repeating the same _ but starting and ending on the different _ note.", "sequence of intervals, root"),
    new FlashCard("The scales most commonly used in Traditional Western Music are the:", "Major Scale, Natural Minor Scale, Melodic Minor Scale, Harmonic Minor Scale"),
    new FlashCard("The scale that contains all 12 notes is called the _.", "Chromatic Scale"),
    new FlashCard("The most commonly used scale in Western Music is the _ scale", "Major"),
    new FlashCard("From the root note, the major scale follows the interval pattern:", "Tone, Tone, Semitone, Tone, Tone, Tone, Semitone"),
    new FlashCard("The degrees of the _ Scale are used as the base from which all other scale and chord degrees are derived.", "Major"),
    new FlashCard("What notes make up the natural minor scale?", "1 2 b3 4 5 b6 b7"),
    new FlashCard("The major and natural minor scale types are called ‘_ scales‘. If you play only using the notes from one of these scales, you are playing ‘_’. While if you play using notes outside of one of these two scales, you are playing ‘_’.", "diatonic, diatonically, chromatically"),
    new FlashCard("", ""),
    new FlashCard("", ""),
    new FlashCard("", ""),
  ].concat(PianoNotes.createFlashCards())
}