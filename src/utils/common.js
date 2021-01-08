import {HIDE_OVERFLOW_CLASSNAME} from "../consts";
import dayjs from "dayjs";

export const getRandomNumber = (min, max) => min + Math.floor(Math.random() * (max - min + 1));

export const getRandomBool = () => Boolean(getRandomNumber(0, 1));

export const shuffle = (list, isImmutable = true) => {
  const listCopy = (isImmutable) ? list.slice() : list;

  for (let i = listCopy.length - 1; i > 0; i--) {
    let j = getRandomNumber(0, i - 1);
    [listCopy[i], listCopy[j]] = [listCopy[j], listCopy[i]];
  }
  return listCopy;
};

export const getRandomChoice = (list) => {
  return list[getRandomNumber(0, list.length - 1)];
};

export const getRandomSlice = (list, length = null) => {
  return shuffle(list, true).slice(0, length || getRandomNumber(1, list.length));
};

export const getFilledList = (size, fillFunction) => new Array(size).fill(0).map(fillFunction);

export const capitalize = (string) => {
  if ((typeof string !== `string`) || (string.length === 0)) {
    return ``;
  }
  return `${string.charAt(0).toUpperCase()}${string.slice(1).toLowerCase()}`;
};

export const addClass = (element, className) => {
  element.classList.add(className);
};

export const removeClass = (element, className) => {
  element.classList.remove(className);
};

export const bodyNode = document.querySelector(`body`);
export const headerNode = document.querySelector(`header`);
export const mainNode = document.querySelector(`main`);
export const footerNode = document.querySelector(`footer`);
export const footerStatsNode = footerNode.querySelector(`.footer__statistics`);

export const setHideOverflow = () => addClass(bodyNode, HIDE_OVERFLOW_CLASSNAME);
export const unsetHideOverflow = () => removeClass(bodyNode, HIDE_OVERFLOW_CLASSNAME);

export const makeEscKeyDownHandler = (callback) => {
  const handler = (evt) => {
    evt.preventDefault();
    if (evt.key === `Escape` || evt.key === `Esc`) {
      callback();
      document.removeEventListener(`keydown`, handler);
    }
  };
  return handler;
};

export const addDocumentEscKeyDownHandler = (callback) => {
  document.addEventListener(`keydown`, makeEscKeyDownHandler(callback));
};

export const isNull = (value) => value === null;

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }
  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1)
  ];
};

export const dateComparator = (a, b) => dayjs(b.releaseDate).diff(dayjs(a.releaseDate));

export const ratingComparator = (a, b) => b.rating - a.rating;

export const commentsCountComparator = (a, b) => b.comments.length - a.comments.length;
