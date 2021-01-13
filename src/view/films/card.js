import dayjs from "dayjs";
import Abstract from "../abstract";
import {FILMS_DESCRIPTION_MAX_LENGTH} from "../../consts";
import {getFilmDuration} from "../../utils/film";

const getFilmCardHTML = (film, commentsCount) => {
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
  <a class="film-card__comments">${commentsCount} comment${(commentsCount > 1) ? `s` : ``}</a>
  <div class="film-card__controls">
    <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist${film.isInWatchlist ? ` film-card__controls-item--active` : ``}" type="button">Add to watchlist</button>
    <button class="film-card__controls-item button film-card__controls-item--mark-as-watched${film.isAlreadyWatched ? ` film-card__controls-item--active` : ``}" type="button">Mark as watched</button>
    <button class="film-card__controls-item button film-card__controls-item--favorite${film.isInFavourites ? ` film-card__controls-item--active` : ``}" type="button">Mark as favorite</button>
  </div>
</article>`;
};

export default class FilmCard extends Abstract {
  constructor(film, comments) {
    super();

    this._film = film;
    this._comments = comments;
    this._clickHandler = this._clickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._favouriteClickHandler = this._favouriteClickHandler.bind(this);
  }

  getTemplate() {
    return getFilmCardHTML(this._film, this._comments);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click(this._film.id);
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    [`.film-card__poster`, `.film-card__comments`].forEach((className) => {
      this.querySelector(className).addEventListener(`click`, this._clickHandler);
    });
  }

  _favouriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favouriteClick();
  }

  setFavouriteClickHandler(callback) {
    this._callback.favouriteClick = callback;
    this.querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, this._favouriteClickHandler);
  }

  _watchedClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchedClick();
  }

  setWatchedClickHandler(callback) {
    this._callback.watchedClick = callback;
    this.querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, this._watchedClickHandler);
  }

  _watchlistClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchlistClick();
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, this._watchlistClickHandler);
  }
}
