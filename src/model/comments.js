import Observer from "../utils/observer";
import {UserAction} from "../consts";

export default class Comments extends Observer {
  constructor() {
    super();
    this._comments = [];
  }

  setComments(comments) {
    this._comments = [...comments];
  }

  getComments() {
    return this._comments;
  }

  addComment(comment) {
    this._comments.push(comment);
    this._notify(UserAction.ADD_COMMENT, comment);
  }

  removeComment(targetComment) {
    this._comments = this._comments.filter((currentComment) => (currentComment.id !== targetComment.id));
    this._notify(UserAction.DELETE_COMMENT, targetComment);
  }
}
