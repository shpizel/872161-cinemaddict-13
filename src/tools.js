export const render = (html, target, where = `beforeend`) => target.insertAdjacentHTML(where, html);

export const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * i);
    let temp = a[i];
    a[i] = a[j];
    a[j] = temp;
  }
  return a;
};

export const getRandomNumber = (min, max) => min + Math.floor(Math.random() * (max - min + 1));

export const getRandomChoice = (array, length) => {
  return (length) ? shuffle(array).slice(0, length) : array[getRandomNumber(0, array.length - 1)];
};

export const getFilledArray = (size, fillFunction) => new Array(size).fill(0).map(fillFunction);
