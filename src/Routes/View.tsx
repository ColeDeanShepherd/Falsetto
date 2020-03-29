import * as React from "react";
import { Route } from "react-router-dom";
import DocumentTitle from "react-document-title";

import { flashCardSets } from "../FlashCardGraph";

import { PianoTheory } from "../PianoTheory";
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
import { SupportUsPage } from "../Components/SupportUs";
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
        <Route key="/support-us" exact path="/support-us" component={() => (
          <DocumentTitle title="Support Us - Falsetto">
            <LimitedWidthContentContainer>
              <SupportUsPage />
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
            <PianoTheory />
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
        <Route key="/scale-viewer" exact path="/scale-viewer" component={() => (
          <DocumentTitle title={"Scale Viewer - Falsetto"}>
            <LimitedWidthContentContainer>
              <ScaleViewer renderAllScaleShapes={false} />
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
        flashCardSets.map(fcg => <Route key={fcg.route} exact path={fcg.route} component={this.createStudyFlashCardSetComponent(fcg)} />)
      );
    }

    return <div>{this.cachedRenderedRoutes}</div>;
  }
  
  private cachedRenderedRoutes: Array<JSX.Element> | null = null;
  
  private createStudyFlashCardSetComponent(currentFlashCardSet: FlashCardSet): () => JSX.Element {
    return () => (
      <DocumentTitle title={currentFlashCardSet.name + " - Falsetto"}>
        <LimitedWidthContentContainer>
          {createStudyFlashCardSetComponent(currentFlashCardSet, /*isEmbedded:*/ false, /*hideMoreInfoUri:*/ false)}
        </LimitedWidthContentContainer>
      </DocumentTitle>
    );
  }
}