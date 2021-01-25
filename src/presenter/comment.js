import {remove, render, replace, shake} from "../utils/render";
import {UserAction} from "../consts";
import CommentView from "../view/comment";
import {isNull} from "../utils/common";

export default class Comment {
  constructor(container, comment, updateHandler) {
    this._container = container;
    this._comment = comment;
    this._updateHandler = updateHandler;
    this._commentView = null;
    this._deleteComment = this._deleteComment.bind(this);
  }

  init() {
    const prevCommentView = this._commentView;
    this._commentView = new CommentView(this._comment);
    this._commentView.setDeleteButtonClickHandler(this._deleteComment);

    if (isNull(prevCommentView)) {
      render(this._commentView, this._container);
      return;
    }

    replace(this._commentView, prevCommentView);
    remove(prevCommentView);
  }

  showError() {
    shake(this._commentView.getElement(), () => this.init());
  }

  _deleteComment() {
    this._updateHandler(UserAction.DELETE_COMMENT, this._comment);
  }

  destroy() {
    remove(this._commentView);
  }
}
