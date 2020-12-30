import {getFilledList, render, RenderPosition} from './utils';
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

const bodyNode = document.querySelector(`body`);

const showFilmsPager = (films, filmsListSectionNode, filmsListContainerNode) => {
  let cursor = 0;
  const renderNextPortion = () => {
    const filmsPortion = films.slice(cursor, cursor + FILMS_PER_PAGE);
    cursor += Math.min(FILMS_PER_PAGE, filmsPortion.length);
    filmsPortion.forEach((film) => renderFilmCard(film, filmsListContainerNode));
  };

  renderNextPortion();
  if (cursor < films.length) {
    const showMoreButtonComponent = new ShowMoreButton();
    render(showMoreButtonComponent.getElement(), filmsListSectionNode);
    const showMoreButtonClickHandler = () => {
      renderNextPortion();
      if (cursor >= films.length) {
        showMoreButtonComponent.getElement().removeEventListener(`click`, showMoreButtonClickHandler);
        showMoreButtonComponent.getElement().remove();
        showMoreButtonComponent.removeElement();
      }
    };
    showMoreButtonComponent.getElement().addEventListener(`click`, showMoreButtonClickHandler);
  }
};

const showFilmDetails = (film, footerNode) => {
  const filmDetailsComponent = new FilmDetails(film);
  if (!bodyNode.classList.contains(HIDE_OVERFLOW_CLASSNAME)) {
    bodyNode.classList.add(HIDE_OVERFLOW_CLASSNAME);
  }
  render(filmDetailsComponent.getElement(), footerNode, RenderPosition.BEFOREEND);
  const closeFilmsDetails = () => {
    filmDetailsComponent.getElement().remove();
    filmDetailsComponent.removeElement();
    if (bodyNode.classList.contains(HIDE_OVERFLOW_CLASSNAME)) {
      bodyNode.classList.remove(HIDE_OVERFLOW_CLASSNAME);
    }
  };

  const filmDetailsCloseButtonNode = filmDetailsComponent.getElement().querySelector(`.film-details__close-btn`);
  filmDetailsCloseButtonNode.addEventListener(`click`, closeFilmsDetails);
  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      closeFilmsDetails();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };
  document.addEventListener(`keydown`, onEscKeyDown);
};

const renderFilmCard = (film, container) => {
  const filmCard = new FilmCard(film);
  const filmCardNode = filmCard.getElement();
  filmCardNode.querySelector(`.film-card__poster`).addEventListener(`click`, () => showFilmDetails(film, footerNode));
  filmCardNode.querySelector(`.film-card__comments`).addEventListener(`click`, () => showFilmDetails(film, footerNode));
  render(filmCardNode, container);
};

let films = [];

const headerNode = document.querySelector(`header`);
const mainNode = document.querySelector(`main`);
const footerNode = document.querySelector(`footer`);
const footerStatsNode = footerNode.querySelector(`.footer__statistics`);

const allMoviesFilmsListTitleComponent = new FilmsListTitle(Messages.ALL_MOVIES, true);
const loadingFilmsListTitleComponent = new FilmsListTitle(Messages.LOADING, false);
const noMoviesFilmsListTitleComponent = new FilmsListTitle(Messages.NO_MOVIES, false);

let defaultMainMenuComponent = new Menu(getFilters(films));
render(defaultMainMenuComponent.getElement(), mainNode);

const filmsSectionComponent = new FilmsSection();
const filmsSectionNode = filmsSectionComponent.getElement();
render(filmsSectionNode, mainNode);

const filmsListSection = new FilmsListSection();
const filmsListSectionNode = filmsListSection.getElement();
render(filmsListSectionNode, filmsSectionNode);

render(loadingFilmsListTitleComponent.getElement(), filmsListSectionNode);

const main = () => {
  if (IS_AJAX_WORKS) {
    films = getFilledList(FILMS_COUNT, getRandomFilm);
  }

  filmsListSectionNode.innerHTML = ``;
  defaultMainMenuComponent.getElement().remove();
  defaultMainMenuComponent.removeElement();
  if (films.length > 0) {
    render(new Profile(films.filter((film) => film.isAlreadyWatched).length).getElement(), headerNode);
    render(new Sorting(getSortingItems()).getElement(), mainNode, RenderPosition.AFTERBEGIN);
    render(new Menu(getFilters(films)).getElement(), mainNode, RenderPosition.AFTERBEGIN);

    render(allMoviesFilmsListTitleComponent.getElement(), filmsListSectionNode);
    render(new FilmsListContainer().getElement(), filmsListSectionNode);
    const filmsListContainerNode = filmsListSectionNode.querySelector(`div.films-list__container`);

    showFilmsPager(films, filmsListSectionNode, filmsListContainerNode);

    EXTRA_SECTIONS.forEach(({title}) => {
      const filmsListExtraSection = new FilmsListSection(true);
      render(filmsListExtraSection.getElement(), filmsSectionNode);
      render(new FilmsListTitle(title).getElement(), filmsListExtraSection.getElement());
      const filmsListExtraContainer = new FilmsListContainer();
      render(filmsListExtraContainer.getElement(), filmsListExtraSection.getElement());
      getFilledList(EXTRA_FILMS_COUNT, getRandomFilm).forEach((film) => renderFilmCard(film, filmsListExtraContainer.getElement()));
    });
  } else {
    render(new Profile(0).getElement(), headerNode);
    render(new Menu(getFilters(films)).getElement(), mainNode, RenderPosition.AFTERBEGIN);
    render(noMoviesFilmsListTitleComponent.getElement(), filmsListSectionNode);
  }
  render(new MoviesInside(films.length).getElement(), footerStatsNode);
};

setTimeout(main, LOADING_TIMEOUT);
