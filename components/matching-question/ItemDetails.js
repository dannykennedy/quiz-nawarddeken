import React from "react";
import styles from "../../styles/MatchingQuestion.module.css";
import PlayButton from "../PlayButton";

export const ItemDetails = ({ item, isHeader }) => {
  const {
    title,
    quizItemAudioEnglish,
    labelKundedjnjenghmi,
    labelKunwinjku,
    quizItemAudioKunwinjku,
    quizItemAudioKundedjnjenghmi,
  } = item || {};

  const djnjAndWAreSame =
    item.labelKundedjnjenghmi &&
    item.labelKundedjnjenghmi === item.labelKunwinjku;

  let bininjDetails = null;
  if (djnjAndWAreSame) {
    bininjDetails = {
      labelBininj: labelKundedjnjenghmi || labelKunwinjku,
      quizItemAudioBininj:
        quizItemAudioKundedjnjenghmi || quizItemAudioKunwinjku,
    };
  }

  return (
    <div>
      <p
        className={styles["question-option__text"]}
        style={{
          fontWeight: isHeader ? "bold" : "normal",
        }}
      >
        <span>{title}</span>
        {quizItemAudioEnglish && (
          <PlayButton audioTrack={quizItemAudioEnglish} />
        )}
      </p>
      {/* If W and Djnj are same, amalgamate */}
      {bininjDetails && (
        <p
          className={`${styles["question-option__text"]} ${styles["question-option__bininj"]}`}
        >
          <span>{bininjDetails.labelBininj}</span>
          {bininjDetails.quizItemAudioBininj && (
            <PlayButton audioTrack={bininjDetails.quizItemAudioBininj} />
          )}
        </p>
      )}
      {/* Else, show separately */}
      {!bininjDetails && (
        <>
          <p
            className={`${styles["question-option__text"]} ${styles["question-option__djnj"]}`}
          >
            <span>{labelKundedjnjenghmi}</span>
            {quizItemAudioKundedjnjenghmi && (
              <PlayButton audioTrack={quizItemAudioKundedjnjenghmi} />
            )}
          </p>
          <p
            className={`${styles["question-option__text"]} ${styles["question-option__w"]}`}
          >
            <span>{labelKunwinjku}</span>
            {quizItemAudioKunwinjku && (
              <PlayButton audioTrack={quizItemAudioKunwinjku} />
            )}
          </p>
        </>
      )}
    </div>
  );
};
