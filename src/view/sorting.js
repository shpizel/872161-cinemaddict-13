import Abstract from "./abstract";
import {addClass, removeClass} from "../utils/common";
import {SortType} from "../consts";

const SORT_BUTTON_ACTIVE_CLASS = `sort__button--active`;

const getSortingHTML = (currentSortType) => `<ul class="sort">
${Object.entries(SortType).map(([, sortType]) => `
<li>
    <a href="#" data-sort-type="${sortType}" class="sort__button${(currentSortType === sortType) ? ` ${SORT_BUTTON_ACTIVE_CLASS}` : ``}">Sort by ${sortType}</a>
</li>`).join(`\n`)}
</ul>`;

export default class Sorting extends Abstract {
  constructor(sortType) {
    super();

    this._currentSortType = sortType;
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return getSortingHTML(this._currentSortType);
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
