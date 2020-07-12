import * as React from "react";

import { createStudyFlashCardSetComponent } from "../StudyFlashCards/View";

import { Slide, SlideGroup } from "../Slideshow/Slideshow";
import { NoteText } from "../Utils/NoteText";

import * as NoteSinging from "../Quizzes/Notes/NoteSinging";
import * as IntervalSinging from "../Quizzes/Intervals/IntervalSinging";

const studyFlashCardsViewRenderCard = false;
const exerciseContainerStyle: any = { height: "100%" };

// #region Slides

export const earTrainingCourseSlideGroups = [
  new SlideGroup(
    "Introduction & Setup",
    "introduction",
    [
      new Slide("introduction", () => (
        <div>
          <div>
            <h1 style={{ marginBottom: "1em" }}>Understanding the Piano Keyboard</h1>
            <h2 style={{ marginBottom: "1em" }}>Section 1: Introduction &amp; Setup</h2>
            <p>Welcome to Falsetto's interactive course "Ear Training!"</p>
            <p>This is an interactive course designed to train your ear and mind to recognize and produce music theory concepts.</p>
            <p>This course is designed to be viewed on tablets and computer monitors, not on mobile phones due to screen space limitations.</p>
            <p>Without further ado, let's get started!</p>
            <p>Press the "<i className="material-icons" style={{ verticalAlign: "bottom" }}>keyboard_arrow_right</i>" on the right of this page, or press the right arrow key on your computer keyboard, to move to the next slide where we will set up your MIDI piano keyboard, if you have one.</p>
          </div>
        </div>
      )),
      new Slide("setup", () => (
        <div>
          <div>
            <p>TODO: set up mic</p>
          </div>
        </div>
      )),
    ]
  ),
  new SlideGroup(
    "Notes",
    "notes",
    [
      new Slide("introduction", () => (
        <div></div>
      )),
      new Slide("quiz", () => (
        <div style={exerciseContainerStyle}>
          {createStudyFlashCardSetComponent(
            NoteSinging.createFlashCardSet(),
            /*isEmbedded*/ false,
            /*hideMoreInfoUri*/ true,
            /*title*/ "Note Singing Exercise",
            /*style*/ undefined,
            /*enableSettings*/ undefined,
            /*renderCard*/ studyFlashCardsViewRenderCard)}
        </div>
      ))
    ]
  ),
  new SlideGroup(
    "Intervals",
    "intervals",
    [
      new Slide("introduction", () => (
        <div>This is the intervals section.</div>
      )),
      new Slide("quiz", () => (
        <div style={exerciseContainerStyle}>
          {createStudyFlashCardSetComponent(
            IntervalSinging.createFlashCardSet(),
            /*isEmbedded*/ false,
            /*hideMoreInfoUri*/ true,
            /*title*/ "Interval Singing Exercise",
            /*style*/ undefined,
            /*enableSettings*/ undefined,
            /*renderCard*/ studyFlashCardsViewRenderCard)}
        </div>
      )),
    ]
  ),
  new SlideGroup(
    "Scales",
    "scales",
    [
      new Slide("introduction", () => (
        <div></div>
      ))
    ]
  ),
  new SlideGroup(
    "Chords",
    "chords",
    [
      new Slide("introduction", () => (
        <div></div>
      ))
    ]
  ),
  new SlideGroup(
    "Chord Progressions",
    "chord-progressions",
    [
      new Slide("introduction", () => (
        <div></div>
      ))
    ]
  )
];

// #endregion Slides