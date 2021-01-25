import MenuView from "../view/siteMenu";
import {remove, render, RenderPosition, replace} from "../utils/render";
import {SiteState, UpdateType} from "../consts";
import {getFilters} from "../utils/filters";
import {isNull} from "../utils/common";

export default class MainMenu {
  constructor(container, filmsModel, filterModel, stateChangeHandler) {
    this._container = container;
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;
    this._stateChangeHandler = stateChangeHandler;
    this._siteMenu = null;
    this._isStatsEnabled = false;

    this._changeFilterHandler = this._changeFilterHandler.bind(this);
    this._showStatsHandler = this._showStatsHandler.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._filterModel.addObserver(this._handleModelEvent);
    this._filmsModel.addObserver(this._handleModelEvent);
  }

  init() {
    const prevSiteMenu = this._siteMenu;
    const filters = getFilters(this._filmsModel.getFilms(), this._filterModel.getFilter());
    this._siteMenu = new MenuView(filters, this._isStatsEnabled);
    this._siteMenu.setMenuClickHandler(this._changeFilterHandler);
    this._siteMenu.setStatsClickHandler(this._showStatsHandler);

    if (isNull(prevSiteMenu)) {
      render(this._siteMenu, this._container, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this._siteMenu, prevSiteMenu);
    remove(prevSiteMenu);
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
