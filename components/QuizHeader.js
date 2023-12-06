import React from "react";
import Image from "next/image";
import styles from "../styles/Quiz.module.css";

export const QuizHeader = ({ frontmatter }) => {
  const { quizImage, title, labelKunwinjku, labelKundedjnjenghmi } =
    frontmatter;

  const hasWLabel = labelKunwinjku && labelKunwinjku.length > 0;
  const hasDjnjLabel = labelKundedjnjenghmi && labelKundedjnjenghmi.length > 0;

  const hasOneLabel = hasWLabel || hasDjnjLabel;
  const hasBothLabels = hasWLabel && hasDjnjLabel;

  return (
    <div>
      {quizImage && (
        <div style={{ width: "100%", height: 400, position: "relative" }}>
          <Image
            src={quizImage.quizImageSrc}
            alt={quizImage.quizImageAlt}
            layout="fill"
            objectFit="cover"
          />
          {/* Overlay with shading, darker at the bottom */}
          <div className={styles["quiz-image-overlay"]} />
          <h1
            className={`${styles["quiz-title"]}`}
            style={{
              bottom: hasBothLabels ? "6rem" : hasOneLabel ? "3rem" : "1rem",
            }}
          >
            {title}
          </h1>
          {hasDjnjLabel && (
            <h2
              className={`${styles["quiz-label-language"]} ${styles["quiz-label-language--djnj"]}`}
              style={{
                bottom: hasBothLabels ? "3.5rem" : "1rem",
              }}
            >
              {labelKundedjnjenghmi}
            </h2>
          )}
          {hasWLabel && (
            <h2
              className={`${styles["quiz-label-language"]}`}
              style={{
                bottom: "1rem",
              }}
            >
              {labelKunwinjku}
            </h2>
          )}
        </div>
      )}
    </div>
  );
};
