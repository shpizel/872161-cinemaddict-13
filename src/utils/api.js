import {HttpMethod, SuccessStatusRange} from "../consts";

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  _load({url, method = HttpMethod.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}${url}`, {method, body, headers})
      .then(this._checkStatus)
      .catch((err) => {
        throw err;
      })
    ;
  }

  _checkStatus(response) {
    if (response.status < SuccessStatusRange.start || response.status > SuccessStatusRange.end) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
    return response;
  }

  _toJSON(response) {
    return response.json();
  }

  getFilms() {
    return this._load({url: `movies`})
      .then(this._toJSON)
      .then((films) => films.map(this._adaptFilmToClient));
  }

  updateFilm(film) {
    return this._load({
      url: `movies/${film.id}`,
      method: HttpMethod.PUT,
      body: JSON.stringify(this._adaptFilmToServer(film)),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(this._toJSON)
      .then(this._adaptFilmToClient)
    ;
  }

  getComments(filmId) {
    return this._load({url: `comments/${filmId}`})
      .then(this._toJSON)
      .then((comments) => comments.map(this._adaptCommentToClient))
    ;
  }

  addComment(filmId, comment) {
    return this._load({
      url: `comments/${filmId}`,
      method: HttpMethod.POST,
      body: JSON.stringify(this._adaptCommentToServer(comment)),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(this._toJSON)
      .then((response) => response.comments.map(this._adaptCommentToClient));
  }

  deleteComment(commentId) {
    return this._load({
      url: `comments/${commentId}`,
      method: HttpMethod.DELETE
    });
  }

  _adaptFilmToClient(serverFilmObject) {
    const adaptedFilm = {
      id: serverFilmObject.id,
      comments: serverFilmObject.comments,
      title: serverFilmObject.film_info.title,
      originalTitle: serverFilmObject.film_info.alternative_title,
      rating: serverFilmObject.film_info.total_rating,
      poster: serverFilmObject.film_info.poster,
      ageRating: serverFilmObject.film_info.age_rating,
      director: serverFilmObject.film_info.director,
      writers: serverFilmObject.film_info.writers,
      actors: serverFilmObject.film_info.actors,
      releaseDate: new Date(serverFilmObject.film_info.release.date),
      country: serverFilmObject.film_info.release.release_country,
      duration: serverFilmObject.film_info.runtime,
      genres: serverFilmObject.film_info.genre,
      description: serverFilmObject.film_info.description,
      isInWatchlist: serverFilmObject.user_details.watchlist,
      isAlreadyWatched: serverFilmObject.user_details.already_watched,
      isInFavourites: serverFilmObject.user_details.favorite,
      watchingDate: new Date(serverFilmObject.user_details.watching_date)
    };

    return adaptedFilm;
  }

  _adaptFilmToServer(clientFilmObject) {
    return {
      'id': clientFilmObject.id,
      'comments': clientFilmObject.comments,
      'film_info': {
        'title': clientFilmObject.title,
        'alternative_title': clientFilmObject.originalTitle,
        'total_rating': clientFilmObject.rating,
        'poster': clientFilmObject.poster,
        'age_rating': clientFilmObject.ageRating,
        'director': clientFilmObject.director,
        'writers': clientFilmObject.writers,
        'actors': clientFilmObject.actors,
        'release': {
          'date': clientFilmObject.releaseDate.toISOString(),
          'release_country': clientFilmObject.country
        },
        'runtime': clientFilmObject.duration,
        'genre': clientFilmObject.genres,
        'description': clientFilmObject.description
      },
      'user_details': {
        'watchlist': clientFilmObject.isInWatchlist,
        'already_watched': clientFilmObject.isAlreadyWatched,
        'watching_date': clientFilmObject.watchingDate.toISOString(),
        'favorite': clientFilmObject.isInFavourites,
      }
    };
  }

  _adaptCommentToClient(serverCommentObject) {
    const date = new Date(serverCommentObject.date);
    const adaptedComment = Object.assign({}, serverCommentObject, {date});
    return adaptedComment;
  }

  _adaptCommentToServer(clientCommentObject) {
    const date = clientCommentObject.date.toISOString();
    const adaptedComment = Object.assign({}, clientCommentObject, {date});
    return adaptedComment;
  }
}
