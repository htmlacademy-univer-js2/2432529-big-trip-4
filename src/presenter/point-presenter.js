import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';
import { remove, render, replace } from '../framework/render.js';
import { Mode, UserAction, UpdateType } from '../const.js';
import { isBigDifference } from '../utils/point.js';

export default class PointPresenter {
  #container = null;

  #destinationsModel = null;
  #offersModel = null;

  #handleDataChange = null;
  #handleModeChange = null;

  #pointComponent = null;
  #editPointComponent = null;
  #point = null;
  #mode = Mode.DEFAULT;

  constructor({ container, destinationsModel, offersModel, onDataChange, onModeChange }) {
    this.#container = container;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevEditPointComponent = this.#editPointComponent;

    this.#pointComponent = new PointView({
      point: this.#point,
      pointDestination: this.#destinationsModel.getById(point.destination),
      pointOffers: this.#offersModel.getByType(point.type),
      onEditClick: this.#pointEditClickHandler,
      onFavoriteClick: this.#favoriteClickHandler
    });

    this.#editPointComponent = new EditPointView({
      point: this.#point,
      pointDestination: this.#destinationsModel.get(),
      pointOffers: this.#offersModel.get(),
      onSubmitClick: this.#formSubmitHandler,
      onResetClick: this.#resetButtonClickHandler,
      onDeleteClick: this.#deleteButtonClickHandler
    });

    if (!prevPointComponent || !prevEditPointComponent) {
      render(this.#pointComponent, this.#container);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#editPointComponent, prevEditPointComponent);
    }

    remove(prevPointComponent);
    remove(prevEditPointComponent);
  }

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#editPointComponent.reset(this.#point);
      this.#replaceFormToPoint();
    }
  };

  destroy = () => {
    remove(this.#pointComponent);
    remove(this.#editPointComponent);
  };

  setSaving = () => {
    if (this.#mode === Mode.EDITING) {
      this.#editPointComponent.updateElement({
        isDisabled: true,
        isSaving: true
      });
    }
  };

  setDeleting = () => {
    this.#editPointComponent.updateElement({
      isDisabled: true,
      isDeleting: true
    });
  };

  setAborting = () => {
    if (this.#mode === Mode.DEFAULT) {
      this.#pointComponent.shake();
      return;
    }

    if (this.#mode === Mode.EDITING) {
      const resetFormState = () => {
        this.#editPointComponent.updateElement({
          isDisabled: false,
          isSaving: false,
          isDeleting: false
        });
      };

      this.#editPointComponent.shake(resetFormState);
    }
  };

  #replacePointToForm = () => {
    if (!this.#editPointComponent._state.isSaving) {
      replace(this.#editPointComponent, this.#pointComponent);
      document.addEventListener('keydown', this.#escKeyDownHandler);
      this.#handleModeChange();
      this.#mode = Mode.EDITING;
    }
  };

  #replaceFormToPoint = () => {
    replace(this.#pointComponent, this.#editPointComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  };

  #deleteButtonClickHandler = (point) => {
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point
    );
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' && !this.#editPointComponent._state.isDisabled) {
      evt.preventDefault();
      this.#editPointComponent.reset(this.#point);
      this.#replaceFormToPoint();
    }
  };

  #pointEditClickHandler = () => {
    this.#replacePointToForm();
  };

  #favoriteClickHandler = () => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      {
        ...this.#point,
        isFavorite: !this.#point.isFavorite
      }
    );
  };

  #formSubmitHandler = async (updatedPoint) => {
    const isMinor = isBigDifference(updatedPoint, this.#point);

    await this.#handleDataChange(
      UserAction.UPDATE_POINT,
      isMinor ? UpdateType.MINOR : UpdateType.PATCH,
      updatedPoint
    );

    if (!this.#editPointComponent._state.isDisabled) {
      this.#replaceFormToPoint();
    }
  };

  #resetButtonClickHandler = () => {
    if (!this.#editPointComponent._state.isDisabled || this.#editPointComponent._state.isSavingCompleted) {
      this.#editPointComponent.reset(this.#point);
      this.#replaceFormToPoint();
    }
  };
}
