import * as React from "react";
import { CardContent, Card, Typography } from "@material-ui/core";
import { MAX_MAIN_CARD_WIDTH } from './Style';

import becomeAPatronButton from "../img/become_a_patron_button.png";

export class SupportUsPage extends React.Component<{}, {}> {
  public render(): JSX.Element {
    return (
      <Card style={{ maxWidth: MAX_MAIN_CARD_WIDTH }}>
        <CardContent>
          <Typography gutterBottom={true} variant="h5" component="h2">
            Support Us
          </Typography>
          <p>I combine my passions for music and software to create free, interactive music theory lessons and exercises. Your patronage can help me allocate more of my time towards creating and improving music theory lessons without resorting to a paywall or intrusive advertisements. With your support, my goal is to make falsetto.app the #1 resource for learning music theory online.</p>
          <p style={{ textAlign: "center" }}>
            <a href="https://www.patreon.com/bePatron?u=4644571" target="_blank">
              <img src={becomeAPatronButton} alt="Become a Patron!" style={{width: "176px", borderRadius: "9999px"}} />
            </a>
          </p>
        </CardContent>
      </Card>
    );
  }
}