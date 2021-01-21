import {remove, render, replace} from "../utils/render";
import {filter} from "../utils/film";
import {FilterType} from "../consts";
import ProfileView from "../view/profile";

export default class Profile {
  constructor(container, filmsModel) {
    this._container = container;
    this._filmsModel = filmsModel;
    this._handleFilmModelEvent = this._handleFilmModelEvent.bind(this);
    this._filmsModel.addObserver(this._handleFilmModelEvent);
  }

  init() {
    const prevProfile = this._profile;
    const films = this._filmsModel.getFilms();
    const watchedFilmsCount = filter[FilterType.WATCHED](films).length;
    this._profile = new ProfileView(watchedFilmsCount);

    if (!prevProfile) {
      render(this._profile, this._container);
      return;
    }

    replace(this._profile, prevProfile);
    remove(prevProfile);
  }

  _handleFilmModelEvent() {
    this.init();
  }
}
