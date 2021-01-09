import Abstract from "./abstract";
import {mergeObjects} from "../utils/common";

export default class Smart extends Abstract {
  constructor() {
    super();
    this._data = {};
  }

  updateData(update, justDataUpdate) {
    if (!update) {
      return;
    }

    this._data = mergeObjects(this._data, update);

    if (justDataUpdate) {
      return;
    }

    this.updateElement();
  }

  updateElement() {
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);

    this.restoreHandlers();
  }

  restoreHandlers() {
    throw new Error(`Abstract method not implemented: resetHandlers`);
  }
}
