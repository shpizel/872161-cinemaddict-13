import {getFilledList} from './utils';
import {getProfileHTML} from './view/profile';
import {getMenuHTML} from "./view/menu";
import {getSortingHTML} from "./view/sorting";
import {getMoviesInsideHTML} from "./view/movies-inside";
import {getFilmsSectionHTML} from "./view/films/section";
import {getFilmsListSectionHTML} from "./view/films/list/section";
import {getFilmsListTitleHTML} from "./view/films/list/title";
import {getFilmsListContainerHTML} from "./view/films/list/container";
import {getFilmCardHTML} from "./view/films/card";
import {getShowMoreButtonHTML} from "./view/show-more-button";
import {getRandomFilm} from "./mock/film";
import {getFilters} from "./mock/filters";
import {getSortingItems} from "./mock/sorting";
import {getFilmDetailsHTML} from "./view/films/details";
import {
  EXTRA_FILMS_COUNT,
  FILMS_COUNT,
  FILMS_PER_PAGE,
  IS_AJAX_WORKS,
  MESSAGES,
  EXTRA_SECTIONS, LOADING_TIMEOUT
} from "./consts";

const render = (html, target, where = `beforeend`) => target.insertAdjacentHTML(where, html);

const showFilmsPager = (films, filmsListSectionNode, filmsListContainerNode) => {
  let cursor = 0;
  const renderNextPortion = () => {
    const filmsPortion = films.slice(cursor, cursor + FILMS_PER_PAGE);
    cursor += Math.min(FILMS_PER_PAGE, filmsPortion.length);
    filmsPortion.forEach((film) => {
      render(getFilmCardHTML(film), filmsListContainerNode);
    });
  };

  renderNextPortion();
  if (cursor < films.length) {
    render(getShowMoreButtonHTML(), filmsListSectionNode);
    const showMoreButtonNode = filmsListSectionNode.querySelector(`button.films-list__show-more`);
    const showMoreButtonClickHandler = () => {
      renderNextPortion();
      if (cursor >= films.length) {
        showMoreButtonNode.removeEventListener(`click`, showMoreButtonClickHandler);
        showMoreButtonNode.remove();
      }
    };
    showMoreButtonNode.addEventListener(`click`, showMoreButtonClickHandler);
  }
};

const showFilmDetails = (film, footerNode) => {
  render(getFilmDetailsHTML(film), footerNode, `beforeend`);
  const filmDetailsNode = footerNode.querySelector(`.film-details`);
  const closeFilmsDetails = () => {
    if (filmDetailsNode) {
      filmDetailsNode.remove();
    }
  };

  const filmDetailsCloseButtonNode = filmDetailsNode.querySelector(`.film-details__close-btn`);
  filmDetailsCloseButtonNode.addEventListener(`click`, closeFilmsDetails);
  const onKeyDownHandler = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      closeFilmsDetails();
      document.removeEventListener(`keydown`, onKeyDownHandler);
    }
  };
  document.addEventListener(`keydown`, onKeyDownHandler);
};

let films = [];

const headerNode = document.querySelector(`header`);
const mainNode = document.querySelector(`main`);
const footerNode = document.querySelector(`footer`);
const footerStatsNode = footerNode.querySelector(`.footer__statistics`);

const allMoviesHTML = getFilmsListTitleHTML(MESSAGES.allMovies, true);
const loadingHTML = getFilmsListTitleHTML(MESSAGES.loading, false);
const noMoviesHTML = getFilmsListTitleHTML(MESSAGES.noMovies, false);

render(getMenuHTML(getFilters(films)), mainNode);
const mainMenuNode = document.querySelector(`nav.main-navigation`);
const sortingItems = getSortingItems();

render(getFilmsSectionHTML(), mainNode);
const filmsSectionNode = mainNode.querySelector(`section.films`);

render(getFilmsListSectionHTML(), filmsSectionNode);
const filmsListSectionNode = filmsSectionNode.querySelector(`section.films-list`);

render(loadingHTML, filmsListSectionNode);

const main = () => {
  if (IS_AJAX_WORKS) {
    films = getFilledList(FILMS_COUNT, getRandomFilm);
  }

  filmsListSectionNode.innerHTML = ``;
  mainMenuNode.remove();
  if (films.length > 0) {
    render(getProfileHTML(films.filter((film) => film.isAlreadyWatched).length), headerNode);
    render(getSortingHTML(sortingItems), mainNode, `afterbegin`);
    render(getMenuHTML(getFilters(films)), mainNode, `afterbegin`);

    render(allMoviesHTML, filmsListSectionNode);
    render(getFilmsListContainerHTML(), filmsListSectionNode);
    const filmsListContainerNode = filmsListSectionNode.querySelector(`div.films-list__container`);

    showFilmsPager(films, filmsListSectionNode, filmsListContainerNode);

    EXTRA_SECTIONS.forEach(({title}) => {
      render(getFilmsListSectionHTML(true), filmsSectionNode);
      const lastFilmsListExtraSectionNode = filmsSectionNode.querySelector(`section.films-list--extra:last-child`);
      render(getFilmsListTitleHTML(title), lastFilmsListExtraSectionNode);
      render(getFilmsListContainerHTML(), lastFilmsListExtraSectionNode);
      const lastFilmsListExtraContainerNode = lastFilmsListExtraSectionNode.querySelector(`div.films-list__container`);
      getFilledList(EXTRA_FILMS_COUNT, getRandomFilm).forEach((film) => render(getFilmCardHTML(film), lastFilmsListExtraContainerNode));
    });

    showFilmDetails(films[0], footerNode);
  } else {
    render(getProfileHTML(0), headerNode);
    render(getMenuHTML(getFilters(films)), mainNode, `afterbegin`);
    render(noMoviesHTML, filmsListSectionNode);
  }

  render(getMoviesInsideHTML(films.length), footerStatsNode);
};

setTimeout(main, LOADING_TIMEOUT);
