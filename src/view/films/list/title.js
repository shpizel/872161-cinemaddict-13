import Abstract from "../../abstract";

export const getFilmsListTitleHTML = (message, isHidden = false) => {
  return `<h2 class="films-list__title${(isHidden) ? ` visually-hidden` : ``}">${message}</h2>`;
};

export default class FilmsListTitle extends Abstract {
  constructor(message, isHidden) {
    super();

    this._message = message;
    this._isHidden = isHidden;
  }

  getTemplate() {
    return getFilmsListTitleHTML(this._message, this._isHidden);
  }
}
