import {nanoid} from 'nanoid';
import {getRandomChoice} from "../tools";
import {getRandomDate} from "./tools";
import {AUTHORS, EMOTIONS, MESSAGES} from "./comments-consts";


export const getRandomComment = () => {
  const id = nanoid();
  const author = getRandomChoice(AUTHORS);
  const comment = getRandomChoice(MESSAGES);
  const date = getRandomDate();
  const emotion = getRandomChoice(EMOTIONS);
  return {
    id,
    author,
    comment,
    date,
    emotion
  };
};
