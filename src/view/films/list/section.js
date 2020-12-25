export const getFilmsListSectionHTML = (isExtra) => {
  return `<section class="films-list${(isExtra) ? ` films-list--extra` : ``}"></section>`;
};
