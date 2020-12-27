export const getMenuHTML = (filters) => `
<nav class="main-navigation">
  <div class="main-navigation__items">
    ${filters.map(({name, isActive, counter}) => `
<a href="#${name.toLowerCase()}" class="main-navigation__item main-navigation__item--${name.toLowerCase()}${(isActive) ? ` main-navigation__item--active` : ``}">${name} ${(counter !== null) ? `<span class="main-navigation__item-count">${counter}</span>` : ``}</a>
`).join(`\n`)}
  </div>
  <a href="#stats" class="main-navigation__additional">Stats</a>
</nav>`;
