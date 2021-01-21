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
}
