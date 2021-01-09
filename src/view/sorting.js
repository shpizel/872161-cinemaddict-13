import Abstract from "./abstract";
import {addClass, removeClass} from "../utils/common";

const SORT_BUTTON_ACTIVE_CLASS = `sort__button--active`;

const getSortingHTML = (items) => `<ul class="sort">
${items.map(({sortType, isActive}) => `
<li>
    <a href="#" data-sort-type="${sortType}" class="sort__button${(isActive) ? ` ${SORT_BUTTON_ACTIVE_CLASS}` : ``}">Sort by ${sortType}</a>
</li>`).join(`\n`)}
</ul>`;

export default class Sorting extends Abstract {
  constructor(items) {
    super();

    this._items = items;
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return getSortingHTML(this._items);
  }

  _sortTypeChangeHandler(evt) {
    evt.preventDefault();
    const {target: currentSortButton} = evt;
    const activeSortButton = this.querySelector(`.${SORT_BUTTON_ACTIVE_CLASS}`);
    if (currentSortButton.tagName !== `A` || !activeSortButton) {
      return;
    }

    this._callback.sortTypeChange(currentSortButton.dataset.sortType);

    if (!currentSortButton.classList.contains(SORT_BUTTON_ACTIVE_CLASS)) {
      activeSortButton.classList.remove(SORT_BUTTON_ACTIVE_CLASS);
      removeClass(activeSortButton, SORT_BUTTON_ACTIVE_CLASS);
      addClass(currentSortButton, SORT_BUTTON_ACTIVE_CLASS);
    }
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener(`click`, this._sortTypeChangeHandler);

  }
}
