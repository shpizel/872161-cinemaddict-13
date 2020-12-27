import {getFilledList, getRandomNumber} from './tools';
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


const [FILMS_COUNT, FILMS_PER_PAGE, EXTRA_FILMS_COUNT] = [getRandomNumber(15, 20), 5, 2];

const EXTRA_SECTIONS = [
  {title: `Top rated`, comparator: (a, b) => b.rating - a.rating},
  {title: `Most commented`, comparator: (a, b) => b.comments.length - a.comments.length}
];

const render = (html, target, where = `beforeend`) => target.insertAdjacentHTML(where, html);

const showFilmsPager = (films, filmsListSectionNode, filmsListContainerNode) => {
  let cursor = 0;
  let filmsPortion = [];

  filmsPortion = films.slice(cursor, cursor + FILMS_PER_PAGE);
  cursor += Math.min(FILMS_PER_PAGE, filmsPortion.length);
  filmsPortion.forEach((film) => {
    render(getFilmCardHTML(film), filmsListContainerNode);
  });
  if (cursor < films.length) {
    render(getShowMoreButtonHTML(), filmsListSectionNode);
    const showMoreButtonNode = filmsListSectionNode.querySelector(`button.films-list__show-more`);
    showMoreButtonNode.addEventListener(`click`, () => {
      filmsPortion = films.slice(cursor, cursor + FILMS_PER_PAGE);
      filmsPortion.forEach((film) => {
        render(getFilmCardHTML(film), filmsListContainerNode);
      });
      cursor += Math.min(films.slice(cursor, cursor + FILMS_PER_PAGE).length, FILMS_PER_PAGE);
      if (cursor >= films.length) {
        showMoreButtonNode.remove();
      }
    });
  }
};

const showFilmDetails = (film, footerNode) => {
  render(getFilmDetailsHTML(film), footerNode, `beforeend`);

  const onKeyDownHandler = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      document.removeEventListener(`keydown`, onKeyDownHandler);
      const filmDetailsNode = footerNode.querySelector(`.film-details`);
      if (filmDetailsNode) {
        filmDetailsNode.remove();
      }
    }
  };
  document.addEventListener(`keydown`, onKeyDownHandler);
};

let films = [];

const headerNode = document.querySelector(`header`);
const mainNode = document.querySelector(`main`);
const footerNode = document.querySelector(`footer`);
const footerStatsNode = footerNode.querySelector(`.footer__statistics`);

const allMoviesHTML = getFilmsListTitleHTML(`All movies. Upcoming`, true);
const loadingHTML = getFilmsListTitleHTML(`Loading...`, false);
const noMoviesHTML = getFilmsListTitleHTML(`There are no movies in our database`, false);

render(getProfileHTML(), headerNode);
render(getMenuHTML(getFilters(films)), mainNode);
const mainMenuNode = document.querySelector(`nav.main-navigation`);
const sortingItems = getSortingItems();

render(getFilmsSectionHTML(), mainNode);
const filmsSectionNode = mainNode.querySelector(`section.films`);

render(getFilmsListSectionHTML(), filmsSectionNode);
const filmsListSectionNode = filmsSectionNode.querySelector(`section.films-list`);

render(loadingHTML, filmsListSectionNode);

const main = () => {
  if (getRandomNumber(0, 5) !== 0) {
    films = getFilledList(FILMS_COUNT, getRandomFilm);
  }

  filmsListSectionNode.innerHTML = ``;
  mainMenuNode.remove();
  if (films.length > 0) {
    render(getSortingHTML(sortingItems), mainNode, `afterbegin`);
    render(getMenuHTML(getFilters(films)), mainNode, `afterbegin`);

    render(allMoviesHTML, filmsListSectionNode);
    render(getFilmsListContainerHTML(), filmsListSectionNode);
    const filmsListContainerNode = filmsListSectionNode.querySelector(`div.films-list__container`);

    showFilmsPager(films, filmsListSectionNode, filmsListContainerNode);

    EXTRA_SECTIONS.forEach(({title, comparator}) => {
      render(getFilmsListSectionHTML(true), filmsSectionNode);
      const lastFilmsListExtraSectionNode = filmsSectionNode.querySelector(`section.films-list--extra:last-child`);
      render(getFilmsListTitleHTML(title), lastFilmsListExtraSectionNode);
      render(getFilmsListContainerHTML(), lastFilmsListExtraSectionNode);
      const lastFilmsListExtraContainerNode = lastFilmsListExtraSectionNode.querySelector(`div.films-list__container`);
      films.sort(comparator).slice(0, EXTRA_FILMS_COUNT).forEach((film) => render(getFilmCardHTML(film), lastFilmsListExtraContainerNode));
    });

    showFilmDetails(films[0], footerNode);
  } else {
    render(getMenuHTML(getFilters(films)), mainNode, `afterbegin`);
    render(noMoviesHTML, filmsListSectionNode);
  }

  render(getMoviesInsideHTML(films.length), footerStatsNode);
};

setTimeout(main, 300);
