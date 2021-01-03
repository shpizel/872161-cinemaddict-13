import Abstract from "../abstract";

export const getFilmsSectionHTML = () => `<section class="films"></section>`;

export default class FilmsSection extends Abstract {
  constructor() {
    super();

    this._element = null;
  }

  getTemplate() {
    return getFilmsSectionHTML();
  }
}
