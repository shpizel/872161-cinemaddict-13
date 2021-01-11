import dayjs from "dayjs";
import he from "he";
import {nanoid} from "nanoid";
import {getFilmDuration} from "../../utils/film";
import Smart from "../smart";
import {BLANK_FILM, Category, EMOTION, UserAction} from "../../consts";
import {isNull, formatDate} from "../../utils/common";

const getFilmDetailsHTML = (film, comments) => {
  const duration = getFilmDuration(film.duration);

  return `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="./images/posters/${film.poster}" alt="">
          <p class="film-details__age">${film.ageRating}+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${film.title}</h3>
              <p class="film-details__title-original">Original: ${film.originalTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${film.rating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${film.director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${film.writers.join(`, `)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${film.actors.join(`, `)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${dayjs(film.releaseDate).format(`DD MMMM YYYY`)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${duration}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${film.country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Genre${(film.genres.length > 1) ? `s` : ``}</td>
              <td class="film-details__cell">
                ${film.genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join(`\n`)}
              </td>
            </tr>
          </table>

          <p class="film-details__film-description">${film.description}</p>
        </div>
      </div>

      <section class="film-details__controls">
        <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist"${(film.isInWatchlist) ? ` checked` : ``}>
        <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched"${(film.isAlreadyWatched) ? ` checked` : ``}>
        <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite"${(film.isInFavourites) ? ` checked` : ``}>
        <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
      </section>
    </div>

    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

        <ul class="film-details__comments-list">
          ${comments.map((comment) => `
<li class="film-details__comment">
  <span class="film-details__comment-emoji">
    <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji-smile">
  </span>
  <div>
    <p class="film-details__comment-text">${comment.comment}</p>
    <p class="film-details__comment-info">
      <span class="film-details__comment-author">${comment.author}</span>
      <span class="film-details__comment-day">${formatDate(comment.date)}</span>
      <button class="film-details__comment-delete" data-comment-id="${comment.id}">Delete</button>
    </p>
  </div>
</li>`).join(`\n`)}
        </ul>

        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label">${(!isNull(film.activeEmotion) ? `<img src="images/emoji/${film.activeEmotion}.png" width="55" height="55" alt="emoji-smile">` : ``)}</div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"${(!film.activeEmotion) ? ` disabled` : ``}>${(film.writtenText.length > 0 && film.activeEmotion) ? film.writtenText : ``}</textarea>
          </label>

          <div class="film-details__emoji-list">
            ${EMOTION.map((emotion) => `
<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emotion}" value="${emotion}"${(film.activeEmotion === emotion) ? ` checked` : ``}>
<label class="film-details__emoji-label" for="emoji-${emotion}">
  <img src="./images/emoji/${emotion}.png" width="30" height="30" alt="emoji">
</label>`).join(`\n`)}
          </div>
        </div>
      </section>
    </div>
  </form>
</section>
`;
};

export default class FilmDetails extends Smart {
  constructor(film = BLANK_FILM, commentsModel, updateHandler) {
    super();
    this._data = FilmDetails.parseFilmToData(film);
    this._commentsModel = commentsModel;
    this._updateHandler = updateHandler;
    this._closeHandler = this._closeHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._favouriteClickHandler = this._favouriteClickHandler.bind(this);
    this._deleteCommentClickHandler = this._deleteCommentClickHandler.bind(this);

    this._emojiClickHandler = this._emojiClickHandler.bind(this);
    this._textareaInputHandler = this._textareaInputHandler.bind(this);
    this._textAreaKeydownHandler = this._textAreaKeydownHandler.bind(this);

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._commentsModel.addObserver(this._handleModelEvent);

    this._setInnerHandlers();
  }

  _deleteCommentClickHandler(evt) {
    evt.preventDefault();
    const commentId = evt.target.dataset.commentId;
    const targetComment = this._commentsModel.getComments().find((comment) => comment.id === commentId);
    if (!targetComment) {
      throw new Error(`Invalid comment id: ${commentId}`);
    }
    this._commentsModel.removeComment(targetComment);
  }

  _handleModelEvent(reason) {
    switch (reason) {
      case UserAction.ADD_COMMENT:
        this.updateData({comments: this._commentsModel.getComments(), activeEmotion: null, writtenText: ``});
        break;
      case UserAction.DELETE_COMMENT:
        this.updateData({comments: this._commentsModel.getComments()});
        break;
      default:
        throw new Error(`Invalid reason: ${reason}`);
    }
  }

