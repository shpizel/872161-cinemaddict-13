import {FilterType} from "../consts";
import {filter} from "./film";

const getFilter = (name, isActive, counter) => ({name, isActive, counter});

export const getFilters = (films, activeFilter = FilterType.ALL) => {
  return Object.entries(FilterType).map(([, value]) => {
    const isActive = activeFilter === value;
    const counter = (value !== FilterType.ALL) ? filter[value](films).length : null;
    return getFilter(value, isActive, counter);
  });
};
