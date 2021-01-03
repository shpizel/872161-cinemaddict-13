import {remove, render, RenderPosition} from './utils/render';
import Profile from './view/profile';
import Menu from "./view/menu";
import Sorting from "./view/sorting";
import MoviesInside from "./view/movies-inside";
import FilmsSection from "./view/films/section";
import FilmsListSection from "./view/films/list/section";
import FilmsListTitle from "./view/films/list/title";
import FilmsListContainer from "./view/films/list/container";
import FilmDetails from "./view/films/details";
import FilmCard from "./view/films/card";
import ShowMoreButton from "./view/show-more-button";
import {getRandomFilm} from "./mock/film";
import {getFilters} from "./mock/filters";
import {getSortingItems} from "./mock/sorting";
import {
  EXTRA_FILMS_COUNT,
  FILMS_COUNT,
  FILMS_PER_PAGE,
  IS_AJAX_WORKS,
  Messages,
  EXTRA_SECTIONS,
  LOADING_TIMEOUT, HIDE_OVERFLOW_CLASSNAME
} from "./consts";
import {
  addClass,
  getFilledList,
  makeEscKeyDownHandler,
  removeClass
} from "./utils/common";

const bodyNode = document.querySelector(`body`);

const showFilmsPager = (films, filmsListSection, filmsListContainer) => {
  let cursor = 0;

  const renderNextPortion = () => {
    const filmsPortion = films.slice(cursor, cursor + FILMS_PER_PAGE);
    cursor += Math.min(FILMS_PER_PAGE, filmsPortion.length);
    filmsPortion.forEach((film) => renderFilmCard(film, filmsListContainer));
  };

  renderNextPortion();

  if (cursor < films.length) {
    const showMoreButton = new ShowMoreButton();
    render(showMoreButton, filmsListSection);
    showMoreButton.setClickHandler(() => {
      renderNextPortion();
      if (cursor >= films.length) {
        remove(showMoreButton);
      }
    });
  }
};

const showFilmDetails = (film, footerNode) => {
  const filmDetails = new FilmDetails(film);
  addClass(bodyNode, HIDE_OVERFLOW_CLASSNAME);
  render(filmDetails, footerNode, RenderPosition.BEFOREEND);
  const closeFilmsDetails = () => {
    remove(filmDetails);
    removeClass(bodyNode, HIDE_OVERFLOW_CLASSNAME);
  };
  const onEscKeyDownHandler = makeEscKeyDownHandler(closeFilmsDetails);
  document.addEventListener(`keydown`, onEscKeyDownHandler);
  filmDetails.setCloseHandler(() => {
    closeFilmsDetails();
    document.removeEventListener(`keydown`, onEscKeyDownHandler);
  });
};

const renderFilmCard = (film, container) => {
  const filmCard = new FilmCard(film);
  filmCard.setClickHandler(() => showFilmDetails(film, footerNode));
  render(filmCard, container);
};

let films = [];

const headerNode = document.querySelector(`header`);
const mainNode = document.querySelector(`main`);
const footerNode = document.querySelector(`footer`);
const footerStatsNode = footerNode.querySelector(`.footer__statistics`);

const allMoviesFilmsListTitle = new FilmsListTitle(Messages.ALL_MOVIES, true);
const loadingFilmsListTitle = new FilmsListTitle(Messages.LOADING, false);
const noMoviesFilmsListTitle = new FilmsListTitle(Messages.NO_MOVIES, false);

let defaultMainMenu = new Menu(getFilters(films));
render(defaultMainMenu, mainNode);

const filmsSection = new FilmsSection();
render(filmsSection, mainNode);

const filmsListSection = new FilmsListSection();
render(filmsListSection, filmsSection);

render(loadingFilmsListTitle, filmsListSection);

const main = () => {
  if (IS_AJAX_WORKS) {
    films = getFilledList(FILMS_COUNT, getRandomFilm);
  }

  filmsListSection.getElement().innerHTML = ``;
  remove(defaultMainMenu);
  if (films.length > 0) {
    render(new Profile(films.filter((film) => film.isAlreadyWatched).length), headerNode);
    render(new Sorting(getSortingItems()), mainNode, RenderPosition.AFTERBEGIN);
    render(new Menu(getFilters(films)), mainNode, RenderPosition.AFTERBEGIN);

    render(allMoviesFilmsListTitle, filmsListSection);
    const filmsListContainer = new FilmsListContainer();
    render(filmsListContainer, filmsListSection);

    showFilmsPager(films, filmsListSection, filmsListContainer);

    EXTRA_SECTIONS.forEach(({title}) => {
      const filmsListExtraSection = new FilmsListSection(true);
      render(filmsListExtraSection, filmsSection);
      render(new FilmsListTitle(title), filmsListExtraSection);

      const filmsListExtraContainer = new FilmsListContainer();
      render(filmsListExtraContainer, filmsListExtraSection);
      getFilledList(EXTRA_FILMS_COUNT, getRandomFilm).forEach((film) => renderFilmCard(film, filmsListExtraContainer));
    });
  } else {
    render(new Profile(0), headerNode);
    render(new Menu(getFilters(films)), mainNode, RenderPosition.AFTERBEGIN);
    render(noMoviesFilmsListTitle, filmsListSection);
  }
  render(new MoviesInside(films.length), footerStatsNode);
};

setTimeout(main, LOADING_TIMEOUT);
