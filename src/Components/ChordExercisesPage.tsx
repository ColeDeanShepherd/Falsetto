import * as React from "react";
import { Typography } from "@material-ui/core";
import { NavLinkView } from "../NavLinkView";

import * as ChordNotes from "./Quizzes/Chords/ChordNotes";
import * as ChordFamilies from "./Quizzes/Chords/ChordFamilies";
import * as AvailableChordTensions from "./Quizzes/Chords/AvailableChordTensions";
import * as DiatonicTriads from "./Quizzes/Chords/DiatonicTriads";
import * as DiatonicSeventhChords from "./Quizzes/Chords/DiatonicSeventhChords";
import * as RandomChordGenerator from "./Tools/RandomChordGenerator";
import * as PianoChords from "./Quizzes/Chords/PianoChords";
import * as GuitarChords from "./Quizzes/Chords/GuitarChords";
import * as SheetMusicChordRecognition from "./Quizzes/Sheet Music/SheetMusicChordRecognition";
import * as ChordEarTraining from "./Quizzes/Chords/ChordEarTraining";

import { ChordTypeGroup } from '../lib/TheoryLib/ChordTypeGroup';
import { ChordType, getUriComponent } from "../lib/TheoryLib/ChordType";
import { ChordTypeSelectView } from "./Utils/ChordTypeSelectView";
import { Card } from "../ui/Card/Card";

export interface IChordExercisesProps {}

export interface IChordExercisesState {
  chordTypeGroup: ChordTypeGroup,
  chordType: ChordType
}

export class ChordExercisesPage extends React.Component<IChordExercisesProps, IChordExercisesState> {
  public constructor(props: IChordExercisesProps) {
    super(props);

    const chordTypeGroup = ChordType.Groups[0];
    const chordType = chordTypeGroup.chordTypes[0];

    this.state = {
      chordTypeGroup: chordTypeGroup,
      chordType: chordType
    };
  }

  public render(): JSX.Element {
    const { chordType, chordTypeGroup } = this.state;

    return (
      <Card>
        <Typography gutterBottom={true} variant="h5" component="h2">
          Chord Exercises
        </Typography>

        <h3>Per-Chord Exercises</h3>

        <div style={{textAlign: "center"}}>
          <ChordTypeSelectView
            chordTypeGroups={ChordType.Groups}
            value={[chordTypeGroup, chordType]}
            onChange={newValue => this.onChordTypeChange(newValue)} />
            
          <p style={{fontSize: "1.5em"}}>{chordType.name} Chord Lessons</p>
        </div>

        <div>
          <NavLinkView to={`/chord/${getUriComponent(chordType)}/lesson`}>
            {chordType.name} Chords Lesson
          </NavLinkView>
        </div>
        
        <h3>Non-Chord-Specific Exercises</h3>
        <div><NavLinkView to={ChordFamilies.flashCardSet.route}>{ChordFamilies.flashCardSet.name}</NavLinkView></div>
        <div><NavLinkView to={ChordNotes.flashCardSet.route}>{ChordNotes.flashCardSet.name}</NavLinkView></div>
        <div><NavLinkView to={AvailableChordTensions.flashCardSet.route}>{AvailableChordTensions.flashCardSet.name}</NavLinkView></div>
        <div><NavLinkView to={DiatonicTriads.flashCardSet.route}>{DiatonicTriads.flashCardSet.name}</NavLinkView></div>
        <div><NavLinkView to={DiatonicSeventhChords.flashCardSet.route}>{DiatonicSeventhChords.flashCardSet.name}</NavLinkView></div>
        <div><NavLinkView to={SheetMusicChordRecognition.flashCardSet.route}>{SheetMusicChordRecognition.flashCardSet.name}</NavLinkView></div>
        <div><NavLinkView to={PianoChords.flashCardSet.route}>{PianoChords.flashCardSet.name}</NavLinkView></div>
        <div><NavLinkView to={GuitarChords.flashCardSet.route}>{GuitarChords.flashCardSet.name}</NavLinkView></div>
        <div><NavLinkView to={ChordEarTraining.flashCardSet.route}>{ChordEarTraining.flashCardSet.name}</NavLinkView></div>
        <div><NavLinkView to={RandomChordGenerator.flashCardSet.route}>{RandomChordGenerator.flashCardSet.name}</NavLinkView></div>
      </Card>
    );
  }

  private onChordTypeChange(newValue: [ChordTypeGroup, ChordType]) {
    const [ newChordTypeGroup, newChordType ] = newValue;

    this.setState({
      chordTypeGroup: newChordTypeGroup,
      chordType: newChordType
    });
  }
}