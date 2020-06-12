import * as React from "react";
import { Typography } from "@material-ui/core";
import { LimitedWidthContentContainer } from "./Utils/LimitedWidthContentContainer";
import { Card } from "../ui/Card/Card";

export class PageNotFoundView extends React.Component<{}, {}> {
  public render(): JSX.Element {
    return (
      <LimitedWidthContentContainer>
        <Card>
          <Typography gutterBottom={true} variant="h5" component="h2">
            Not Found
          </Typography>
          <p>The requested URL was not found.</p>
        </Card>
      </LimitedWidthContentContainer>
    );
  }
}