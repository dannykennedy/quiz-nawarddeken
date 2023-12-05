import React, { useState } from "react";
import styles from "../styles/MultipleChoiceQuestion.module.css";
import mainStyles from "../styles/Main.module.css";
import Image from "next/image";
import { QuestionTitle } from "./QuestionTitle";
import { MatchingMap } from "./MapIllustration";

// question.options is in the form
// [{title: 'Dioscorea transversa', optionImage: 'x.jpg', optionCorrect: true}]
export const MultipleChoiceQuestion = ({
  question,
  questionNumber,
  onAnswer,
}) => {
  const { questionType } = question;

  const options = question.options || [];
  const defaultCheckedValues = options.map((x) => false);
  const [checkedValues, setCheckedValues] = useState(options.map((x) => false));
  const [showingAnswer, setShowingAnswer] = useState(false);
  const [answer, setAnswer] = useState({
    correct: false,
    message: "Try again!",
  });

  console.log("MultipleChoiceQuestion", question);

  // Set checked based on index
  const setChecked = (index) => {
    // Uncheck all values
    // Then check the right one
    const newCheckedValues = [...defaultCheckedValues].map((_, i) => {
      return i === index;
    });
    setCheckedValues(newCheckedValues);
  };

  return (
    <div className={styles["mc-question"]}>
      <QuestionTitle questionNumber={questionNumber} title={question.title} />
      {questionType === "Map" && (
        <div className={styles["mc-question__map"]}>
          <MatchingMap options={question.options} />
        </div>
      )}
      {/* List with check boxes for the options */}
      <ul className={styles["mc-question__options"]}>
        {question.options.map((option, index) => {
          return (
            <li key={index}>
              <input
                type="radio"
                name={question.id}
                id={option.title}
                value={option.title}
                checked={checkedValues[index]}
                onChange={(e) => {
                  // Set the checked value
                  setChecked(index);
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
                htmlFor={option.title}
              >
                {option.title}
              </label>
              {/* Image if there is one */}
              {option.optionImage && (
                <div className={styles["mc-question__option-image"]}>
                  <Image
                    src={option.optionImage}
                    alt={option.title || option.optionImage}
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
