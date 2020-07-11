import * as React from "react";

import { Card } from "../../ui/Card/Card";

import { MainMenu } from '../../ui/MainMenu';
import { NavLinkView } from "../../ui/NavLinkView";
import { PianoKeyboard, renderPianoKeyboardNoteNames } from "../../ui/Utils/PianoKeyboard";

import { Size2D } from '../../lib/Core/Size2D';
import { Scale, ScaleType } from "../../lib/TheoryLib/Scale";
import { wrapInteger } from '../../lib/Core/MathUtils';
import { Pitch } from "../../lib/TheoryLib/Pitch";
import { PitchLetter } from "../../lib/TheoryLib/PitchLetter";

import { Chord } from '../../lib/TheoryLib/Chord';
import { ChordType } from '../../lib/TheoryLib/ChordType';

import "./Stylesheet.css";
import { PaywallOverlay } from "../Utils/PaywallOverlay/PaywallOverlay";
import { understandingThePianoKeyboardProduct } from '../../Products';
import { UserProfile } from '../../UserProfile';
import { IServer } from "../../Server";
import { DependencyInjector } from "../../DependencyInjector";

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

export interface IHomePageState {
  userProfile: UserProfile | undefined;
}

export class HomePage extends React.Component<{}, IHomePageState> {
  public constructor(props: {}) {
    super(props);
    
    this.server = DependencyInjector.instance.getRequiredService<IServer>("IServer");

    this.state = {
      userProfile: undefined
    };
  }
  public componentDidMount() {
    this.server.getProfile()
      .then(p => this.setState({ userProfile: p }));
    // TODO: error handling
  }

