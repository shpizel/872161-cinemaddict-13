import {HttpMethod, HttpSuccessStatusRange} from "../consts";
import FilmsModel from "../model/films";
import CommentsModel from "../model/comments";

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
    if (response.status < HttpSuccessStatusRange.START || response.status > HttpSuccessStatusRange.END) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
    return response;
  }

  getFilms() {
    return this._load({url: `movies`})
      .then((response) => response.json())
      .then((films) => films.map(FilmsModel.adaptFilmToClient));
  }

  updateFilm(film) {
    return this._load({
      url: `movies/${film.id}`,
      method: HttpMethod.PUT,
      body: JSON.stringify(FilmsModel.adaptFilmToServer(film)),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json())
      .then(FilmsModel.adaptFilmToClient)
    ;
  }

  getComments(filmId) {
    return this._load({url: `comments/${filmId}`})
      .then((response) => response.json())
      .then((comments) => comments.map(CommentsModel.adaptCommentToClient))
    ;
  }

  addComment(filmId, comment) {
    return this._load({
      url: `comments/${filmId}`,
      method: HttpMethod.POST,
      body: JSON.stringify(CommentsModel.adaptCommentToServer(comment)),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json())
      .then((response) => response.comments.map(CommentsModel.adaptCommentToClient));
  }

  deleteComment(commentId) {
    return this._load({
      url: `comments/${commentId}`,
      method: HttpMethod.DELETE
    });
  }
}
