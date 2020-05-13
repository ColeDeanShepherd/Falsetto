import * as React from "react";
import { Route, Switch } from "react-router-dom";
import DocumentTitle from "react-document-title";

import { flashCardSets } from "../FlashCardGraph";

import { PianoTheory, pianoTheorySlideGroups } from "../PianoTheory/PianoTheory";
import {
  SectionContainer
} from "../Components/Lessons/EssentialMusicTheory/EssentialMusicTheory";
import { IntroSection } from "../Components/Lessons/EssentialMusicTheory/Introduction";
import { RhythmSection } from "../Components/Lessons/EssentialMusicTheory/Rhythm";
import { NotesSection } from "../Components/Lessons/EssentialMusicTheory/Notes";
import { IntervalsSection } from "../Components/Lessons/EssentialMusicTheory/Intervals";
import { ScalesAndModesSection } from "../Components/Lessons/EssentialMusicTheory/ScalesAndModes";
import { ChordsSection } from "../Components/Lessons/EssentialMusicTheory/Chords";
import { ChordProgressionsSection } from "../Components/Lessons/EssentialMusicTheory/ChordProgressions";
import { NextStepsSection } from "../Components/Lessons/EssentialMusicTheory/NextSteps";
import { GuitarNotesLesson } from "../Components/Lessons/GuitarNotesLesson";
import { GuitarScalesLesson } from "../Components/Lessons/GuitarScalesLesson";
import { ScaleViewer } from "../Components/Tools/ScaleViewer";
import { ChordViewer } from "../Components/Tools/ChordViewer";
import { IntervalChordScaleFinder } from "../Components/Tools/IntervalChordScaleFinder";
import { Tuner } from "../Components/Tools/Tuner";
import { RhythmTapper } from "../Components/Tools/RhythmTapper";
import { AboutPage } from "../Components/AboutPage";
import { ContributePage } from "../Components/ContributePage";
import { HomePage } from "../Components/HomePage";
import { Glossary } from "../Glossary";
import { ProfilePage } from "../Components/ProfilePage";
import { Metronome } from '../Components/Tools/Metronome';
import { DiatonicChordPlayer } from '../Components/Tools/DiatonicChordPlayer';
import { KnowledgeMapPage } from '../Components/KnowledgeMapPage';
import { LoginPage } from '../Components/LoginPage';
import { LogoutPage } from "../Components/LogoutPage";
import { MessagePage } from '../Components/MessagePage';
import { FlashCardSet } from '../FlashCardSet';
import { createStudyFlashCardSetComponent } from '../StudyFlashCards/View';
import { LimitedWidthContentContainer } from '../Components/Utils/LimitedWidthContentContainer';
import { ScaleExercisesPage } from "../Components/ScaleExercisesPage";
import * as PianoScaleDegrees from "../Components/Quizzes/Scales/PianoScaleDegrees";
import * as PianoDiatonicChords from "../Components/Quizzes/Chords/PianoDiatonicChords";
import { Scale, parseScaleFromUriComponent } from '../lib/TheoryLib/Scale';
import { createSlideGroups as createScaleMasteryLessonSlideGroups } from '../PianoTheory/ScaleMasteryLessonSlides';
import { createSlideGroups as createChordTypeMasteryLessonSlideGroups } from '../PianoTheory/ChordTypeMasteryLessonSlides';
import { PageNotFoundView } from '../Components/PageNotFoundView';
import { Chord, parseChordFromUriComponent } from "../lib/TheoryLib/Chord";
import { ChordPage } from "../Components/ChordPage";
import { ChordExercisesPage } from '../Components/ChordExercisesPage';
import { ChordType, parseChordTypeFromUriComponent } from '../lib/TheoryLib/ChordType';

export interface IScaleRouteProps {
  routeParams: {};
  renderRoute: (scale: Scale) => JSX.Element;
}

export class ScaleRoute extends React.Component<IScaleRouteProps, {}> {
  public constructor(props: IScaleRouteProps) {
    super(props);
  }

  public render(): JSX.Element | null {
    const { routeParams, renderRoute } = this.props;

    const scaleId = routeParams["scaleId"];
    if (!scaleId) {
      return null;
    }

    const scale = parseScaleFromUriComponent(scaleId);
    
    return scale
      ? renderRoute(scale)
      : null;
  }
}

export interface IChordTypeRouteProps {
  routeParams: {};
  renderRoute: (chord: ChordType) => JSX.Element;
}

export class ChordTypeRoute extends React.Component<IChordTypeRouteProps, {}> {
  public constructor(props: IChordTypeRouteProps) {
    super(props);
  }

