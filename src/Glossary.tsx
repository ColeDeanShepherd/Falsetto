import * as React from "react";
import { CardContent, Card, Typography } from "@material-ui/core";

export class GlossaryEntry {
    public constructor(
        public term: string,
        public renderDefinitionFn: () => JSX.Element,
        public synonyms?: Array<string>
    ) {}
}

export const glossaryData = [
  new GlossaryEntry("a cappella", () => <span>vocalists performing without accompaniment</span>),
  new GlossaryEntry("accidentals", () => <span>sharps &amp; flats &mdash; pitch modifiers</span>),
  new GlossaryEntry("adagio", () => <span>at a slow tempo</span>),
  new GlossaryEntry("allegro", () => <span>lively and fast</span>),
  new GlossaryEntry("alto", () => <span>the second-highest classical singing voice</span>),
  new GlossaryEntry("atonal", () => <span>without regard to any specific key</span>),
  new GlossaryEntry("arpeggio", () => <span>the notes of a chord played individually in a melody</span>),
  new GlossaryEntry("bass", () => <span>low-frequency sounds; the lowest classical singing voice</span>),
  new GlossaryEntry("beat", () => <span>the repeating pulse you can feel when listening to a piece of music</span>),
  new GlossaryEntry("BPM", () => <span>beats per minute</span>),
  new GlossaryEntry("cadence", () => <span>a chord progression ending a phrase</span>),
  new GlossaryEntry("chord", () => <span>three or more notes played simultaneously</span>),
  new GlossaryEntry("chord inversion", () => <span>a chord played with a non-root pitch in the base</span>),
  new GlossaryEntry("chord progression", () => <span>a sequence of chords</span>),
  new GlossaryEntry("chord substitution", () => <span>replacing a chord in a chord progression with a similar chord</span>),
  new GlossaryEntry("clef", () => <span>a symbol defining the pitches on a musical staff</span>),
  new GlossaryEntry("compound interval", () => <span>an interval spanning more than 12 half steps</span>),
  new GlossaryEntry("consonance", () => <span>collections of pitches that are generally considered to sound pleasing to the ear</span>),
  new GlossaryEntry("diatonic chord", () => <span>a chord built by picking out notes from a scale separated by 3rds</span>),
  new GlossaryEntry("dissonance", () => <span>collections of pitches that are generally considered to sound harsh or tense to the ear</span>),
  new GlossaryEntry("dynamics", () => <span>pertaining to the loudness or softness of a musical composition</span>),
  new GlossaryEntry("extended chord", () => <span>chords built with more than three 3rds &ndash; ninth chords, eleventh chords, and thirteenth chords</span>),
  new GlossaryEntry("falsetto", () => <span>a style of male singing where by partial use of the vocal chords, the voice is able to reach the pitch of a female</span>),
  new GlossaryEntry("flat", () => <span>lowered in pitch by one semitone</span>),
  new GlossaryEntry("harmony", () => <span>the arrangement of multiple notes at the same time to form chords</span>),
  new GlossaryEntry("interval", () => <span>the distance between two notes</span>),
  new GlossaryEntry("interval number", () => <span>the number of letters that the interval spans</span>),
  new GlossaryEntry("interval quality", () => <span>describes the sound of the interval and helps specify the exact number of half steps in the interval</span>),
  new GlossaryEntry("key", () => <span>the scale that forms the basis of a musical composition</span>),
  new GlossaryEntry("key signature", () => <span>flats and sharps at the beginning staff lines which indicate the key of the music</span>),
  new GlossaryEntry("note", () => <span>a sound with a distinct pitch and a duration</span>),
  new GlossaryEntry("note value", () => <span>the duration of a note/rest</span>),
  new GlossaryEntry("measure", () => <span>synonym for "bar" &mdash; a small section of music containing a fixed number of beats</span>, ["bar"]),
  new GlossaryEntry("melody", () => <span>the arrangement of individual notes over time, with no two notes playing simultaneously &mdash; when you sing a song, you sing the melody</span>),
  new GlossaryEntry("middle C", () => <span>the fourth C key from the left on a standard 88-key piano keyboard</span>),
  new GlossaryEntry("mode", () => <span>the different scales you get when you start on different notes of a "base" scale and consider those starting notes the new root notes</span>),
  new GlossaryEntry("modulation", () => <span>changing to another key</span>),
  new GlossaryEntry("natural note", () => <span>a note with no accidental &mdash; a white key on a piano</span>),
  new GlossaryEntry("octave", () => <span>an interval spanning twelve semitones</span>),
  new GlossaryEntry("pitch", () => <span>the "highness" or "lowness" of a sound</span>),
  new GlossaryEntry("roman numeral notation", () => <span>a way to notate chords using roman numerals of scale degrees instead of letters to designate chord root notes</span>),
  new GlossaryEntry("root note", () => <span>the tonal center of a scale or key &mdash; the note that sounds like "home"</span>),
  new GlossaryEntry("rhythm", () => <span>the purposeful arrangement of sounds over time &mdash; what you dance to when listening to a piece of music</span>),
  new GlossaryEntry("rubato", () => <span>to slightly deviate from a fixed tempo in a smooth and flowing manner</span>),
  new GlossaryEntry("scale", () => <span>sets of notes forming particular intervals with a tonal center called a root note</span>),
  new GlossaryEntry("scale degree", () => <span>the number of a note in a scale, in ascending order, starting from 1</span>),
  new GlossaryEntry("semitone", () => <span>the smallest interval (aside from unisons) in Western music</span>, ["half step"]),
  new GlossaryEntry("seventh chord", () => <span>a chord built with three 3rds, including the 7th degree of a scale</span>),
  new GlossaryEntry("sharp", () => <span>raised in pitch by one semitone</span>),
  new GlossaryEntry("simple interval", () => <span>intervals spanning 12 half steps or less</span>),
  new GlossaryEntry("sight-reading", () => <span>reading and performing a piece of music that the performer has not seen or learned before</span>),
  new GlossaryEntry("soprano", () => <span>the highest type of classical singing voice</span>),
  new GlossaryEntry("staff", () => <span>a set of five horizontal lines and four spaces that each represent a different musical pitch</span>, ["stave"]),
  new GlossaryEntry("strong beat", () => <span>a beat with a lot of "weight" in a measure, specific to the time signature</span>),
  new GlossaryEntry("tempo", () => <span>the speed of the beat</span>),
  new GlossaryEntry("time signature", () => <span>specifies the number &amp; type of beats in a measure</span>),
  new GlossaryEntry("tenor", () => <span>the third-highest type of classical singing voice</span>),
  new GlossaryEntry("triad", () => <span>chords made of exactly three distinct pitches</span>),
  new GlossaryEntry("tone", () => <span>the interval spanning two semitones</span>, ["whole step"]),
  new GlossaryEntry("voice leading", () => <span>the arrangement of the notes in chord progressions (called "voices") to create smooth, flowing transitions between chords</span>),
  new GlossaryEntry("weak beat", () => <span>a beat with relatively little "weight" in a measure, specific to the time signature</span>),
];

glossaryData.sort((a, b) => (a.term.toLowerCase() < b.term.toLowerCase()) ? -1 : 1);

export class Glossary extends React.Component<{}, {}> {
  public render(): JSX.Element {
    return (
      <Card>
        <CardContent>
          <Typography gutterBottom={true} variant="h5" component="h2">
            Glossary
          </Typography>

          {glossaryData.map(d => <p><strong>{d.term}</strong> - {d.renderDefinitionFn()}</p>)}
        </CardContent>
      </Card>
    );
  }
}