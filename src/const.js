const OFFER_COUNT = 5;

const POINT_COUNT = 5;

const CITIES = [
  'Chamonix',
  'Geneva',
  'Amsterdam',
  'Helsinki',
  'Oslo',
  'Kopenhagen',
  'Den Haag',
  'Rotterdam',
  'Saint Petersburg',
  'Moscow',
  'Sochi',
  'Tokyo',
];

const DESTINATION_COUNT = CITIES.length;

const OFFERS = [
  'Order Uber',
  'Add luggage',
  'Switch to comfort',
  'Rent a car',
  'Add breakfast',
  'Book tickets',
  'Lunch in city',
  'Upgrade to a business class'
];

const DESCRIPTION = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.';

const Price = {
  MIN: 1,
  MAX: 1000
};

const TYPES = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant'
];

const DEFAULT_TYPE = 'flight';

const POINT_EMPTY = {
  basePrice: 0,
  dateFrom: null,
  dateTo: null,
  destination: null,
  isFavorite: false,
  offers: [],
  type: DEFAULT_TYPE
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
}

const Mode = {
  DEFAULT: 'default',
  EDITING: 'editing',
};

const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers'
};

const EnabledSortType = {
  [SortType.DAY]: true,
  [SortType.EVENT]: false,
  [SortType.TIME]: true,
  [SortType.PRICE]: true,
  [SortType.OFFERS]: false
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR'
};

const EditType = {
  EDITING: 'EDITING',
  CREATING: 'CREATING'
}

export {
  OFFER_COUNT,
  DESTINATION_COUNT,
  POINT_COUNT,
  CITIES,
  OFFERS,
  DESCRIPTION,
  Price,
  TYPES,
  DEFAULT_TYPE,
  POINT_EMPTY,
  FilterType,
  Mode,
  SortType,
  EnabledSortType,
  UserAction,
  UpdateType,
  EditType
}
