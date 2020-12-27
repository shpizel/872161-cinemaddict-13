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
  if (typeof string !== `string`) {
    return ``;
  }
  if (string.length === 0) {
    return ``;
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
};
