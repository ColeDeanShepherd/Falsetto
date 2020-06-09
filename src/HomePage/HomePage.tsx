import * as React from "react";

import { MainMenu } from '../Components/MainMenu';
import { NavLinkView } from "../NavLinkView";

import "./Stylesheet.css";
import { Paper } from "@material-ui/core";

export class HomePage extends React.Component<{}, {}> {
  public render(): JSX.Element {
    return (
      <div className="home-page">
        <div className="headline">
          <h1>Falsetto</h1>
          <h2 className="elevator-pitch">Learn music theory and train your ear online with interactive lessons &amp; exercises for free!</h2>
        </div>

        <div className="home-topic-container">
          <Paper className="home-topic">
            <div className="thumbnail" style={{ backgroundImage: "url('/img/setup-thumbnail.jpg')" }}></div>

            <div className="text">
              <h2>1. Introduction &amp; Setup</h2>
              <p><NavLinkView to="/music-theory-for-piano?slide=introduction">Introduction</NavLinkView></p>
              <p><NavLinkView to="/music-theory-for-piano?slide=setup">Setup</NavLinkView></p>
            </div>
          </Paper>

          <Paper className="home-topic">
            <div className="thumbnail" style={{ backgroundImage: "url('/img/notes-thumbnail.png')" }}></div>

            <div className="text">
              <h2>2. Notes</h2>
              <p><NavLinkView to="/music-theory-for-piano?slide=notes-introduction">Introduction</NavLinkView></p>
              <p><NavLinkView to="/music-theory-for-piano?slide=note-c">White Keys</NavLinkView></p>
              <p><NavLinkView to="/music-theory-for-piano?slide=note-c-sharp">Black Keys</NavLinkView></p>
              <p><NavLinkView to="/music-theory-for-piano?slide=notes-summary">Review</NavLinkView></p>
              <p><NavLinkView to="/music-theory-for-piano?slide=notes-quiz">Quiz</NavLinkView></p>
            </div>
          </Paper>

          <Paper className="home-topic">
            <div className="thumbnail" style={{ backgroundImage: "url('/img/scale-thumbnail.png')", backgroundSize: "contain" }}></div>

            <div className="text">
              <h2>3. Scales</h2>
              <p><NavLinkView to="/music-theory-for-piano?slide=scales-introduction">Introduction</NavLinkView></p>
              <p><NavLinkView to="/music-theory-for-piano?slide=major-scale">Major Scale</NavLinkView></p>
              <p><NavLinkView to="/music-theory-for-piano?slide=natural-minor-scale">Natural Minor Scale</NavLinkView></p>
              <p><NavLinkView to="/music-theory-for-piano?slide=scales-summary">Review</NavLinkView></p>
              <p><NavLinkView to="/music-theory-for-piano?slide=scales-quiz">Quiz</NavLinkView></p>
              <br />
              <p><NavLinkView to="/scale-exercises">Self-Paced Scale Mastery</NavLinkView></p>
            </div>
          </Paper>
          
          <Paper className="home-topic">
            <div className="thumbnail" style={{ backgroundImage: "url('/img/chord-thumbnail.png')", backgroundSize: "contain" }}></div>

            <div className="text">
              <h2>4. Chords</h2>
              <p><NavLinkView to="/music-theory-for-piano?slide=chords-introduction">Introduction</NavLinkView></p>
              <p><NavLinkView to="/music-theory-for-piano?slide=chords-introduction-review">Chords Review</NavLinkView></p>
              <p><NavLinkView to="/music-theory-for-piano?slide=chords-introduction-quiz">Chords Quiz</NavLinkView></p>
              <p><NavLinkView to="/music-theory-for-piano?slide=diatonic-chords">Diatonic Chords</NavLinkView></p>
              <p><NavLinkView to="/music-theory-for-piano?slide=diatonic-chords-review">Diatonic Chords Review</NavLinkView></p>
              <p><NavLinkView to="/music-theory-for-piano?slide=diatonic-chords-quiz">Diatonic Chords Quiz</NavLinkView></p>
              <br />
              <p><NavLinkView to="/chord-exercises">Self-Paced Chord Mastery</NavLinkView></p>
            </div>
          </Paper>
          
          <Paper className="home-topic">
            <div className="thumbnail" style={{ backgroundImage: "url('/img/chord-progression-thumbnail.png')", backgroundSize: "contain" }}></div>

            <div className="text">
              <h2>5. Chord Progressions</h2>
              <p><NavLinkView to="/music-theory-for-piano?slide=chord-progressions-introduction">Introduction</NavLinkView></p>
              <p><NavLinkView to="/music-theory-for-piano?slide=chord-progressions-review">Review</NavLinkView></p>
              <p><NavLinkView to="/music-theory-for-piano?slide=chord-progressions-quiz">Quiz</NavLinkView></p>
            </div>
          </Paper>
        </div>
        
        <Paper style={{ padding: "0 1em 1em 1em", overflow: "hidden" }}>
          <h2>Other Lessons, Tools, &amp; Exercises</h2>
          <MainMenu collapseCategories={false} />
        </Paper>
      </div>
    );
  }
}