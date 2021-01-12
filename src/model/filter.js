import Observer from "../utils/observer";
import {FilterType} from "../consts";

export default class Filter extends Observer {
  constructor(defaultFilter = FilterType.ALL) {
    super();
    this._filter = defaultFilter;
  }

  setFilter(updateType, filter) {
    this._filter = filter;
    this._notify(updateType, filter);
  }

  getFilter() {
    return this._filter;
  }

  updateFilter(newFilter) {
    if (newFilter === this.getFilter()) {
      return;
    }
    this.setFilter(newFilter);
  }
}
