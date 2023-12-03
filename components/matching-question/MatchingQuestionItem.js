import React from "react";
import styles from "../../styles/MatchingQuestion.module.css";
import Image from "next/image";
import PlayButton from "../PlayButton";

export const MatchingQuestionItem = ({ item, index }) => {
  return (
    <div className={styles["question-option"]}>
      {item.item.quizItemImage && (
        <div className={styles["question-option__image"]}>
          <Image
            src={item.item.quizItemImage}
            layout="fill"
            objectFit="cover"
            alt={item.title}
          />
        </div>
      )}
      <p key={index} className={styles["question-option__text"]}>
        <span>{item.title}</span>
        {item.item && item.item.quizItemAudioKunwok && (
          <PlayButton audioTrack={item.item.quizItemAudioKunwok} />
        )}
      </p>
    </div>
  );
};
