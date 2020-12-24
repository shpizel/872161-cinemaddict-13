export const getFilmsHTML = ({heading, films = null, showMoreButton = null, extraFilms = null}) => `
<section class="films">
  <section class="films-list">
    ${heading}
    ${films ? films : ``}
    ${showMoreButton ? showMoreButton : ``}
  </section>
${extraFilms ? extraFilms : ``}
</section>`;
