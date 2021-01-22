import {remove, render, RenderPosition, setHideOverflow, unsetHideOverflow} from "../utils/render";
import FilmsListContainer from "../view/films/list/container";
import FilmsListTitle from "../view/films/list/title";
import {
  Category,
  EXTRA_FILMS_COUNT,
  ExtraSection,
  FILMS_PER_PAGE,
  FilterType,
  Message,
  Mode,
  SortType,
  UpdateType,
  UserAction
} from "../consts";
import ShowMoreButton from "../view/show-more-button";
import {
  commentsCountComparator,
  releaseDateComparator,
  isNull,
  ratingComparator, footerNode, makeEscKeyDownHandler
} from "../utils/common";
import FilmsListSection from "../view/films/list/section";
import FilmPresenter from "./film";
import Sorting from "../view/sorting";
import FilmsSection from "../view/films/section";
import {filter} from "../utils/film";
import FilmDetails from "../view/films/details";
import CommentPresenter from "./comment";

export default class FilmList {
  constructor(container, filmsModel, commentsModel, filterModel) {
    this._container = container;
    this._filmsModel = filmsModel;
    this._commentsModel = commentsModel;
    this._filterModel = filterModel;

    this._prepareAll();
  }

  _prepareAll() {
    this._prepareVariables();
    this._prepareLayout();
    this._prepareTitles();
    this._prepareHandlers();
    this._prepareSorting();
    this._prepareFilmDetails();
  }

  _prepareFilmDetails() {
    this._filmDetails = new FilmDetails();
    this._filmDetails.setCloseHandler(this._closeFilmDetails);
    this._filmDetails.setUpdateHandler(this._filmUpdateHandler);
    this._filmDetails.setCommentRenderHandler(this._renderFilmDetailsComments);
    this._filmDetails.setAddCommentClickHandler(this._handleCommentAdd);
  }

  _filmUpdateHandler(filmId, category) {
    const film = this._filmsModel.getFilmById(filmId);

    switch (category) {
      case Category.FAVOURITES:
        this._handleFilmCategoryChange(UserAction.UPDATE_FILM_CATEGORY, UpdateType.PATCH, Object.assign({}, film, {isInFavourites: !film.isInFavourites}));
        break;
      case Category.WATCHED:
        this._handleFilmCategoryChange(UserAction.UPDATE_FILM_CATEGORY, UpdateType.PATCH, Object.assign({}, film, {isAlreadyWatched: !film.isAlreadyWatched}));
        break;
      case Category.WATCHLIST:
        this._handleFilmCategoryChange(UserAction.UPDATE_FILM_CATEGORY, UpdateType.PATCH, Object.assign({}, film, {isInWatchlist: !film.isInWatchlist}));
        break;
      default:
        throw new Error(`Invalid category: ${category}`);
    }
  }

