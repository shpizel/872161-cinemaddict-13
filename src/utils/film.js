export const getFilmDuration = (duration) => {
  return `${Math.round(duration / 60)}h` + ((duration % 60) ? ` ${duration % 60}m` : ``);
};
