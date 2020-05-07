import * as React from "react";

import { Vector2D } from '../../lib/Core/Vector2D';
import { Size2D } from "../../lib/Core/Size2D";
import { Rect2D } from '../../lib/Core/Rect2D';
import { PitchLetter } from "../../lib/TheoryLib/PitchLetter";
import { Pitch } from "../../lib/TheoryLib/Pitch";
import { Button, Card, CardContent, Typography } from "@material-ui/core";
import { Chord } from "../../lib/TheoryLib/Chord";
import { ChordTypeGroup } from "../../lib/TheoryLib/ChordTypeGroup";
import { ChordType } from "../../lib/TheoryLib/ChordType";
import { PianoKeyboard } from "../Utils/PianoKeyboard";
import { playPitches } from '../../Audio/PianoAudio';
import * as PianoScaleDronePlayer from "../Utils/PianoScaleDronePlayer";
import { GuitarChordViewer } from '../Utils/GuitarChordViewer';
import { getStandardGuitarTuning } from '../Utils/StringedInstrumentTuning';
import { arrayContains } from '../../lib/Core/ArrayUtils';
import { getPianoKeyboardAspectRatio } from '../Utils/PianoUtils';
import { ChordSelectView } from "../Utils/ChordSelectView";
import { ChordView } from "../Utils/ChordView";

const pianoLowestPitch = new Pitch(PitchLetter.C, 0, 4);
const pianoHighestPitch = new Pitch(PitchLetter.B, 0, 5);
const pianoOctaveCount = 2;
const pianoAspectRatio = getPianoKeyboardAspectRatio(pianoOctaveCount);

const guitarTuning = getStandardGuitarTuning(6);

export interface IChordViewerProps {
  title?: string;
  chordTypeGroups?: Array<ChordTypeGroup>;
  renderOnCard?: boolean;
  showTitle?: boolean;
  showChordSelect?: boolean;
  showChordInfoText?: boolean;
  showPianoKeyboard?: boolean;
  showGuitarFretboard?: boolean;
}

export interface IChordViewerState {
  chordTypeGroup: ChordTypeGroup;
  chord: Chord;
}

export class ChordViewer extends React.Component<IChordViewerProps, IChordViewerState> {
  public constructor(props: IChordViewerProps) {
    super(props);

    this.state = {
      chordTypeGroup: this.chordTypeGroups[0],
      chord: new Chord(this.chordTypeGroups[0].chordTypes[0], new Pitch(PitchLetter.C, 0, 4))
    };
  }

  public render(): JSX.Element {
    const { chordTypeGroup, chord } = this.state;

    const title = this.props.title
      ? this.props.title
      : "Chord Viewer";

    const renderOnCard = (this.props.renderOnCard !== undefined)
      ? this.props.renderOnCard
      : true;

    const showTitle = (this.props.showTitle !== undefined)
      ? this.props.showTitle
      : true;

    const showChordSelect = (this.props.showChordSelect !== undefined)
      ? this.props.showChordSelect
      : true;
    
    const showChordInfoText = (this.props.showChordInfoText !== undefined)
      ? this.props.showChordInfoText
      : true;

    const showPianoKeyboard = (this.props.showPianoKeyboard !== undefined)
      ? this.props.showPianoKeyboard
      : true;

    const showGuitarFretboard = (this.props.showGuitarFretboard !== undefined)
      ? this.props.showGuitarFretboard
      : true;

    const containerContents = (
      <div>
        {showTitle ? (
          <Typography gutterBottom={true} variant="h5" component="h2" style={{flexGrow: 1}}>
            {title}
          </Typography>
        ) : null}
        
        <div style={{textAlign: "center"}}>
          {showChordSelect
            ? (
              <ChordSelectView
                value={[chordTypeGroup, chord]}
                onChange={newValue => this.onChordChange(newValue[0], newValue[1])} />
            )
            : null}

          <ChordView
            chord={chord}
            showChordInfoText={showChordInfoText}
            showPianoKeyboard={showPianoKeyboard}
            showGuitarFretboard={showGuitarFretboard} />
        </div>
      </div>
    );
    
    return renderOnCard
      ? (
        <Card>
          <CardContent>
            {containerContents}
          </CardContent>
        </Card>
      )
      : containerContents;
  }

  private get chordTypeGroups(): Array<ChordTypeGroup> {
    return this.props.chordTypeGroups
      ? this.props.chordTypeGroups
      : ChordType.Groups;
  }

  private onChordChange(chordTypeGroup: ChordTypeGroup, chord: Chord) {
    this.setState({ chordTypeGroup, chord });
  }
}
