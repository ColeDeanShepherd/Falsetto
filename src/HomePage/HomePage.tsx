import * as React from "react";

import { Card } from "../ui/Card/Card";

import { MainMenu } from '../Components/MainMenu';
import { NavLinkView } from "../NavLinkView";
import { PianoKeyboard, renderPianoKeyboardNoteNames } from "../Components/Utils/PianoKeyboard";

import { Size2D } from '../lib/Core/Size2D';
import { Scale, ScaleType } from "../lib/TheoryLib/Scale";
import { wrapInteger } from '../lib/Core/MathUtils';
import { Pitch } from "../lib/TheoryLib/Pitch";
import { PitchLetter } from "../lib/TheoryLib/PitchLetter";

import "./Stylesheet.css";
import { Chord } from '../lib/TheoryLib/Chord';
import { ChordType } from '../lib/TheoryLib/ChordType';

// #region Topic Thumbnails

// from ".home-topic .thumbnail" in Stylesheet.css
const topicThumbnailSize = new Size2D(336, 208);

export const NotesThumbnail: React.FunctionComponent<{}> = props => (
  <PianoKeyboard
    maxWidth={topicThumbnailSize.width} 
    maxHeight={topicThumbnailSize.height} /* from ".home-topic .thumbnail" in Stylesheet.css */
    lowestPitch={new Pitch(PitchLetter.C, 0, 4)}
    highestPitch={new Pitch(PitchLetter.B, 0, 4)}
    renderExtrasFn={metrics => renderPianoKeyboardNoteNames(
      metrics,
      /*useSharps*/ true,
      /*showLetterPredicate*/ undefined
    )} />
);

export interface IAnimatedPianoKeyboardThumbnailProps {
  animationStepPitches: Array<Array<Pitch>>;
  animationStepDurationMs: number;
}

export interface IAnimatedPianoKeyboardThumbnailState {
  animationStepIndex: number;
}

export class AnimatedPianoKeyboardThumbnail extends React.Component<IAnimatedPianoKeyboardThumbnailProps, IAnimatedPianoKeyboardThumbnailState> {
  public constructor(props: IAnimatedPianoKeyboardThumbnailProps) {
    super(props);

    this.state = {
      animationStepIndex: 0
    };
  }

  public componentDidMount() {
    this.changeNoteIntervalId = window.setInterval(() => {
      const newAnimationStepIndex = wrapInteger(
        this.state.animationStepIndex + 1,
        0,
        this.getNumAnimationSteps() - 1);

      this.setState({ animationStepIndex: newAnimationStepIndex });
    }, this.props.animationStepDurationMs);
  }

  public componentWillUnmount() {
    if (this.changeNoteIntervalId !== undefined) {
      window.clearInterval(this.changeNoteIntervalId);
    }
  }

  public render() : JSX.Element {
    const pressedPitches = this.props.animationStepPitches[this.state.animationStepIndex];

    return (
      <PianoKeyboard
        maxWidth={topicThumbnailSize.width} 
        maxHeight={topicThumbnailSize.height} /* from ".home-topic .thumbnail" in Stylesheet.css */
        lowestPitch={new Pitch(PitchLetter.C, 0, 4)}
        highestPitch={new Pitch(PitchLetter.B, 0, 4)}
        pressedPitches={pressedPitches} />
    );
  }

  private changeNoteIntervalId: number | undefined;

  private getNumAnimationSteps(): number {
    return this.props.animationStepPitches.length;
  }
}

const scalesThumbnailScale = new Scale(ScaleType.Aeolian, new Pitch(PitchLetter.C, 0, 4));
const scalesThumbnailScalePitches = scalesThumbnailScale.getPitches();
const scalesThumbnailAnimationStepPitches = (
  () => {
    const animationStepPitches = new Array<Array<Pitch>>();

    for (const scalePitch of scalesThumbnailScalePitches) {
      animationStepPitches.push([scalePitch]);
    }

    for (let i = scalesThumbnailScalePitches.length - 2; i >= 1; i--) {
      animationStepPitches.push([scalesThumbnailScalePitches[i]]);
    }

    return animationStepPitches;
  }
)();
const scalesThumbnailAnimationStepDurationMs = 350;

export const ScalesThumbnail: React.FunctionComponent<{}> = props => (
  <AnimatedPianoKeyboardThumbnail
    animationStepPitches={scalesThumbnailAnimationStepPitches}
    animationStepDurationMs={scalesThumbnailAnimationStepDurationMs} />
);

const chordsThumbnailPitches = (new Chord(ChordType.Minor, new Pitch(PitchLetter.C, 0, 4)))
  .getPitches();

export const ChordsThumbnail: React.FunctionComponent<{}> = props => (
  <PianoKeyboard
    maxWidth={topicThumbnailSize.width} 
    maxHeight={topicThumbnailSize.height} /* from ".home-topic .thumbnail" in Stylesheet.css */
    lowestPitch={new Pitch(PitchLetter.C, 0, 4)}
    highestPitch={new Pitch(PitchLetter.B, 0, 4)}
    pressedPitches={chordsThumbnailPitches} />
);

const chordProgressionsThumbnailAnimationStepPitches = [
  [new Pitch(PitchLetter.D, 0, 4), new Pitch(PitchLetter.F, 0, 4), new Pitch(PitchLetter.A, 0, 4)],
  [new Pitch(PitchLetter.D, 0, 4), new Pitch(PitchLetter.F, 0, 4), new Pitch(PitchLetter.G, 0, 4), new Pitch(PitchLetter.B, 0, 4)],
  [new Pitch(PitchLetter.C, 0, 4), new Pitch(PitchLetter.E, 0, 4), new Pitch(PitchLetter.G, 0, 4)]
];
const chordProgressionsThumbnaillAnimationStepDurationMs = 1000;

export const ChordProgressionsThumbnail: React.FunctionComponent<{}> = props => (
  <AnimatedPianoKeyboardThumbnail
    animationStepPitches={chordProgressionsThumbnailAnimationStepPitches}
    animationStepDurationMs={chordProgressionsThumbnaillAnimationStepDurationMs} />
);

// #endregion

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
            <div className="thumbnail">
              <NotesThumbnail />
            </div>

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
            <div className="thumbnail">
              <ScalesThumbnail />
            </div>

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
            <div className="thumbnail">
              <ChordsThumbnail />
            </div>

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
            <div className="thumbnail">
              <ChordProgressionsThumbnail />
            </div>

            <div className="text">
              <h3>5. Chord Progressions</h3>
              <p><NavLinkView to="/understanding-the-piano-keyboard?slide=chord-progressions-introduction">Introduction</NavLinkView></p>
              <p><NavLinkView to="/understanding-the-piano-keyboard?slide=chord-progressions-review">Review</NavLinkView></p>
              <p><NavLinkView to="/understanding-the-piano-keyboard?slide=chord-progressions-quiz">Quiz</NavLinkView></p>
            </div>
          </Card>
        </div>
        
        <Card className="other-stuff">
          <h2>Other Lessons, Tools, and Exercises</h2>
          <MainMenu collapseCategories={false} />
        </Card>
      </div>
    );
  }
}