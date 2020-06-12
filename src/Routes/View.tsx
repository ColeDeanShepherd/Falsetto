import * as React from "react";
import { Route, Switch } from "react-router-dom";
import DocumentTitle from "react-document-title";

import { flashCardSets } from "../FlashCardGraph";

import { getUriComponent as getPitchUriComponent } from "../lib/TheoryLib/Pitch";
import { Scale, parseScaleFromUriComponent } from '../lib/TheoryLib/Scale';
import { ChordType, parseChordTypeFromUriComponent, getUriComponent as getChordTypeUriComponent } from '../lib/TheoryLib/ChordType';
import { Chord, parseChordFromUriComponent } from "../lib/TheoryLib/Chord";

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
import { HomePage } from "../HomePage/HomePage";
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
import { createSlideGroups as createScaleMasteryLessonSlideGroups } from '../PianoTheory/ScaleMasteryLessonSlides';
import { createSlideGroups as createChordTypeMasteryLessonSlideGroups } from '../PianoTheory/ChordTypeMasteryLessonSlides';
import { PageNotFoundView } from '../Components/PageNotFoundView';
import { ChordPage } from "../Components/ChordPage";
import { ChordExercisesPage } from '../Components/ChordExercisesPage';

export interface IRouteData {
  key?: string;
  path?: string;
  isPathExact?: boolean;
  title?: string;
  renderFn: (props: any) => JSX.Element;
}

function renderRoute(routeData: IRouteData): JSX.Element {
  const { path, title, renderFn } = routeData;

  const key = (routeData.key !== undefined)
    ? routeData.key
    : path;

  const attributes: any = ((routeData.isPathExact === true) || (routeData.isPathExact === undefined))
    ? { exact: true }
    : {};

  return (
    <Route key={key} {...attributes} path={path} component={(props: any) => (
      (title !== undefined)
        ? <DocumentTitle title={title}>{renderFn(props)}</DocumentTitle>
        : renderFn(props)
    )} />
  );
}

function renderStudyFlashCardSetComponent(currentFlashCardSet: FlashCardSet): JSX.Element {
  return (
    <DocumentTitle title={currentFlashCardSet.name + " - Falsetto"}>
      <LimitedWidthContentContainer>
        {createStudyFlashCardSetComponent(currentFlashCardSet, /*isEmbedded:*/ false, /*hideMoreInfoUri:*/ false)}
      </LimitedWidthContentContainer>
    </DocumentTitle>
  );
}

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

