import {FilterType} from "../consts";

export const getFilmDuration = (duration) => {
  return `${Math.round(duration / 60)}h${(duration % 60) ? ` ${duration % 60}m` : ``}`;
};

export const FilmsFilter = {
  [FilterType.ALL]: (films) => films,
  [FilterType.WATCHLIST]: (films) => films.filter((film) => (film.isInWatchlist)),
  [FilterType.WATCHED]: (films) => films.filter((film) => (film.isAlreadyWatched)),
  [FilterType.FAVOURITES]: (films) => films.filter((film) => (film.isInFavourites))
};
