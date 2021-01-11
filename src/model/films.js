import Observer from "../utils/observer";

export default class Films extends Observer {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(films) {
    this._films = [...films];
  }

  getFilms() {
    return this._films;
  }

  updateFilm(updateType, updatedFilm) {
    const index = this._films.findIndex((film) => film.id === updatedFilm.id);
    if (index === -1) {
      throw new Error(`Film doesn't exist`);
    }

    this._films = [
      ...this._films.slice(0, index),
      updatedFilm,
      ...this._films.slice(index + 1)
    ];
    this._notify(updateType, updatedFilm);
  }
}
