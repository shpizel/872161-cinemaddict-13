import Abstract from "../../abstract";

export const getFilmsListContainerHTML = () => `<div class="films-list__container"></div>`;

export default class FilmsListContainer extends Abstract {
  getTemplate() {
    return getFilmsListContainerHTML();
  }
}
