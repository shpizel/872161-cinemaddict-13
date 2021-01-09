import {getRandomNumber} from "./utils/common";


export const HIDE_OVERFLOW_CLASSNAME = `hide-overflow`;
const FILMS_COUNT_MIN = 15;
const FILMS_COUNT_MAX = 20;
export const FILMS_COUNT = getRandomNumber(FILMS_COUNT_MIN, FILMS_COUNT_MAX);
export const FILMS_PER_PAGE = 5;
export const EXTRA_FILMS_COUNT = 2;
export const IS_AJAX_WORKS = getRandomNumber(0, 5) !== 0;
export const LOADING_TIMEOUT = 300;


export const Messages = {
  ALL_MOVIES: `All movies. Upcoming`,
  LOADING: `Loading...`,
  NO_MOVIES: `There are no movies in our database`
};

export const ExtraSection = {
  TOP_RATED: `Top rated`,
  MOST_COMMENTED: `Most commented`
};

export const SortType = {
  DEFAULT: `default`,
  DATE: `date`,
  RATING: `rating`
};

export const FilmFilter = {
  ALL: `All movies`,
  WATCHED: `Watchlist`,
  WATCHLIST: `History`,
  FAVOURITE: `Favourites`
};

export const Mode = {
  DEFAULT: `default`,
  POPUP: `popup`
};

const makeInterval = (start = -Infinity, end = Infinity) => ({start, end});

export const PROFILE_RANKS = {
  '': makeInterval(0, 0),
  'novice': makeInterval(1, 10),
  'fan': makeInterval(11, 20),
  'movie buff': makeInterval(21)
};

export const FILMS_DESCRIPTION_MAX_LENGTH = 140;

export const BLANK_FILM = {
  id: ``,
  title: ``,
  originalTitle: ``,
  director: ``,
  writers: ``,
  releaseDate: ``,
  duration: 0,
  ageRating: 0,
  rating: 0.0,
  genres: [],
  country: ``,
  actors: [],
  poster: ``,
  description: ``,
  comments: [],
  isInWatchlist: null,
  isAlreadyWatched: null,
  isInFavourites: null
};

export const EMOTIONS = [
  `smile`,
  `angry`,
  `puke`,
  `sleeping`,
];
