import {createElement} from "../utils";

const getMoviesInsideHTML = (filmsCount) => `<p>${filmsCount} movies inside</p>`;

export default class MoviesInside {
  constructor(filmsCount) {
    this._filmsCount = filmsCount;
    this._element = null;
  }

  getTemplate() {
    return getMoviesInsideHTML(this._filmsCount);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
