import Abstract from "../abstract";

const getFilmsSectionHTML = () => `<section class="films"></section>`;

export default class FilmsSection extends Abstract {
  getTemplate() {
    return getFilmsSectionHTML();
  }
}
