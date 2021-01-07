import {remove, render, RenderPosition, replace} from "../utils/render";
import FilmCard from "../view/films/card";
import {footerNode, isNull, makeEscKeyDownHandler, setHideOverflow, unsetHideOverflow} from "../utils/common";
import {Mode} from "../consts";
import FilmDetails from "../view/films/details";

export default class Movie {
  constructor(filmsContainer, changeData, changeMode) {
    this._filmsContainer = filmsContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._prepareAll();
  }

  _prepareAll() {
    this._prepareVariables();
    this._prepareHandlers();
  }

  _prepareVariables() {
    this._mode = Mode.DEFAULT;
    this._film = null;
    this._filmCard = null;
    this._filmDetails = null;
    this._prevFilmCard = null;
    this._prevFilmDetails = null;
  }

  _prepareHandlers() {
    this._handleFavouriteClick = this._handleFavouriteClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._closeFilmDetails = this._closeFilmDetails.bind(this);
    this._escKeyDownHandler = makeEscKeyDownHandler(this._closeFilmDetails);
    this._renderFilmDetails = this._renderFilmDetails.bind(this);
  }

  init(film) {
    this._film = film;
    this._prevFilmCard = this._filmCard;
    this._prevFilmDetails = this._filmDetails;

    this._filmCard = new FilmCard(this._film);
    this._filmDetails = new FilmDetails(this._film);
    this._initFilmCardHandlers();
    this._initFilmDetailsHandlers();

    if (isNull(this._prevFilmCard) || isNull(this._prevFilmDetails)) {
      render(this._filmCard, this._filmsContainer);
      return;
    }

    replace(this._filmCard, this._prevFilmCard);

    if (this._mode === Mode.POPUP) {
      replace(this._filmDetails, this._prevFilmDetails);
    }
    remove(this._prevFilmCard);
    remove(this._prevFilmDetails);
  }

  _initFilmCardHandlers() {
    this._filmCard.setClickHandler(this._renderFilmDetails);
    this._filmCard.setFavouriteClickHandler(this._handleFavouriteClick);
    this._filmCard.setWatchedClickHandler(this._handleWatchedClick);
    this._filmCard.setWatchlistClickHandler(this._handleWatchlistClick);
  }

  _initFilmDetailsHandlers() {
    this._filmDetails.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmDetails.setWatchedClickHandler(this._handleWatchedClick);
    this._filmDetails.setFavouriteClickHandler(this._handleFavouriteClick);
    this._filmDetails.setCloseHandler(this._closeFilmDetails);
  }

  _handleFavouriteClick() {
    this._changeData(Object.assign({}, this._film, {isInFavourites: !this._film.isInFavourites}));
  }

  _handleWatchedClick() {
    this._changeData(Object.assign({}, this._film, {isAlreadyWatched: !this._film.isAlreadyWatched}));
  }

  _handleWatchlistClick() {
    this._changeData(Object.assign({}, this._film, {isInWatchlist: !this._film.isInWatchlist}));
  }

  _closeFilmDetails() {
    remove(this._filmDetails);
    unsetHideOverflow();
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
    this._changeMode();
  }

  _renderFilmDetails() {
    this._initFilmDetailsHandlers();

    document.addEventListener(`keydown`, this._escKeyDownHandler);
    setHideOverflow();
    render(this._filmDetails, footerNode, RenderPosition.BEFOREEND);
    this._changeMode();
    this._mode = Mode.POPUP;
  }

  destroy() {
    remove(this._filmCard);
    remove(this._filmDetails);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closeFilmDetails();
    }
  }
}
