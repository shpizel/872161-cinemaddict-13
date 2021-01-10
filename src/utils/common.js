import dayjs from "dayjs";

export const equals = (one, two) => one === two;

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
  if (!equals(typeof string, `string`) || equals(string.length, 0)) {
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

export const makeEscKeyDownHandler = (callback) => {
  const handler = (evt) => {
    if ([`Escape`, `Esc`].includes(evt.key)) {
      evt.preventDefault();
      callback();
      document.removeEventListener(`keydown`, handler);
    }
  };
  return handler;
};

export const addDocumentEscKeyDownHandler = (callback) => {
  document.addEventListener(`keydown`, makeEscKeyDownHandler(callback));
};

export const isNull = (value) => equals(value, null);

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => equals(item.id, update.id));

  if (equals(index, -1)) {
    return items;
  }
  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1)
  ];
};

export const mergeObjects = (base, patch) => Object.assign({}, base, patch);
export const cloneObject = (object) => Object.assign({}, object);

export const dateComparator = (a, b) => dayjs(b.releaseDate).diff(dayjs(a.releaseDate));

export const ratingComparator = (a, b) => b.rating - a.rating;

export const commentsCountComparator = (a, b) => b.comments.length - a.comments.length;

export const asList = (data) => Array.from(data);

export const formatDate = (date) => {
  const dt = dayjs(date);
  const now = dayjs();
  const diff = {
    m: Math.abs(dt.diff(now, `m`)),
    h: Math.abs(dt.diff(now, `h`)),
    d: Math.abs(dt.diff(now, `d`)),
    M: Math.abs(dt.diff(now, `M`)),
    y: Math.abs(dt.diff(now, `y`))
  };
  if (diff.m < 1) {
    return `now`;
  } else if (diff.m >= 1 && diff.m < 5) {
    return `a few minutes ago`;
  } else if (diff.m >= 5 && diff.m < 60) {
    return `${Math.floor(diff.m)} minutes ago`;
  } else if (equals(diff.h, 1)) {
    return `1 hour ago`;
  } else if (diff.h > 1 && diff.h < 24) {
    return `${Math.floor(diff.h)} hours ago`;
  } else if (equals(diff.d, 1)) {
    return `1 day ago`;
  } else if (diff.d > 1 && diff.M < 1) {
    return `${Math.floor(diff.d)} days ago`;
  } else if (equals(diff.M, 1)) {
    return `1 month ago`;
  } else if (diff.M > 1 && diff.y < 1) {
    return `${Math.floor(diff.M)} month ago`;
  } else if (equals(diff.y, 1)) {
    return `1 year ago`;
  } else if (diff.y > 1) {
    return `${Math.floor(diff.y)} years ago`;
  }
  return dt.format(`YYYY/MM/DD HH:mm`);
};

export const ternary = (cond, yes, no) => (cond) ? yes : no;
