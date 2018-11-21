import * as React from 'react';

import * as Utils from "../../Utils";
import { Quiz } from "../../Quiz";
import { AnswerCheckboxes } from "../AnswerCheckboxes";

export function createQuiz(): Quiz {
  const intervalQualities = ["perfect", "imperfect"];
  const questionAnswers = [
    ["1st", "4th", "5th", "8th"],
    ["2nd", "3rd", "6th", "7th"]
  ];
  const answers = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];
  const questionAnswerIds = intervalQualities
    .map((_, i) => {
      const setBitIndices = questionAnswers[i].map(qa => answers.indexOf(qa));
      return Utils.setBitIndicesToInt(setBitIndices);
    });

  return new Quiz(
    "Interval Qualities To Generic Intervals",
    intervalQualities.map(intervalQuality => (() => <span>{intervalQuality}</span>)),
    questionAnswerIds,
    (selectAnswerId, questionId) => <AnswerCheckboxes key={questionId} answers={answers} selectAnswerId={selectAnswerId} />
  );
}