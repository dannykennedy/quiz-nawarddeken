// Reordering within the box
export const reorder = (keyList, itemKey, endIndex) => {
  const currentIndex = keyList.indexOf(itemKey);
  // If the item is not in the list, log and return
  if (currentIndex === -1) {
    console.log("Item not in list");
    return;
  }
  const resultKeyList = [...keyList];
  const keyListWithoutItem = resultKeyList.filter((x) => x !== itemKey);
  keyListWithoutItem.splice(endIndex, 0, itemKey);
  return keyListWithoutItem;
};
