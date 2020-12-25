export const getRandomNumber = (min, max) => min + Math.floor(Math.random() * (max - min + 1));

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

export const getRandomSlice = (list, length) => {
  return shuffle(list, true).slice(0, length);
};

export const getFilledList = (size, fillFunction) => new Array(size).fill(0).map(fillFunction);
