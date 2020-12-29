import {createElement} from "../utils";

const getMenuHTML = (filters) => `<nav class="main-navigation">
  <div class="main-navigation__items">
${filters.map(({name, isActive, counter}) => `
    <a href="#${name.toLowerCase().replace(` `, `_`)}" class="main-navigation__item main-navigation__item--${name.toLowerCase()}${(isActive) ? ` main-navigation__item--active` : ``}">${name}${(counter !== null) ? ` <span class="main-navigation__item-count">${counter}</span>` : ``}</a>
`.trim()).join(`\n`)}
  </div>
  <a href="#stats" class="main-navigation__additional">Stats</a>
</nav>`;

export default class Menu {
  constructor(filters) {
    this._filters = filters;
    this._element = null;
  }

  getTemplate() {
    return getMenuHTML(this._filters).trim();
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
