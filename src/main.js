import {mainNode, headerNode, footerStatsNode} from "./utils/common";
import FilmListPresenter from "./presenter/film-list";
import FilmsModel from "./model/films";
import FilterModel from "./model/filter";
import MenuPresenter from "./presenter/menu";
import CommentsModel from "./model/comments";
import Api from "./utils/api";
import FilmsCounterPresenter from "./presenter/films-counter";
import ProfilePresenter from "./presenter/profile";
import Stats from "./view/stats";
import {remove, render} from "./utils/render";
import {SiteState} from "./consts";

const END_POINT = `https://13.ecmascript.pages.academy/cinemaddict/`;
const AUTHORIZATION = `Basic igor321shpizel123`;

const api = new Api(END_POINT, AUTHORIZATION);
const filmsModel = new FilmsModel(api);
const commentsModel = new CommentsModel(api);
const filterModel = new FilterModel();

const filmListPresenter = new FilmListPresenter(mainNode, filmsModel, commentsModel, filterModel);

let statsView = null;
const siteStateChangeHandler = (state) => {
  switch (state) {
    case SiteState.MOVIES:
      if (statsView) {
        remove(statsView);
      }
      filmListPresenter.init();
      break;
    case SiteState.STATS:
      filmListPresenter.destroy();
      statsView = new Stats(filmsModel.getFilms());
      render(statsView, mainNode);
      break;
  }
};

const menuPresenter = new MenuPresenter(mainNode, filmsModel, filterModel, siteStateChangeHandler);
const filmsCounterPresenter = new FilmsCounterPresenter(footerStatsNode, filmsModel);
const profilePresenter = new ProfilePresenter(headerNode, filmsModel);

const presenters = [profilePresenter, menuPresenter, filmListPresenter, filmsCounterPresenter];
presenters.forEach((presenter) => presenter.init());

api.getFilms()
  .then((films) => {
    filmsModel.setFilms(films);
  })
  .catch(() => filmsModel.setFilms([]))
;
