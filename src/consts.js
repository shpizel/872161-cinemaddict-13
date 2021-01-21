import {getRandomNumber} from "./utils/common";

export const HIDE_OVERFLOW_CLASSNAME = `hide-overflow`;
const FILMS_COUNT_MIN = 15;
const FILMS_COUNT_MAX = 20;
export const FILMS_COUNT = getRandomNumber(FILMS_COUNT_MIN, FILMS_COUNT_MAX);
export const FILMS_PER_PAGE = 5;
export const EXTRA_FILMS_COUNT = 2;
export const LOADING_TIMEOUT = 300;


export const Message = {
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

export const FilterType = {
  ALL: `All movies`,
  WATCHED: `Watchlist`,
  WATCHLIST: `History`,
  FAVOURITES: `Favourites`
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
  writers: [],
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

export const EMOTION = [
  `smile`,
  `angry`,
  `puke`,
  `sleeping`,
];

export const Category = Object.assign({}, FilterType);

export const UserAction = {
  DELETE_COMMENT: `DELETE_COMMENT`,
  ADD_COMMENT: `ADD_COMMENT`,
  UPDATE_FILM_CATEGORY: `UPDATE_FILM_CATEGORY`,
  UPDATE_FILTER: `UPDATE_FILTER`
};

export const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`,
  INIT: `INIT`
};

export const HttpMethod = {
  GET: `GET`,
  PUT: `PUT`,
  POST: `POST`,
  DELETE: `DELETE`
};

export const SuccessStatusRange = makeInterval(200, 299);

export const StatsPeriod = {
  ALL: `all-time`,
  TODAY: `day`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`
};

export const getProfileRank = (count) => {
  const rank = Object.entries(PROFILE_RANKS).find(([, {start, end}]) => count >= start && count <= end);
  return (rank) ? rank[0] : ``;
};

export const SiteState = {
  MOVIES: `MOVIES`,
  STATS: `STATS`
};
