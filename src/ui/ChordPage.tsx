import * as React from "react";
import { Chord } from "../lib/TheoryLib/Chord";
import { ChordView } from "./Utils/ChordView";
import { Card } from "../ui/Card/Card";

export interface IChordPageProps {
  chord: Chord;
}

export class ChordPage extends React.Component<IChordPageProps, {}> {
  public render(): JSX.Element {
    const { chord } = this.props;

    return (
      <Card>
        <ChordView
          chord={chord}
          maxWidth={500} />
      </Card>
    );
  }
}
