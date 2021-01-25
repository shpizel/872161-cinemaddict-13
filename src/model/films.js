import Observer from "../utils/observer";
import {UpdateType} from "../consts";

export default class Films extends Observer {
  constructor(api) {
    super();

    this._api = api;
    this._films = [];
  }

  setFilms(films) {
    this._films = [...films];
    this._notify(UpdateType.INIT, this._films);
  }

  getFilms() {
    return this._films;
  }

  getFilmById(filmId) {
    return this._films.find(({id}) => id === filmId);
  }

  updateFilm(updateType, updatedFilm) {
    const index = this._films.findIndex((film) => film.id === updatedFilm.id);
    if (index === -1) {
      throw new Error(`Film doesn't exist`);
    }

    return this._api.updateFilm(updatedFilm)
      .then((filmFromServer) => {
        this._films = [
          ...this._films.slice(0, index),
          filmFromServer,
          ...this._films.slice(index + 1)
        ];
        this._notify(updateType, filmFromServer);
      })
    ;
  }

  static adaptFilmToClient(serverFilmObject) {
    const adaptedFilm = {
      id: serverFilmObject.id,
      comments: serverFilmObject.comments,
      title: serverFilmObject.film_info.title,
      originalTitle: serverFilmObject.film_info.alternative_title,
      rating: serverFilmObject.film_info.total_rating,
      poster: serverFilmObject.film_info.poster,
      ageRating: serverFilmObject.film_info.age_rating,
      director: serverFilmObject.film_info.director,
      writers: serverFilmObject.film_info.writers,
      actors: serverFilmObject.film_info.actors,
      releaseDate: new Date(serverFilmObject.film_info.release.date),
      country: serverFilmObject.film_info.release.release_country,
      duration: serverFilmObject.film_info.runtime,
      genres: serverFilmObject.film_info.genre,
      description: serverFilmObject.film_info.description,
      isInWatchlist: serverFilmObject.user_details.watchlist,
      isAlreadyWatched: serverFilmObject.user_details.already_watched,
      isInFavourites: serverFilmObject.user_details.favorite,
      watchingDate: new Date(serverFilmObject.user_details.watching_date)
    };

    return adaptedFilm;
  }

  static adaptFilmToServer(clientFilmObject) {
    const adaptedFilm = {
      'id': clientFilmObject.id,
      'comments': clientFilmObject.comments,
      'film_info': {
        'title': clientFilmObject.title,
        'alternative_title': clientFilmObject.originalTitle,
        'total_rating': clientFilmObject.rating,
        'poster': clientFilmObject.poster,
        'age_rating': clientFilmObject.ageRating,
        'director': clientFilmObject.director,
        'writers': clientFilmObject.writers,
        'actors': clientFilmObject.actors,
        'release': {
          'date': clientFilmObject.releaseDate.toISOString(),
          'release_country': clientFilmObject.country
        },
        'runtime': clientFilmObject.duration,
        'genre': clientFilmObject.genres,
        'description': clientFilmObject.description
      },
      'user_details': {
        'watchlist': clientFilmObject.isInWatchlist,
        'already_watched': clientFilmObject.isAlreadyWatched,
        'watching_date': clientFilmObject.watchingDate.toISOString(),
        'favorite': clientFilmObject.isInFavourites,
      }
    };

    return adaptedFilm;
  }
}
