import * as React from "react";

import { Card } from "../ui/Card/Card";

import { MainMenu } from '../Components/MainMenu';
import { NavLinkView } from "../NavLinkView";

import "./Stylesheet.css";

export class HomePage extends React.Component<{}, {}> {
  public render(): JSX.Element {
    return (
      <div className="home-page">
        <div className="headline">
          <h1>Falsetto</h1>
          <h2 className="elevator-pitch">Master your instrument, learn music theory, and train your ear with interactive lessons &amp; exercises!</h2>
        </div>

        <h3 style={{ textAlign: "center" }}>Understanding the Piano Keyboard</h3>
        <div className="home-topic-container">
          <Card className="home-topic">
            <div className="thumbnail" style={{ backgroundImage: "url('/img/setup-thumbnail.jpg')" }}></div>

            <div className="text">
              <h3>1. Introduction &amp; Setup</h3>
              <p><NavLinkView to="/understanding-the-piano-keyboard?slide=introduction">Introduction</NavLinkView></p>
              <p><NavLinkView to="/understanding-the-piano-keyboard?slide=setup">Setup</NavLinkView></p>
            </div>
          </Card>

          <Card className="home-topic">
            <div className="thumbnail" style={{ backgroundImage: "url('/img/notes-thumbnail.png')" }}></div>

            <div className="text">
              <h3>2. Notes</h3>
              <p><NavLinkView to="/understanding-the-piano-keyboard?slide=notes-introduction">Introduction</NavLinkView></p>
              <p><NavLinkView to="/understanding-the-piano-keyboard?slide=note-c">White Keys</NavLinkView></p>
              <p><NavLinkView to="/understanding-the-piano-keyboard?slide=note-c-sharp">Black Keys</NavLinkView></p>
              <p><NavLinkView to="/understanding-the-piano-keyboard?slide=notes-summary">Review</NavLinkView></p>
              <p><NavLinkView to="/understanding-the-piano-keyboard?slide=notes-quiz">Quiz</NavLinkView></p>
            </div>
          </Card>

          <Card className="home-topic">
            <div className="thumbnail" style={{ backgroundImage: "url('/img/scale-thumbnail.png')", backgroundSize: "contain" }}></div>

            <div className="text">
              <h3>3. Scales</h3>
              <p><NavLinkView to="/understanding-the-piano-keyboard?slide=scales-introduction">Introduction</NavLinkView></p>
              <p><NavLinkView to="/understanding-the-piano-keyboard?slide=major-scale">Major Scale</NavLinkView></p>
              <p><NavLinkView to="/understanding-the-piano-keyboard?slide=natural-minor-scale">Natural Minor Scale</NavLinkView></p>
              <p><NavLinkView to="/understanding-the-piano-keyboard?slide=scales-summary">Review</NavLinkView></p>
              <p><NavLinkView to="/understanding-the-piano-keyboard?slide=scales-quiz">Quiz</NavLinkView></p>
              <br />
              <p><NavLinkView to="/scale-exercises">Self-Paced Scale Mastery</NavLinkView></p>
            </div>
          </Card>
          
          <Card className="home-topic">
            <div className="thumbnail" style={{ backgroundImage: "url('/img/chord-thumbnail.png')", backgroundSize: "contain" }}></div>

            <div className="text">
              <h3>4. Chords</h3>
              <p><NavLinkView to="/understanding-the-piano-keyboard?slide=chords-introduction">Introduction</NavLinkView></p>
              <p><NavLinkView to="/understanding-the-piano-keyboard?slide=chords-introduction-review">Chords Review</NavLinkView></p>
              <p><NavLinkView to="/understanding-the-piano-keyboard?slide=chords-introduction-quiz">Chords Quiz</NavLinkView></p>
              <p><NavLinkView to="/understanding-the-piano-keyboard?slide=diatonic-chords">Diatonic Chords</NavLinkView></p>
              <p><NavLinkView to="/understanding-the-piano-keyboard?slide=diatonic-chords-review">Diatonic Chords Review</NavLinkView></p>
              <p><NavLinkView to="/understanding-the-piano-keyboard?slide=diatonic-chords-quiz">Diatonic Chords Quiz</NavLinkView></p>
              <br />
              <p><NavLinkView to="/chord-exercises">Self-Paced Chord Mastery</NavLinkView></p>
            </div>
          </Card>
          
          <Card className="home-topic">
            <div className="thumbnail" style={{ backgroundImage: "url('/img/chord-progression-thumbnail.png')", backgroundSize: "contain" }}></div>

            <div className="text">
              <h3>5. Chord Progressions</h3>
              <p><NavLinkView to="/understanding-the-piano-keyboard?slide=chord-progressions-introduction">Introduction</NavLinkView></p>
              <p><NavLinkView to="/understanding-the-piano-keyboard?slide=chord-progressions-review">Review</NavLinkView></p>
              <p><NavLinkView to="/understanding-the-piano-keyboard?slide=chord-progressions-quiz">Quiz</NavLinkView></p>
            </div>
          </Card>
        </div>
        
        <Card className="other-stuff">
          <h2>Other Lessons, Tools, &amp; Exercises</h2>
          <MainMenu collapseCategories={false} />
        </Card>
      </div>
    );
  }
}