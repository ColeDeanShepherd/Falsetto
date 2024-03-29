import * as React from "react";

import { PitchLetter } from "../../lib/TheoryLib/PitchLetter";
import { Pitch } from "../../lib/TheoryLib/Pitch";
import { Chord } from "../../lib/TheoryLib/Chord";
import { ChordTypeGroup } from "../../lib/TheoryLib/ChordTypeGroup";
import { ChordType } from "../../lib/TheoryLib/ChordType";
import { ChordSelectView } from "../Utils/ChordSelectView";
import { ChordView } from "../Utils/ChordView";
import { Card } from "../../ui/Card/Card";

export interface IChordViewerProps {
  title?: string;
  chordTypeGroups?: Array<ChordTypeGroup>;
  renderOnCard?: boolean;
  showTitle?: boolean;
  showChordSelect?: boolean;
  showChordInfoText?: boolean;
  showPianoKeyboard?: boolean;
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

    const containerContents = (
      <div>
        {showTitle ? (
          <h2 className="h5 margin-bottom" style={{flexGrow: 1}}>
            {title}
          </h2>
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
            showPianoKeyboard={showPianoKeyboard} />
        </div>
      </div>
    );
    
    return renderOnCard
      ? (
        <Card>
          {containerContents}
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
