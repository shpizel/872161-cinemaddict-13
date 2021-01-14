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
    this._prevFilmCard = null;
  }

  _prepareHandlers() {
    this._handleFavouriteClick = this._handleFavouriteClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
  }

  init(film, commentsCount) {
    this._film = film;
    this._commentsCount = commentsCount;
    this._prevFilmCard = this._filmCard;

    this._filmCard = new FilmCard(this._film, this._commentsCount);
    this._initFilmCardHandlers();

    if (isNull(this._prevFilmCard)) {
      render(this._filmCard, this._container);
      return;
    }

    replace(this._filmCard, this._prevFilmCard);
    remove(this._prevFilmCard);
  }

  // _handleModelEvent(actionType) {
  //   // const comments = this._commentsModel.getComments();
  //   switch (actionType) {
  //     case UserAction.ADD_COMMENT:
  //     case UserAction.DELETE_COMMENT:
  //       this._filmDetails.updateData({comments});
  //       break;
  //     default:
  //       throw new Error(`Invalid actionType: ${actionType}`);
  //   }
  // }

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
