export const SHAKE_DURATION = 500;
export const HIDE_OVERFLOW_CLASSNAME = `hide-overflow`;
export const FILMS_PER_PAGE = 5;
export const EXTRA_FILMS_COUNT = 2;

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

export const FILM_DESCRIPTION_MAX_LENGTH = 140;

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

export const EMOTIONS = [
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

export const HttpSuccessStatusRange = {
  START: 200,
  END: 299
};

export const StatsPeriod = {
  ALL: `all-time`,
  TODAY: `day`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`
};

export const SiteState = {
  MOVIES: `MOVIES`,
  STATS: `STATS`
};

export const DeleteButtonText = {
  DEFAULT: `Delete`,
  IN_PROGRESS: `Deleting...`
};

