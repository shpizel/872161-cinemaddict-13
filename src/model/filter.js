import Observer from "../utils/observer";
import {FilterType, UserAction} from "../consts";

export default class Filter extends Observer {
  constructor(defaultFilter = FilterType.ALL) {
    super();
    this._filter = defaultFilter;
  }

  setFilter(filter) {
    this._filter = filter;
  }

  getFilter() {
    return this._filter;
  }

  updateFilter(newFilter) {
    if (newFilter === this.getFilter()) {
      return;
    }
    this._filter = newFilter;
    this._notify(UserAction.UPDATE_FILTER, this._filter);
  }
}
