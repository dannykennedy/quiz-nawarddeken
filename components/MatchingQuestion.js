import React, { useState } from "react";
import styles from "../styles/MatchingQuestion.module.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
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
  const [sourceItems, setSourceItems] = useState(question.set1);
  const [answerBoxes, setAnswerBoxes] = useState(
    question.set2.map((x) => ({ ...x, sourceItems: [] }))
  );

  const onDragEnd = (result) => {
    console.log("result", result);
    if (!result.destination) return;
    const items = Array.from(sourceItems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setSourceItems(items);
  };

  return (
    <div className={styles["matching-question"]}>
      <div>
        <h3>{question.title}</h3>
      </div>
      <DragDropContext
        onDragEnd={(result) => {
          onDragEnd(result);
        }}
      >
        <Droppable
          droppableId={`droppable-questions`}
          key={`droppable-questions`}
        >
          {(provided) => {
            return (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={styles["matching-question-questions-box"]}
              >
                {sourceItems.map((item, index) => {
                  return (
                    <Draggable
                      key={item.key}
                      draggableId={item.key}
                      index={index}
                    >
                      {(provided) => {
                        return (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <MatchingQuestionItem item={item} index={index} />
                          </div>
                        );
                      }}
                    </Draggable>
                  );
                })}
                {/* Makes the box bigger when dropping */}
                {provided.placeholder}
              </div>
            );
          }}
        </Droppable>
      </DragDropContext>
    </div>
  );
};
