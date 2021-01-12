import {remove, render, RenderPosition, replace, setHideOverflow, unsetHideOverflow} from "../utils/render";
import FilmCard from "../view/films/card";
import {
  footerNode,
  isNull,
  makeEscKeyDownHandler
} from "../utils/common";
import {Category, Mode, UpdateType, UserAction} from "../consts";
import FilmDetails from "../view/films/details";
import CommentsModel from "../model/comments";

export default class Film {
  constructor(container, changeData, changeMode) {
    this._container = container;
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
  }

  _prepareHandlers() {
    this._handleFavouriteClick = this._handleFavouriteClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._closeFilmDetails = this._closeFilmDetails.bind(this);
    this._escKeyDownHandler = makeEscKeyDownHandler(this._closeFilmDetails);
    this._renderFilmDetails = this._renderFilmDetails.bind(this);
    this._filmUpdateHandler = this._filmUpdateHandler.bind(this);
    this._handleCommentDelete = this._handleCommentDelete.bind(this);
    this._handleCommentAdd = this._handleCommentAdd.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
  }

  _handleCommentDelete(commentId) {
    const targetComment = this._commentsModel.getComments().find((comment) => comment.id === commentId);
    if (!targetComment) {
      throw new Error(`Invalid comment id: ${commentId}`);
    }
    this._commentsModel.removeComment(targetComment);
  }

  _handleCommentAdd(comment) {
    this._commentsModel.addComment(comment);
  }

  init(film) {
    this._film = film;
    this._prevFilmCard = this._filmCard;

    this._commentsModel = new CommentsModel();
    this._commentsModel.setComments(this._film.comments);
    this._commentsModel.addObserver(this._handleModelEvent);

    this._filmCard = new FilmCard(this._film, this._commentsModel.getComments());
    this._initFilmCardHandlers();

    if (!this._filmDetails) {
      this._filmDetails = new FilmDetails(this._film, this._filmUpdateHandler);
      this._filmDetails.setCloseHandler(this._closeFilmDetails);
      this._filmDetails.setAddCommentClickHandler(this._handleCommentAdd);
      this._filmDetails.setDeleteCommentClickHandler(this._handleCommentDelete);
    } else {
      this._filmDetails.updateData(this._film);
    }

    if (isNull(this._prevFilmCard)) {
      render(this._filmCard, this._container);
      return;
    }

    replace(this._filmCard, this._prevFilmCard);
    remove(this._prevFilmCard);
  }

  _handleModelEvent(actionType) {
    const comments = this._commentsModel.getComments();
    switch (actionType) {
      case UserAction.ADD_COMMENT:
      case UserAction.DELETE_COMMENT:
        this._filmDetails.updateData({comments});
        break;
      default:
        throw new Error(`Invalid actionType: ${actionType}`);
    }
  }

  _filmUpdateHandler(reason) {
    const map = {
      [Category.FAVOURITES]: this._handleFavouriteClick,
      [Category.WATCHED]: this._handleWatchedClick,
      [Category.WATCHLIST]: this._handleWatchlistClick
    };
    if (map.hasOwnProperty(reason)) {
      map[reason]();
    } else {
      throw new Error(`Invalid reason: ${reason}`);
    }
  }

  _initFilmCardHandlers() {
    this._filmCard.setClickHandler(this._renderFilmDetails);
    this._filmCard.setFavouriteClickHandler(this._handleFavouriteClick);
    this._filmCard.setWatchedClickHandler(this._handleWatchedClick);
    this._filmCard.setWatchlistClickHandler(this._handleWatchlistClick);
  }

  _handleFavouriteClick() {
    this._changeData(UserAction.UPDATE_FILM_CATEGORY, UpdateType.PATCH, Object.assign({}, this._film, {isInFavourites: !this._film.isInFavourites}));
  }

  _handleWatchedClick() {
    this._changeData(UserAction.UPDATE_FILM_CATEGORY, UpdateType.PATCH, Object.assign({}, this._film, {isAlreadyWatched: !this._film.isAlreadyWatched}));
  }

  _handleWatchlistClick() {
    this._changeData(UserAction.UPDATE_FILM_CATEGORY, UpdateType.PATCH, Object.assign({}, this._film, {isInWatchlist: !this._film.isInWatchlist}));
  }

  _closeFilmDetails() {
    remove(this._filmDetails);
    unsetHideOverflow();
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _renderFilmDetails() {
    this._filmDetails.restoreHandlers();
    document.addEventListener(`keydown`, this._escKeyDownHandler);
    setHideOverflow();
    render(this._filmDetails, footerNode, RenderPosition.BEFOREEND);
    this._changeMode();
    this._mode = Mode.POPUP;
  }

  destroy() {
    remove(this._filmCard);
    this.resetView();
    remove(this._filmDetails);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closeFilmDetails();
    }
  }
}
