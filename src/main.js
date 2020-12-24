import {getFilledArray, render} from './tools';
import {getProfileHTML} from './view/profile';
import {getMenuHTML} from "./view/menu";
import {getSorterHTML} from "./view/sorter";
import {getFilmsHTML} from "./view/films";
import {getAllMoviesMessageHTML} from "./view/messages/all-movies";
import {getFilmsContainerHTML} from "./view/films-container";
import {getFilmCardHTML} from "./view/film-card";
import {getExtraHTML} from "./view/extra";
import {getShowMoreButtonHTML} from "./view/show-more-button";
// import {getFilmDetailsPopupHTML} from "./view/film-details";
import {getMoviesInsideMessageHTML} from "./view/messages/movies-inside";

const [FILMS_COUNT, EXTRA_FILMS_COUNT] = [5, 2];

const headerNode = document.querySelector(`header`);
const mainNode = document.querySelector(`main`);
const footerNode = document.querySelector(`footer`);
const footerStatsNode = footerNode.querySelector(`.footer__statistics`);

render(getProfileHTML(), headerNode);
render(getMenuHTML(), mainNode);
render(getSorterHTML(), mainNode);

const filmsHTML = getFilmsHTML({
  heading: getAllMoviesMessageHTML(),
  films: getFilmsContainerHTML(getFilledArray(FILMS_COUNT, getFilmCardHTML)),
  showMoreButton: getShowMoreButtonHTML(),
  extraFilms: [
    getExtraHTML(`Top rated`, getFilmsContainerHTML(getFilledArray(EXTRA_FILMS_COUNT, getFilmCardHTML))),
    getExtraHTML(`Most commented`, getFilmsContainerHTML(getFilledArray(EXTRA_FILMS_COUNT, getFilmCardHTML)))
  ].join(`\n`)
});

render(filmsHTML, mainNode);
// render(getFilmDetailsPopupHTML(), footerNode, `afterend`);
render(getMoviesInsideMessageHTML(), footerStatsNode);