  public render(): JSX.Element {
    const { userProfile } = this.state;

    const userOwnsUnderstandingThePianoKeyboardCourse = (userProfile !== undefined) &&
      userProfile.boughtProductIds.some(pId => pId == understandingThePianoKeyboardProduct.id);
    
    return (
      <div className="home-page">
        <div className="headline">
          <h1>Falsetto</h1>
          <h2 className="elevator-pitch">Master your instrument, learn music theory, and train your ear with interactive lessons &amp; exercises!</h2>
        </div>

        <h3 style={{ textAlign: "center" }}>Understanding the Piano Keyboard</h3>
        <h4 className="h5" style={{ textAlign: "center" }}>The piano keyboard is more than just 12 notes. Better understand the music you enjoy, and improve your skills in music composition &amp; improvisation by learning to see intervals, scales, chords, and chord progressions on the piano keyboard.</h4>
        <div className="home-topic-container">
          <Card className="home-topic">
            <NavLinkView
              to="/understanding-the-piano-keyboard"
              className="thumbnail"
              style={{ backgroundImage: "url('/img/setup-thumbnail.jpg')" }} />

            <div className="text">
              <h3><NavLinkView to="/understanding-the-piano-keyboard">1. Introduction &amp; Setup</NavLinkView></h3>
              <p><NavLinkView to="/understanding-the-piano-keyboard/introduction">Introduction</NavLinkView></p>
              <p><NavLinkView to="/understanding-the-piano-keyboard/introduction/setup">Setup</NavLinkView></p>
            </div>
          </Card>

          <Card className="home-topic">
            <NavLinkView to="/understanding-the-piano-keyboard/notes/introduction" className="thumbnail">
              <NotesThumbnail />
            </NavLinkView>

            <div className="text">
              <h3><NavLinkView to="/understanding-the-piano-keyboard/notes/introduction">2. Notes</NavLinkView></h3>
              <p><NavLinkView to="/understanding-the-piano-keyboard/notes/introduction">Introduction</NavLinkView></p>
              <p><NavLinkView to="/understanding-the-piano-keyboard/notes/c">White Keys</NavLinkView></p>
              <p><NavLinkView to="/understanding-the-piano-keyboard/notes/c-sharp">Black Keys</NavLinkView></p>
              <p><NavLinkView to="/understanding-the-piano-keyboard/notes/summary">Review</NavLinkView></p>
              <p><NavLinkView to="/understanding-the-piano-keyboard/notes/quiz">Quiz</NavLinkView></p>
            </div>
          </Card>

          <Card className="home-topic">
            <NavLinkView to="/understanding-the-piano-keyboard/scales/introduction" className="thumbnail">
              <ScalesThumbnail />
            </NavLinkView>

            <div className="text">
              <h3><NavLinkView to="/understanding-the-piano-keyboard/scales/introduction">3. Scales</NavLinkView></h3>
              <p><NavLinkView to="/understanding-the-piano-keyboard/scales/introduction">Introduction</NavLinkView></p>
              <p><NavLinkView to="/understanding-the-piano-keyboard/scales/major">Major Scale</NavLinkView></p>
              <p><NavLinkView to="/understanding-the-piano-keyboard/scales/natural-minor">Natural Minor Scale</NavLinkView></p>
              <p><NavLinkView to="/understanding-the-piano-keyboard/scales/summary">Review</NavLinkView></p>
              <p><NavLinkView to="/understanding-the-piano-keyboard/scales/quiz">Quiz</NavLinkView></p>
              <br />
              <p><NavLinkView to="/scale-exercises">Self-Paced Scale Mastery</NavLinkView></p>
            </div>
            
            {!userOwnsUnderstandingThePianoKeyboardCourse ? <PaywallOverlay premiumProductId={understandingThePianoKeyboardProduct.id} /> : null}
          </Card>
          
          <Card className="home-topic">
            <NavLinkView to="/understanding-the-piano-keyboard/chords/introduction" className="thumbnail">
              <ChordsThumbnail />
            </NavLinkView>

            <div className="text">
              <h3><NavLinkView to="/understanding-the-piano-keyboard/chords/introduction">4. Chords</NavLinkView></h3>
              <p><NavLinkView to="/understanding-the-piano-keyboard/chords/introduction">Introduction</NavLinkView></p>
              <p><NavLinkView to="/understanding-the-piano-keyboard/chords/introduction-review">Chords Review</NavLinkView></p>
              <p><NavLinkView to="/understanding-the-piano-keyboard/chords/introduction-quiz">Chords Quiz</NavLinkView></p>
              <p><NavLinkView to="/understanding-the-piano-keyboard/chords/diatonic-chords">Diatonic Chords</NavLinkView></p>
              <p><NavLinkView to="/understanding-the-piano-keyboard/chords/diatonic-chords-review">Diatonic Chords Review</NavLinkView></p>
              <p><NavLinkView to="/understanding-the-piano-keyboard/chords/diatonic-chords-quiz">Diatonic Chords Quiz</NavLinkView></p>
              <br />
              <p><NavLinkView to="/chord-exercises">Self-Paced Chord Mastery</NavLinkView></p>
            </div>
            
            {!userOwnsUnderstandingThePianoKeyboardCourse ? <PaywallOverlay premiumProductId={understandingThePianoKeyboardProduct.id} /> : null}
          </Card>
          
          <Card className="home-topic">
            <NavLinkView to="/understanding-the-piano-keyboard/chord-progressions/introduction" className="thumbnail">
              <ChordProgressionsThumbnail />
            </NavLinkView>

            <div className="text">
              <h3><NavLinkView to="/understanding-the-piano-keyboard/chord-progressions/introduction">5. Chord Progressions</NavLinkView></h3>
              <p><NavLinkView to="/understanding-the-piano-keyboard/chord-progressions/introduction">Introduction</NavLinkView></p>
              <p><NavLinkView to="/understanding-the-piano-keyboard/chord-progressions/review">Review</NavLinkView></p>
              <p><NavLinkView to="/understanding-the-piano-keyboard/chord-progressions/quiz">Quiz</NavLinkView></p>
            </div>
            
            {!userOwnsUnderstandingThePianoKeyboardCourse ? <PaywallOverlay premiumProductId={understandingThePianoKeyboardProduct.id} /> : null}
          </Card>
        </div>
        
        <Card className="other-stuff">
          <h2>Other Lessons, Tools, and Exercises</h2>
          <MainMenu collapseCategories={false} />
        </Card>
      </div>
    );
  }
  
  private server: IServer;
}