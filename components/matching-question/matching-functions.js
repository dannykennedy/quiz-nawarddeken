// Matches are in the form
// { "match1": "late-spear-grass", "match2": "late-wet-season" }
// Boxes are in the form
// {"id": "bangkerreng", "itemKeys": ["late-spear-grass"]}
export const calculateCorrectMatches = (boxes, matches) => {
  const initialState = {
    incorrectItems: [],
    correctItems: [],
  };

  // First we check that the ACTUAL matches are in the list of matches
  const actualMatchAnswers = matches.reduce((acc, currMatch) => {
    const { match1, match2 } = currMatch;
    const matchIsCorrect = boxes.find((b) => {
      const rightBox = b.id === match1 || b.id === match2;
      const rightAnswer =
        b.itemKeys.includes(match1) || b.itemKeys.includes(match2);
      return rightBox && rightAnswer;
    });
    if (matchIsCorrect) {
      return {
        ...acc,
        correctItems: [...acc.correctItems, currMatch],
      };
    } else {
      return {
        ...acc,
        incorrectItems: [...acc.incorrectItems, currMatch],
      };
    }
  }, initialState);

  // Then, we check that there are no extra matches
  const extraMatchAnswers = boxes.reduce((acc, currBox) => {
    const itemsInTheBox = currBox.itemKeys || [];
    const itemsInTheBoxMatches = itemsInTheBox.map((itemKey) => ({
      match1: currBox.id,
      match2: itemKey,
    }));
    const extraIncorrectAnswers = itemsInTheBoxMatches.filter((m) => {
      return !matches.find((match) => {
        const oneWayMatch =
          match.match1 === m.match1 && match.match2 === m.match2;
        const otherWayMatch =
          match.match1 === m.match2 && match.match2 === m.match1;
        return oneWayMatch || otherWayMatch;
      });
    });

    return {
      ...acc,
      incorrectItems: [...acc.incorrectItems, ...extraIncorrectAnswers],
    };
  }, actualMatchAnswers);

  // Now we filter, because we don't care about answers left in the questions box
  const filteredIncorrectItems = extraMatchAnswers.incorrectItems.filter(
    (x) => {
      if (x.match1 === "questions" || x.match2 === "questions") {
        return false;
      } else {
        return true;
      }
    }
  );

  return {
    ...extraMatchAnswers,
    incorrectItems: filteredIncorrectItems,
  };
};
