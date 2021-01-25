import Abstract from "./abstract";
import {isNull} from "../utils/common";

const getSiteMenuHTML = (filters, isStatsEnabled) => `<nav class="main-navigation">
  <div class="main-navigation__items">
${filters.map(({name, isActive, counter}) => `
    <a href="#" data-filter-type="${name}" class="main-navigation__item${(isActive && !isStatsEnabled) ? ` main-navigation__item--active` : ``}">${name}${(!isNull(counter)) ? ` <span class="main-navigation__item-count">${counter}</span>` : ``}</a>
`.trim()).join(`\n`)}
  </div>
  <a href="#stats" class="main-navigation__additional${(isStatsEnabled) ? ` main-navigation__item--active` : ``}">Stats</a>
</nav>`;

export default class SiteMenu extends Abstract {
  constructor(filters, isStatsEnabled) {
    super();
    this._filters = filters;
    this._isStatsEnabled = isStatsEnabled;
    this._menuClickHandler = this._menuClickHandler.bind(this);
    this._statsClickHandler = this._statsClickHandler.bind(this);
  }

  getTemplate() {
    return getSiteMenuHTML(this._filters, this._isStatsEnabled);
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    const currentFilterType = evt.currentTarget.dataset.filterType;
    this._callback.click(currentFilterType);
  }

  setMenuClickHandler(callback) {
    this._callback.click = callback;
    this._menuItemsNodes.forEach((node) => node.addEventListener(`click`, this._menuClickHandler));
  }

  _statsClickHandler(evt) {
    evt.preventDefault();
    this._callback.statsClick();
  }

  setStatsClickHandler(callback) {
    this._callback.statsClick = callback;
    this._statsNode.addEventListener(`click`, this._statsClickHandler);
  }

  get _menuItemsNodes() {
    return this.querySelectorAll(`.main-navigation__item`);
  }

  get _statsNode() {
    return this.querySelector(`.main-navigation__additional`);
  }
}
