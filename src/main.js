import TripInfoView from './view/trip-info-view.js';
import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import NewPointButtonPresenter from './presenter/new-point-button-presenter.js';
import MockService from './service/mock-service.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import { render, RenderPosition } from './framework/render.js';

const bodyElement = document.querySelector('body');
const headerElement = bodyElement.querySelector('.page-header');
const tripInfoElement = headerElement.querySelector('.trip-main');
const siteMainElement = bodyElement.querySelector('.page-main');
const eventListElement = siteMainElement.querySelector('.trip-events');
const filterElement = tripInfoElement.querySelector('.trip-controls__filters');

const mockService = new MockService();
const destinationsModel = new DestinationsModel(mockService);
const offersModel = new OffersModel(mockService);
const pointsModel = new PointsModel(mockService);
const filterModel = new FilterModel();

const newPointButtonPresenter = new NewPointButtonPresenter({
  container: tripInfoElement
});

const filterPresenter = new FilterPresenter({
  container: filterElement,
  pointsModel,
  filterModel
});

const tripPresenter = new TripPresenter({
  tripContainer: eventListElement,
  destinationsModel,
  offersModel,
  pointsModel,
  filterModel,
  newPointButtonPresenter: newPointButtonPresenter
});

render(new TripInfoView(), tripInfoElement, RenderPosition.AFTERBEGIN);

newPointButtonPresenter.init({
  onButtonClick: tripPresenter.newPointButtonClickHandler
});

filterPresenter.init();
tripPresenter.init();
