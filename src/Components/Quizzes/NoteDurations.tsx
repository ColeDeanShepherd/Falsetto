import * as React from 'react';
import * as Vex from 'vexflow';

import { FlashCard } from "../../FlashCard";
import { VexFlowComponent } from "../VexFlowComponent";

const width = 100;
const height = 100;

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