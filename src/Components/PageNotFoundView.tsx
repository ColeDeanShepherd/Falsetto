import * as React from "react";
import { CardContent, Card, Typography } from "@material-ui/core";
import { LimitedWidthContentContainer } from "./Utils/LimitedWidthContentContainer";

export class PageNotFoundView extends React.Component<{}, {}> {
  public render(): JSX.Element {
    return (
      <LimitedWidthContentContainer>
        <Card>
          <CardContent>
            <Typography gutterBottom={true} variant="h5" component="h2">
              Not Found
            </Typography>
            <p>The requested URL was not found.</p>
          </CardContent>
        </Card>
      </LimitedWidthContentContainer>
    );
  }
}