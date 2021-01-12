import {remove, render} from "../utils/render";
import FilmsListContainer from "../view/films/list/container";
import FilmsListTitle from "../view/films/list/title";
import {
  EXTRA_FILMS_COUNT,
  ExtraSection,
  FILMS_PER_PAGE,
  FilterType,
  Message,
  SortType,
  UpdateType,
  UserAction
} from "../consts";
import ShowMoreButton from "../view/show-more-button";
import {
  commentsCountComparator,
  releaseDateComparator,
  isNull,
  ratingComparator
} from "../utils/common";
import FilmsListSection from "../view/films/list/section";
import FilmPresenter from "./film";
import Sorting from "../view/sorting";
import FilmsSection from "../view/films/section";
import {filter} from "../utils/film";

export default class FilmList {
  constructor(container, filmsModel, filterModel) {
    this._container = container;
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;

    this._prepareAll();
  }

  _prepareAll() {
    this._prepareVariables();
    this._prepareLayout();
    this._prepareTitles();
    this._prepareHandlers();
    this._prepareSorting();
  }

  _prepareVariables() {
    this._showMoreButton = null;
    this._allMoviePresenters = new Map();
    this._topRatedMoviesPresenters = new Map();
    this._mostCommentedMoviesPresenters = new Map();
    this._renderedFilmsCount = FILMS_PER_PAGE;
  }

  _prepareHandlers() {
    this._showMoreButtonClickHandler = this._showMoreButtonClickHandler.bind(this);
    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);

    this._handleModelEvent = this._handleModelEvent.bind(this);
  }

  init() {
    this._filterModel.addObserver(this._handleModelEvent);
    this._filmsModel.addObserver(this._handleModelEvent);
    this._renderBoard();
  }

  destroy() {
    this._clearBoard({resetSortType: true, resetRenderedTasksCount: true});
    this._filterModel.removeObserver(this._handleModelEvent);
    this._filmsModel.removeObserver(this._handleModelEvent);
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

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._updateFilmCard(data);
        break;
      case UpdateType.MINOR:
        this._updateFilmCard(data);
        this._clearBoard();
        this._renderBoard();
        break;
      case UpdateType.MAJOR:
        this._clearBoard({resetSortType: true});
        this._renderBoard();
        break;
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

  _handleFilmChange(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_FILM_CATEGORY:
        if ((updateType === UpdateType.PATCH) && (this._filterModel.getFilter() !== FilterType.ALL)) {
          updateType = UpdateType.MINOR;
        }
        this._filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
      default:
        throw new Error(`Add comment in list not implemented`);
    }
  }

  _handleModeChange() {
    this._getAllPresentersList().forEach((currentPresentersMap) => {
      currentPresentersMap.forEach((presenter) => presenter.resetView());
    });
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
      presentersStorage.set(film.id, new FilmPresenter(container, this._handleFilmChange, this._handleModeChange));
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
      remove(this._showMoreButton);
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

    const mostCommentedFilms = this._getFilms().slice().sort(commentsCountComparator);
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

  _clearBoard({resetRenderedTasksCount = false, resetSortType = false} = {}) {
    const allPresenters = this._getAllPresentersList();
    allPresenters.forEach((currentPresentersMap) => {
      currentPresentersMap.forEach((presenter) => presenter.destroy());
      currentPresentersMap.clear();
    });
    remove(this._showMoreButton);
    remove(this._sorting);
    this._removeLayout();
    if (resetRenderedTasksCount) {
      this._renderedFilmsCount = FILMS_PER_PAGE;
    }
    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderBoard() {
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
