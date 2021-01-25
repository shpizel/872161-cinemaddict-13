import MoviesInside from "../view/movies-inside";
import {remove, render, replace} from "../utils/render";
import {isNull} from "../utils/common";

export default class FilmsCounter {
  constructor(container, filmsModel) {
    this._container = container;
    this._filmsModel = filmsModel;
    this._counterView = null;

    this._handleFilmsModelEvent = this._handleFilmsModelEvent.bind(this);
    this._filmsModel.addObserver(this._handleFilmsModelEvent);
  }

  init() {
    const prevCounter = this._counterView;
    const filmsCount = this._filmsModel.getFilms().length;
    this._counterView = new MoviesInside(filmsCount);

    if (isNull(prevCounter)) {
      render(this._counterView, this._container);
      return;
    }

    replace(this._counterView, prevCounter);
    remove(prevCounter);
  }

  _handleFilmsModelEvent() {
    this.init();
  }
}
