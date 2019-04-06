import * as React from "react";
import { CardContent, Card } from "@material-ui/core";

const MainTitle: React.FunctionComponent<{}> = props => <h1>{props.children}</h1>;
const SectionTitle: React.FunctionComponent<{}> = props => <h2>{props.children}</h2>;

export class EssentialMusicTheory extends React.Component<{}, {}> {
  public render(): JSX.Element {
    return (
      <Card>
        <CardContent>
          <MainTitle>Essential Music Theory</MainTitle>

          <SectionTitle>Rhythm</SectionTitle>
          <ul>
            <li>Overview</li>
            <li>Tempo</li>
            <li>Time Signatures</li>
            <li>Note Durations</li>
            <li>Strong and Weak Beats</li>
            <li>Rubato</li>
            <li>Rhythym Tapper</li>
          </ul>

          <SectionTitle>Notes</SectionTitle>
          <ul>
            <li>Overview</li>
            <li>12 notes</li>
            <li>sharps &amp; flats</li>
            <li>no note in between B &amp; C and E &amp; F</li>
            <li>why sharps and flats?</li>
          </ul>

          <SectionTitle>Intervals</SectionTitle>
          <ul>
            <li>Overview</li>
            <li>The 12 Simple Intervals (whole steps &amp; half steps, semitones &amp; tones)</li>
            <li>Compound Intervals</li>
            <li>Ear Training</li>
          </ul>

          <SectionTitle>Scales &amp; Modes</SectionTitle>
          <ul>
            <li>Overview</li>
            <li>Chromatic Scale</li>
            <li>Major Scale</li>
            <li>7 Modes of the Major Scale</li>
            <li>Other Minor Scales</li>
            <li>Pentatonic Scales</li>
            <li>Whole Tone Scale</li>
            <li>Diminished Scales</li>
            <li>Blues Scale</li>
          </ul>

          <SectionTitle>Chords</SectionTitle>
          <ul>
            <li>Overview</li>
          </ul>

        </CardContent>
      </Card>
    );
  }
}