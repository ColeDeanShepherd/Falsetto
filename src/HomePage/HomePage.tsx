import * as React from "react";

import { MainMenu } from '../Components/MainMenu';
import { NavLinkView } from "../NavLinkView";

import "./Stylesheet.css";

export class HomePage extends React.Component<{}, {}> {
  public render(): JSX.Element {
    return (
      <div className="home-page">
        <div className="headline">
          <h1>Falsetto</h1>
          <h2 className="elevator-pitch">Learn music theory and train your ear online with interactive lessons &amp; exercises for free!</h2>
        </div>

        <div className="home-topic-container">
          <div className="home-topic">
            <div className="thumbnail" style={{ backgroundImage: "url('/img/setup-thumbnail.jpg')" }}></div>

            <div className="text">
              <h2>1. Introduction &amp; Setup</h2>
              <p><NavLinkView to="/piano-theory?slide=introduction">Introduction</NavLinkView></p>
              <p><NavLinkView to="/piano-theory?slide=setup">Setup</NavLinkView></p>
              <p><NavLinkView to="/piano-theory?slide=piano-basics">Piano Introduction</NavLinkView></p>
            </div>
          </div>

          <div className="home-topic">
            <div className="thumbnail" style={{ backgroundImage: "url('/img/notes-thumbnail.png')" }}></div>

            <div className="text">
              <h2>2. Notes</h2>
              <p><NavLinkView to="/piano-theory?slide=note-c">White Keys</NavLinkView></p>
              <p><NavLinkView to="/piano-theory?slide=note-c-sharp">Black Keys</NavLinkView></p>
              <p><NavLinkView to="/piano-theory?slide=all-notes">Review</NavLinkView></p>
              <p><NavLinkView to="/piano-theory?slide=notes-quiz">Quiz</NavLinkView></p>
            </div>
          </div>

          <div className="home-topic">
            <div className="thumbnail" style={{ backgroundImage: "url('/img/scale-thumbnail.png')", backgroundSize: "contain" }}></div>

            <div className="text">
              <h2>3. Scales</h2>
              <p><NavLinkView to="/piano-theory?slide=scales-introduction">Introduction</NavLinkView></p>
              <p><NavLinkView to="/piano-theory?slide=major-scale">Major Scale</NavLinkView></p>
              <p><NavLinkView to="/piano-theory?slide=natural-minor-scale">Natural Minor Scale</NavLinkView></p>
              <p><NavLinkView to="/piano-theory?slide=scales-summary">Review</NavLinkView></p>
              <p><NavLinkView to="/piano-theory?slide=scales-quiz">Quiz</NavLinkView></p>
              <br />
              <p><NavLinkView to="/scale-exercises">Self-Paced Scale Mastery</NavLinkView></p>
            </div>
          </div>
          
          <div className="home-topic">
            <div className="thumbnail" style={{ backgroundImage: "url('/img/chord-thumbnail.png')", backgroundSize: "contain" }}></div>

            <div className="text">
              <h2>4. Chords</h2>
              <p><NavLinkView to="/piano-theory?slide=chords-introduction">Introduction</NavLinkView></p>
              <p><NavLinkView to="/piano-theory?slide=chords-introduction-review">Review</NavLinkView></p>
              <p><NavLinkView to="/piano-theory?slide=chords-introduction-quiz">Quiz</NavLinkView></p>
              <p><NavLinkView to="/piano-theory?slide=diatonic-chords">Diatonic Chords</NavLinkView></p>
              <p><NavLinkView to="/piano-theory?slide=diatonic-chords-review">Review</NavLinkView></p>
              <p><NavLinkView to="/piano-theory?slide=diatonic-chords-quiz">Quiz</NavLinkView></p>
              <br />
              <p><NavLinkView to="/chord-exercises">Self-Paced Chord Mastery</NavLinkView></p>
            </div>
          </div>
          
          <div className="home-topic">
            <div className="thumbnail" style={{ backgroundImage: "url('/img/chord-progression-thumbnail.png')", backgroundSize: "contain" }}></div>

            <div className="text">
              <h2>5. Chord Progressions</h2>
              <p><NavLinkView to="/piano-theory?slide=chord-progressions-introduction">Introduction</NavLinkView></p>
              <p><NavLinkView to="/piano-theory?slide=chord-progressions-review">Review</NavLinkView></p>
              <p><NavLinkView to="/piano-theory?slide=chord-progressions-quiz">Quiz</NavLinkView></p>
            </div>
          </div>
        </div>
        
        <h2>Other Lessons, Tools, &amp; Exercises</h2>
        <MainMenu collapseCategories={true} />
      </div>
    );
  }
}