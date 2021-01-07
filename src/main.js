import {remove, render, RenderPosition} from './utils/render';
import Profile from './view/profile';
import Menu from "./view/menu";
import MoviesInside from "./view/movies-inside";
import {getRandomFilm} from "./mock/film";
import {getFilters} from "./mock/filters";
import {
  FILMS_COUNT,
  IS_AJAX_WORKS,
  LOADING_TIMEOUT
} from "./consts";
import {getFilledList, mainNode, headerNode, footerStatsNode} from "./utils/common";
import MovieListPresenter from "./presenter/movie-list";

let films = [];

let defaultMainMenu = new Menu(getFilters(films));
render(defaultMainMenu, mainNode);

const movieListPresenter = new MovieListPresenter(mainNode);

const main = () => {
  if (IS_AJAX_WORKS) {
    films = getFilledList(FILMS_COUNT, getRandomFilm);
  }

  remove(defaultMainMenu);

  if (films.length > 0) {
    render(new Profile(films.filter((film) => film.isAlreadyWatched).length), headerNode);
    render(new Menu(getFilters(films)), mainNode, RenderPosition.AFTERBEGIN);
  } else {
    render(new Profile(0), headerNode);
    render(new Menu(getFilters(films)), mainNode, RenderPosition.AFTERBEGIN);
  }

  movieListPresenter.init(films);

  render(new MoviesInside(films.length), footerStatsNode);
};

setTimeout(main, LOADING_TIMEOUT);
