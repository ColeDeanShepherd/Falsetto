import * as React from "react";
import { NavLinkView } from "../ui/NavLinkView";

import * as ScaleDegreeNames from "./Quizzes/Scales/ScaleDegreeNames";
import * as ScaleNotes from "./Quizzes/Scales/ScaleFormulas";
import * as PianoScales from "./Quizzes/Scales/PianoScales";
import * as GuitarScales from "./Quizzes/Scales/GuitarScales";
import * as ScaleDegreeModes from "./Quizzes/Scales/ScaleDegreeModes";
import * as ScaleChords from "./Quizzes/Chords/ScaleChords";
import * as ScaleEarTraining from "./Quizzes/Scales/ScaleEarTraining";
import { Scale, ScaleTypeGroup, ScaleType, getUriComponent } from '../lib/TheoryLib/Scale';
import { ScaleTypeSelect } from "./Utils/ScaleTypeSelect";
import { getValidKeyPitches } from '../lib/TheoryLib/Key';
import { isDevelopment } from '../Config';
import { flattenArrays } from '../lib/Core/ArrayUtils';
import { Card } from "../ui/Card/Card";

export interface IScaleExercisesProps {}

export interface IScaleExercisesState {
  scaleTypeGroup: ScaleTypeGroup,
  scaleType: ScaleType
}

export class ScaleExercisesPage extends React.Component<IScaleExercisesProps, IScaleExercisesState> {
  public constructor(props: IScaleExercisesProps) {
    super(props);

    const scaleTypeGroup = ScaleType.Groups[0];
    const scaleType = scaleTypeGroup.scaleTypes[0];

    this.state = {
      scaleTypeGroup: scaleTypeGroup,
      scaleType: scaleType
    };
  }

  public render(): JSX.Element {
    const { scaleType, scaleTypeGroup } = this.state;

    const validKeyPitches = getValidKeyPitches(/*preferredOctaveNumber*/ 4);
    const scales = validKeyPitches
      .map(keyPitch => new Scale(scaleType, keyPitch));

    return (
      <Card>
        <h2 className="h5 margin-bottom">
          Scale Exercises
        </h2>

        <h3>Per-Scale Exercises</h3>

        <div style={{textAlign: "center"}}>
          <ScaleTypeSelect
            scaleTypeGroups={ScaleType.Groups}
            value={[scaleTypeGroup, scaleType]}
            onChange={newValue => this.onScaleTypeChange(newValue)} />
            
          <p style={{fontSize: "1.5em"}}>{scaleType.name} Scale Lessons</p>
        </div>

        <div>
          {scales.map(scale => (
            <div>
              <NavLinkView to={`/scale/${getUriComponent(scale)}/lesson/introduction`}>{scale.rootPitch.toString(/*includeOctaveNumber*/ false)} {scale.type.name} Lesson</NavLinkView>
            </div>
          ))}
        </div>
        
        <h3>Non-Scale-Specific Exercises</h3>
        <div><NavLinkView to={ScaleDegreeNames.flashCardSet.route}>{ScaleDegreeNames.flashCardSet.name}</NavLinkView></div>
        <div><NavLinkView to={ScaleNotes.flashCardSet.route}>{ScaleNotes.flashCardSet.name}</NavLinkView></div>
        <div><NavLinkView to={PianoScales.flashCardSet.route}>{PianoScales.flashCardSet.name}</NavLinkView></div>
        <div><NavLinkView to={GuitarScales.flashCardSet.route}>{GuitarScales.flashCardSet.name}</NavLinkView></div>
        <div><NavLinkView to={ScaleDegreeModes.flashCardSet.route}>{ScaleDegreeModes.flashCardSet.name}</NavLinkView></div>
        <div><NavLinkView to={ScaleChords.flashCardSet.route}>{ScaleChords.flashCardSet.name}</NavLinkView></div>
        <div><NavLinkView to={ScaleEarTraining.flashCardSet.route}>{ScaleEarTraining.flashCardSet.name}</NavLinkView></div>
      </Card>
    );
  }

  private onScaleTypeChange(newValue: [ScaleTypeGroup, ScaleType]) {
    const [ newScaleTypeGroup, newScaleType ] = newValue;

    this.setState({
      scaleTypeGroup: newScaleTypeGroup,
      scaleType: newScaleType
    });
  }
}

// TODO: remove
if (isDevelopment()) {
  var failedScaleTypeNames = new Set<string>();

  flattenArrays<ScaleType>(ScaleType.Groups.map(g => g.scaleTypes))
    .map(st => getValidKeyPitches(4)
      .map(p => [3, 4]
        .map(numChordPitches => {
          const scale = new Scale(st, p);

          try {
            scale.getDiatonicChords(numChordPitches)
          } catch {
            failedScaleTypeNames.add(scale.type.name);
          }
        }))
    );
  
  for (const stn of failedScaleTypeNames) {
    console.error(stn);
  }
}