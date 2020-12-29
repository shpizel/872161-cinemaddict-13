import {capitalize} from "../utils";
import {PROFILE_RANKS} from "../consts";

export const getProfileHTML = (filmsWatched) => {
  const getRank = (count) => {
    const rank = Object.entries(PROFILE_RANKS).find(([, {start, end}]) => count >= start && count <= end);
    return (rank) ? rank[0] : ``;
  };
  return `
<section class="header__profile profile">
  <p class="profile__rating">${capitalize(getRank(filmsWatched))}</p>
  <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
</section>`;
};
