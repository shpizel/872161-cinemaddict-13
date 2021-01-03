import {getRandomNumber} from "./utils/common";


const FILMS_COUNT_MIN = 15;
const FILMS_COUNT_MAX = 20;
export const FILMS_COUNT = getRandomNumber(FILMS_COUNT_MIN, FILMS_COUNT_MAX);
export const FILMS_PER_PAGE = 5;
export const EXTRA_FILMS_COUNT = 2;
export const IS_AJAX_WORKS = getRandomNumber(0, 5) !== 0;
export const LOADING_TIMEOUT = 300;
export const HIDE_OVERFLOW_CLASSNAME = `hide-overflow`;

export const Messages = {
  ALL_MOVIES: `All movies. Upcoming`,
  LOADING: `Loading...`,
  NO_MOVIES: `There are no movies in our database`
};

export const EXTRA_SECTIONS = [
  {title: `Top rated`},
  {title: `Most commented`}
];

const makeInterval = (start = -Infinity, end = Infinity) => ({start, end});

export const PROFILE_RANKS = {
  '': makeInterval(0, 0),
  'novice': makeInterval(1, 10),
  'fan': makeInterval(11, 20),
  'movie buff': makeInterval(21)
};

export const FILMS_DESCRIPTION_MAX_LENGTH = 140;
