import * as React from "react";
import { NavLinkView } from "./NavLinkView";

import * as ChordNotes from "../ui/Quizzes/Chords/ChordNotes";
import * as ChordFamilies from "../ui/Quizzes/Chords/ChordFamilies";
import * as AvailableChordTensions from "../ui/Quizzes/Chords/AvailableChordTensions";
import * as DiatonicTriads from "../ui/Quizzes/Chords/DiatonicTriads";
import * as DiatonicSeventhChords from "../ui/Quizzes/Chords/DiatonicSeventhChords";
import * as RandomChordGenerator from "./Tools/RandomChordGenerator";
import * as PianoChords from "../ui/Quizzes/Chords/PianoChords";
import * as GuitarChords from "../ui/Quizzes/Chords/GuitarChords";
import * as SheetMusicChordRecognition from "../ui/Quizzes/Sheet Music/SheetMusicChordRecognition";
import * as ChordEarTraining from "../ui/Quizzes/Chords/ChordEarTraining";

import { ChordTypeGroup } from '../lib/TheoryLib/ChordTypeGroup';
import { ChordType, getUriComponent } from "../lib/TheoryLib/ChordType";
import { Card } from "./Card/Card";
import { ChordTypeGroupSelectView } from "./Utils/ChordTypeGroupSelectView";

export interface IChordExercisesProps {}

export interface IChordExercisesState {
  chordTypeGroup: ChordTypeGroup
}

export class ChordExercisesPage extends React.Component<IChordExercisesProps, IChordExercisesState> {
  public constructor(props: IChordExercisesProps) {
    super(props);

    const chordTypeGroup = ChordType.Groups[0];

    this.state = {
      chordTypeGroup: chordTypeGroup
    };
  }

  public render(): JSX.Element {
    const { chordTypeGroup } = this.state;

    return (
      <Card>
        <h2 className="margin-bottom">
          Chord Mastery
        </h2>

        <p>Pick a chord category &amp;, then click a link below to master a particular chord.</p>

        <div style={{ textAlign: "center" }}>
          <ChordTypeGroupSelectView
            chordTypeGroups={ChordType.Groups}
            value={chordTypeGroup}
            onChange={newValue => this.onChordTypeGroupChange(newValue)} />
        </div>

        <div>
          {chordTypeGroup.chordTypes.map(chordType => (
            <div>
              <NavLinkView to={`/chord/${getUriComponent(chordType)}/lesson/introduction`}>
                {chordType.name} Chords Lesson
              </NavLinkView>
            </div>
          ))}
        </div>
        <br />
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

  private onChordTypeGroupChange(newValue: ChordTypeGroup) {
    this.setState({
      chordTypeGroup: newValue
    });
  }
}