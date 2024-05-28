import EditPointView from "../view/edit-point-view.js";

import { remove, render, RenderPosition } from '../framework/render.js';
import { UserAction, UpdateType, EditType } from "../const.js";

export default class NewPointPresenter {
  #container = null;

  #destinationsModel = null;
  #offersModel = null;

  #pointNewComponent = null;

  #handleDataChange = null;
  #handleDestroy = null;

  constructor({ container, destinationsModel, offersModel, onDataChange, onDestroy }) {
    this.#container = container;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  };

  init() {
    if (this.#pointNewComponent !== null) {
      return;
    }

    this.#pointNewComponent = new EditPointView({
      pointDestination: this.#destinationsModel.get(),
      pointOffers: this.#offersModel.get(),
      onSubmitClick: this.#formSubmitHandler,
      onResetClick: this.#resetButtonClickHandler,
      pointType: EditType.CREATING
    });

    render(this.#pointNewComponent, this.#container, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy = ({ isCanceled = true } = {}) => {
    if (this.#pointNewComponent === null) {
      return;
    }

    remove(this.#pointNewComponent);
    this.#pointNewComponent = null;
    document.removeEventListener('keydown', this.#escKeyDownHandler);

    this.#handleDestroy({ isCanceled });
  };

  #formSubmitHandler = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point
    );

    this.destroy({ isCanceled: false });
  };

  #resetButtonClickHandler = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
