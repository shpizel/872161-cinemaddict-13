export const getFilmsListTitleHTML = (message, isHidden = false) => {
  return `<h2 class="films-list__title${(isHidden) ? ` visually-hidden` : ``}">${message}</h2>`;
};
