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
    getFilter(`All movies`, true, null),
    getFilter(`Watchlist`, false, getFilmsCountByField(films, `isInWatchlist`)),
    getFilter(`History`, false, getFilmsCountByField(films, `isAlreadyWatched`)),
    getFilter(`Favourites`, false, getFilmsCountByField(films, `isInFavourites`)),
  ];
};
