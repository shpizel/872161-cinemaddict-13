import Observer from "../utils/observer";
import {UpdateType} from "../consts";

export default class Comments extends Observer {
  constructor(api) {
    super();

    this._api = api;
    this._comments = {};
  }

  getCommentsByFilmId(filmId) {
    if (!this._comments.hasOwnProperty(filmId)) {
      return this._api.getComments(filmId)
        .then((comments) => {
          this._comments[filmId] = comments;
          return this._comments[filmId];
        })
      ;
    }
    return new Promise((resolve) => resolve(this._comments[filmId]));
  }

  addComment(filmId, comment) {
    if (!this._comments.hasOwnProperty(filmId)) {
      this._comments[filmId] = [];
    }

    return this._api.addComment(filmId, comment).then((commentsFromServer) => {
      this._comments[filmId] = commentsFromServer;
      this._notify(UpdateType.MAJOR, filmId);
    });
  }

  removeComment(filmId, targetComment) {
    if (!this._comments.hasOwnProperty(filmId)) {
      throw new Error(`Could not film id: ${filmId}`);
    }
    return this._api.deleteComment(targetComment.id)
      .then(() => {
        this._comments[filmId] = this._comments[filmId].filter((currentComment) => (currentComment.id !== targetComment.id));
        this._notify(UpdateType.MINOR, filmId);
      })
    ;
  }

  getErrorComment(errorMsg = null) {
    return {
      id: `0`,
      author: `System error`,
      date: new Date(),
      emotion: `angry`,
      comment: `Не удалось загрузить комментарии. (${errorMsg})`
    };
  }

  static adaptCommentToClient(serverCommentObject) {
    const date = new Date(serverCommentObject.date);
    const adaptedComment = Object.assign({}, serverCommentObject, {date});
    return adaptedComment;
  }

  static adaptCommentToServer(clientCommentObject) {
    const date = clientCommentObject.date.toISOString();
    const adaptedComment = Object.assign({}, clientCommentObject, {date});
    return adaptedComment;
  }
}
