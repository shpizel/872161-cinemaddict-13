import {createElement} from "../../../utils";

export const getFilmsListTitleHTML = (message, isHidden = false) => {
  return `<h2 class="films-list__title${(isHidden) ? ` visually-hidden` : ``}">${message}</h2>`;
};

export default class FilmsListTitle {
  constructor(message, isHidden) {
    this._message = message;
    this._isHidden = isHidden;
    this._element = null;
  }

  getTemplate() {
    return getFilmsListTitleHTML(this._message, this._isHidden);
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
