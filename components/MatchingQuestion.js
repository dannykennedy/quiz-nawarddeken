import React from "react";
import styles from "../styles/MatchingQuestion.module.css";
import Image from "next/image";

const MatchingQuestionItem = ({ item, index }) => {
  return (
    <div className={styles["question-option"]}>
      {item.item.quizItemImage && (
        <div
          style={{
            width: 100,
            height: 100,
            position: "relative",
          }}
        >
          <Image
            src={item.item.quizItemImage}
            layout="fill"
            objectFit="cover"
          />
        </div>
      )}
      <p key={index}>{item.title}</p>
    </div>
  );
};

export const MatchingQuestion = ({ question }) => {
  return (
    <div className={styles["matching-question"]}>
      <div>
        <h3>{question.title}</h3>
      </div>
      <div className={styles["matching-question-options"]}>
        <div className={styles["matching-question-set-1"]}>
          {question.set1.map((item, index) => {
            return <MatchingQuestionItem item={item} index={index} />;
          })}
        </div>
        <div className={styles["matching-question-set-2"]}>
          {question.set2.map((item, index) => {
            return (
              <MatchingQuestionItem item={item} index={index} key={index} />
            );
          })}
        </div>
      </div>
    </div>
  );
};
