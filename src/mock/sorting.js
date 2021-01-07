import {SortType} from "../consts";

const makeSortItem = (sortType, isActive = false) => {
  return {
    sortType,
    isActive
  };
};

export const getSortingItems = () => {
  return [
    makeSortItem(SortType.DEFAULT, true),
    makeSortItem(SortType.DATE),
    makeSortItem(SortType.RATING)
  ];
};
