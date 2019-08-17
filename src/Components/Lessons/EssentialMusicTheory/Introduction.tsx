import * as React from "react";

import App from '../../App';
import { SectionProps, MainTitle } from './EssentialMusicTheory';

export const IntroSection: React.FunctionComponent<SectionProps> = props => (
  <div>
    <MainTitle>Essential Music Theory</MainTitle>
    <p>This course is designed to teach students the essentials of Western music theory interactively. As you work your way through this course, keep in mind that music theory is descriptive, not prescriptive. This means that there are no hard-rules, only guidelines based on music that already exists. The goal of learning music theory is not to restrict ourselves to doing only what is "correct", but to understand the music we hear on a deeper level, to apply this understanding to our music, and to know how to skillfully break the "rules" to fully express ourselves in our music.</p>
    <p>Without further ado, let's get started!</p>
    <p style={{ textAlign: "center" }}>{App.instance.renderNavLink("/essential-music-theory/rhythm", "Next: Rhythm >>")}</p>
  </div>
);