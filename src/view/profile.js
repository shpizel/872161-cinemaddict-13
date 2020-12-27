import {capitalize} from "../tools";

export const getProfileHTML = (filmsWatched) => {
  let rank = ``;
  if (filmsWatched >= 1 && filmsWatched <= 10) {
    rank = `novice`;
  } else if (filmsWatched >= 11 && filmsWatched <= 20) {
    rank = `fan`;
  } else if (filmsWatched >= 21) {
    rank = `movie buff`;
  }
  return `
<section class="header__profile profile">
  <p class="profile__rating">${capitalize(rank)}</p>
  <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
</section>`;
};
