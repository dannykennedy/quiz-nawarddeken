import React, { useState } from "react";
import styles from "../styles/MultipleChoiceQuestion.module.css";
import mainStyles from "../styles/Main.module.css";
import Image from "next/image";

// question.options is in the form
// [{optionText: 'Dioscorea transversa', optionImage: 'x.jpg', optionCorrect: true}]
export const MultipleChoiceQuestion = ({
  question,
  questionNumber,
  onAnswer,
}) => {
  const [checkedValues, setCheckedValues] = useState([]);
  const [showingAnswer, setShowingAnswer] = useState(false);
  const [answer, setAnswer] = useState({
    correct: false,
    message: "Try again!",
  });

  return (
    <div className={styles["mc-question"]}>
      <h3>{`${questionNumber}) ${question.title}`}</h3>
      {/* List with check boxes for the options */}
      <ul className={styles["mc-question__options"]}>
        {question.options.map((option, index) => {
          return (
            <li key={index}>
              <input
                type="radio"
                name={question.id}
                id={option.optionText}
                value={option.optionText}
                checked={checkedValues.includes(option.optionText)}
                onChange={(e) => {
                  setCheckedValues([e.target.value]);
                  // Hide the answer
                  setShowingAnswer(false);
                  // Check if the answer is correct
                  const isCorrect = option.optionCorrect;
                  // Call the onAnswer callback
                  const answer = {
                    correct: isCorrect,
                    message: isCorrect ? "✅ Kamak yimarnbom!" : "Try again!",
                  };
                  onAnswer(answer);
                  setAnswer(answer);
                }}
              />
              <label
                className={styles["mc-question__option-label"]}
                htmlFor={option.optionText}
              >
                {option.optionText}
              </label>
              {/* Image if there is one */}
              {option.optionImage && (
                <div className={styles["mc-question__option-image"]}>
                  <Image
                    src={option.optionImage}
                    alt={option.optionText || option.optionImage}
                    height={100}
                    width={100}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <div className={mainStyles["answers-area"]}>
        <button
          className={mainStyles["button"]}
          onClick={() => {
            setShowingAnswer(!showingAnswer);
          }}
        >
          Check answer
        </button>
        {
          // If the user has checked the answer, show the answer
          showingAnswer && (
            <div className={styles["mc-question__answer"]}>
              <p>{answer.message}</p>
            </div>
          )
        }
      </div>
    </div>
  );
};
