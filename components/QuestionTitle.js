import React from "react";

export const QuestionTitle = ({ questionNumber, title }) => {
  return (
    <h3>
      <span>{`${questionNumber}) `}</span>
      <span>{title}</span>
    </h3>
  );
};
