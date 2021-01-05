import Abstract from "../../abstract";

const getFilmsListSectionHTML = (isExtra) => {
  return `<section class="films-list${(isExtra) ? ` films-list--extra` : ``}"></section>`;
};

export default class FilmsListSection extends Abstract {
  constructor(isExtra) {
    super();

    this._isExtra = isExtra;
  }

  getTemplate() {
    return getFilmsListSectionHTML(this._isExtra);
  }
}
