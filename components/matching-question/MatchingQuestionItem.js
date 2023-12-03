import React from "react";
import styles from "../../styles/MatchingQuestion.module.css";
import Image from "next/image";

export const MatchingQuestionItem = ({ item, index }) => {
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
