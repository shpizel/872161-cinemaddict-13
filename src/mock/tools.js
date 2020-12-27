import dayjs from 'dayjs';
import {getRandomNumber} from "../tools";

export const getRandomDate = () => {
  return dayjs().subtract(getRandomNumber(0, 365), `day`);
};
