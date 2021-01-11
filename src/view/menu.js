import Abstract from "./abstract";
import {isNull} from "../utils/common";

const getMenuHTML = (filters) => `<nav class="main-navigation">
  <div class="main-navigation__items">
${filters.map(({name, isActive, counter}) => `
    <a href="#" data-filter-type="${name}" class="main-navigation__item${(isActive) ? ` main-navigation__item--active` : ``}">${name}${(!isNull(counter)) ? ` <span class="main-navigation__item-count">${counter}</span>` : ``}</a>
`.trim()).join(`\n`)}
  </div>
  <a href="#stats" class="main-navigation__additional">Stats</a>
</nav>`;

export default class Menu extends Abstract {
  constructor(filters) {
    super();
    this._filters = filters;
    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return getMenuHTML(this._filters);
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    const currentFilterType = evt.currentTarget.dataset.filterType;
    this._callback.click(currentFilterType);
  }

  setMenuClickHandler(callback) {
    this._callback.click = callback;
    this._menuItems.forEach((node) => node.addEventListener(`click`, this._menuClickHandler));
  }

  get _menuItems() {
    return this.querySelectorAll(`.main-navigation__item`);
  }
}
