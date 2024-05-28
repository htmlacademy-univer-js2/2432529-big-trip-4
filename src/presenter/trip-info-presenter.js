import TripInfoView from '../view/trip-info-view.js';
import { render, replace, remove, RenderPosition } from '../framework/render.js';

export default class TripInfoPresenter {
  #container = null;
  #tripInfoComponent = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;

  constructor({ container, pointsModel, destinationsModel, offersModel }) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  get points() {
    return this.#pointsModel.get();
  }

  get destinations() {
    return this.#destinationsModel.get();
  }

  get offers() {
    return this.#offersModel.get();
  }

  init() {
    this.#renderTripInfo();
    this.#pointsModel.addObserver(this.#modelEventHandler);
  }

  #renderTripInfo = () => {
    const prevTripInfoComponent = this.#tripInfoComponent;
    const destinations = this.destinations;
    const offers = this.offers;
    const points = this.points;

    this.#tripInfoComponent = new TripInfoView({
      destinations,
      offers,
      points
    });

    if (!prevTripInfoComponent) {
      render(this.#tripInfoComponent, this.#container, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#tripInfoComponent, prevTripInfoComponent);
    remove(prevTripInfoComponent);
  };

  #modelEventHandler = () => {
    this.#renderTripInfo();
  };
}
