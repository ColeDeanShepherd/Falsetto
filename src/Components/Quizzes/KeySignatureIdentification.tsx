import * as React from 'react';
import * as Vex from 'vexflow';

import * as FlashCardUtils from "../../Components/Quizzes/Utils";
import { FlashCard } from '../../FlashCard';
import { FlashCardGroup } from '../../FlashCardGroup';
import { VexFlowComponent } from '../VexFlowComponent';
import { Pitch } from '../../Pitch';
import { PitchLetter } from '../../PitchLetter';

const allowedPitches = [
  new Pitch(PitchLetter.C, -1, 0),
  new Pitch(PitchLetter.C, 0, 0),
  new Pitch(PitchLetter.C, 1, 0),
  new Pitch(PitchLetter.D, -1, 0),
  new Pitch(PitchLetter.D, 0, 0),
  new Pitch(PitchLetter.E, -1, 0),
  new Pitch(PitchLetter.E, 0, 0),
  new Pitch(PitchLetter.F, 0, 0),
  new Pitch(PitchLetter.F, 1, 0),
  new Pitch(PitchLetter.G, -1, 0),
  new Pitch(PitchLetter.G, 0, 0),
  new Pitch(PitchLetter.A, -1, 0),
  new Pitch(PitchLetter.A, 0, 0),
  new Pitch(PitchLetter.B, -1, 0),
  new Pitch(PitchLetter.B, 0, 0)
];
export const answers = [
  "Cb Major, Ab Minor",
  "C Major, A Minor",
  "C# Major, A# Minor",
  "Db Major, Bb Minor",
  "D Major, B Minor",
  "Eb Major, C Minor",
  "E Major, C# Minor",
  "F Major, D Minor",
  "F# Major, D# Minor",
  "Gb Major, Eb Minor",
  "G Major, E Minor",
  "Ab Major, F Minor",
  "A Major, F# Minor",
  "Bb Major, G Minor",
  "B Major, G# Minor"
];

export interface ISheetMusicKeySignatureProps {
  width: number;
  height: number;
  keySignature: string;
}
export class SheetMusicKeySignature extends React.Component<ISheetMusicKeySignatureProps, {}> {
  public render(): JSX.Element {
    const vexFlowRender = this.vexFlowRender.bind(this);
    return <VexFlowComponent width={this.props.width} height={this.props.height} vexFlowRender={vexFlowRender} />;
  }

  private vexFlowRender(context: Vex.IRenderContext) {
    context.setFont("Arial", 10).setBackgroundFillStyle("#eed");

    // Create the staves
    const staveLength = this.props.width;
    const staveX = 20;

    const topStaff = new Vex.Flow.Stave(staveX, 0, staveLength);
    topStaff.addClef('treble');
    topStaff.addKeySignature(this.props.keySignature);

    const bottomStaff = new Vex.Flow.Stave(staveX, 80, staveLength);
    bottomStaff.addClef('bass');
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

export function createFlashCardGroup(): FlashCardGroup {
  const flashCards = allowedPitches
    .map((pitch, i) => FlashCard.fromRenderFns(
      () => <SheetMusicKeySignature
        width={300}
        height={200}
        keySignature={pitch.toVexFlowKeySignatureString()}
      />,
      answers[i]
    ));

  const flashCardGroup = new FlashCardGroup("Key Signature Identification", flashCards);
  flashCardGroup.renderAnswerSelect = FlashCardUtils.renderDistinctFlashCardSideAnswerSelect;
  flashCardGroup.moreInfoUri = "https://method-behind-the-music.com/theory/scalesandkeys/#sigs";

  return flashCardGroup;
}