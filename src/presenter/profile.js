import {remove, render, replace} from "../utils/render";
import {filter} from "../utils/film";
import {FilterType} from "../consts";
import {isNull} from "../utils/common";
import ProfileCard from "../view/profileCard";

export default class Profile {
  constructor(container, filmsModel) {
    this._container = container;
    this._filmsModel = filmsModel;
    this._profileCard = null;

    this._handleFilmModelEvent = this._handleFilmModelEvent.bind(this);
    this._filmsModel.addObserver(this._handleFilmModelEvent);
  }

  init() {
    const prevProfileCard = this._profileCard;
    const films = this._filmsModel.getFilms();
    const watchedFilmsCount = filter[FilterType.WATCHED](films).length;
    this._profileCard = new ProfileCard(watchedFilmsCount);

    if (isNull(prevProfileCard)) {
      render(this._profileCard, this._container);
      return;
    }

    replace(this._profileCard, prevProfileCard);
    remove(prevProfileCard);
  }

  _handleFilmModelEvent() {
    this.init();
  }
}
