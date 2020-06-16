import * as React from "react";
import { LimitedWidthContentContainer } from "./Utils/LimitedWidthContentContainer";
import { Card } from "../ui/Card/Card";

export class PageNotFoundView extends React.Component<{}, {}> {
  public render(): JSX.Element {
    return (
      <LimitedWidthContentContainer>
        <Card>
          <h2 className="h5 margin-bottom">
            Not Found
          </h2>
          <p>The requested URL was not found.</p>
        </Card>
      </LimitedWidthContentContainer>
    );
  }
}