import {render} from './utils/render';
import Profile from './view/profile';
import MoviesInside from "./view/movies-inside";
import {getRandomFilm} from "./mock/film";
import {FILMS_COUNT, FilterType} from "./consts";
import {getFilledList, mainNode, headerNode, footerStatsNode} from "./utils/common";
import FilmListPresenter from "./presenter/film-list";
import FilmsModel from "./model/films";
import FilterModel from "./model/filter";
import MenuPresenter from "./presenter/menu";
import {filter} from "./utils/film";
import CommentsModel from "./model/comments";

const filmsList = getFilledList(FILMS_COUNT, getRandomFilm);

const filmsModel = new FilmsModel();
const filterModel = new FilterModel();
const commentsModel = new CommentsModel();

commentsModel.setComments(filmsList
  .map((film) => ({[film.id]: film.comments}))
  .reduce((prev, curr) => Object.assign(prev, curr))
);
filmsModel.setFilms(filmsList
  .map((film) => {
    delete film.comments;
    return film;
  })
);

const menuPresenter = new MenuPresenter(mainNode, filmsModel, filterModel);
const filmListPresenter = new FilmListPresenter(mainNode, filmsModel, commentsModel, filterModel);

menuPresenter.init();
filmListPresenter.init();

render(new Profile(filter[FilterType.WATCHED](filmsList).length), headerNode);
render(new MoviesInside(filmsList.length), footerStatsNode);
