import * as React from "react";

import { SectionProps, Term, SectionTitle, SubSectionTitle, NoteText } from './EssentialMusicTheory';
import { NavLinkView } from '../../../NavLinkView';

export const NextStepsSection: React.FunctionComponent<SectionProps> = props => (
  <div>
    <p style={{ textAlign: "center" }}><NavLinkView to="/essential-music-theory/chord-progressions">{"<< Previous: Chord Progressions"}</NavLinkView></p>

    <SectionTitle>Next Steps</SectionTitle>
    <p>With the essentials of music theory under your belt, you should now have a better understanding of music as a whole, and of the instrument of your choice. We encourage you to explore the exercises we have on our website, and to experiment with your knowledge to come up with original ideas and develop your musical voice.</p>
    <p>You are now equipped to tackle more advanced and specialized music theory in the musical genres that interest you, and we have included some useful links to other websites below to continue your studies in whatever direction you choose.</p>

    <SubSectionTitle>General Music Theory</SubSectionTitle>
    <ul>
      <li><a href="https://www.youtube.com/channel/UCJquYOG5EL82sKTfH9aMA9Q" target="_blank">Rick Beato's YouTube Channel</a></li>
      <li><a href="https://www.youtube.com/user/havic5" target="_blank">Adam Neely's YouTube Channel</a></li>
      <li><a href="https://www.youtube.com/user/nimajqeb/videos" target="_blank">Ben Levin's YouTube Channel</a></li>
      <li><a href="https://www.youtube.com/user/MangoldProject" target="_blank">Manigold Project YouTube Channel</a></li>
      <li><a href="https://www.youtube.com/user/the1564studios" target="_blank">Two Minute Music Theory</a></li>
      <li><a href="http://tobyrush.com/theorypages/index.html" target="_blank">Toby Rush's Music Theory Posters</a></li>
    </ul>

    <SubSectionTitle>Classical Theory</SubSectionTitle>
    <ul>
      <li><a href="http://openmusictheory.com/contents.html" target="_blank">Open Music Theory</a></li>
      <li><a href="https://www.coursera.org/learn/classical-composition" target="_blank">Write Like Mozart - Coursera</a></li>
      <li><a href="https://www.udemy.com/orchestrationcourse/" target="_blank">Orchestration Course - Udemy</a></li>
    </ul>
    
    <SubSectionTitle>Jazz Theory</SubSectionTitle>
    <ul>
      <li><a href="http://www.thejazzpianosite.com/jazz-piano-lessons/" target="_blank">www.thejazzpianosite.com</a> (and accompanying <a href="https://www.youtube.com/channel/UCk24OnGLcP5XlTBjZ9WBWvw" target="_black">YouTube channel</a>)</li>
      <li><a href="https://www.youtube.com/channel/UCdmjw5sm9Kn83TB_rA_QBCw" target="_blank">Kent Hewitt's YouTube Channel</a></li>
    </ul>
    
    <SubSectionTitle>Atonal Music Theory</SubSectionTitle>
    <ul>
      <li><a href="http://openmusictheory.com/contents.html" target="_blank">Open Music Theory (scroll down to "Post-tonal music")</a></li>
    </ul>

    <SubSectionTitle>Software</SubSectionTitle>
    <ul>
      <li><a href="https://musescore.org/" target="_blank">MuseScore - Sheet Music Notation Software</a></li>
      <li><a href="https://www.propellerheads.com/en/reason" target="_blank">Reason - Digital Audio Workstation</a></li>
      <li><a href="https://www.image-line.com/flstudio/" target="_blank">FL Studio - Digital Audio Workstation</a></li>
    </ul>

    <p style={{ textAlign: "center" }}><NavLinkView to="/essential-music-theory/chord-progressions">{"<< Previous: Chord Progressions"}</NavLinkView></p>
  </div>
);