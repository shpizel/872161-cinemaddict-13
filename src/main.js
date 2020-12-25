import {getFilledList} from './tools';
import {getProfileHTML} from './view/profile';
import {getMenuHTML} from "./view/menu";
import {getSorterHTML} from "./view/sorter";
import {getMoviesInsideHTML} from "./view/movies-inside";
import {getFilmsSectionHTML} from "./view/films/section";
import {getFilmsListSectionHTML} from "./view/films/list/section";
import {getFilmsListTitleHTML} from "./view/films/list/title";
import {getFilmsListContainerHTML} from "./view/films/list/container";
import {getFilmCardHTML} from "./view/films/card";
import {getShowMoreButtonHTML} from "./view/show-more-button";


const render = (html, target, where = `beforeend`) => target.insertAdjacentHTML(where, html);

const [FILMS_COUNT, EXTRA_FILMS_COUNT, EXTRA_SECTIONS] = [5, 2, [`Top rated`, `Most commented`]];


const headerNode = document.querySelector(`header`);
const mainNode = document.querySelector(`main`);
const footerNode = document.querySelector(`footer`);
const footerStatsNode = footerNode.querySelector(`.footer__statistics`);

render(getProfileHTML(), headerNode);
render(getMenuHTML(), mainNode);
render(getSorterHTML(), mainNode);

render(getFilmsSectionHTML(), mainNode);
const filmsSectionNode = mainNode.querySelector(`section.films`);

render(getFilmsListSectionHTML(), filmsSectionNode);
const filmsListSectionNode = filmsSectionNode.querySelector(`section.films-list`);

render(getFilmsListTitleHTML(`All movies. Upcoming`, true), filmsListSectionNode);
render(getFilmsListContainerHTML(), filmsListSectionNode);
const filmsListContainerNode = filmsListSectionNode.querySelector(`div.films-list__container`);

getFilledList(FILMS_COUNT, getFilmCardHTML).forEach((film) => render(film, filmsListContainerNode));
render(getShowMoreButtonHTML(), filmsListSectionNode);

EXTRA_SECTIONS.forEach((title) => {
  render(getFilmsListSectionHTML(true), filmsSectionNode);
  const lastFilmsListExtraSectionNode = filmsSectionNode.querySelector(`section.films-list--extra:last-child`);
  render(getFilmsListTitleHTML(title), lastFilmsListExtraSectionNode);
  render(getFilmsListContainerHTML(), lastFilmsListExtraSectionNode);
  const lastFilmsListExtraContainerNode = lastFilmsListExtraSectionNode.querySelector(`div.films-list__container`);
  getFilledList(EXTRA_FILMS_COUNT, getFilmCardHTML).forEach((film) => render(film, lastFilmsListExtraContainerNode));
});

render(getMoviesInsideHTML(FILMS_COUNT), footerStatsNode);
