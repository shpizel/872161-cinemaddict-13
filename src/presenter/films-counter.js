import MoviesInside from "../view/movies-inside";
import {remove, render, replace} from "../utils/render";

export default class FilmsCounter {
  constructor(container, filmsModel) {
    this._container = container;
    this._filmsModel = filmsModel;
    this._handleFilmModelEvent = this._handleFilmModelEvent.bind(this);
    this._filmsModel.addObserver(this._handleFilmModelEvent);
  }

  init() {
    const prevCounter = this._counter;
    const filmsCount = this._filmsModel.getFilms().length;
    this._counter = new MoviesInside(filmsCount);

    if (!prevCounter) {
      render(this._counter, this._container);
      return;
    }

    replace(this._counter, prevCounter);
    remove(prevCounter);
  }

  _handleFilmModelEvent() {
    this.init();
  }
}
