import React from "react";
import styles from "../../styles/MatchingQuestion.module.css";
import Image from "next/image";
import PlayButton from "../PlayButton";
import { ItemDetails } from "./ItemDetails";

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
      <ItemDetails item={item.item} />
    </div>
  );
};
