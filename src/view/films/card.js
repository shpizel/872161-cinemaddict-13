import dayjs from "dayjs";
import Abstract from "../abstract";
import {FILMS_DESCRIPTION_MAX_LENGTH} from "../../consts";
import {getFilmDuration} from "../../utils/film";

const getFilmCardHTML = (film) => {
  const duration = getFilmDuration(film.duration);
  const year = dayjs(film.release_date).year();

  return `<article class="film-card">
  <h3 class="film-card__title">${film.title}</h3>
  <p class="film-card__rating">${film.rating}</p>
  <p class="film-card__info">
    <span class="film-card__year">${year}</span>
    <span class="film-card__duration">${duration}</span>
    ${film.genres.map((genre) => `<span class="film-card__genre">${genre}</span>`).join(`\n`)}
  </p>
  <img src="./images/posters/${film.poster}" alt="" class="film-card__poster">
  <p class="film-card__description">${film.description.substr(0, FILMS_DESCRIPTION_MAX_LENGTH)}…</p>
  <a class="film-card__comments">${film.comments.length} comments</a>
  <div class="film-card__controls">
    <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist${film.isInWatchlist ? ` film-card__controls-item--active` : ``}" type="button">Add to watchlist</button>
    <button class="film-card__controls-item button film-card__controls-item--mark-as-watched${film.isAlreadyWatched ? ` film-card__controls-item--active` : ``}" type="button">Mark as watched</button>
    <button class="film-card__controls-item button film-card__controls-item--favorite${film.isInFavourites ? ` film-card__controls-item--active` : ``}" type="button">Mark as favorite</button>
  </div>
</article>`;
};

export default class FilmCard extends Abstract {
  constructor(film) {
    super();

    this._film = film;
    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return getFilmCardHTML(this._film);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    [`.film-card__poster`, `.film-card__comments`].forEach((className) => {
      this.getElement().querySelector(className).addEventListener(`click`, this._clickHandler);
    });
  }
}
