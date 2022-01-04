import * as React from "react";
import Vex from "vexflow";

import * as FlashCardUtils from "../Utils";
import { createFlashCardId, FlashCard } from "../../../FlashCard";
import { FlashCardSet } from "../../../FlashCardSet";
import { VexFlowComponent } from "../../Utils/VexFlowComponent";
import { Pitch } from "../../../lib/TheoryLib/Pitch";
import { PitchLetter } from "../../../lib/TheoryLib/PitchLetter";
import { Size2D } from '../../../lib/Core/Size2D';

const flashCardSetId = "keySignatureIdentification";

const allowedPitches = [
  createPitch(PitchLetter.C, -1, 0),
  createPitch(PitchLetter.C, 0, 0),
  createPitch(PitchLetter.C, 1, 0),
  createPitch(PitchLetter.D, -1, 0),
  createPitch(PitchLetter.D, 0, 0),
  createPitch(PitchLetter.E, -1, 0),
  createPitch(PitchLetter.E, 0, 0),
  createPitch(PitchLetter.F, 0, 0),
  createPitch(PitchLetter.F, 1, 0),
  createPitch(PitchLetter.G, -1, 0),
  createPitch(PitchLetter.G, 0, 0),
  createPitch(PitchLetter.A, -1, 0),
  createPitch(PitchLetter.A, 0, 0),
  createPitch(PitchLetter.B, -1, 0),
  createPitch(PitchLetter.B, 0, 0)
];
export const answers = [
  "C♭ Major, A♭ Minor",
  "C Major, A Minor",
  "C♯ Major, A♯ Minor",
  "D♭ Major, B♭ Minor",
  "D Major, B Minor",
  "E♭ Major, C Minor",
  "E Major, C♯ Minor",
  "F Major, D Minor",
  "F♯ Major, D♯ Minor",
  "G♭ Major, E♭ Minor",
  "G Major, E Minor",
  "A♭ Major, F Minor",
  "A Major, F♯ Minor",
  "B♭ Major, G Minor",
  "B Major, G♯ Minor"
];

export interface ISheetMusicKeySignatureProps {
  size: Size2D;
  keySignature: string;
}
export class SheetMusicKeySignature extends React.Component<ISheetMusicKeySignatureProps, {}> {
  public render(): JSX.Element {
    const vexFlowRender = this.vexFlowRender.bind(this);
    return <VexFlowComponent size={this.props.size} vexFlowRender={vexFlowRender} />;
  }

  private vexFlowRender(context: Vex.IRenderContext) {
    context.setFont("Arial", 10).setBackgroundFillStyle("#eed");

    // Create the staves
    const staveLength = this.props.size.width;
    const staveX = 20;

    const topStaff = new Vex.Flow.Stave(staveX, 0, staveLength);
    topStaff.addClef("treble");
    topStaff.addKeySignature(this.props.keySignature);

    const bottomStaff = new Vex.Flow.Stave(staveX, 80, staveLength);
    bottomStaff.addClef("bass");
    bottomStaff.addKeySignature(this.props.keySignature);

    const brace = new Vex.Flow.StaveConnector(topStaff, bottomStaff).setType(3);
    const lineLeft = new Vex.Flow.StaveConnector(topStaff, bottomStaff).setType(1);
    const lineRight = new Vex.Flow.StaveConnector(topStaff, bottomStaff).setType(6);

    topStaff.setContext(context).draw();
    bottomStaff.setContext(context).draw();

    brace.setContext(context).draw();
    lineLeft.setContext(context).draw();
    lineRight.setContext(context).draw();
  }
}

export function createFlashCards(): Array<FlashCard> {
  return allowedPitches
    .map((pitch, i) => FlashCard.fromRenderFns(
      createFlashCardId(flashCardSetId, { keys: answers[i] }),
      size => <SheetMusicKeySignature
        size={new Size2D(300, 200)}
        keySignature={pitch.toVexFlowKeySignatureString()}
      />,
      answers[i]
    ));
}
function createFlashCardSet(): FlashCardSet {
  const flashCardSet = new FlashCardSet(flashCardSetId, "Key Signature Identification", createFlashCards);
  flashCardSet.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  flashCardSet.moreInfoUri = "https://method-behind-the-music.com/theory/scalesandkeys/#sigs";

  return flashCardSet;
}

export const flashCardSet = createFlashCardSet();