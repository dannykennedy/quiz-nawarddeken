import React, { useState } from "react";
import styles from "../../styles/MatchingQuestion.module.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { MatchingQuestionItem } from "./MatchingQuestionItem";
import { insert, remove, reorder } from "./drag-drop-functions";

export const MatchingQuestion = ({ question }) => {
  // STRUCTURE THE DATA
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
    };
  });
  const allBoxes = [sourceBox, ...answerBoxes];

  // STATE
  const [boxes, setBoxes] = useState(allBoxes);

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
      <div>
        <h3>{question.title}</h3>
      </div>
      <DragDropContext
        onDragEnd={(result) => {
          onDragEnd(result);
        }}
      >
        <div className={styles["matching-question__container"]}>
          {boxes.map((box, index) => (
            <div key={box.id} className={styles["matching-question__box"]}>
              <h3>{box.title}</h3>
              <Droppable droppableId={box.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={styles["matching-question__box__content"]}
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
                                styles["matching-question__box__content__item"]
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
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};
