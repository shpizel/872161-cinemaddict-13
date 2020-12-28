import {capitalize} from "../utils";
import {PROFILE_RANKS} from "../consts";

export const getProfileHTML = (filmsWatched) => {
  const getRank = (count) => {
    const ranksFiltered = Object.entries(PROFILE_RANKS).filter(([, {start, end}]) => count >= start && count <= end);
    return (ranksFiltered.length > 0) ? ranksFiltered[0][0] : ``;
  };
  return `
<section class="header__profile profile">
  <p class="profile__rating">${capitalize(getRank(filmsWatched))}</p>
  <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
</section>`;
};
