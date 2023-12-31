import React, { useState, useMemo, useEffect } from "react";
import styles from "../../styles/MatchingQuestion.module.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { MatchingQuestionItem } from "./MatchingQuestionItem";
import { insert, remove, reorder } from "./drag-drop-functions";
import mainStyles from "../../styles/Main.module.css";
import { calculateCorrectMatches } from "./matching-functions";
import { MatchingMap } from "../MapIllustration";
import { ItemDetails } from "./ItemDetails";
import { log } from "@deck.gl/core";
import { QuestionTitle } from "../QuestionTitle";

export const MatchingQuestion = ({ question, questionNumber, onAnswer }) => {
  const isMapQuestion = question.questionType === "Map";

  // STRUCTURE THE DATA
  // Put all boxes together
  const sourceItems = question.set1.reduce((acc, item) => {
    acc[item.key] = item;
    return acc;
  }, {});
  const sourceBox = {
    id: `questions`,
    title: question.set1title || `Questions`,
    itemKeys: question.set1.map((x) => x.key),
  };
  const answerBoxes = question.set2.map((item, index) => {
    return {
      id: `${item.key}`,
      title: item.title,
      itemKeys: [],
      item: item.item,
    };
  });
  const allBoxes = [sourceBox, ...answerBoxes];

  // STATE
  const [boxes, setBoxes] = useState(allBoxes);
  const [showingAnswer, setShowingAnswer] = useState(false);

  // MEMOIZED VALUES
  const answer = useMemo(() => {
    // Matches are in the form
    // { "match1": "late-spear-grass", "match2": "late-wet-season" }
    // Boxes are in the form
    // {"id": "bangkerreng", "itemKeys": ["late-spear-grass"]}
    const { matches } = question;

    const answers = calculateCorrectMatches(boxes, matches);

    const allCorrect = answers.incorrectItems.length === 0;

    // If all answers are correct, return the correct answers
    if (allCorrect) {
      return {
        correct: true,
        message: "✅ Kamak yimarnbom!",
      };
    } else {
      // Make a string that lists the incorrect matches
      return {
        correct: false,
        message: "Try again!",
      };
    }
  }, [boxes, question]);

  // If the answer is correct, show the answer
  useEffect(() => {
    if (answer.correct) {
      setShowingAnswer(true);
    } else {
      setShowingAnswer(false);
    }
    onAnswer(answer);
  }, [answer]);

  const setNewBoxes = (newBoxes) => {
    setBoxes(newBoxes);
  };

  // FUNCTIONS
  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    // If the item is dropped outside of a box, do nothing
    if (!destination) {
      return;
    }

    const sourceBox = allBoxes.find((x) => x.id === source.droppableId);
    const destBox = allBoxes.find((x) => x.id === destination.droppableId);

    // 1) We put the box back where it was
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    // 2) If the item is reordered within the same box
    else if (destination.droppableId === source.droppableId) {
      const newBoxes = [...boxes].map((box) => {
        if (box.id === sourceBox.id) {
          const itemKeys = reorder(
            box.itemKeys,
            draggableId,
            destination.index
          );
          return {
            ...box,
            itemKeys,
          };
        } else {
          return box;
        }
      });
      setNewBoxes(newBoxes);
    }
    // 3) If the item is moved to a different box
    else {
      const newBoxes = [...boxes].map((box) => {
        if (box.id === sourceBox.id) {
          const newItemKeys = remove(box.itemKeys, draggableId);
          return {
            ...box,
            itemKeys: newItemKeys,
          };
        } else if (box.id === destBox.id) {
          const itemKeys = insert(box.itemKeys, draggableId, destination.index);
          return {
            ...box,
            itemKeys,
          };
        } else {
          return box;
        }
      });
      setNewBoxes(newBoxes);
    }
  };

  return (
    <div className={styles["matching-question"]}>
      <QuestionTitle questionNumber={questionNumber} title={question.title} />
      {isMapQuestion && (
        <MatchingMap
          options={question.set2.map((item) => {
            return {
              ...item,
              latitude: item.item.latitude,
              longitude: item.item.longitude,
            };
          })}
        />
      )}
      <DragDropContext
        onDragEnd={(result) => {
          onDragEnd(result);
        }}
      >
        <div className={styles["matching-question__container"]}>
          {boxes.map((box, i) => {
            // If it's a map question, obscure the details
            // Also, make sure box title is respected
            const boxItem = { ...(box.item || {}), title: box.title };
            const displayBox = isMapQuestion
              ? { title: box.title, id: box.id }
              : boxItem;

            // If set2ImagesOnly is true, only show the images
            // No itemdetails other than the first one
            const shouldDisplayItemDetails = i < 1 || !question.set2ImagesOnly;

            return (
              <div key={box.id} className={styles["matching-question__box"]}>
                <div
                  style={{
                    minHeight: isMapQuestion ? undefined : 50,
                    marginBottom: 16,
                  }}
                >
                  {shouldDisplayItemDetails && (
                    <ItemDetails item={displayBox} isHeader={true} />
                  )}
                </div>

                <Droppable
                  droppableId={box.id}
                  className={styles["matching-question__droppable"]}
                >
                  {(provided, snapshot) => {
                    return (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={styles["matching-question__box__content"]}
                        // Background image of the item
                        // Fit the image to the box
                        style={{
                          backgroundImage:
                            box.item && !isMapQuestion
                              ? `url(../${box.item.quizItemImage})`
                              : undefined,
                          backgroundSize: "cover",
                          backgroundRepeat: "no-repeat",
                        }}
                      >
                        {box.itemKeys.map((itemKey, index) => {
                          const item = sourceItems[itemKey];
                          return (
                            <Draggable
                              key={item.key}
                              draggableId={item.key}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={
                                    styles[
                                      "matching-question__box__content__item"
                                    ]
                                  }
                                >
                                  <MatchingQuestionItem item={item} />
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
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
            <div className={styles["matching-question__answer"]}>
              <p>{answer.message}</p>
            </div>
          )
        }
      </div>
    </div>
  );
};
