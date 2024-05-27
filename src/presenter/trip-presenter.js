import SortView from '../view/sort-view.js';
import TripView from '../view/point-list-view.js';
import EmptyListView from '../view/empty-list-view.js';
import PointPresenter from './point-presenter.js';
import { render, replace, remove } from '../framework/render.js';
import { updateItem } from '../utils.js';
import { SortType } from '../const.js';
import { sort } from '../utils/sort.js';
import PointListView from '../view/point-list-view.js';

export default class TripPresenter {
  #tripContainer = null;
  #destinationsModel = null;
  #offersModel = null;
  #pointsModel = null;
  #pointListComponent = new TripView();
  #sortComponent = null;

  #points = [];

  #currentSortType = SortType.DAY;

  #pointPresenters = new Map();

  constructor({ tripContainer, destinationsModel, offersModel, pointsModel }) {
    this.#tripContainer = tripContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;

    this.#points = sort[SortType.DAY]([...this.#pointsModel.get()]);
  }

  init() {
    this.#renderBoard();
  }

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter({
      container: this.#pointListComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#pointChangeHandler,
      onModeChange: this.#modeChangeHandler
    });

    pointPresenter.init(point);

    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #sortPoints = (sortType) => {
    this.#currentSortType = sortType;
    this.#points = sort[this.#currentSortType](this.#points);
  }

  #renderPoints = () => {
    this.#points.forEach((point) => {
      this.#renderPoint(point);
    });
  };

  #clearPoints = () => {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #renderSort = () => {
    const prevSortComponent = this.#sortComponent;

    this.#sortComponent = new SortView({
      sortType: this.#currentSortType,
      onItemChange: this.#sortTypeChangeHandler
    });

    if (prevSortComponent) {
      replace(this.#sortComponent, prevSortComponent);
      remove(prevSortComponent);
    } else {
      render(this.#sortComponent, this.#tripContainer);
    }
  }

  #renderPointContainer = () => {
    this.#pointListComponent = new PointListView();
    render(this.#pointListComponent, this.#tripContainer);
  }

  #renderBoard = () => {
    if (this.#points.length === 0) {
      render(new EmptyListView(), this.#tripContainer);
      return;
    }

    this.#renderSort();
    this.#renderPointContainer();
    this.#renderPoints();
  };

  #pointChangeHandler = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  }

  #modeChangeHandler = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #sortTypeChangeHandler = (sortType) => {
    this.#sortPoints(sortType);
    this.#clearPoints();
    this.#renderSort();
    this.#renderPoints();
  };
}
