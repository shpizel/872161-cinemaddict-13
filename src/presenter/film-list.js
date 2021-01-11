import {remove, render} from "../utils/render";
import FilmsListContainer from "../view/films/list/container";
import FilmsListTitle from "../view/films/list/title";
import {EXTRA_FILMS_COUNT, ExtraSection, FILMS_PER_PAGE, Message, SortType, UserAction} from "../consts";
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
import {FilmsFilter} from "../utils/film";

export default class FilmList {
  constructor(container, filmsModel, filterModel) {
    this._container = container;
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;

    this._prepareAll();

    this._renderBaseLayout();
    this._enableLoadingMessage();
  }

  _prepareAll() {
    this._prepareVariables();
    this._prepareLayout();
    this._prepareTitles();
    this._prepareHandlers();
    this._prepareSorting();
    this._prepareShowMoreButton();
  }

  _getFilms() {
    const currentFilter = this._filterModel.getFilter();
    const films = FilmsFilter[currentFilter](this._filmsModel.getFilms());
    switch (this._currentSortType) {
      case SortType.DATE:
        return films.slice().sort(releaseDateComparator);
      case SortType.RATING:
        return films.slice().sort(ratingComparator);
      default:
        return films;
    }
  }

  _prepareVariables() {
    this._allMoviePresenters = new Map();
    this._topRatedMoviesPresenters = new Map();
    this._mostCommentedMoviesPresenters = new Map();
    this._showedFilmsCount = 0;
  }

  _prepareShowMoreButton() {
    this._showMoreButton = new ShowMoreButton();
  }

  _prepareHandlers() {
    this._showMoreButtonClickHandler = this._showMoreButtonClickHandler.bind(this);
    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._filterModel.addObserver(this._handleModelEvent);
    this._filmsModel.addObserver(this._handleModelEvent);
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UserAction.UPDATE_FILM_CATEGORY:
        this._updateFilmCard(data);
        // todo: если тут выбран не ALL фильтр то стоит перерисовать экран или что-то такое сделать
        break;
      case UserAction.UPDATE_FILTER:
        this._currentSortType = SortType.DEFAULT;
        this._sorting.updateData({currentSortType: this._currentSortType});
        this._clearMoviesList();
        this._renderMovies();
        break;
    }
  }

  _getAllPresenters() {
    return [this._allMoviePresenters, this._mostCommentedMoviesPresenters, this._topRatedMoviesPresenters];
  }

  _updateFilmCard(film) {
    const filmId = film.id;
    this._getAllPresenters().forEach((map) => {
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
    this._sorting = new Sorting(this._currentSortType);
    this._sorting.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderSorting() {
    render(this._sorting, this._container);
  }

  _handleFilmChange(reason, updatedFilm) {
    if (reason === UserAction.UPDATE_FILM_CATEGORY) {
      this._filmsModel.updateFilm(reason, updatedFilm);
    }
  }

  _handleModeChange() {
    this._getAllPresenters().forEach((map) => {
      map.forEach((presenter) => presenter.resetView());
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

  _destroyBaseLayout() {
    [this._filmsSection, this._filmsListSection].forEach((element) => {
      if (!isNull(element)) {
        remove(element);
      }
    });
  }

  _renderFilmsContainer() {
    render(this._filmsListContainer, this._filmsListSection);
  }

  _renderFullLayout() {
    this._renderBaseLayout();
    this._renderFilmsContainer();
  }

  _renderFilmCard(film, container, presentersStorage) {
    if (!presentersStorage.has(film.id)) {
      presentersStorage.set(film.id, new FilmPresenter(container, this._handleFilmChange, this._handleModeChange));
    }
    presentersStorage.get(film.id).init(film);
  }

  _renderFilmsPortion() {
    const filmsPortion = this._getFilms().slice(this._showedFilmsCount, this._showedFilmsCount + FILMS_PER_PAGE);
    this._showedFilmsCount += Math.min(FILMS_PER_PAGE, filmsPortion.length);
    filmsPortion.forEach((film) => this._renderFilmCard(film, this._filmsListContainer, this._allMoviePresenters));
  }

  _showMoreButtonClickHandler() {
    this._renderFilmsPortion();
    if (this._showedFilmsCount >= this._getFilms().length) {
      remove(this._showMoreButton);
    }
  }

  _renderMovies() {
    this._renderFilmsPortion();
    if (this._showedFilmsCount < this._getFilms().length) {
      this._showMoreButton.setClickHandler(this._showMoreButtonClickHandler);
      render(this._showMoreButton, this._filmsListSection);
    }
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

  _clearMoviesList() {
    this._allMoviePresenters.forEach((presenter) => presenter.destroy());
    this._allMoviePresenters.clear();
    this._showedFilmsCount = 0;
    remove(this._showMoreButton);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    this._clearMoviesList();
    this._renderMovies();
  }

  _renderDashboard() {
    this._disableLoadingMessage();
    if (this._getFilms().length > 0) {
      this._enableAllMoviesMessage();
      this._destroyBaseLayout();
      this._renderSorting();
      this._renderFullLayout();
      this._renderMovies();
      this._renderExtraMovies();
    } else {
      this._enableNoMoviesMessage();
    }
  }

  init() {
    this._renderDashboard();
  }
}
