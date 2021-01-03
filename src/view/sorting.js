import Abstract from "./abstract";

const getSortingHTML = (items) => `<ul class="sort">
${items.map(({term, isActive}) => `
<li>
    <a href="#" class="sort__button sort__button-${term.toLowerCase()}${(isActive) ? ` sort__button--active` : ``}">Sort by ${term}</a>
</li>`).join(`\n`)}
</ul>`;

export default class Sorting extends Abstract {
  constructor(items) {
    super();

    this._items = items;
  }

  getTemplate() {
    return getSortingHTML(this._items);
  }
}
