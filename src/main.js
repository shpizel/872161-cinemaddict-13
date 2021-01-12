import {render} from './utils/render';
import Profile from './view/profile';
import MoviesInside from "./view/movies-inside";
import {getRandomFilm} from "./mock/film";
import {
  FILMS_COUNT, FilterType,
  IS_AJAX_WORKS,
  LOADING_TIMEOUT
} from "./consts";
import {getFilledList, mainNode, headerNode, footerStatsNode} from "./utils/common";
import FilmListPresenter from "./presenter/film-list";
import FilmsModel from "./model/films";
import FilterModel from "./model/filter";
import MenuPresenter from "./presenter/menu";
import {filter} from "./utils/film";

const filmsModel = new FilmsModel();
const filterModel = new FilterModel();
const menuPresenter = new MenuPresenter(mainNode, filmsModel, filterModel);
menuPresenter.init();
const filmListPresenter = new FilmListPresenter(mainNode, filmsModel, filterModel);

const main = () => {
  if (IS_AJAX_WORKS) {
    filmsModel.setFilms(getFilledList(FILMS_COUNT, getRandomFilm));
  }
  const films = filmsModel.getFilms();
  if (films.length > 0) {
    render(new Profile(filter[FilterType.WATCHED](films).length), headerNode);
  } else {
    render(new Profile(0), headerNode);
  }

  menuPresenter.init();
  filmListPresenter.init();

  render(new MoviesInside(films.length), footerStatsNode);
};

setTimeout(main, LOADING_TIMEOUT);
