import * as React from "react";
import * as Vex from "vexflow";

import * as FlashCardUtils from "../Utils";
import { createFlashCardId, FlashCard, FlashCardId } from "../../../FlashCard";
import { VexFlowComponent } from "../../Utils/VexFlowComponent";
import { FlashCardSet, FlashCardStudySessionInfo } from "../../../FlashCardSet";
import { Size2D } from '../../../lib/Core/Size2D';

const flashCardSetId = "noteDurationSymbols";

const canvasSize = new Size2D(100, 65);

export function renderAnswerSelect(
  info: FlashCardStudySessionInfo
): JSX.Element {
  return FlashCardUtils.renderMultiRowDistinctFlashCardSideAnswerSelect(info, [5, 5, 5, 5]);
}

function configDataToEnabledFlashCardIds(
  flashCardSet: FlashCardSet, flashCards: Array<FlashCard>, configData: any
): Array<FlashCardId> {
  return flashCards
    .filter((_, i) => (i <= 4) || ((i >= 8) && (i <= 12)))
    .map(fc => fc.id);
}

function createFlashCardSet(): FlashCardSet {
  const flashCardSet = new FlashCardSet(flashCardSetId, "Sheet Music Note Durations", createFlashCards);
  flashCardSet.configDataToEnabledFlashCardIds = configDataToEnabledFlashCardIds;
  flashCardSet.renderAnswerSelect = renderAnswerSelect;
  flashCardSet.moreInfoUri = "http://www.thejazzpianosite.com/jazz-piano-lessons/the-basics/overview/";

  return flashCardSet;
}
export function createFlashCards(): FlashCard[] {
  return [
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "w" }),
      () => (
        <VexFlowComponent
          size={canvasSize}
          vexFlowRender={vexFlowRender.bind(null, "w", [])}
        />
      ),
      "Whole Note"
    ),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "h" }),
      () => (
        <VexFlowComponent
          size={canvasSize}
          vexFlowRender={vexFlowRender.bind(null, "h", ["hr"])}
        />
      ),
      "Half Note"
    ),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "q" }),
      () => (
        <VexFlowComponent
          size={canvasSize}
          vexFlowRender={vexFlowRender.bind(null, "q", ["qr", "hr"])}
        />
      ),
      "Quarter Note"
    ),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "8" }),
      () => (
        <VexFlowComponent
          size={canvasSize}
          vexFlowRender={vexFlowRender.bind(null, "8", ["8r", "qr", "hr"])}
        />
      ),
      "Eighth Note"
    ),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "16" }),
      () => (
        <VexFlowComponent
          size={canvasSize}
          vexFlowRender={vexFlowRender.bind(null, "16", ["16r", "8r", "qr", "hr"])}
        />
      ),
      "Sixteenth Note"
    ),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "32" }),
      () => (
        <VexFlowComponent
          size={canvasSize}
          vexFlowRender={vexFlowRender.bind(null, "32", ["32r", "16r", "8r", "qr", "hr"])}
        />
      ),
      "32nd Note"
    ),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "64" }),
      () => (
        <VexFlowComponent
          size={canvasSize}
          vexFlowRender={vexFlowRender.bind(null, "64", ["64r", "32r", "16r", "8r", "qr", "hr"])}
        />
      ),
      "64th Note"
    ),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "128" }),
      () => (
        <VexFlowComponent
          size={canvasSize}
          vexFlowRender={vexFlowRender.bind(null, "128", ["128r", "64r", "32r", "16r", "8r", "qr", "hr"])}
        />
      ),
      "128th Note"
    ),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "wr" }),
      () => (
        <VexFlowComponent
          size={canvasSize}
          vexFlowRender={vexFlowRender.bind(null, "wr", [])}
        />
      ),
      "Whole Rest"
    ),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "h4" }),
      () => (
        <VexFlowComponent
          size={canvasSize}
          vexFlowRender={vexFlowRender.bind(null, "hr", ["hr"])}
        />
      ),
      "Half Rest"
    ),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "qr" }),
      () => (
        <VexFlowComponent
          size={canvasSize}
          vexFlowRender={vexFlowRender.bind(null, "qr", ["qr", "hr"])}
        />
      ),
      "Quarter Rest"
    ),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "8r" }),
      () => (
        <VexFlowComponent
          size={canvasSize}
          vexFlowRender={vexFlowRender.bind(null, "8r", ["8r", "qr", "hr"])}
        />
      ),
      "Eighth Rest"
    ),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "16r" }),
      () => (
        <VexFlowComponent
          size={canvasSize}
          vexFlowRender={vexFlowRender.bind(null, "16r", ["16r", "8r", "qr", "hr"])}
        />
      ),
      "Sixteenth Rest"
    ),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "32r" }),
      () => (
        <VexFlowComponent
          size={canvasSize}
          vexFlowRender={vexFlowRender.bind(null, "32r", ["32r", "16r", "8r", "qr", "hr"])}
        />
      ),
      "32nd Rest"
    ),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "64r" }),
      () => (
        <VexFlowComponent
          size={canvasSize}
          vexFlowRender={vexFlowRender.bind(null, "64r", ["64r", "32r", "16r", "8r", "qr", "hr"])}
        />
      ),
      "64th Rest"
    ),
    FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { id: "128r" }),
      () => (
        <VexFlowComponent
          size={canvasSize}
          vexFlowRender={vexFlowRender.bind(null, "128r", ["128r", "64r", "32r", "16r", "8r", "qr", "hr"])}
        />
      ),
      "128th Rest"
    )
  ];
}
function vexFlowRender(
  noteDurationString: string, restDurationStrings: string[], context: Vex.IRenderContext
) {
  context
    .setFont("Arial", 10)
    .setBackgroundFillStyle("#eed");

  const stave = new Vex.Flow.Stave(0, -20, canvasSize.width);
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
  formatter.joinVoices([voice]).format([voice], canvasSize.width);
  
  voice.draw(context, stave);
}

export const flashCardSet = createFlashCardSet();