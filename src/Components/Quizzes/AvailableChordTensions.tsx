import * as React from 'react';

import * as Utils from "../../Utils";
import { Quiz } from "../../Quiz";
import { AnswerCheckboxes } from "../AnswerCheckboxes";
import { createTextMultipleChoiceQuiz } from "../Quiz";

export function createQuiz(): Quiz {
  const chordTypes = [
    "Maj7",
    "m7",
    "ø7",
    "mMaj7",
    "Maj+7",
    "o",
    "7",
    "7sus",
    "+7",
  ];
  const questionAnswers = [
    ["9", "#11", "13"],
    ["9", "11", "13"],
    ["9", "11", "b13"],
    ["9", "11", "13"],
    ["9", "#11"],
    ["9", "11", "b13", "7"],
    ["b9", "9", "#9", "#11", "b13", "13"],
    ["b9", "9", "#9", "b11", "b13", "13"],
    ["b9", "9", "#9", "#11", "13"],
  ];
  const answers = ["7", "b9", "9", "#9", "b11", "11", "#11", "b13", "13"];
  const questionAnswerIds = chordTypes
    .map((_, i) => {
      const setBitIndices = questionAnswers[i].map(qa => answers.indexOf(qa));
      return Utils.setBitIndicesToInt(setBitIndices);
    });

  return new Quiz(
    "Available Chord Tensions",
    chordTypes.map(chordType => (() => <span>{chordType}</span>)),
    questionAnswerIds,
    (selectAnswerId, questionId) => <AnswerCheckboxes key={questionId} answers={answers} selectAnswerId={selectAnswerId} />
  );
}