import {createElement} from "../utils/render";
import {addClass, isNull, removeClass} from "../utils/common";

export default class Abstract {
  constructor() {
    if (new.target === Abstract) {
      throw new Error(`Can't instantiate Abstract, only concrete one.`);
    }

    this._element = null;
    this._querySelector = null;
    this._querySelectorAll = null;
    this._callback = {};
  }

  show() {
    removeClass(this.getElement(), `visually-hidden`);
  }

  hide() {
    addClass(this.getElement(), `visually-hidden`);
  }

  contains(target) {
    if (target instanceof Abstract) {
      target = target.getElement();
    }

    return this.getElement().contains(target);
  }

  getTemplate() {
    throw new Error(`Abstract method not implemented: getTemplate`);
  }

  getElement() {
    if (isNull(this._element)) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  get querySelector() {
    if (isNull(this._querySelector)) {
      const element = this.getElement();
      this._querySelector = element.querySelector.bind(element);
    }
    return this._querySelector;
  }

  get querySelectorAll() {
    if (isNull(this._querySelectorAll)) {
      const element = this.getElement();
      this._querySelectorAll = element.querySelectorAll.bind(element);
    }
    return this._querySelectorAll;
  }

  removeElement() {
    this._element = null;
    this._querySelector = null;
    this._querySelectorAll = null;
  }
}
