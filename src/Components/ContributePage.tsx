import * as React from "react";
import { BecomeAPatronButton } from './Utils/BecomeAPatronButton';
import { Card } from "../ui/Card/Card";

export class ContributePage extends React.Component<{}, {}> {
  public render(): JSX.Element {
    return (
      <Card>
        <h2 className="h5 margin-bottom">
          Contribute
        </h2>
        <p>I combine my passions for music and software to create free, interactive music theory lessons and exercises. Your patronage can help me allocate more of my time towards creating and improving music theory lessons without resorting to a paywall or intrusive advertisements. If this website is valuable to you, please consider becoming a patron using the button below!</p>
        <p style={{ textAlign: "center", margin: "2em 0" }}><BecomeAPatronButton /></p>
      </Card>
    );
  }
}