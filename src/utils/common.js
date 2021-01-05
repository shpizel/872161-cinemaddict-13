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
  if (!element.classList.contains(className)) {
    element.classList.add(className);
  }
};

export const removeClass = (element, className) => {
  if (element.classList.contains(className)) {
    element.classList.remove(className);
  }
};

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
