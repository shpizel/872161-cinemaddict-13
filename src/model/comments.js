import Observer from "../utils/observer";
import {UpdateType} from "../consts";

export default class Comments extends Observer {
  constructor() {
    super();
    this._comments = {};
  }

  setComments(comments) {
    this._comments = Object.assign({}, comments);
  }

  getCommentsByFilmId(filmId) {
    if (!this._comments.hasOwnProperty(filmId)) {
      return [];
    }
    return this._comments[filmId];
  }

  addComment(filmId, comment) {
    if (!this._comments.hasOwnProperty(filmId)) {
      this._comments[filmId] = [];
    }
    this._comments[filmId].push(comment);
    this._notify(UpdateType.MAJOR, filmId);
  }

  removeComment(filmId, targetComment) {
    if (!this._comments.hasOwnProperty(filmId)) {
      throw new Error(`Could not film id: ${filmId}`);
    }
    this._comments[filmId] = this._comments[filmId].filter((currentComment) => (currentComment.id !== targetComment.id));
    this._notify(UpdateType.MINOR, filmId);
  }
}
