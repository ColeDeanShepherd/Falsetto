import * as React from "react";
import { LimitedWidthContentContainer } from "./Utils/LimitedWidthContentContainer";
import { Card } from "../ui/Card/Card";

export class PageNotFoundView extends React.Component<{}, {}> {
  public render(): JSX.Element {
    return (
      <LimitedWidthContentContainer>
        <Card>
          <h1 className="margin-bottom">Not Found</h1>
          <p>The requested URL was not found.</p>
        </Card>
      </LimitedWidthContentContainer>
    );
  }
}