  _closeFilmDetails() {
    this._currentFilmId = null;
    this._filmDetails.resetScroll();
    remove(this._filmDetails);
    unsetHideOverflow();
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _clearFilmDetailsComments() {
    this._commentPresenters.forEach((presenter) => presenter.destroy());
    this._commentPresenters.clear();
  }

  _commentUpdateHandler(updateType, comment) {
    switch (updateType) {
      case UserAction.DELETE_COMMENT:
        this._commentsModel.removeComment(this._currentFilmId, comment)
          .catch(() => {
            const commentPresenter = this._commentPresenters.get(comment.id);
            commentPresenter.setAborting();
          })
        ;
        break;
      default:
        throw new Error(`Not implemented`);
    }
  }

  _renderFilmDetailsComment(comment) {
    const commentPresenter = new CommentPresenter(this._filmDetails.commentsContainer, comment, this._commentUpdateHandler);
    this._commentPresenters.set(comment.id, commentPresenter);
    commentPresenter.init();
  }

  _renderFilmDetailsComments(filmId) {
    this._commentsModel.getCommentsByFilmId(filmId)
      .then((comments) => {
        this._clearFilmDetailsComments();
        return comments;
      })
      .then((comments) => comments.forEach((comment) => this._renderFilmDetailsComment(comment)))
      .then(() => this._filmDetails.restoreScrollTop())
      .catch((err) => this._renderFilmDetailsComment(this._commentsModel.getErrorComment(err)))
    ;
  }

  _renderFilmDetails(filmId) {
    const film = this._filmsModel.getFilmById(filmId);
    this._filmDetails.updateData(film);

    if (this._currentFilmId !== filmId) {
      this._filmDetails.resetUserInput();
      this._currentFilmId = filmId;
    }

    this._filmDetails.restoreHandlers();
    document.addEventListener(`keydown`, this._escKeyDownHandler);
    setHideOverflow();
    render(this._filmDetails, footerNode, RenderPosition.BEFOREEND);
    this._mode = Mode.POPUP;
  }

  _handleCommentAdd(filmId, comment) {
    this._commentsModel.addComment(filmId, comment)
      .catch(() => this._filmDetails.showFormError())
    ;
  }

  _prepareVariables() {
    this._isLoading = true;
    this._showMoreButton = null;
    this._allMoviePresenters = new Map();
    this._topRatedMoviesPresenters = new Map();
    this._mostCommentedMoviesPresenters = new Map();
    this._commentPresenters = new Map();
    this._renderedFilmsCount = FILMS_PER_PAGE;
    this._mode = Mode.DEFAULT;
  }

  _prepareHandlers() {
    this._showMoreButtonClickHandler = this._showMoreButtonClickHandler.bind(this);
    this._handleFilmCategoryChange = this._handleFilmCategoryChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._closeFilmDetails = this._closeFilmDetails.bind(this);
    this._escKeyDownHandler = makeEscKeyDownHandler(this._closeFilmDetails);
    this._renderFilmDetails = this._renderFilmDetails.bind(this);
    this._handleCommentAdd = this._handleCommentAdd.bind(this);
    this._handleFilmsModelEvent = this._handleFilmsModelEvent.bind(this);
    this._handleFilterModelEvent = this._handleFilterModelEvent.bind(this);
    this._handleCommentsModelEvent = this._handleCommentsModelEvent.bind(this);
    this._filmUpdateHandler = this._filmUpdateHandler.bind(this);
    this._renderFilmDetailsComments = this._renderFilmDetailsComments.bind(this);
    this._commentUpdateHandler = this._commentUpdateHandler.bind(this);
  }

  init() {
    this._filterModel.addObserver(this._handleFilterModelEvent);
    this._filmsModel.addObserver(this._handleFilmsModelEvent);
    this._commentsModel.addObserver(this._handleCommentsModelEvent);

    this._renderBoard();
  }

  destroy() {
    this._clearBoard({resetSortType: true, resetRenderedTasksCount: true});
    this._filterModel.removeObserver(this._handleFilmsModelEvent);
    this._filmsModel.removeObserver(this._handleFilmsModelEvent);
    this._commentsModel.removeObserver(this._handleCommentsModelEvent);
  }

  _getFilms() {
    const currentFilter = this._filterModel.getFilter();
    const films = filter[currentFilter](this._filmsModel.getFilms());
    switch (this._currentSortType) {
      case SortType.DATE:
        return films.slice().sort(releaseDateComparator);
      case SortType.RATING:
        return films.slice().sort(ratingComparator);
      default:
        return films;
    }
  }

  _handleCommentsModelEvent(updateType, filmId) {
    const film = this._filmsModel.getFilmById(filmId);
    switch (updateType) {
      case UpdateType.MINOR:
        this._updateFilmCard(film);
        if (this._mode === Mode.POPUP) {
          this._filmDetails.updateData(film);
        }
        break;
      case UpdateType.MAJOR:
        this._updateFilmCard(film);
        if (this._mode === Mode.POPUP) {
          this._filmDetails.resetUserInput();
          this._filmDetails.updateData(film);
        }
        break;
    }
    this._commentsModel.getCommentsByFilmId(filmId).then((comments) => {
      const commentsIds = comments.map((comment) => comment.id);
      const updatedFilm = Object.assign({}, film, {comments: commentsIds});
      this._filmsModel.updateFilm(UpdateType.PATCH, updatedFilm);
    });
  }

  _handleFilterModelEvent(updateType) {
    switch (updateType) {
      case UpdateType.MAJOR:
        if (this._mode === Mode.POPUP) {
          this._closeFilmDetails();
        }
        this._clearBoard({resetSortType: true, resetRenderedTasksCount: true});
        this._renderBoard();
        break;
      default:
        throw new Error(`Invalid update type: ${updateType}`);
    }
  }

  _handleFilmsModelEvent(updateType, film) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._updateFilmCard(film);
        if (this._mode === Mode.POPUP) {
          this._filmDetails.updateData(film);
        }
        break;
      case UpdateType.MINOR:
        if (this._mode === Mode.POPUP) {
          this._filmDetails.updateData(film);
        }
        this._clearBoard();
        this._renderBoard();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        this._clearBoard();
        this._renderBoard();
        break;
      default:
        throw new Error(`Invalid update type: ${updateType}`);
    }
  }

  _getAllPresentersList() {
    return [this._allMoviePresenters, this._mostCommentedMoviesPresenters, this._topRatedMoviesPresenters];
  }

  _updateFilmCard(film) {
    const filmId = film.id;
    this._getAllPresentersList().forEach((map) => {
      if (map.has(filmId)) {
        map.get(filmId).init(film);
      }
    });
  }

  _prepareTitles() {
    this._loadingFilmsListTitle = new FilmsListTitle(Message.LOADING, false);
    this._allMoviesFilmsListTitle = new FilmsListTitle(Message.ALL_MOVIES, true);
    this._noMoviesFilmsListTitle = new FilmsListTitle(Message.NO_MOVIES, false);
  }

  _prepareLayout() {
    this._filmsSection = new FilmsSection();
    this._filmsListSection = new FilmsListSection();
    this._filmsListContainer = new FilmsListContainer();
  }

  _prepareSorting() {
    this._currentSortType = SortType.DEFAULT;
    this._sorting = null;
  }

  _handleFilmCategoryChange(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_FILM_CATEGORY:
        if ((updateType === UpdateType.PATCH) && (this._filterModel.getFilter() !== FilterType.ALL)) {
          updateType = UpdateType.MINOR;
        }
        this._filmsModel.updateFilm(updateType, update);
        break;
      default:
        throw new Error(`Add comment in list not implemented`);
    }
  }

  _enableLoadingMessage() {
    if (!this._filmsListSection.contains(this._loadingFilmsListTitle)) {
      render(this._loadingFilmsListTitle, this._filmsListSection);
    }
  }

  _disableLoadingMessage() {
    if (this._filmsListSection.contains(this._loadingFilmsListTitle)) {
      remove(this._loadingFilmsListTitle);
    }
  }

  _enableNoMoviesMessage() {
    if (!this._filmsListSection.contains(this._noMoviesFilmsListTitle)) {
      render(this._noMoviesFilmsListTitle, this._filmsListSection);
    }
  }

  _disableNoMoviesMessage() {
    if (this._filmsListSection.contains(this._noMoviesFilmsListTitle)) {
      remove(this._noMoviesFilmsListTitle);
    }
  }

  _enableAllMoviesMessage() {
    if (!this._filmsListSection.contains(this._allMoviesFilmsListTitle)) {
      render(this._allMoviesFilmsListTitle, this._filmsListSection);
    }
  }

  _disableAllMoviesMessage() {
    if (this._filmsListSection.getElement().contains(this._allMoviesFilmsListTitle.getElement())) {
      remove(this._allMoviesFilmsListTitle);
    }
  }

  _renderBaseLayout() {
    render(this._filmsListSection, this._filmsSection);
    render(this._filmsSection, this._container);
  }

  _renderFilmsContainer() {
    render(this._filmsListContainer, this._filmsListSection);
  }

  _removeLayout() {
    remove(this._filmsSection);
    remove(this._filmsListSection);
    remove(this._filmsListContainer);
  }

  _renderFilmCard(film, container, presentersStorage) {
    if (!presentersStorage.has(film.id)) {
      const presenter = new FilmPresenter(container, this._handleFilmCategoryChange, this._renderFilmDetails);
      presentersStorage.set(film.id, presenter);
    }
    presentersStorage.get(film.id).init(film);
  }

  _showMoreButtonClickHandler() {
    const films = this._getFilms();
    const filmsCount = films.length;
    const newRenderedTasksCount = Math.min(filmsCount, this._renderedFilmsCount + FILMS_PER_PAGE);
    const filmsSlice = films.slice(0, newRenderedTasksCount);
    this._renderedFilmsCount = newRenderedTasksCount;

    this._renderFilms(filmsSlice, this._filmsListContainer, this._allMoviePresenters);

    if (this._renderedFilmsCount >= filmsCount) {
      this._removeShowMoreButton();
    }
  }

  _renderShowMoreButton() {
    if (!isNull(this._showMoreButton)) {
      this._showMoreButton = null;
    }

    this._showMoreButton = new ShowMoreButton();
    this._showMoreButton.setClickHandler(this._showMoreButtonClickHandler);
    render(this._showMoreButton, this._filmsListSection);
  }

  _removeShowMoreButton() {
    if (isNull(this._showMoreButton)) {
      return;
    }
    remove(this._showMoreButton);
  }

  _renderFilms(films, container, presentersStorage) {
    films.forEach((film) => this._renderFilmCard(film, container, presentersStorage));
  }

  _prepareExtraSection(title) {
    const filmsListExtraSection = new FilmsListSection(true);
    render(filmsListExtraSection, this._filmsSection);
    render(new FilmsListTitle(title), filmsListExtraSection);
    const filmsListExtraContainer = new FilmsListContainer();
    render(filmsListExtraContainer, filmsListExtraSection);

    return filmsListExtraContainer;
  }

  _renderMostCommentedMovies() {
    const ratedFilmsCount = this._getFilms().filter((film) => film.comments.length > 0).length;
    if (!ratedFilmsCount) {
      return;
    }

    const mostCommentedFilms = this._getFilms().sort(commentsCountComparator);
    const extraContainer = this._prepareExtraSection(ExtraSection.MOST_COMMENTED);
    mostCommentedFilms.slice(0, EXTRA_FILMS_COUNT)
      .forEach((film) => this._renderFilmCard(film, extraContainer, this._mostCommentedMoviesPresenters));
  }

  _renderTopRatedMovies() {
    const ratedFilmsCount = this._getFilms().filter((film) => film.rating > 0).length;
    if (!ratedFilmsCount) {
      return;
    }

    const topRatedFilms = this._getFilms().slice().sort(ratingComparator);
    const extraContainer = this._prepareExtraSection(ExtraSection.TOP_RATED);
    topRatedFilms.slice(0, EXTRA_FILMS_COUNT)
      .forEach((film) => this._renderFilmCard(film, extraContainer, this._topRatedMoviesPresenters));
  }

  _renderExtraMovies() {
    this._renderTopRatedMovies();
    this._renderMostCommentedMovies();
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    this._clearBoard();
    this._renderBoard();
  }

  _renderSorting() {
    if (!isNull(this._sorting)) {
      this._sorting = null;
    }

    this._sorting = new Sorting(this._currentSortType);
    this._sorting.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._sorting, this._container);
  }

  _removeSorting() {
    if (isNull(this._sorting)) {
      return;
    }
    remove(this._sorting);
  }

  _clearBoard({resetRenderedTasksCount = false, resetSortType = false} = {}) {
    const allPresenters = this._getAllPresentersList();
    allPresenters.forEach((currentPresentersMap) => {
      currentPresentersMap.forEach((presenter) => presenter.destroy());
      currentPresentersMap.clear();
    });
    this._removeShowMoreButton();
    this._removeSorting();
    this._removeLayout();
    if (resetRenderedTasksCount) {
      this._renderedFilmsCount = FILMS_PER_PAGE;
    }
    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderBoard() {
    if (this._isLoading) {
      this._renderBaseLayout();
      this._enableLoadingMessage();
      return;
    }
    const films = this._getFilms();
    const filmsCount = films.length;

    if (filmsCount === 0) {
      this._renderBaseLayout();
      this._enableNoMoviesMessage();
      return;
    }
    this._renderSorting();
    this._renderBaseLayout();
    this._renderFilmsContainer();
    const filmsSlice = films.slice(0, Math.min(filmsCount, this._renderedFilmsCount));
    this._renderFilms(filmsSlice, this._filmsListContainer, this._allMoviePresenters);
    if (filmsCount > this._renderedFilmsCount) {
      this._renderShowMoreButton();
    }
    this._renderExtraMovies();
  }
}
