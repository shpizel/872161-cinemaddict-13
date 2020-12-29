import {createElement} from "../utils";

const getSortingHTML = (items) => `<ul class="sort">
${items.map(({term, isActive}) => `
<li>
    <a href="#" class="sort__button sort__button-${term.toLowerCase()}${(isActive) ? ` sort__button--active` : ``}">Sort by ${term}</a>
</li>`).join(`\n`)}
</ul>`.trim();

export default class Sorting {
  constructor(items) {
    this._items = items;
    this._element = null;
  }

  getTemplate() {
    return getSortingHTML(this._items);
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
