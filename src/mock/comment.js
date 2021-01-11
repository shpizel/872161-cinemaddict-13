import {nanoid} from 'nanoid';
import {getRandomDate} from "./tools";
import {AUTHORS, MESSAGES} from "./comments-consts";
import {getRandomChoice} from "../utils/common";
import {EMOTION} from "../consts";


export const getRandomComment = () => {
  const id = nanoid();
  const author = getRandomChoice(AUTHORS);
  const comment = getRandomChoice(MESSAGES);
  const date = getRandomDate();
  const emotion = getRandomChoice(EMOTION);
  return {
    id,
    author,
    comment,
    date,
    emotion
  };
};
