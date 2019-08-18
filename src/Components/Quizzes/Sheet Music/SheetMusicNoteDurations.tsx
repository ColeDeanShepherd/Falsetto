import * as React from "react";
import * as Vex from "vexflow";

import * as FlashCardUtils from "../Utils";
import { FlashCard, FlashCardId } from "../../../FlashCard";
import { VexFlowComponent } from "../../Utils/VexFlowComponent";
import { FlashCardSet, FlashCardStudySessionInfo } from "../../../FlashCardSet";

const flashCardSetId = "noteDurationSymbols";

const width = 100;
const height = 65;

export function renderAnswerSelect(
  info: FlashCardStudySessionInfo
): JSX.Element {
  return FlashCardUtils.renderMultiRowDistinctFlashCardSideAnswerSelect(info, [5, 5]);
}

function configDataToEnabledFlashCardIds(
  flashCardSet: FlashCardSet, flashCards: Array<FlashCard>, configData: any
): Array<FlashCardId> {
  return flashCards
    .filter((_, i) => (i <= 4) || ((i >= 8) && (i <= 12)))
    .map(fc => fc.id);
}

export function createFlashCardSet(): FlashCardSet {
  const flashCardSet = new FlashCardSet(flashCardSetId, "Sheet Music Note Durations", createFlashCards);
  flashCardSet.configDataToEnabledFlashCardIds = configDataToEnabledFlashCardIds;
  flashCardSet.renderAnswerSelect = renderAnswerSelect;
  flashCardSet.containerHeight = "80px";
  flashCardSet.moreInfoUri = "http://www.thejazzpianosite.com/jazz-piano-lessons/the-basics/overview/";

  return flashCardSet;
}
export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "w" }),
      () => (
        <VexFlowComponent
          width={width} height={height}
          vexFlowRender={vexFlowRender.bind(null, "w", [])}
        />
      ),
      "Whole Note"
    ),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "h" }),
      () => (
        <VexFlowComponent
          width={width} height={height}
          vexFlowRender={vexFlowRender.bind(null, "h", ["hr"])}
        />
      ),
      "Half Note"
    ),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "q" }),
      () => (
        <VexFlowComponent
          width={width} height={height}
          vexFlowRender={vexFlowRender.bind(null, "q", ["qr", "hr"])}
        />
      ),
      "Quarter Note"
    ),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "8" }),
      () => (
        <VexFlowComponent
          width={width} height={height}
          vexFlowRender={vexFlowRender.bind(null, "8", ["8r", "qr", "hr"])}
        />
      ),
      "Eighth Note"
    ),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "16" }),
      () => (
        <VexFlowComponent
          width={width} height={height}
          vexFlowRender={vexFlowRender.bind(null, "16", ["16r", "8r", "qr", "hr"])}
        />
      ),
      "Sixteenth Note"
    ),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "32" }),
      () => (
        <VexFlowComponent
          width={width} height={height}
          vexFlowRender={vexFlowRender.bind(null, "32", ["32r", "16r", "8r", "qr", "hr"])}
        />
      ),
      "32nd Note"
    ),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "64" }),
      () => (
        <VexFlowComponent
          width={width} height={height}
          vexFlowRender={vexFlowRender.bind(null, "64", ["64r", "32r", "16r", "8r", "qr", "hr"])}
        />
      ),
      "64th Note"
    ),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "128" }),
      () => (
        <VexFlowComponent
          width={width} height={height}
          vexFlowRender={vexFlowRender.bind(null, "128", ["128r", "64r", "32r", "16r", "8r", "qr", "hr"])}
        />
      ),
      "128th Note"
    ),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "wr" }),
      () => (
        <VexFlowComponent
          width={width} height={height}
          vexFlowRender={vexFlowRender.bind(null, "wr", [])}
        />
      ),
      "Whole Rest"
    ),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "h4" }),
      () => (
        <VexFlowComponent
          width={width} height={height}
          vexFlowRender={vexFlowRender.bind(null, "hr", ["hr"])}
        />
      ),
      "Half Rest"
    ),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "qr" }),
      () => (
        <VexFlowComponent
          width={width} height={height}
          vexFlowRender={vexFlowRender.bind(null, "qr", ["qr", "hr"])}
        />
      ),
      "Quarter Rest"
    ),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "8r" }),
      () => (
        <VexFlowComponent
          width={width} height={height}
          vexFlowRender={vexFlowRender.bind(null, "8r", ["8r", "qr", "hr"])}
        />
      ),
      "Eighth Rest"
    ),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "16r" }),
      () => (
        <VexFlowComponent
          width={width} height={height}
          vexFlowRender={vexFlowRender.bind(null, "16r", ["16r", "8r", "qr", "hr"])}
        />
      ),
      "Sixteenth Rest"
    ),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "32r" }),
      () => (
        <VexFlowComponent
          width={width} height={height}
          vexFlowRender={vexFlowRender.bind(null, "32r", ["32r", "16r", "8r", "qr", "hr"])}
        />
      ),
      "32nd Rest"
    ),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "64r" }),
      () => (
        <VexFlowComponent
          width={width} height={height}
          vexFlowRender={vexFlowRender.bind(null, "64r", ["64r", "32r", "16r", "8r", "qr", "hr"])}
        />
      ),
      "64th Rest"
    ),
    FlashCard.fromRenderFns(
      JSON.stringify({ set: flashCardSetId, id: "128r" }),
      () => (
        <VexFlowComponent
          width={width} height={height}
          vexFlowRender={vexFlowRender.bind(null, "128r", ["128r", "64r", "32r", "16r", "8r", "qr", "hr"])}
        />
      ),
      "128th Rest"
    )
  ];
}
function vexFlowRender(noteDurationString: string, restDurationStrings: string[], context: Vex.IRenderContext) {
  context
    .setFont("Arial", 10)
    .setBackgroundFillStyle("#eed");

  const stave = new Vex.Flow.Stave(0, -20, width);
  stave.setContext(context).draw();
  
  const notes = [
    new Vex.Flow.StaveNote({
      clef: "treble",
      keys: ["b/4"],
      duration: noteDurationString
    })
  ];

  notes[0].setXShift(25);

  for (const durationString of restDurationStrings) {
    const restNote = new Vex.Flow.StaveNote({
      clef: "treble",
      keys: ["b/4"],
      duration: durationString
    });

    notes.push(restNote);

    // Move the rest out of view.
    restNote.setXShift(390);
  }
  
  const voice = new Vex.Flow.Voice({num_beats: 4, beat_value: 4});
  voice.addTickables(notes);
  
  const formatter = new Vex.Flow.Formatter();
  formatter.joinVoices([voice]).format([voice], width);
  
  voice.draw(context, stave);
}