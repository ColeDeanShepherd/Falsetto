import * as React from "react";
import { CardContent, Card, Typography } from "@material-ui/core";
import App from './App';

import * as GuitarNotes from "./Quizzes/GuitarNotes";
import * as PianoNotes from "./Quizzes/PianoNotes";
import * as PianoIntervals from "./Quizzes/PianoIntervals";
import * as GuitarIntervals from "./Quizzes/GuitarIntervals";
import * as IntervalEarTraining from "./Quizzes/IntervalEarTraining";
import * as ScaleNotes from "./Quizzes/ScaleNotes";
import * as PianoScales from "./Quizzes/PianoScales";
import * as GuitarScales from "./Quizzes/GuitarScales";
import * as ScaleEarTraining from "./Quizzes/ScaleEarTraining";
import * as PianoChords from "./Quizzes/PianoChords";
import * as GuitarChords from "./Quizzes/GuitarChords";

export class HomePage extends React.Component<{}, {}> {
  public render(): JSX.Element {
    return (
      <Card>
        <CardContent>
          <p>Falsetto is a collection of free, interactive music theory exercises. Get started by clicking one of the exercises below, or in the menu!</p>
          <ul style={{ listStyleType: "none", margin: 0, padding: 0 }}>
            <li>{App.instance.renderFlashCardGroupLink(PianoNotes.createFlashCardGroup())}</li>
            <li>{App.instance.renderFlashCardGroupLink(GuitarNotes.createFlashCardGroup())}</li>
            <li>{App.instance.renderFlashCardGroupLink(PianoIntervals.createFlashCardGroup())}</li>
            <li>{App.instance.renderFlashCardGroupLink(GuitarIntervals.createFlashCardGroup())}</li>
            <li>{App.instance.renderFlashCardGroupLink(IntervalEarTraining.createFlashCardGroup())}</li>
            <li>{App.instance.renderFlashCardGroupLink(ScaleNotes.createFlashCardGroup())}</li>
            <li>{App.instance.renderFlashCardGroupLink(PianoScales.createFlashCardGroup())}</li>
            <li>{App.instance.renderFlashCardGroupLink(GuitarScales.createFlashCardGroup())}</li>
            <li>{App.instance.renderFlashCardGroupLink(ScaleEarTraining.createFlashCardGroup())}</li>
            <li>{App.instance.renderFlashCardGroupLink(PianoChords.createFlashCardGroup())}</li>
            <li>{App.instance.renderFlashCardGroupLink(GuitarChords.createFlashCardGroup())}</li>
            <li><a href="" onClick={event => this.onMoreExercisesClick(event)}>More exercises...</a></li>
          </ul>
        </CardContent>
      </Card>
    );
  }

  private onMoreExercisesClick(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    App.instance.setMenuIsVisibleOnMobile(true);

    event.preventDefault();
    event.stopPropagation();
  }
}