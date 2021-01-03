import Abstract from "./abstract";

const getMoviesInsideHTML = (filmsCount) => `<p>${filmsCount} movies inside</p>`;

export default class MoviesInside extends Abstract {
  constructor(filmsCount) {
    super();

    this._filmsCount = filmsCount;
  }

  getTemplate() {
    return getMoviesInsideHTML(this._filmsCount);
  }
}
