import * as React from "react";
import { Card } from "../ui/Card/Card";

export interface IMessagePageProps {
  title: string;
  message: string;
}
export class MessagePage extends React.Component<IMessagePageProps, {}> {
  public render(): JSX.Element {
    return (
      <Card>
        <h2 className="h5 margin-bottom" style={{ textAlign: "center" }}>
          {this.props.title}
        </h2>
        <p>{this.props.message}</p>
      </Card>
    );
  }
}