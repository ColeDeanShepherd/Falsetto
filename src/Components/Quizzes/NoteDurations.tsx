import * as React from "react";
import * as Vex from "vexflow";

import * as Utils from "../../Utils";
import * as FlashCardUtils from "../../Components/Quizzes/Utils";
import { FlashCard } from "../../FlashCard";
import { VexFlowComponent } from "../VexFlowComponent";
import { FlashCardGroup } from "../../FlashCardGroup";

const width = 100;
const height = 100;

export function createFlashCardGroup(): FlashCardGroup {
  const flashCardGroup = new FlashCardGroup("Note Durations", createFlashCards());
  flashCardGroup.initialSelectedFlashCardIndices = Utils.range(0, 4).concat(Utils.range(8, 12));
  flashCardGroup.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;

  return flashCardGroup;
}
export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns(
      () => (
        <VexFlowComponent
          width={width} height={height}
          vexFlowRender={vexFlowRender.bind(null, "w", [""])}
        />
      ),
      "Whole Note - 4 beats"
    ),
    FlashCard.fromRenderFns(
      () => (
        <VexFlowComponent
          width={width} height={height}
          vexFlowRender={vexFlowRender.bind(null, "h", ["hr"])}
        />
      ),
      "Half Note - 2 beats"
    ),
    FlashCard.fromRenderFns(
      () => (
        <VexFlowComponent
          width={width} height={height}
          vexFlowRender={vexFlowRender.bind(null, "q", ["qr", "hr"])}
        />
      ),
      "Quarter Note - 1 beat"
    ),
    FlashCard.fromRenderFns(
      () => (
        <VexFlowComponent
          width={width} height={height}
          vexFlowRender={vexFlowRender.bind(null, "8", ["8r", "qr", "hr"])}
        />
      ),
      "Eighth Note - 1/2 beats"
    ),
    FlashCard.fromRenderFns(
      () => (
        <VexFlowComponent
          width={width} height={height}
          vexFlowRender={vexFlowRender.bind(null, "16", ["16r", "8r", "qr", "hr"])}
        />
      ),
      "Sixteenth Note - 1/4 beats"
    ),
    FlashCard.fromRenderFns(
      () => (
        <VexFlowComponent
          width={width} height={height}
          vexFlowRender={vexFlowRender.bind(null, "32", ["32r", "16r", "8r", "qr", "hr"])}
        />
      ),
      "32nd Note - 1/8 beats"
    ),
    FlashCard.fromRenderFns(
      () => (
        <VexFlowComponent
          width={width} height={height}
          vexFlowRender={vexFlowRender.bind(null, "64", ["64r", "32r", "16r", "8r", "qr", "hr"])}
        />
      ),
      "64th Note - 1/16 beats"
    ),
    FlashCard.fromRenderFns(
      () => (
        <VexFlowComponent
          width={width} height={height}
          vexFlowRender={vexFlowRender.bind(null, "128", ["128r", "64r", "32r", "16r", "8r", "qr", "hr"])}
        />
      ),
      "128th Note - 1/32 beats"
    ),
    FlashCard.fromRenderFns(
      () => (
        <VexFlowComponent
          width={width} height={height}
          vexFlowRender={vexFlowRender.bind(null, "wr", [""])}
        />
      ),
      "Whole Rest - 4 beats"
    ),
    FlashCard.fromRenderFns(
      () => (
        <VexFlowComponent
          width={width} height={height}
          vexFlowRender={vexFlowRender.bind(null, "hr", ["hr"])}
        />
      ),
      "Half Rest - 2 beats"
    ),
    FlashCard.fromRenderFns(
      () => (
        <VexFlowComponent
          width={width} height={height}
          vexFlowRender={vexFlowRender.bind(null, "qr", ["qr", "hr"])}
        />
      ),
      "Quarter Rest - 1 beat"
    ),
    FlashCard.fromRenderFns(
      () => (
        <VexFlowComponent
          width={width} height={height}
          vexFlowRender={vexFlowRender.bind(null, "8r", ["8r", "qr", "hr"])}
        />
      ),
      "Eighth Rest - 1/2 beats"
    ),
    FlashCard.fromRenderFns(
      () => (
        <VexFlowComponent
          width={width} height={height}
          vexFlowRender={vexFlowRender.bind(null, "16r", ["16r", "8r", "qr", "hr"])}
        />
      ),
      "Sixteenth Rest - 1/4 beats"
    ),
    FlashCard.fromRenderFns(
      () => (
        <VexFlowComponent
          width={width} height={height}
          vexFlowRender={vexFlowRender.bind(null, "32r", ["32r", "16r", "8r", "qr", "hr"])}
        />
      ),
      "32nd Rest - 1/8 beats"
    ),
    FlashCard.fromRenderFns(
      () => (
        <VexFlowComponent
          width={width} height={height}
          vexFlowRender={vexFlowRender.bind(null, "64r", ["64r", "32r", "16r", "8r", "qr", "hr"])}
        />
      ),
      "64th Rest - 1/16 beats"
    ),
    FlashCard.fromRenderFns(
      () => (
        <VexFlowComponent
          width={width} height={height}
          vexFlowRender={vexFlowRender.bind(null, "128r", ["128r", "64r", "32r", "16r", "8r", "qr", "hr"])}
        />
      ),
      "128th Rest - 1/32 beats"
    )
  ];
}
function vexFlowRender(noteDurationString: string, restDurationStrings: string[], context: Vex.IRenderContext) {
  context
    .setFont("Arial", 10)
    .setBackgroundFillStyle("#eed");

  const stave = new Vex.Flow.Stave(0, 0, width);
  stave.setContext(context).draw();
  
  const notes = [
    new Vex.Flow.StaveNote({
      clef: "treble",
      keys: ["b/4"],
      duration: noteDurationString
    })
  ];

  notes[0].setXShift(25);

  if (restDurationStrings) {
    for (const durationString of restDurationStrings) {
      const restNote = new Vex.Flow.StaveNote({
        clef: "treble",
        keys: ["b/4"],
        duration: durationString
      });

      notes.push(restNote);

      restNote.setXShift(390);
    }
  }
  
  const voice = new Vex.Flow.Voice({num_beats: 4, beat_value: 4});
  voice.addTickables(notes);
  
  const formatter = new Vex.Flow.Formatter();
  formatter.joinVoices([voice]).format([voice], width);
  
  voice.draw(context, stave);
}