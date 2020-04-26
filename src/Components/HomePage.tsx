import * as React from "react";
import { CardContent, Card } from "@material-ui/core";

import { MainMenu } from './MainMenu';
import { NavLinkView } from "../NavLinkView";

export class HomePage extends React.Component<{}, {}> {
  public render(): JSX.Element {
    return (
      <Card>
        <CardContent>
          <div style={{ textAlign: "center" }}>
            <h1>Falsetto</h1>
            <h2 style={{ fontWeight: "normal" }}>Learn music theory and train your ear online with interactive lessons &amp; exercises for free!</h2>
          </div>

          <div>
            <div>
              <h2>1. Introduction &amp; Setup</h2>
              <ol>
                <li><NavLinkView to="/piano-theory?slide=introduction">Setup</NavLinkView></li>
                <li><NavLinkView to="/piano-theory?slide=piano-basics">Piano Introduction</NavLinkView></li>
              </ol>
            </div>

            <div>
              <h2>2. Notes</h2>
              <ol>
                <li><NavLinkView to="/piano-theory?slide=note-c">White Keys</NavLinkView></li>
                <li><NavLinkView to="/piano-theory?slide=note-c-sharp">Black Keys</NavLinkView></li>
                <li><NavLinkView to="/piano-theory?slide=all-notes">Review &amp; Quiz</NavLinkView></li>
              </ol>
            </div>

            <div>
              <h2>3. Scales</h2>
              <ol>
                <li><NavLinkView to="/piano-theory?slide=scales-introduction">Introduction</NavLinkView></li>
                <li><NavLinkView to="/piano-theory?slide=major-scale">Major Scale</NavLinkView></li>
                <li><NavLinkView to="/piano-theory?slide=natural-minor-scale">Natural Minor Scale</NavLinkView></li>
                <li><NavLinkView to="/piano-theory?slide=scales-summary">Review &amp; Quiz</NavLinkView></li>
              </ol>

              <p><NavLinkView to="/scale-exercises">Self-Paced Scale Mastery</NavLinkView></p>
            </div>

            <div>
              <h2>4. Chords</h2>
              <ol>
                <li>Introduction</li>
                <li>C Major Chord</li>
                <li>Diatonic Chords &amp; Roman Numeral Notation</li>
                <li>Chord Inversions</li>
                <li>Seventh Chords</li>
                <li>Extended Chords &amp; Chord/Scale Relationships</li>
                <li>Arpeggios</li>
                <li>Quiz</li>
              </ol>

              <p>Self-Paced Scale Mastery</p>
            </div>

            <div>
              <h2>5. Chord Progressions</h2>
              <ol>
                <li>Introduction</li>
                <li>V - I Progression</li>
                <li>Chord Substitution</li>
                <li>Voice Leading</li>
                <li>Quiz</li>
              </ol>
            </div>
          </div>

          <MainMenu collapseCategories={true} />
        </CardContent>
      </Card>
    );
  }
}