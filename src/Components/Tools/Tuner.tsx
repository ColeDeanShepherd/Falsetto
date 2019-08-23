import * as React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";

interface ITunerProps {}
interface ITunerState {}
export class Tuner extends React.Component<ITunerProps, ITunerState> {
  public constructor(props: ITunerProps) {
    super(props);

    this.state = {
      pressedPitches: []
    };
  }

  public componentDidMount() {
  }
  public componentWillUnmount() {
  }

  public render(): JSX.Element {
    return (
      <Card>
        <CardContent>
          <div style={{display: "flex"}}>
            <Typography gutterBottom={true} variant="h5" component="h2" style={{flexGrow: 1}}>
              Tuner
            </Typography>
          </div>
        
          <div>
            <p>test</p>
          </div>
        </CardContent>
      </Card>
    );
  }
}