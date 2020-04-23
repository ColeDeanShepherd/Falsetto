import * as React from "react";
import { CardContent, Card, Typography } from "@material-ui/core";
import { NavLinkView } from "../NavLinkView";

import * as ScaleDegreeNames from "./Quizzes/Scales/ScaleDegreeNames";
import * as ScaleNotes from "./Quizzes/Scales/ScaleFormulas";
import * as PianoScales from "./Quizzes/Scales/PianoScales";
import * as GuitarScales from "./Quizzes/Scales/GuitarScales";
import * as ScaleDegreeModes from "./Quizzes/Scales/ScaleDegreeModes";
import * as ScaleChords from "./Quizzes/Chords/ScaleChords";
import * as ScaleEarTraining from "./Quizzes/Scales/ScaleEarTraining";
import * as PianoScaleDegrees from "./Quizzes/Scales/PianoScaleDegrees";
import * as PianoDiatonicChords from "./Quizzes/Chords/PianoDiatonicChords";
import { ScaleTypeGroup, ScaleType, Scale } from '../lib/TheoryLib/Scale';
import { Pitch } from "../lib/TheoryLib/Pitch";
import { PitchLetter } from "../lib/TheoryLib/PitchLetter";
import { ScaleSelect } from "./Utils/ScaleSelect";
import { FlashCardSet } from "../FlashCardSet";

export interface IScaleExercisesProps {}

export interface IScaleExercisesState {
  scaleTypeGroup: ScaleTypeGroup,
  scale: Scale,
  flashCardSets: Array<FlashCardSet>
}

export class ScaleExercisesPage extends React.Component<IScaleExercisesProps, IScaleExercisesState> {
  public constructor(props: IScaleExercisesProps) {
    super(props);

    const scaleTypeGroup = ScaleType.Groups[0];
    const scale = new Scale(scaleTypeGroup.scaleTypes[0], new Pitch(PitchLetter.C, 0, 4));

    this.state = {
      scaleTypeGroup: scaleTypeGroup,
      scale: scale,
      flashCardSets: this.createFlashCardSetsForScale(scale)
    };
  }

  public render(): JSX.Element {
    return (
      <Card>
        <CardContent>
          <Typography gutterBottom={true} variant="h5" component="h2">
            Scale Exercises
          </Typography>

          <h3>All Scales</h3>
          <div><NavLinkView to={ScaleDegreeNames.flashCardSet.route}>{ScaleDegreeNames.flashCardSet.name}</NavLinkView></div>
          <div><NavLinkView to={ScaleNotes.flashCardSet.route}>{ScaleNotes.flashCardSet.name}</NavLinkView></div>
          <div><NavLinkView to={PianoScales.flashCardSet.route}>{PianoScales.flashCardSet.name}</NavLinkView></div>
          <div><NavLinkView to={GuitarScales.flashCardSet.route}>{GuitarScales.flashCardSet.name}</NavLinkView></div>
          <div><NavLinkView to={ScaleDegreeModes.flashCardSet.route}>{ScaleDegreeModes.flashCardSet.name}</NavLinkView></div>
          <div><NavLinkView to={ScaleChords.flashCardSet.route}>{ScaleChords.flashCardSet.name}</NavLinkView></div>
          <div><NavLinkView to={ScaleEarTraining.flashCardSet.route}>{ScaleEarTraining.flashCardSet.name}</NavLinkView></div>

          <h3>Per-Scale Exercises</h3>
          <div style={{textAlign: "center"}}>
            <ScaleSelect
              scaleTypeGroups={ScaleType.Groups}
              value={[this.state.scaleTypeGroup, this.state.scale]}
              onChange={newValue => this.onScaleChange(newValue)} />
            <p style={{fontSize: "1.5em"}}>{this.state.scale.rootPitch.toString(false)} {this.state.scale.type.name}</p>
          </div>
          <div>
            {this.state.flashCardSets
              .map(fcs => (
                <div>
                  <NavLinkView to={fcs.route}>{fcs.name}</NavLinkView>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  private createFlashCardSetsForScale(scale: Scale): Array<FlashCardSet> {
    return [
      PianoScaleDegrees.createFlashCardSet(scale),
      PianoDiatonicChords.createFlashCardSet(scale, /*numChordPitches*/ 3)
    ];
  }

  private onScaleChange(newValue: [ScaleTypeGroup, Scale]) {
    const [ newScaleTypeGroup, newScale ] = newValue;

    this.setState({
      scaleTypeGroup: newScaleTypeGroup,
      scale: newScale,
      flashCardSets: this.createFlashCardSetsForScale(newScale)
    });
  }
}