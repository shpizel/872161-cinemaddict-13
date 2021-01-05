import {PROFILE_RANKS} from "../consts";
import Abstract from "./abstract";
import {capitalize} from "../utils/common";

const getProfileHTML = (filmsWatched) => {
  const getRank = (count) => {
    const rank = Object.entries(PROFILE_RANKS).find(([, {start, end}]) => count >= start && count <= end);
    return (rank) ? rank[0] : ``;
  };
  return `<section class="header__profile profile">
  <p class="profile__rating">${capitalize(getRank(filmsWatched))}</p>
  <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
</section>`;
};

export default class Profile extends Abstract {
  constructor(filmsWatched) {
    super();

    this._filmsWatched = filmsWatched;
  }

  getTemplate() {
    return getProfileHTML(this._filmsWatched);
  }
}
