import MenuView from "../view/menu";
import {remove, render, RenderPosition, replace} from "../utils/render";
import {getFilters} from "../mock/filters";
import {UpdateType} from "../consts";

export default class Menu {
  constructor(container, filmsModel, filterModel) {
    this._container = container;
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;

    this._changeFilterHandler = this._changeFilterHandler.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._filterModel.addObserver(this._handleModelEvent);
    this._filmsModel.addObserver(this._handleModelEvent);
  }

  init() {
    const prevMenu = this._menu;

    this._menu = new MenuView(getFilters(this._filmsModel.getFilms(), this._filterModel.getFilter()));
    this._menu.setMenuClickHandler(this._changeFilterHandler);

    if (!prevMenu) {
      render(this._menu, this._container, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this._menu, prevMenu);
    remove(prevMenu);
  }

  _handleModelEvent() {
    this.init();
  }

  _changeFilterHandler(newFilter) {
    this._filterModel.setFilter(UpdateType.MAJOR, newFilter);
  }
}
