import * as pythonBasics from "./python-basics.js";
import * as pythonClasses from "./python-classes.js";
import * as dataStructures from "./data-structures.js";

const allQuizzes = [
  { meta: pythonBasics.meta, questions: pythonBasics.questions },
  { meta: pythonClasses.meta, questions: pythonClasses.questions },
  { meta: dataStructures.meta, questions: dataStructures.questions },
  // Add new quizzes here
];

const mixedQuiz = {
  meta: {
    id: "mixed",
    title: "Mixed Drill",
    description: "20 random questions pulled from all quizzes",
    topics: ["All Topics"],
    limit: 20,
  },
  questions: allQuizzes.flatMap((q) => q.questions),
};

export const quizzes = [mixedQuiz, ...allQuizzes];
