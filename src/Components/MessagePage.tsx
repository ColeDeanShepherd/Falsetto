import * as React from "react";
import { Typography } from "@material-ui/core";
import { Card } from "../ui/Card/Card";

export interface IMessagePageProps {
  title: string;
  message: string;
}
export class MessagePage extends React.Component<IMessagePageProps, {}> {
  public render(): JSX.Element {
    return (
      <Card>
        <Typography gutterBottom={true} variant="h5" component="h2" style={{ textAlign: "center" }}>
          {this.props.title}
        </Typography>
        <p>{this.props.message}</p>
      </Card>
    );
  }
}