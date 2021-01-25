import dayjs from "dayjs";
import Abstract from "../abstract";
import {FILM_DESCRIPTION_MAX_LENGTH} from "../../consts";
import {getFilmDuration} from "../../utils/film";

const BUTTON_CLASSNAME = `film-card__controls-item`;
const ACTIVE_BUTTON_CLASSNAME = `${BUTTON_CLASSNAME}--active`;

const getFilmCardHTML = (film) => {
  const commentsCount = film.comments.length;
  const duration = getFilmDuration(film.duration);
  const year = dayjs(film.releaseDate).year();

  return `<article class="film-card">
  <h3 class="film-card__title">${film.title}</h3>
  <p class="film-card__rating">${film.rating}</p>
  <p class="film-card__info">
    <span class="film-card__year">${year}</span>
    <span class="film-card__duration">${duration}</span>
    ${film.genres.map((genre) => `<span class="film-card__genre">${genre}</span>`).join(`\n`)}
  </p>
  <img src="${film.poster}" alt="" class="film-card__poster">
  <p class="film-card__description">${film.description.substr(0, FILM_DESCRIPTION_MAX_LENGTH)}…</p>
  <a class="film-card__comments">${commentsCount} comment${(commentsCount > 1) ? `s` : ``}</a>
  <div class="film-card__controls">
    <button class="button ${BUTTON_CLASSNAME} ${BUTTON_CLASSNAME}--add-to-watchlist${film.isInWatchlist ? ` ${ACTIVE_BUTTON_CLASSNAME}` : ``}" type="button">Add to watchlist</button>
    <button class="button ${BUTTON_CLASSNAME} ${BUTTON_CLASSNAME}--mark-as-watched${film.isAlreadyWatched ? ` ${ACTIVE_BUTTON_CLASSNAME}` : ``}" type="button">Mark as watched</button>
    <button class="button ${BUTTON_CLASSNAME} ${BUTTON_CLASSNAME}--favorite${film.isInFavourites ? ` ${ACTIVE_BUTTON_CLASSNAME}` : ``}" type="button">Mark as favorite</button>
  </div>
</article>`;
};

export default class FilmCard extends Abstract {
  constructor(film) {
    super();

    this._film = film;

    this._clickHandler = this._clickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._watchlistButtonClickHandler = this._watchlistButtonClickHandler.bind(this);
    this._favouriteClickHandler = this._favouriteClickHandler.bind(this);
  }

  getTemplate() {
    return getFilmCardHTML(this._film);
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

  setFavouriteClickHandler(callback) {
    this._callback.addToFavourites = callback;
    this._addToFavouritesButtonNode.addEventListener(`click`, this._favouriteClickHandler);
  }

  _favouriteClickHandler(evt) {
    evt.preventDefault();
    evt.target.disabled = true;
    this._callback.addToFavourites();
  }

  setWatchedClickHandler(callback) {
    this._callback.markAsWatched = callback;
    this._markAsWatchedButtonNode.addEventListener(`click`, this._watchedClickHandler);
  }

  _watchedClickHandler(evt) {
    evt.preventDefault();
    evt.target.disabled = true;
    this._callback.markAsWatched();
  }

  setWatchlistClickHandler(callback) {
    this._callback.addToWatchlist = callback;
    this._addToWatchlistButtonNode.addEventListener(`click`, this._watchlistButtonClickHandler);
  }

  _watchlistButtonClickHandler(evt) {
    evt.preventDefault();
    evt.target.disabled = true;
    this._callback.addToWatchlist();
  }

  get _addToWatchlistButtonNode() {
    return this.querySelector(`.film-card__controls-item--add-to-watchlist`);
  }

  get _markAsWatchedButtonNode() {
    return this.querySelector(`.film-card__controls-item--mark-as-watched`);
  }

  get _addToFavouritesButtonNode() {
    return this.querySelector(`.film-card__controls-item--favorite`);
  }
}
