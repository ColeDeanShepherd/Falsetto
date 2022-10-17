import * as React from "react";

import * as Utils from "../../lib/Core/Utils";
import { Size2D } from "../../lib/Core/Size2D";
import { Scale } from "../../lib/TheoryLib/Scale";
import { Pitch } from "../../lib/TheoryLib/Pitch";
import { PitchLetter } from "../../lib/TheoryLib/PitchLetter";
import { GuitarFretboard, renderGuitarFretboardScaleExtras } from "./GuitarFretboard";
import { getPreferredGuitarScaleShape } from "./GuitarFretboard";
import { StringedInstrumentTuning } from '../../lib/TheoryLib/StringedInstrumentTuning';
import { arrayMax } from '../../lib/Core/ArrayUtils';

export const GuitarScaleViewer: React.FunctionComponent<{
  scale: Scale,
  renderAllScaleShapes: boolean,
  tuning: StringedInstrumentTuning,
  size: Size2D
}> = props => {
  let rootPitch = Pitch.createFromMidiNumber(
    (new Pitch(PitchLetter.C, 0, 2)).midiNumber + props.scale.rootPitch.midiNumberNoOctave
  );

  // If the root pitch is below the range of the guitar, add an octave.
  const guitarLowestNoteMidiNumber = (new Pitch(PitchLetter.E, 0, 2)).midiNumber;
  if (rootPitch.midiNumber < guitarLowestNoteMidiNumber) {
    rootPitch.octaveNumber++;
  }

  const guitarNotes = getPreferredGuitarScaleShape(props.scale, props.tuning);
  const maxFretNumber = arrayMax(guitarNotes
    .map(gn => gn.getFretNumber(props.tuning))
  );
  const minFretNumber = Math.max(0, maxFretNumber - 11);
  
  const fretboardStyle = { width: "100%", maxWidth: `${props.size.width}px`, height: "auto" };

  return (
    <GuitarFretboard
      width={props.size.width} height={props.size.height}
      tuning={props.tuning}
      minFretNumber={minFretNumber}
      renderExtrasFn={metrics => renderGuitarFretboardScaleExtras(metrics, props.scale, props.renderAllScaleShapes)}
      style={fretboardStyle}
    />
  );
}