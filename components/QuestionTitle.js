import React from "react";

export const QuestionTitle = ({ questionNumber, title }) => {
  return (
    <h3
      style={{
        textAlign: "center",
      }}
    >
      <span>{`${questionNumber}) `}</span>
      <span>{title}</span>
    </h3>
  );
};
