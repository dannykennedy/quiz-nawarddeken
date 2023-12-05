import React from "react";
import styles from "../styles/MultipleChoiceQuestion.module.css";

export const MultipleChoiceQuestion = ({
  question,
  questionNumber,
  onAnswer,
}) => {
  console.log("question", question);

  return (
    <div className={styles["matching-question"]}>
      <h3>{`${questionNumber}) ${question.title}`}</h3>
    </div>
  );
};
