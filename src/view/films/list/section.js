import {createElement} from "../../../utils";

const getFilmsListSectionHTML = (isExtra) => {
  return `<section class="films-list${(isExtra) ? ` films-list--extra` : ``}"></section>`;
};

export default class FilmsListSection {
  constructor(isExtra) {
    this._isExtra = isExtra;
    this._element = null;
  }

  getTemplate() {
    return getFilmsListSectionHTML(this._isExtra);
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
