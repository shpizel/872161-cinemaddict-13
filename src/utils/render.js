import Abstract from "../view/abstract";
import {addClass, bodyNode, isNull, removeClass} from "./common";
import {HIDE_OVERFLOW_CLASSNAME, SHAKE_DURATION} from "../consts";

export const RenderPosition = {
  AFTER_BEGIN: `afterbegin`,
  BEFORE_END: `beforeend`
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const render = (element, container, place = RenderPosition.BEFORE_END) => {
  if (element instanceof Abstract) {
    element = element.getElement();
  }

  if (container instanceof Abstract) {
    container = container.getElement();
  }

  switch (place) {
    case RenderPosition.AFTER_BEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFORE_END:
      container.append(element);
      break;
  }
};

export const replace = (newChild, oldChild) => {
  if (oldChild instanceof Abstract) {
    oldChild = oldChild.getElement();
  }

  if (newChild instanceof Abstract) {
    newChild = newChild.getElement();
  }

  const parent = oldChild.parentElement;

  if (isNull(parent) || isNull(oldChild) || isNull(newChild)) {
    throw new Error(`Can't replace unexisting elements`);
  }

  parent.replaceChild(newChild, oldChild);
};

export const remove = (component) => {
  if (!(component instanceof Abstract)) {
    throw new Error(`Can remove only components`);
  }

  component.getElement().remove();
  component.removeElement();
};

export const setHideOverflow = () => addClass(bodyNode, HIDE_OVERFLOW_CLASSNAME);

export const unsetHideOverflow = () => removeClass(bodyNode, HIDE_OVERFLOW_CLASSNAME);

export const shake = (element, callback = null) => {
  element.style.animation = `shake ${SHAKE_DURATION / 1000}s`;
  setTimeout(() => {
    element.style.animation = ``;
    if (callback) {
      callback();
    }
  }, SHAKE_DURATION);
};
