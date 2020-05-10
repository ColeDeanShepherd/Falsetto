import * as React from "react";
import { CardContent, Card, Typography } from "@material-ui/core";
import { Chord } from "../lib/TheoryLib/Chord";
import { ChordView } from "./Utils/ChordView";

export interface IChordPageProps {
  chord: Chord;
}

export class ChordPage extends React.Component<IChordPageProps, {}> {
  public render(): JSX.Element {
    const { chord } = this.props;

    return (
      <Card>
        <CardContent>
          <ChordView
            chord={chord}
            maxWidth={500} />
        </CardContent>
      </Card>
    );
  }
}