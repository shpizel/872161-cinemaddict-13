import {remove, render} from "../utils/render";
import {UserAction} from "../consts";
import CommentView from "../view/comment";

const DeleteButtonText = {
  ENABLED: `Delete`,
  DISABLED: `Deleting...`
};

export default class Comment {
  constructor(container, updateHandler) {
    this._container = container;
    this._updateHandler = updateHandler;
    this._isEnabled = true;

    this._deleteComment = this._deleteComment.bind(this);
  }

  init(comment) {
    this._comment = comment;
    this._commentView = new CommentView(comment);
    this._commentView.setDeleteButtonClickHandler(this._deleteComment);
    render(this._commentView, this._container);
  }

  destroy() {
    remove(this._commentView);
  }

  _deleteComment(deleteButtonNode) {
    this._isEnabled = false;
    deleteButtonNode.disabled = !this._isEnabled;
    deleteButtonNode.textContent = (this._isEnabled) ? DeleteButtonText.ENABLED : DeleteButtonText.DISABLED;
    this._updateHandler(UserAction.DELETE_COMMENT, this._comment);
  }
}
