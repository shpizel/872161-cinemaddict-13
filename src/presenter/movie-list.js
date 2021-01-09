import {remove, render} from "../utils/render";
import FilmsListContainer from "../view/films/list/container";
import FilmsListTitle from "../view/films/list/title";
import {EXTRA_FILMS_COUNT, ExtraSection, FILMS_PER_PAGE, Messages, SortType} from "../consts";
import ShowMoreButton from "../view/show-more-button";
import {
  commentsCountComparator,
  dateComparator, equals,
  isNull,
  ratingComparator,
  updateItem
} from "../utils/common";
import FilmsListSection from "../view/films/list/section";
import Movie from "./movie";
import Sorting from "../view/sorting";
import FilmsSection from "../view/films/section";
import {getSortingItems} from "../mock/sorting";

export default class MovieList {
  constructor(container) {
    this._container = container;

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

  _prepareVariables() {
    this._films = null;
    this._originalFilms = null;
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
    this._handleMovieChange = this._handleMovieChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  _prepareTitles() {
    this._loadingFilmsListTitle = new FilmsListTitle(Messages.LOADING, false);
    this._allMoviesFilmsListTitle = new FilmsListTitle(Messages.ALL_MOVIES, true);
    this._noMoviesFilmsListTitle = new FilmsListTitle(Messages.NO_MOVIES, false);
  }

  _prepareLayout() {
    this._filmsSection = new FilmsSection();
    this._filmsListSection = new FilmsListSection();
    this._filmsListContainer = new FilmsListContainer();
  }

  _prepareSorting() {
    this._sorting = new Sorting(getSortingItems());
    this._sorting.setSortTypeChangeHandler(this._handleSortTypeChange);
    this._currentSortType = SortType.DEFAULT;
  }

  _renderSorting() {
    render(this._sorting, this._container);
  }

  _handleMovieChange(updatedFilm) {
    this._films = updateItem(this._films, updatedFilm);
    this._originalFilms = updateItem(this._originalFilms, updatedFilm);
    const presenters = [this._allMoviePresenters, this._mostCommentedMoviesPresenters, this._topRatedMoviesPresenters];
    const filmId = updatedFilm.id;
    presenters.forEach((map) => {
      if (map.has(filmId)) {
        map.get(filmId).init(updatedFilm);
      }
    });
  }

  _handleModeChange() {
    this._allMoviePresenters.forEach((presenter) => presenter.resetView());
    this._topRatedMoviesPresenters.forEach((presenter) => presenter.resetView());
    this._mostCommentedMoviesPresenters.forEach((presenter) => presenter.resetView());
  }

  _enableLoadingMessage() {
    render(this._loadingFilmsListTitle, this._filmsListSection);
  }

  _disableLoadingMessage() {
    remove(this._loadingFilmsListTitle);
  }

  _enableNoMoviesMessage() {
    render(this._noMoviesFilmsListTitle, this._filmsListSection);
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
      presentersStorage.set(film.id, new Movie(container, this._handleMovieChange, this._handleModeChange));
    }
    presentersStorage.get(film.id).init(film);
  }

  _renderFilmsPortion() {
    const filmsPortion = this._films.slice(this._showedFilmsCount, this._showedFilmsCount + FILMS_PER_PAGE);
    this._showedFilmsCount += Math.min(FILMS_PER_PAGE, filmsPortion.length);
    filmsPortion.forEach((film) => this._renderFilmCard(film, this._filmsListContainer, this._allMoviePresenters));
  }

  _showMoreButtonClickHandler() {
    this._renderFilmsPortion();
    if (this._showedFilmsCount >= this._films.length) {
      remove(this._showMoreButton);
    }
  }

  _renderMovies() {
    this._renderFilmsPortion();
    if (this._showedFilmsCount < this._films.length) {
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
    const ratedFilmsCount = this._films.filter((film) => film.comments.length > 0).length;
    if (!ratedFilmsCount) {
      return;
    }

    const mostCommentedFilms = this._films.slice().sort(commentsCountComparator);
    const extraContainer = this._prepareExtraSection(ExtraSection.MOST_COMMENTED);
    mostCommentedFilms.slice(0, EXTRA_FILMS_COUNT)
      .forEach((film) => this._renderFilmCard(film, extraContainer, this._mostCommentedMoviesPresenters));
  }

  _renderTopRatedMovies() {
    const ratedFilmsCount = this._films.filter((film) => film.rating > 0).length;
    if (!ratedFilmsCount) {
      return;
    }

    const topRatedFilms = this._films.slice().sort(ratingComparator);
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

  _sortMovies(sortType) {
    switch (sortType) {
      case SortType.DATE:
        this._films.sort(dateComparator);
        break;
      case SortType.RATING:
        this._films.sort(ratingComparator);
        break;
      default:
        this._films = [...this._originalFilms];
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (equals(this._currentSortType, sortType)) {
      return;
    }

    this._sortMovies(sortType);
    this._clearMoviesList();
    this._renderMovies();
  }

  _renderDashboard() {
    this._disableLoadingMessage();
    if (this._films.length > 0) {
      render(this._allMoviesFilmsListTitle, this._filmsListSection);
      this._destroyBaseLayout();
      this._renderSorting();
      this._renderFullLayout();
      this._renderMovies();
      this._renderExtraMovies();
    } else {
      this._enableNoMoviesMessage();
    }
  }

  init(films) {
    this._films = [...films];
    this._originalFilms = [...films];
    this._renderDashboard();
  }
}
