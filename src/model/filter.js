import Observer from "../utils/observer";
import {FilterType} from "../consts";

export default class Filter extends Observer {
  constructor(defaultFilter = FilterType.ALL) {
    super();
    this._filter = defaultFilter;
  }

  setFilter(updateType, filter) {
    if (filter === this.getFilter()) {
      return;
    }
    this._filter = filter;
    this._notify(updateType, filter);
  }

  getFilter() {
    return this._filter;
  }
}
