import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';
import { remove, render, replace } from '../framework/render.js';
import { Mode } from '../const.js';

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

    constructor({container, destinationsModel, offersModel, onDataChange, onModeChange}) {
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
            pointDestination: this.#destinationsModel.getById(point.destination),
            pointOffers: this.#offersModel.getByType(point.type),
            onSubmitClick: this.#formSubmitHandler,
            onResetClick: this.#resetButtonClickHandler
        })

        if (prevPointComponent === null || prevEditPointComponent === null) {
            render(this.#pointComponent, this.#container);
            return;
        }

        if (this.#mode === Mode.DEFAULT) {
            replace(this.#pointComponent, prevPointComponent);
        }

        if (this.#mode === Mode.EDITING) {
            replace(this.#pointComponent, prevEditPointComponent);
        }

        remove(prevPointComponent);
        remove(prevEditPointComponent);
    }

    resetView = () => {
        if (this.#mode !== Mode.DEFAULT) {
            this.#replaceFormToPoint();
        }
    };

    destroy = () => {
        remove(this.#pointComponent);
        remove(this.#editPointComponent);
    }

    #replacePointToForm = () => {
        replace(this.#editPointComponent, this.#pointComponent);
        document.addEventListener('keydown', this.#escKeyDownHandler);
        this.#handleModeChange();
        this.#mode = Mode.EDITING;
    };

    #replaceFormToPoint = () => {
        replace(this.#pointComponent, this.#editPointComponent);
        document.removeEventListener('keydown', this.#escKeyDownHandler);
        this.#mode = Mode.DEFAULT;
    };

    #escKeyDownHandler = (evt) => {
        if (evt.key === 'Escape') {
            evt.preventDefault();
            this.#replaceFormToPoint();
        }
    };

    #pointEditClickHandler = () => {
        this.#replacePointToForm();
    };

    #favoriteClickHandler = () => {
        this.#handleDataChange({
            ...this.#point,
            isFavorite: !this.#point.isFavorite
        });
    };

    #formSubmitHandler = (point) => {
        this.#handleDataChange(point);
        this.#replaceFormToPoint();
    }

    #resetButtonClickHandler = () => {
        this.#replaceFormToPoint();
    }
}
