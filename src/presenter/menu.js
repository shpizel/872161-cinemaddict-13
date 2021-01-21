import MenuView from "../view/menu";
import {remove, render, RenderPosition, replace} from "../utils/render";
import {SiteState, UpdateType} from "../consts";
import {getFilters} from "../utils/filters";

export default class Menu {
  constructor(container, filmsModel, filterModel, stateChangeHandler) {
    this._container = container;
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;
    this._stateChangeHandler = stateChangeHandler;
    this._isStatsEnabled = false;

    this._changeFilterHandler = this._changeFilterHandler.bind(this);
    this._showStatsHandler = this._showStatsHandler.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._filterModel.addObserver(this._handleModelEvent);
    this._filmsModel.addObserver(this._handleModelEvent);
  }

  init() {
    const prevMenu = this._menu;

    this._menu = new MenuView(getFilters(this._filmsModel.getFilms(), this._filterModel.getFilter()), this._isStatsEnabled);
    this._menu.setMenuClickHandler(this._changeFilterHandler);
    this._menu.setStatsClickHandler(this._showStatsHandler);

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
    if (this._isStatsEnabled) {
      this._isStatsEnabled = false;
      this._stateChangeHandler(SiteState.MOVIES);
    }
    this._filterModel.setFilter(UpdateType.MAJOR, newFilter);
  }

  _showStatsHandler() {
    if (!this._isStatsEnabled) {
      this._isStatsEnabled = true;
      this.init();
      this._stateChangeHandler(SiteState.STATS);
    }
  }
}
