import dayjs from 'dayjs';
import {getRandomNumber} from "../utils";

export const getRandomDate = () => {
  return dayjs().subtract(getRandomNumber(0, 365), `day`);
};
