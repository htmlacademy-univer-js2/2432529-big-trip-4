import TripInfoPresenter from './presenter/trip-info-presenter.js';
import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import NewPointButtonPresenter from './presenter/new-point-button-presenter.js';
import PointsApiService from './service/points-api-service.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';

const AUTHORIZATION = 'Basic YWxpbmE6b3N0aW4xNzg=';
const END_POINT = 'https://21.objects.htmlacademy.pro/big-trip';

const bodyElement = document.querySelector('body');
const headerElement = bodyElement.querySelector('.page-header');
const tripInfoElement = headerElement.querySelector('.trip-main');
const siteMainElement = bodyElement.querySelector('.page-main');
const eventListElement = siteMainElement.querySelector('.trip-events');
const filterElement = tripInfoElement.querySelector('.trip-controls__filters');

const pointsApiService = new PointsApiService(END_POINT, AUTHORIZATION);
const destinationsModel = new DestinationsModel(pointsApiService);
const offersModel = new OffersModel(pointsApiService);
const pointsModel = new PointsModel({
  service: pointsApiService,
  destinationsModel,
  offersModel
});
const filterModel = new FilterModel();

const tripInfoPresenter = new TripInfoPresenter({
  container: tripInfoElement,
  pointsModel,
  destinationsModel,
  offersModel
});

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

tripInfoPresenter.init();

newPointButtonPresenter.init({
  onButtonClick: tripPresenter.newPointButtonClickHandler
});

filterPresenter.init();
tripPresenter.init();

pointsModel.init();
