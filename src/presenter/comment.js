import {remove, render, replace, shake} from "../utils/render";
import {UserAction} from "../consts";
import CommentView from "../view/comment";

const DeleteButtonText = {
  ENABLED: `Delete`,
  DISABLED: `Deleting...`
};

export default class Comment {
  constructor(container, comment, updateHandler) {
    this._container = container;
    this._comment = comment;
    this._updateHandler = updateHandler;
    this._isEnabled = true;
    this._commentView = null;
    this._deleteComment = this._deleteComment.bind(this);
  }

  init() {
    const prevCommentView = this._commentView;
    this._commentView = new CommentView(this._comment);
    this._commentView.setDeleteButtonClickHandler(this._deleteComment);
    if (!prevCommentView) {
      render(this._commentView, this._container);
      return;
    }

    replace(this._commentView, prevCommentView);
    remove(prevCommentView);
  }

  destroy() {
    remove(this._commentView);
  }

  showError() {
    shake(this._commentView.getElement(), () => this.init());
  }

  _deleteComment(deleteButtonNode) {
    this._isEnabled = false;
    deleteButtonNode.disabled = !this._isEnabled;
    deleteButtonNode.textContent = (this._isEnabled) ? DeleteButtonText.ENABLED : DeleteButtonText.DISABLED;
    this._updateHandler(UserAction.DELETE_COMMENT, this._comment);
  }
}