const routes: Array<IRouteData> = ([
  {
    path: "/",
    title: "Falsetto",
    renderFn: () => (
      <LimitedWidthContentContainer>
        <HomePage />
      </LimitedWidthContentContainer>
    )
  },
  {
    path: "/login",
    title: "Login - Falsetto",
    renderFn: () => (
      <LimitedWidthContentContainer>
        <LoginPage />
      </LimitedWidthContentContainer>
    )
  },
  {
    path: "/logout",
    title: "Logout - Falsetto",
    renderFn: () => (
      <LimitedWidthContentContainer>
        <LogoutPage />
      </LimitedWidthContentContainer>
    )
  },
  {
    path: "/profile",
    title: "Profile - Falsetto",
    renderFn: () => (
      <LimitedWidthContentContainer>
        <ProfilePage />
      </LimitedWidthContentContainer>
    )
  },
  {
    path: "/reset-password",
    title: "Reset Password - Falsetto",
    renderFn: () => (
      <LimitedWidthContentContainer>
        <MessagePage title="Reset Password" message="An email has been sent to your email address with instructions to reset your password." />
      </LimitedWidthContentContainer>
    )
  },
  {
    path: "/about",
    title: "About - Falsetto",
    renderFn: () => (
      <LimitedWidthContentContainer>
        <AboutPage />
      </LimitedWidthContentContainer>
    )
  },
  {
    path: "/contribute",
    title: "Contribute - Falsetto",
    renderFn: () => (
      <LimitedWidthContentContainer>
        <ContributePage />
      </LimitedWidthContentContainer>
    )
  },
  {
    path: "/knowledge-map",
    title: "Knowledge Map - Falsetto",
    renderFn: () => (
      <LimitedWidthContentContainer>
        <KnowledgeMapPage />
      </LimitedWidthContentContainer>
    )
  },
  {
    path: "/understanding-the-piano-keyboard",
    title: "Understanding the Piano Keyboard - Falsetto",
    renderFn: () => (
      <PianoTheory slideGroups={pianoTheorySlideGroups} />
    )
  },
  {
    path: "/essential-music-theory",
    title: "Essential Music Theory - Falsetto",
    renderFn: () => (
      <LimitedWidthContentContainer>
        <SectionContainer section={IntroSection} />
      </LimitedWidthContentContainer>
    )
  },
  {
    path: "/essential-music-theory/rhythm",
    title: "Rhythm - Essential Music Theory - Falsetto",
    renderFn: () => (
      <LimitedWidthContentContainer>
        <SectionContainer section={RhythmSection} />
      </LimitedWidthContentContainer>
    )
  },
  {
    path: "/essential-music-theory/notes",
    title: "Notes - Essential Music Theory - Falsetto",
    renderFn: () => (
      <LimitedWidthContentContainer>
        <SectionContainer section={NotesSection} />
      </LimitedWidthContentContainer>
    )
  },
  {
    path: "/essential-music-theory/intervals",
    title: "Intervals - Essential Music Theory - Falsetto",
    renderFn: () => (
      <LimitedWidthContentContainer>
        <SectionContainer section={IntervalsSection} />
      </LimitedWidthContentContainer>
    )
  },
  {
    path: "/essential-music-theory/scales-and-modes",
    title: "Scales And Modes - Essential Music Theory - Falsetto",
    renderFn: () => (
      <LimitedWidthContentContainer>
        <SectionContainer section={ScalesAndModesSection} />
      </LimitedWidthContentContainer>
    )
  },
  {
    path: "/essential-music-theory/chords",
    title: "Chords - Essential Music Theory - Falsetto",
    renderFn: () => (
      <LimitedWidthContentContainer>
        <SectionContainer section={ChordsSection} />
      </LimitedWidthContentContainer>
    )
  },
  {
    path: "/essential-music-theory/chord-progressions",
    title: "Chord Progressions - Essential Music Theory - Falsetto",
    renderFn: () => (
      <LimitedWidthContentContainer>
        <SectionContainer section={ChordProgressionsSection} />
      </LimitedWidthContentContainer>
    )
  },
  {
    path: "/essential-music-theory/next-steps",
    title: "Next Steps - Essential Music Theory - Falsetto",
    renderFn: () => (
      <LimitedWidthContentContainer>
        <SectionContainer section={NextStepsSection} />
      </LimitedWidthContentContainer>
    )
  },
  {
    path: "/glossary",
    title: "Glossary - Falsetto",
    renderFn: () => (
      <LimitedWidthContentContainer>
        <Glossary />
      </LimitedWidthContentContainer>
    )
  },
  {
    path: "/scale-exercises",
    title: "Scale Exercises - Falsetto",
    renderFn: () => (
      <LimitedWidthContentContainer>
        <ScaleExercisesPage />
      </LimitedWidthContentContainer>
    )
  },
  {
    path: "/scale-viewer",
    title: "Scale Viewer - Falsetto",
    renderFn: () => (
      <LimitedWidthContentContainer>
        <ScaleViewer renderAllScaleShapes={false} />
      </LimitedWidthContentContainer>
    )
  },
  {
    path: "/chord-exercises",
    title: "Chord Exercises - Falsetto",
    renderFn: () => (
      <LimitedWidthContentContainer>
        <ChordExercisesPage />
      </LimitedWidthContentContainer>
    )
  },
  {
    path: "/chord-viewer",
    title: "Chord Viewer - Falsetto",
    renderFn: () => (
      <LimitedWidthContentContainer>
        <ChordViewer />
      </LimitedWidthContentContainer>
    )
  },
  {
    path: "/metronome",
    title: "Metronome - Falsetto",
    renderFn: () => (
      <LimitedWidthContentContainer>
        <Metronome />
      </LimitedWidthContentContainer>
    )
  },
  {
    path: "/diatonic-chord-player",
    title: "Diatonic Chord Player - Falsetto",
    renderFn: () => (
      <LimitedWidthContentContainer>
        <DiatonicChordPlayer />
      </LimitedWidthContentContainer>
    )
  },
    {
      path: "/interval-chord-scale-finder",
      title: "Interval/Chord/Scale Finder - Falsetto",
      renderFn: () => (
        <LimitedWidthContentContainer>
          <IntervalChordScaleFinder />
        </LimitedWidthContentContainer>
      )
    },
  {
    path: "/tuner",
    title: "Tuner - Falsetto",
    renderFn: () => (
      <LimitedWidthContentContainer>
        <Tuner />
      </LimitedWidthContentContainer>
    )
  },
  {
    path: "/rhythm-tapper",
    title: "Rhythm Tapper - Falsetto",
    renderFn: () => (
      <LimitedWidthContentContainer>
        <RhythmTapper />
      </LimitedWidthContentContainer>
    )
  },
  {
    path: "/learn-guitar-notes-in-10-steps",
    title: "Learn the Guitar Notes in 10 Easy Steps - Falsetto",
    renderFn: () => (
      <LimitedWidthContentContainer>
        <GuitarNotesLesson />
      </LimitedWidthContentContainer>
    )
  },
  {
    path: "/learn-guitar-scales",
    title: "Learn the Guitar Scales - Falsetto",
    renderFn: () => (
      <LimitedWidthContentContainer>
        <GuitarScalesLesson />
      </LimitedWidthContentContainer>
    )
  },
] as Array<IRouteData>)
  .concat(
    flashCardSets.map(fcs => ({
      path: fcs.route,
      title: `${fcs.name} - Falsetto`,
      renderFn: () => (
        <LimitedWidthContentContainer style={{ height: "100%" }}>
          {createStudyFlashCardSetComponent(fcs, /*isEmbedded:*/ false, /*hideMoreInfoUri:*/ false)}
        </LimitedWidthContentContainer>
      )
    } as IRouteData))
  )
  .concat([
    {
      path: "/scale/:scaleId",
      renderFn: (props: any) => (
        <ScaleRoute routeParams={props.match.params} renderRoute={scale => {
          const scaleName = `${getPitchUriComponent(scale.rootPitch, /*includeOctaveNumber*/ false)} ${scale.type.name}`;
          const slideGroups = createScaleMasteryLessonSlideGroups(scale);

          return (
            <DocumentTitle title={`${scaleName} Scale - Falsetto`}>
              <PianoTheory slideGroups={slideGroups} />
            </DocumentTitle>
          );
        }} />
      )
    },
    
    {
      path: "/scale/:scaleId/lesson",
      renderFn: (props: any) => (
        <ScaleRoute routeParams={props.match.params} renderRoute={scale => {
          const scaleName = `${getPitchUriComponent(scale.rootPitch, /*includeOctaveNumber*/ false)} ${scale.type.name}`;
          const slideGroups = createScaleMasteryLessonSlideGroups(scale);

          return (
            <DocumentTitle title={`${scaleName} Scale Mastery - Falsetto`}>
              <PianoTheory slideGroups={slideGroups} />
            </DocumentTitle>
          );
        }} />
      )
    },
    
    {
      path: "/scale/:scaleId/degrees-exercise",
      renderFn: (props: any) => (
        <ScaleRoute routeParams={props.match.params} renderRoute={scale => {
          const flashCardSet = PianoScaleDegrees.createFlashCardSet(scale);

          return renderStudyFlashCardSetComponent(flashCardSet);
        }} />
      )
    }
  ])
  .concat([3, 4]
    .map(numChordPitches => {
      const path = `/scale/:scaleId/diatonic-${numChordPitches}-note-chords-exercise`;

      return ({
        path: path,
        renderFn: (props: any) => (
          <ScaleRoute routeParams={props.match.params} renderRoute={scale => {
            const flashCardSet = PianoDiatonicChords.createFlashCardSet(scale, numChordPitches);

            return renderStudyFlashCardSetComponent(flashCardSet);
          }} />
        )
      } as IRouteData);
    })
  )
  .concat([
    
    {
      path: "/chord/:chordId",
      renderFn: (props: any) => (
        <LimitedWidthContentContainer>
          <ChordRoute routeParams={props.match.params} renderRoute={chord => {
            const chordName = `${getPitchUriComponent(chord.rootPitch, /*includeOctaveNumber*/ false)} ${getChordTypeUriComponent(chord.type)}`;

            return (
              <DocumentTitle title={`${chordName} Chord - Falsetto`}>
                <ChordPage chord={chord} />
              </DocumentTitle>
            );
          }} />
        </LimitedWidthContentContainer>
      )
    },

    {
      path: "/chord/:chordType/lesson",
      renderFn: (props: any) => (
        <ChordTypeRoute routeParams={props.match.params} renderRoute={chordType => {
          const slideGroups = createChordTypeMasteryLessonSlideGroups(chordType);
          const chordTypeName = getChordTypeUriComponent(chordType);

          return (
            <DocumentTitle title={`${chordTypeName} Chord Mastery - Falsetto`}>
              <PianoTheory slideGroups={slideGroups} />
            </DocumentTitle>
          );
        }} />
      )
    }
  ])
  .concat([
    {
      key: "/page-not-found",
      isPathExact: false,
      title: "Not Found - Falsetto",
      renderFn: () => (
        <PageNotFoundView />
      )
    }
  ]);

export interface IRoutesViewProps {}

export interface IRoutesViewState {}

export class RoutesView extends React.Component<IRoutesViewProps, IRoutesViewState> {
  public constructor(props: IRoutesViewProps) {
    super(props);
    this.state = {};
  }
  
  public render(): JSX.Element | null {
    if (!this.cachedRenderedRoutes) {
      this.cachedRenderedRoutes = routes
        .map(renderRoute);
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
}