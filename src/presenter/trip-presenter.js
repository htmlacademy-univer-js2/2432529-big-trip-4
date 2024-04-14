import SortView from '../view/sort-view.js';
import EditPointView from '../view/edit-point-view.js';
import PointView from '../view/point-view.js';
import TripView from '../view/point-list-view.js';
import { render, replace } from '../framework/render.js';

export default class TripPresenter {
    #tripContainer = null;
    #destinationsModel = null;
    #offersModel = null;
    #pointsModel = null;
    #pointListComponent = new TripView();
    #sortComponent = new SortView();

    #points = [];

    constructor({tripContainer, destinationsModel, offersModel, pointsModel}) {
        this.#tripContainer = tripContainer;
        this.#destinationsModel = destinationsModel;
        this.#offersModel = offersModel;
        this.#pointsModel = pointsModel;
        this.#points = [...this.#pointsModel.get()];
    }

    init() {
        render(this.#sortComponent, this.#tripContainer);
        render(this.#pointListComponent, this.#tripContainer);

        this.#points.forEach((point) => {
            this.#renderPoint(point);
        });
    }

    #renderPoint = (point) => {
        const pointComponent = new PointView({
            point,
            pointDestination: this.#destinationsModel.getById(point.destination),
            pointOffers: this.#offersModel.getByType(point.type),
            onEditClick: pointEditClickHandler
        });

        const editPointComponent = new EditPointView({
            point,
            pointDestination: this.#destinationsModel.getById(point.destination),
            pointOffers: this.#offersModel.getByType(point.type),
            onSubmitClick: pointSubmitHandler,
            onResetClick: resetButtonClickHandler
        });

        const replacePointToForm = () => {
            replace(editPointComponent, pointComponent);
        };

        const replaceFormToPoint = () => {
            replace(pointComponent, editPointComponent);
        };

        const escKeyDownHandler = (evt) => {
            if (evt.key === 'Escape' || evt.key === 'Esc') {
                evt.preventDefault();
                replaceFormToPoint();
                document.removeEventListener('keydown', escKeyDownHandler);
            }
        };

        function pointEditClickHandler() {
            replacePointToForm();
            document.addEventListener('keydown', escKeyDownHandler);
        };

        function resetButtonClickHandler() {
            replaceFormToPoint();
            document.removeEventListener('keydown', escKeyDownHandler);
        };

        function pointSubmitHandler() {
            replaceFormToPoint();
            document.removeEventListener('keydown', escKeyDownHandler);
        };

        render(pointComponent, this.#pointListComponent.element);
    }
}
