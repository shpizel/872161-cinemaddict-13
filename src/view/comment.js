import Abstract from "./abstract";
import he from "he";
import {formatDate} from "../utils/common";

const getCommentHTML = (comment) => `<li class="film-details__comment">
  <span class="film-details__comment-emoji">
    <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji-smile">
  </span>
  <div>
    <p class="film-details__comment-text">${he.encode(comment.comment)}</p>
    <p class="film-details__comment-info">
      <span class="film-details__comment-author">${comment.author}</span>
      <span class="film-details__comment-day">${formatDate(comment.date)}</span>
      <button class="film-details__comment-delete">Delete</button>
    </p>
  </div>
</li>`;

export default class Comment extends Abstract {
  constructor(comment) {
    super();

    this._commentView = comment;
    this._deleteButtonClickHandler = this._deleteButtonClickHandler.bind(this);
  }

  getTemplate() {
    return getCommentHTML(this._commentView);
  }

  _deleteButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteComment(evt.target);
  }

  setDeleteButtonClickHandler(callback) {
    this._callback.deleteComment = callback;
    this._deleteButtonNode.addEventListener(`click`, this._deleteButtonClickHandler);
  }

  get _deleteButtonNode() {
    return this.querySelector(`.film-details__comment-delete`);
  }
}
