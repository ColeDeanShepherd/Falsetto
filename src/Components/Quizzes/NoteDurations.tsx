import * as React from 'react';
import * as Vex from 'vexflow';

import * as Utils from "src/Utils";
import * as FlashCardUtils from "src/Components/Quizzes/Utils";
import { FlashCard } from "../../FlashCard";
import { VexFlowComponent } from "../VexFlowComponent";
import { FlashCardGroup } from 'src/FlashCardGroup';

const width = 100;
const height = 100;

export function createFlashCardGroup(): FlashCardGroup {
  const flashCardGroup = new FlashCardGroup("Note Durations", createFlashCards());
  flashCardGroup.initialSelectedFlashCardIndices = Utils.range(0, 4);
  flashCardGroup.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;

  return flashCardGroup;
}
export function createFlashCards(): FlashCard[] {
  return [
    new FlashCard(
      () => (
        <VexFlowComponent
          width={width} height={height}
          vexFlowRender={vexFlowRender.bind(null, "w", null)}
        />
      ),
      "Whole Note = 4 beats"
    ),
    new FlashCard(
      () => (
        <VexFlowComponent
          width={width} height={height}
          vexFlowRender={vexFlowRender.bind(null, "h", ["hr"])}
        />
      ),
      "Half Note = 2 beats"
    ),
    new FlashCard(
      () => (
        <VexFlowComponent
          width={width} height={height}
          vexFlowRender={vexFlowRender.bind(null, "q", ["qr", "hr"])}
        />
      ),
      "Quarter Note = 1 beat"
    ),
    new FlashCard(
      () => (
        <VexFlowComponent
          width={width} height={height}
          vexFlowRender={vexFlowRender.bind(null, "8", ["8r", "qr", "hr"])}
        />
      ),
      "Eighth Note = 1/2 beats"
    ),
    new FlashCard(
      () => (
        <VexFlowComponent
          width={width} height={height}
          vexFlowRender={vexFlowRender.bind(null, "16", ["16r", "8r", "qr", "hr"])}
        />
      ),
      "Sixteenth Note = 1/4 beats"
    ),
    new FlashCard(
      () => (
        <VexFlowComponent
          width={width} height={height}
          vexFlowRender={vexFlowRender.bind(null, "32", ["32r", "16r", "8r", "qr", "hr"])}
        />
      ),
      "32nd Note = 1/8 beats"
    ),
    new FlashCard(
      () => (
        <VexFlowComponent
          width={width} height={height}
          vexFlowRender={vexFlowRender.bind(null, "64", ["64r", "32r", "16r", "8r", "qr", "hr"])}
        />
      ),
      "64th Note = 1/16 beats"
    ),
    new FlashCard(
      () => (
        <VexFlowComponent
          width={width} height={height}
          vexFlowRender={vexFlowRender.bind(null, "128", ["128r", "64r", "32r", "16r", "8r", "qr", "hr"])}
        />
      ),
      "128th Note = 1/32 beats"
    )
  ];
}
function vexFlowRender(noteDurationString: string, restDurationStrings: string[], context: Vex.IRenderContext) {
  context
    .setFont("Arial", 10)
    .setBackgroundFillStyle("#eed");

  const stave = new Vex.Flow.Stave(0, 0, width);
  stave.addClef("treble").addTimeSignature("4/4");
  //stave.setContext(context).draw();
  
  const notes = [
    new Vex.Flow.StaveNote({
      clef: "treble",
      keys: ["b/4"],
      duration: noteDurationString
    })
  ];

  notes[0].setXShift(-30);

  if (restDurationStrings) {
    for (const durationString of restDurationStrings) {
      notes.push(
        new Vex.Flow.StaveNote({
          clef: "treble",
          keys: ["b/4"],
          duration: durationString
        })
      );
    }
  }
  
  const voice = new Vex.Flow.Voice({num_beats: 4, beat_value: 4});
  voice.addTickables(notes);
  
  const formatter = new Vex.Flow.Formatter();
  formatter.joinVoices([voice]).format([voice], width);
  
  voice.draw(context, stave);
}