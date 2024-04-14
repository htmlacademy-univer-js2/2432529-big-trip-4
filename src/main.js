import TripInfoView from './view/trip-info-view.js';
import FilterView from './view/filter-view.js';
import TripPresenter from './presenter/trip-presenter.js';
import MockService from './service/mock-service.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import PointsModel from './model/points-model.js';
import { render, RenderPosition } from './framework/render.js';

const tripInfoElement = document.querySelector('.trip-main');
const siteMainElement = document.querySelector('.page-main');
const eventListElement = siteMainElement.querySelector('.trip-events');

const mockService = new MockService();
const destinationsModel = new DestinationsModel(mockService);
const offersModel = new OffersModel(mockService);
const pointsModel = new PointsModel(mockService);

const tripPresenter = new TripPresenter({ tripContainer: eventListElement, destinationsModel, offersModel, pointsModel });

render(new TripInfoView(), tripInfoElement, RenderPosition.AFTERBEGIN);
render(new FilterView(), tripInfoElement.querySelector('.trip-controls__filters'));

tripPresenter.init();
