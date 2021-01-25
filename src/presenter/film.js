import {remove, render, replace} from "../utils/render";
import FilmCard from "../view/films/card";
import {isNull} from "../utils/common";
import {UpdateType, UserAction} from "../consts";

export default class Film {
  constructor(container, changeData, renderFilmDetails) {
    this._container = container;
    this._changeData = changeData;
    this._renderFilmDetails = renderFilmDetails;

    this._prepareAll();
  }

  _prepareAll() {
    this._prepareVariables();
    this._prepareHandlers();
  }

  _prepareVariables() {
    this._film = null;
    this._filmCard = null;
  }

  _prepareHandlers() {
    this._handleFavouriteClick = this._handleFavouriteClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
  }

  init(film) {
    this._film = film;

    const prevFilmCard = this._filmCard;
    this._filmCard = new FilmCard(this._film);
    this._initFilmCardHandlers();

    if (isNull(prevFilmCard)) {
      render(this._filmCard, this._container);
      return;
    }

    replace(this._filmCard, prevFilmCard);
    remove(prevFilmCard);
  }

  _initFilmCardHandlers() {
    this._filmCard.setClickHandler(this._renderFilmDetails);
    this._filmCard.setFavouriteClickHandler(this._handleFavouriteClick);
    this._filmCard.setWatchedClickHandler(this._handleWatchedClick);
    this._filmCard.setWatchlistClickHandler(this._handleWatchlistClick);
  }

  _handleFavouriteClick() {
    const film = Object.assign({}, this._film, {isInFavourites: !this._film.isInFavourites});
    this._changeData(UserAction.UPDATE_FILM_CATEGORY, UpdateType.PATCH, film);
  }

  _handleWatchedClick() {
    const film = Object.assign({}, this._film, {isAlreadyWatched: !this._film.isAlreadyWatched});
    this._changeData(UserAction.UPDATE_FILM_CATEGORY, UpdateType.PATCH, film);
  }

  _handleWatchlistClick() {
    const film = Object.assign({}, this._film, {isInWatchlist: !this._film.isInWatchlist});
    this._changeData(UserAction.UPDATE_FILM_CATEGORY, UpdateType.PATCH, film);
  }

  destroy() {
    remove(this._filmCard);
  }
}
