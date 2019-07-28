import * as React from "react";

import becomeAPatronButton from "../../img/become_a_patron_button.png";

export const BecomeAPatronButton: React.FunctionComponent<{}> = props => (
  <a href="https://www.patreon.com/bePatron?u=4644571" target="_blank">
    <img src={becomeAPatronButton} alt="Become a Patron!" className="patreon-button bottom-shadow" style={{width: "176px", borderRadius: "9999px"}} />
  </a>
);