import dayjs from "dayjs";
import {PROFILE_RANKS} from "../consts";

export const capitalize = (string) => {
  if ((typeof string !== `string`) || (string.length === 0)) {
    return ``;
  }
  return `${string.charAt(0).toUpperCase()}${string.slice(1).toLowerCase()}`;
};

export const addClass = (element, className) => element.classList.add(className);

export const removeClass = (element, className) => element.classList.remove(className);

export const bodyNode = document.querySelector(`body`);
export const headerNode = document.querySelector(`header`);
export const mainNode = document.querySelector(`main`);
export const footerNode = document.querySelector(`footer`);
export const footerStatsNode = footerNode.querySelector(`.footer__statistics`);

export const makeEscKeyDownHandler = (callback) => {
  const handler = (evt) => {
    if ([`Escape`, `Esc`].includes(evt.key)) {
      evt.preventDefault();
      callback();
      document.removeEventListener(`keydown`, handler);
    }
  };
  return handler;
};

export const isNull = (value) => value === null;

export const releaseDateComparator = (a, b) => dayjs(b.releaseDate).diff(dayjs(a.releaseDate));

export const ratingComparator = (a, b) => b.rating - a.rating;

export const commentsCountComparator = (a, b) => b.comments.length - a.comments.length;

export const formatDate = (date) => {
  const dt = dayjs(date);
  const now = dayjs();
  const minutes = Math.abs(dt.diff(now, `m`));
  const hours = Math.abs(dt.diff(now, `h`));
  const days = Math.abs(dt.diff(now, `d`));
  const months = Math.abs(dt.diff(now, `M`));
  const years = Math.abs(dt.diff(now, `y`));

  if (minutes < 1) {
    return `now`;
  }
  if (minutes < 60) {
    return `${(minutes < 5) ? `A few` : minutes} minutes ago`;
  }

  if (hours < 24) {
    return `${hours} hour${(hours > 1) ? `s` : ``} ago`;
  }

  if (months < 1) {
    return `${days} day${(days > 1) ? `s` : ``} ago`;
  }

  if (years < 1) {
    return `${months} month${(months > 1) ? `s` : ``} ago`;
  }

  return `${years} year${(years > 1) ? `s` : ``} ago`;
};

export const getProfileRank = (filmsCount) => {
  const [rank] = Object.entries(PROFILE_RANKS).find(([, {start, end}]) => filmsCount >= start && filmsCount <= end);
  return rank;
};