  getTemplate() {
    return getFilmDetailsHTML(this._data, this._commentsModel.getComments());
  }

  _setInnerHandlers() {
    this._watchlistButtonNode.addEventListener(`click`, this._watchlistClickHandler);
    this._watchedButtonNode.addEventListener(`click`, this._watchedClickHandler);
    this._favouritesButtonNode.addEventListener(`click`, this._favouriteClickHandler);
    this._emotionsRadioNodes.forEach((node) => node.addEventListener(`click`, this._emojiClickHandler));
    this._textareaNode.addEventListener(`input`, this._textareaInputHandler);
    this._textareaNode.addEventListener(`keydown`, this._textAreaKeydownHandler);
    this._deleteButtonNodes.forEach((node) => node.addEventListener(`click`, this._deleteCommentClickHandler));
  }

  updateData(update, justDataUpdate) {
    const scrollManagerEnabled = update && !justDataUpdate;
    if (scrollManagerEnabled) {
      const scrollTop = this.getElement().scrollTop;
      update = Object.assign({}, update, {scrollTop});
    }
    super.updateData(update, justDataUpdate);
    if (scrollManagerEnabled) {
      this._restoreScrollTop();
    }
  }

  restoreHandlers() {
    this._closeButtonNode.addEventListener(`click`, this._closeHandler);
    this._watchlistButtonNode.addEventListener(`click`, this._watchlistClickHandler);
    this._watchedButtonNode.addEventListener(`click`, this._watchedClickHandler);
    this._favouritesButtonNode.addEventListener(`click`, this._favouriteClickHandler);
    this._setInnerHandlers();
  }

  static parseFilmToData(film) {
    return Object.assign({}, film, {
      activeEmotion: null,
      writtenText: ``,
      scrollTop: 0,
    });
  }

  static parseDataToFilm(data) {
    data = Object.assign({}, data);
    delete data.activeEmotion;
    delete data.writtenText;
    delete data.scrollTop;
    return data;
  }

  _emojiClickHandler(evt) {
    const activeEmotion = evt.target.value;
    if (activeEmotion !== this._data.activeEmotion) {
      this.updateData({activeEmotion});
    }
  }

  _textareaInputHandler(evt) {
    const writtenText = evt.target.value;
    this.updateData({writtenText}, true);
  }

  _textAreaKeydownHandler(evt) {
    if ((evt.ctrlKey || evt.metaKey) && (evt.key === `Enter`)) {
      evt.preventDefault();
      if (this._data.activeEmotion && this._data.writtenText) {
        this._commentsModel.addComment({
          id: nanoid(),
          author: `shpizel`,
          comment: he.encode(this._data.writtenText),
          date: dayjs(),
          emotion: this._data.activeEmotion
        });
      }
    }
  }

  _closeHandler(evt) {
    evt.preventDefault();
    this._callback.close();
  }

  _watchlistClickHandler(evt) {
    evt.preventDefault();
    this._updateHandler(Category.WATCHLIST);
  }

  _watchedClickHandler(evt) {
    evt.preventDefault();
    this._updateHandler(Category.WATCHED);
  }

  _favouriteClickHandler(evt) {
    evt.preventDefault();
    this._updateHandler(Category.FAVOURITES);
  }

  setCloseHandler(callback) {
    this._callback.close = callback;
    this._closeButtonNode.addEventListener(`click`, this._closeHandler);
  }

  _restoreScrollTop() {
    this.getElement().scroll(0, this._data.scrollTop);
  }

  get _textareaNode() {
    return this.querySelector(`textarea.film-details__comment-input`);
  }

  get _watchedButtonNode() {
    return this.querySelector(`#watched`);
  }

  get _watchlistButtonNode() {
    return this.querySelector(`#watchlist`);
  }

  get _favouritesButtonNode() {
    return this.querySelector(`#favorite`);
  }

  get _closeButtonNode() {
    return this.querySelector(`.film-details__close-btn`);
  }

  get _emotionsRadioNodes() {
    return this.querySelectorAll(`.film-details__emoji-list > input`);
  }

  get _deleteButtonNodes() {
    return this.querySelectorAll(`.film-details__comment-delete`);
  }
}
