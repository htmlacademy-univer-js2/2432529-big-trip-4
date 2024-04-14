import TripInfoView from './view/trip-info-view.js';
import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import MockService from './service/mock-service.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import PointsModel from './model/points-model.js';
import { render, RenderPosition } from './framework/render.js';

const tripInfoElement = document.querySelector('.trip-main');
const siteMainElement = document.querySelector('.page-main');
const eventListElement = siteMainElement.querySelector('.trip-events');
const filterElement = tripInfoElement.querySelector('.trip-controls__filters');

const mockService = new MockService();
const destinationsModel = new DestinationsModel(mockService);
const offersModel = new OffersModel(mockService);
const pointsModel = new PointsModel(mockService);

const tripPresenter = new TripPresenter({ tripContainer: eventListElement, destinationsModel, offersModel, pointsModel });
const filterPresenter = new FilterPresenter({ container: filterElement, pointsModel });

render(new TripInfoView(), tripInfoElement, RenderPosition.AFTERBEGIN);

tripPresenter.init();
filterPresenter.init();
