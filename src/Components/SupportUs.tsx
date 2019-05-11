import * as React from "react";
import { CardContent, Card, Typography } from "@material-ui/core";
import { MAX_MAIN_CARD_WIDTH } from './Style';

export class SupportUsPage extends React.Component<{}, {}> {
  public render(): JSX.Element {
    return (
      <Card style={{ maxWidth: MAX_MAIN_CARD_WIDTH }}>
        <CardContent>
          <Typography gutterBottom={true} variant="h5" component="h2">
            Support Us
          </Typography>
          <p>I combine my passions for music and software to create free, interactive music theory lessons and exercises. Balancing a day job to pay the bills and a passion project can be tough, and your patronage can help me allocate more of my time towards creating and improving music theory lessons without resorting to a paywall or intrusive advertisements. With your support, my goal is to make falsetto.app the #1 resource for learning music theory online.</p>
          <p style={{ textAlign: "center" }}><a href="https://www.patreon.com/bePatron?u=4644571" data-patreon-widget-type="become-patron-button">Become a Patron!</a></p>
        </CardContent>
      </Card>
    );
  }
}