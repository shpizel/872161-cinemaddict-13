export const getSortingHTML = (items) => `
<ul class="sort">
${items.map(({term, isActive}) => `
<li>
    <a href="#" class="sort__button sort__button-${term.toLowerCase()}${(isActive) ? ` sort__button--active` : ``}">Sort by ${term}</a>
</li>`).join(`\n`)}
</ul>`;
