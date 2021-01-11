import {FilterType} from "../consts";
import {FilmsFilter} from "../utils/film";

const getFilter = (name, isActive, counter) => {
  return {
    name,
    isActive,
    counter
  };
};

export const getFilters = (films, activeFilter = FilterType.ALL) => {
  return Object.entries(FilterType).map(([, value]) => {
    return getFilter(value, activeFilter === value, (value !== FilterType.ALL) ? FilmsFilter[value](films).length : null);
  });
};
