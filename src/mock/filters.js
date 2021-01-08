import {FilmFilter} from "../consts";

const getFilter = (name, isActive, counter) => {
  return {
    name,
    isActive,
    counter
  };
};

const getFilmsCountByField = (films, field) => {
  return films.filter((film) => film[field]).length;
};

export const getFilters = (films) => {
  return [
    getFilter(FilmFilter.ALL, true, null),
    getFilter(FilmFilter.WATCHLIST, false, getFilmsCountByField(films, `isInWatchlist`)),
    getFilter(FilmFilter.WATCHED, false, getFilmsCountByField(films, `isAlreadyWatched`)),
    getFilter(FilmFilter.FAVOURITE, false, getFilmsCountByField(films, `isInFavourites`)),
  ];
};
