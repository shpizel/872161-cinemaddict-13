import Abstract from "./abstract";
import {capitalize} from "../utils/common";
import {getProfileRank} from "../consts";

const getProfileHTML = (filmsWatched) => {
  return `<section class="header__profile profile">
  <p class="profile__rating">${capitalize(getProfileRank(filmsWatched))}</p>
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