  public render(): JSX.Element | null {
    const { routeParams, renderRoute } = this.props;

    const chordTypeUriComponent = routeParams["chordType"];
    if (!chordTypeUriComponent) {
      return null;
    }

    const chordType = parseChordTypeFromUriComponent(chordTypeUriComponent);
    
    return chordType
      ? renderRoute(chordType)
      : null;
  }
}

export interface IChordRouteProps {
  routeParams: {};
  renderRoute: (chord: Chord) => JSX.Element;
}

export class ChordRoute extends React.Component<IChordRouteProps, {}> {
  public constructor(props: IChordRouteProps) {
    super(props);
  }

  public render(): JSX.Element | null {
    const { routeParams, renderRoute } = this.props;

    const chordId = routeParams["chordId"];
    if (!chordId) {
      return null;
    }

    const chord = parseChordFromUriComponent(chordId);
    
    return chord
      ? renderRoute(chord)
      : null;
  }
}

export interface IRoutesViewProps {}

export interface IRoutesViewState {}

export class RoutesView extends React.Component<IRoutesViewProps, IRoutesViewState> {
  public constructor(props: IRoutesViewProps) {
    super(props);
    this.state = {};
  }
  
  public render(): JSX.Element | null {
    if (!this.cachedRenderedRoutes) {
      this.cachedRenderedRoutes = [
        <Route key="/" exact path="/" component={() => (
          <DocumentTitle title="Falsetto">
            <LimitedWidthContentContainer>
              <HomePage />
            </LimitedWidthContentContainer>
          </DocumentTitle>
        )} />,
        <Route key="/login" exact path="/login" component={() => (
          <DocumentTitle title="Login - Falsetto">
            <LimitedWidthContentContainer>
              <LoginPage />
            </LimitedWidthContentContainer>
          </DocumentTitle>
        )} />,
        <Route key="/logout" exact path="/logout" component={() => (
          <DocumentTitle title="Logout - Falsetto">
            <LimitedWidthContentContainer>
              <LogoutPage />
            </LimitedWidthContentContainer>
          </DocumentTitle>
        )} />,
        <Route key="/profile" exact path="/profile" component={() => (
          <DocumentTitle title="Profile - Falsetto">
            <LimitedWidthContentContainer>
              <ProfilePage />
            </LimitedWidthContentContainer>
          </DocumentTitle>
        )} />,
        <Route key="/reset-password" exact path="/reset-password" component={() => (
          <DocumentTitle title="Reset Password - Falsetto">
            <LimitedWidthContentContainer>
              <MessagePage title="Reset Password" message="An email has been sent to your email address with instructions to reset your password." />
            </LimitedWidthContentContainer>
          </DocumentTitle>
        )} />,
        <Route key="/about" exact path="/about" component={() => (
          <DocumentTitle title="About - Falsetto">
            <LimitedWidthContentContainer>
              <AboutPage />
            </LimitedWidthContentContainer>
          </DocumentTitle>
        )} />,
        <Route key="/contribute" exact path="/contribute" component={() => (
          <DocumentTitle title="Contribute - Falsetto">
            <LimitedWidthContentContainer>
              <ContributePage />
            </LimitedWidthContentContainer>
          </DocumentTitle>
        )} />,
        <Route key="/knowledge-map" exact path="/knowledge-map" component={() => (
          <DocumentTitle title="Knowledge Map - Falsetto">
            <LimitedWidthContentContainer>
              <KnowledgeMapPage />
            </LimitedWidthContentContainer>
          </DocumentTitle>
        )} />,
        <Route key="/piano-theory" exact path="/piano-theory" component={() => (
          <DocumentTitle title="Piano Theory - Falsetto">
            <PianoTheory slideGroups={pianoTheorySlideGroups} />
          </DocumentTitle>
        )} />,
        <Route key="/essential-music-theory" exact path="/essential-music-theory" component={() => (
          <DocumentTitle title="Essential Music Theory - Falsetto">
            <LimitedWidthContentContainer>
              <SectionContainer section={IntroSection} />
            </LimitedWidthContentContainer>
          </DocumentTitle>
        )} />,
        <Route key="/essential-music-theory/rhythm" exact path="/essential-music-theory/rhythm" component={() => (
          <DocumentTitle title="Rhythm - Essential Music Theory - Falsetto">
            <LimitedWidthContentContainer>
              <SectionContainer section={RhythmSection} />
            </LimitedWidthContentContainer>
          </DocumentTitle>
        )} />,
        <Route key="/essential-music-theory/notes" exact path="/essential-music-theory/notes" component={() => (
          <DocumentTitle title="Notes - Essential Music Theory - Falsetto">
            <LimitedWidthContentContainer>
              <SectionContainer section={NotesSection} />
            </LimitedWidthContentContainer>
          </DocumentTitle>
        )} />,
        <Route key="/essential-music-theory/intervals" exact path="/essential-music-theory/intervals" component={() => (
          <DocumentTitle title="Intervals - Essential Music Theory - Falsetto">
            <LimitedWidthContentContainer>
              <SectionContainer section={IntervalsSection} />
            </LimitedWidthContentContainer>
          </DocumentTitle>
        )} />,
        <Route key="/essential-music-theory/scales-and-modes" exact path="/essential-music-theory/scales-and-modes" component={() => (
          <DocumentTitle title="Scales And Modes - Essential Music Theory - Falsetto">
            <LimitedWidthContentContainer>
              <SectionContainer section={ScalesAndModesSection} />
            </LimitedWidthContentContainer>
          </DocumentTitle>
        )} />,
        <Route key="/essential-music-theory/chords" exact path="/essential-music-theory/chords" component={() => (
          <DocumentTitle title="Chords - Essential Music Theory - Falsetto">
            <LimitedWidthContentContainer>
              <SectionContainer section={ChordsSection} />
            </LimitedWidthContentContainer>
          </DocumentTitle>
        )} />,
        <Route key="/essential-music-theory/chord-progressions" exact path="/essential-music-theory/chord-progressions" component={() => (
          <DocumentTitle title="Chord Progressions - Essential Music Theory - Falsetto">
            <LimitedWidthContentContainer>
              <SectionContainer section={ChordProgressionsSection} />
            </LimitedWidthContentContainer>
          </DocumentTitle>
        )} />,
        <Route key="/essential-music-theory/next-steps" exact path="/essential-music-theory/next-steps" component={() => (
          <DocumentTitle title="Next Steps - Essential Music Theory - Falsetto">
            <LimitedWidthContentContainer>
              <SectionContainer section={NextStepsSection} />
            </LimitedWidthContentContainer>
          </DocumentTitle>
        )} />,
        <Route key="/glossary" exact path="/glossary" component={() => (
          <DocumentTitle title="Glossary - Falsetto">
            <LimitedWidthContentContainer>
              <Glossary />
            </LimitedWidthContentContainer>
          </DocumentTitle>
        )} />,
        <Route key="/scale-exercises" exact path="/scale-exercises" component={() => (
          <DocumentTitle title={"Scale Exercises - Falsetto"}>
            <LimitedWidthContentContainer>
              <ScaleExercisesPage />
            </LimitedWidthContentContainer>
          </DocumentTitle>
        )} />,
        <Route key="/scale-viewer" exact path="/scale-viewer" component={() => (
          <DocumentTitle title={"Scale Viewer - Falsetto"}>
            <LimitedWidthContentContainer>
              <ScaleViewer renderAllScaleShapes={false} />
            </LimitedWidthContentContainer>
          </DocumentTitle>
        )} />,
        <Route key="/chord-exercises" exact path="/chord-exercises" component={() => (
          <DocumentTitle title={"Chord Exercises - Falsetto"}>
            <LimitedWidthContentContainer>
              <ChordExercisesPage />
            </LimitedWidthContentContainer>
          </DocumentTitle>
        )} />,
        <Route key="/chord-viewer" exact path="/chord-viewer" component={() => (
          <DocumentTitle title={"Chord Viewer - Falsetto"}>
            <LimitedWidthContentContainer>
              <ChordViewer />
            </LimitedWidthContentContainer>
          </DocumentTitle>
        )} />,
        <Route key="/metronome" exact path="/metronome" component={() => (
          <DocumentTitle title={"Metronome - Falsetto"}>
            <LimitedWidthContentContainer>
              <Metronome />
            </LimitedWidthContentContainer>
          </DocumentTitle>
        )} />,
        <Route key="/diatonic-chord-player" exact path="/diatonic-chord-player" component={() => (
          <DocumentTitle title={"Diatonic Chord Player - Falsetto"}>
            <LimitedWidthContentContainer>
              <DiatonicChordPlayer />
            </LimitedWidthContentContainer>
          </DocumentTitle>
          )} />,
        <Route key="/interval-chord-scale-finder" exact path="/interval-chord-scale-finder" component={() => (
          <DocumentTitle title={"Interval/Chord/Scale Finder - Falsetto"}>
            <LimitedWidthContentContainer>
              <IntervalChordScaleFinder />
            </LimitedWidthContentContainer>
          </DocumentTitle>
        )} />,
        <Route key="/tuner" exact path="/tuner" component={() => (
          <DocumentTitle title={"Tuner - Falsetto"}>
            <LimitedWidthContentContainer>
              <Tuner />
            </LimitedWidthContentContainer>
          </DocumentTitle>
        )} />,
        <Route key="/rhythm-tapper" exact path="/rhythm-tapper" component={() => (
          <DocumentTitle title={"Rhythm Tapper - Falsetto"}>
            <LimitedWidthContentContainer>
              <RhythmTapper />
            </LimitedWidthContentContainer>
          </DocumentTitle>
        )} />,
        <Route key="/learn-guitar-notes-in-10-steps" exact path="/learn-guitar-notes-in-10-steps" component={() => (
          <DocumentTitle title={"Learn the Guitar Notes in 10 Easy Steps - Falsetto"}>
            <LimitedWidthContentContainer>
              <GuitarNotesLesson />
            </LimitedWidthContentContainer>
          </DocumentTitle>
        )} />,
        <Route key="/learn-guitar-scales" exact path="/learn-guitar-scales" component={() => (
          <DocumentTitle title={"Learn the Guitar Scales - Falsetto"}>
            <LimitedWidthContentContainer>
              <GuitarScalesLesson />
            </LimitedWidthContentContainer>
          </DocumentTitle>
        )} />
      ].concat(
        flashCardSets.map(fcs => <Route key={fcs.route} exact path={fcs.route} component={this.createStudyFlashCardSetComponent(fcs)} />)
      )
      .concat([
        <Route
          key="/scale/:scaleId"
          exact path="/scale/:scaleId"
          component={(props: any) => (
            <ScaleRoute routeParams={props.match.params} renderRoute={scale => {
              const slideGroups = createScaleMasteryLessonSlideGroups(scale);
              return <PianoTheory slideGroups={slideGroups} />;
            }} />
          )} />,
        
        <Route
          key="/scale/:scaleId/lesson"
          exact path="/scale/:scaleId/lesson"
          component={(props: any) => (
            <ScaleRoute routeParams={props.match.params} renderRoute={scale => {
              const slideGroups = createScaleMasteryLessonSlideGroups(scale);
              return <PianoTheory slideGroups={slideGroups} />;
            }} />
          )} />,
        
        <Route
          key="/scale/:scaleId/degrees-exercise"
          exact path="/scale/:scaleId/degrees-exercise"
          component={(props: any) => (
            <ScaleRoute routeParams={props.match.params} renderRoute={scale => {
              const flashCardSet = PianoScaleDegrees.createFlashCardSet(scale);
              return this.renderStudyFlashCardSetComponent(flashCardSet);
            }} />
          )} />
      ])
      .concat([3, 4]
        .map(numChordPitches => {
          const path = `/scale/:scaleId/diatonic-${numChordPitches}-note-chords-exercise`;

          return (
            <Route
              key={path}
              exact path={path}
              component={(props: any) => (
                <ScaleRoute routeParams={props.match.params} renderRoute={scale => {
                  const flashCardSet = PianoDiatonicChords.createFlashCardSet(scale, numChordPitches);
                  return this.renderStudyFlashCardSetComponent(flashCardSet);
                }} />
              )} />
          );
        })
      )
      .concat([
        <Route
          key="/chord/:chordType/lesson"
          exact path="/chord/:chordType/lesson"
          component={(props: any) => (
            <LimitedWidthContentContainer>
              <ChordTypeRoute routeParams={props.match.params} renderRoute={chordType => {
                const slideGroups = createChordTypeMasteryLessonSlideGroups(chordType);
                return <PianoTheory slideGroups={slideGroups} />;
              }} />
            </LimitedWidthContentContainer>
          )} />,

        <Route
          key="/chord/:chordId"
          exact path="/chord/:chordId"
          component={(props: any) => (
            <LimitedWidthContentContainer>
              <ChordRoute routeParams={props.match.params} renderRoute={chord => {
                return <ChordPage chord={chord} />;
              }} />
            </LimitedWidthContentContainer>
          )} />
      ])
      .concat([
        <Route key={'/page-not-found'} component={PageNotFoundView} />
      ]);
    }

    return (
      <div style={{ height: "100%" }}>
        <Switch>
          {this.cachedRenderedRoutes}
        </Switch>
      </div>
    );
  }
  
  private cachedRenderedRoutes: Array<JSX.Element> | null = null;

  private renderStudyFlashCardSetComponent(currentFlashCardSet: FlashCardSet): JSX.Element {
    return (
      <DocumentTitle title={currentFlashCardSet.name + " - Falsetto"}>
        <LimitedWidthContentContainer>
          {createStudyFlashCardSetComponent(currentFlashCardSet, /*isEmbedded:*/ false, /*hideMoreInfoUri:*/ false)}
        </LimitedWidthContentContainer>
      </DocumentTitle>
    );
  }
  
  private createStudyFlashCardSetComponent(currentFlashCardSet: FlashCardSet): () => JSX.Element {
    return () => this.renderStudyFlashCardSetComponent(currentFlashCardSet);
  }
}