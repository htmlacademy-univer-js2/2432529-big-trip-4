import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { POINT_EMPTY, TYPES, CITIES, EditType } from "../const.js";
import { formatStringToDateTime } from '../utils.js';
import 'flatpickr/dist/flatpickr.min.css';
import flatpickr from 'flatpickr';
import he from 'he';

const ButtonLabel = {
  CANCEL_DEFAULT: 'Cancel',
  DELETE_DEFAULT: 'Delete',
  SAVE_DEFAULT: 'Save'
}

const createSaveButtonTemplate = () => {
  const label = ButtonLabel.SAVE_DEFAULT;
  return `<button class="event__save-btn btn btn--blue" type="submit">${label}</button>`;
}

const createResetButtonTemplate = ({ pointType }) => {
  const label = pointType === EditType.CREATING
    ? ButtonLabel.CANCEL_DEFAULT
    : ButtonLabel.DELETE_DEFAULT;
  return `<button class="event__reset-btn" type="reset">${label}</button>`;
}

const createRollupButtonTemplate = () => {
  return `<button class="event__rollup-btn" type="button"><span class="visually-hidden">Open event</span></button>`
}

const createPointEditControlsTemplate = ({ pointType }) => {
  return `
        ${createSaveButtonTemplate()}
        ${createResetButtonTemplate({ pointType })}
        ${(pointType === EditType.EDITING) ? createRollupButtonTemplate() : ''}
    `;
}

const createPointCitiesOptionsTemplate = () => {
  return (
    `<datalist id="destination-list-1">
            ${CITIES.map((city) => `<option value="${city}"></option>`).join('')}
        </div>`
  );
}

const createPointPhotosTemplate = (pointDestination) => {
  return (
    `<div class="event__photos-tape">
            ${pointDestination.pictures.map((picture) =>
      `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('')}
        </div>`
  );
}

const createPointTypesTemplate = (currentType) => {
  return TYPES.map((type) =>
    `<div class="event__type-item">
            <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${currentType === type ? 'checked' : ''}>
            <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
        </div>`).join('');
}

const createPointOffersTemplate = ({ offersId, currentOffers }) => {
  const offerItems = currentOffers.map(offer => {
    const isChecked = offersId.includes(offer.id) ? 'checked' : '';
    return (
      `<div class="event__offer-selector">
                <input class="event__offer-checkbox  visually-hidden" id="${offer.id}" type="checkbox" name="event-offer-luggage" ${isChecked}>
                <label class="event__offer-label" for="${offer.id}">
                    <span class="event__offer-title">${offer.title}</span>
                    &plus;&euro;&nbsp;
                    <span class="event__offer-price">${offer.price}</span>
                </label>
            </div>`
    );
  }).join('');

  return `<div class="event__available-offers">${offerItems}</div>`;
}

const createEditPointTemplate = ({ state, pointDestination, pointOffers, pointType }) => {
  const { point } = state;
  const { basePrice, dateFrom, dateTo, type } = point;

  const currentDestination = pointDestination.find((destination) => destination.id === point.destination);
  const currentOffers = pointOffers.find((offer) => offer.type === type).offers;

  return (
    `<li class="trip-events__item">
            <form class="event event--edit" action="#" method="post">
                <header class="event__header">
                    <div class="event__type-wrapper">
                        <label class="event__type  event__type-btn" for="event-type-toggle-1">
                            <span class="visually-hidden">Choose event type</span>
                            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
                        </label>
                        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
                        <div class="event__type-list">
                            <fieldset class="event__type-group">
                                <legend class="visually-hidden">Event type</legend>
                                ${createPointTypesTemplate(type)}
                            </fieldset>
                        </div>
                    </div>
                    <div class="event__field-group  event__field-group--destination">
                        <label class="event__label  event__type-output" for="event-destination-1">
                            ${type}
                        </label>
                        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${currentDestination ? he.encode(currentDestination.name) : ''}" list="destination-list-1">
                        ${createPointCitiesOptionsTemplate()}
                    </div>
                    <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${point.dateFrom ? formatStringToDateTime(dateFrom) : ''}">
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${point.dateTo ? formatStringToDateTime(dateTo) : ''}">
                    </div>
                    <div class="event__field-group  event__field-group--price">
                        <label class="event__label" for="event-price-1">
                            <span class="visually-hidden">Price</span>
                            &euro;
                        </label>
                        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value=${he.encode(basePrice.toString())}>
                    </div>
                    ${createPointEditControlsTemplate({ pointType })}
                </header>
                <section class="event__details">
                    ${(currentOffers.length !== 0) ? `<section class="event__section  event__section--offers">
                        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
                        ${createPointOffersTemplate({ offersId: point.offers, currentOffers })}
                    </section>` : ''}
                    ${(currentDestination) ? `<section class="event__section  event__section--destination">
                        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                        <p class="event__destination-description">${currentDestination.description}</p>
                        <div class="event__photos-container">
                            ${createPointPhotosTemplate(currentDestination)}` : ''}
                        </div>
                    </section>
                </section>
            </form>
        </li>`
  );
}

export default class EditPointView extends AbstractStatefulView {
  #pointDestination = null;
  #pointOffers = null;
  #handleSubmitClick = null;
  #handleResetClick = null;
  #handleDeleteClick = null;
  #datepickerFrom = null;
  #datepickerTo = null;
  #pointType;

  constructor({ point = POINT_EMPTY, pointDestination, pointOffers, pointType = EditType.EDITING, onSubmitClick, onResetClick, onDeleteClick }) {
    super();
    this.#pointDestination = pointDestination;
    this.#pointOffers = pointOffers;
    this.#handleSubmitClick = onSubmitClick;
    this.#handleResetClick = onResetClick;
    this.#handleDeleteClick = onDeleteClick;
    this.#pointType = pointType;

    this._setState(EditPointView.parsePointToState({ point }))

    this._restoreHandlers();
  }

  get template() {
    return createEditPointTemplate({
      state: this._state,
      pointDestination: this.#pointDestination,
      pointOffers: this.#pointOffers,
      pointType: this.#pointType
    });
  }

  reset = (point) => this.updateElement({ point });

  removeElement = () => {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  };

  _restoreHandlers = () => {
    if (this.#pointType === EditType.EDITING) {
      this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollupButtonClickHandler);

      this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteButtonClickHandler)
    }

    if (this.#pointType === EditType.CREATING) {
      this.element.querySelector('.event__reset-btn').addEventListener('click', this.#resetButtonClickHandler)
    }

    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);

    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeChangeHandler);

    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);

    this.element.querySelector('.event__available-offers')?.addEventListener('change', this.#offerChangeHandler);

    this.element.querySelector('.event__input--price').addEventListener('change', this.#priceChangeHandler);

    this.#setDatepickers();
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleSubmitClick(EditPointView.parseStateToPoint(this._state));
  }

  #rollupButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleResetClick();
  }

  #resetButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleResetClick();
  }

  #deleteButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(EditPointView.parseStateToPoint(this._state));
  }

  #typeChangeHandler = (evt) => {
    this.updateElement({
      point: {
        ...this._state.point,
        type: evt.target.value,
        offers: []
      }
    });
  };

  #destinationChangeHandler = (evt) => {
    const selectedDestination = this.#pointDestination.find((destination) => destination.name === evt.target.value);
    const selectedDestinationId = (selectedDestination) ? selectedDestination.id : null;

    this.updateElement({
      point: {
        ...this._state.point,
        destination: selectedDestinationId
      }
    });
  };

  #offerChangeHandler = () => {
    const checkedBoxes = Array.from(this.element.querySelectorAll('.event__offer-checkbox:checked'));

    this._setState({
      point: {
        ...this._state.point,
        offers: checkedBoxes.map((element) => element.id)
      }
    });
  };

  #priceChangeHandler = (evt) => {
    this._setState({
      point: {
        ...this._state.point,
        basePrice: evt.target.value
      }
    });
  };

  #dateFromCloseHandler = ([userDate]) => {
    this._setState({
      point: {
        ...this._state.point,
        dateFrom: userDate
      }
    });

    this.#datepickerTo.set('minDate', this._state.point.dateFrom);
  }

  #dateToCloseHandler = ([userDate]) => {
    this._setState({
      point: {
        ...this._state.point,
        dateTo: userDate
      }
    });

    this.#datepickerFrom.set('maxDate', this._state.point.dateTo);
  }

  #setDatepickers = () => {
    const [dateFromElement, dateToElement] = this.element.querySelectorAll('.event__input--time');
    const commonConfig = {
      dateFormat: 'd/m/y H:i',
      enableTime: true,
      locale: {
        firstDayOfWeek: 1,
      },
      'time_24hr': true
    };

    this.#datepickerFrom = flatpickr(
      dateFromElement,
      {
        ...commonConfig,
        defaultDate: this._state.point.dateFrom,
        onClose: this.#dateFromCloseHandler,
        maxDate: this._state.point.dateTo,
      },
    );

    this.#datepickerTo = flatpickr(
      dateToElement,
      {
        ...commonConfig,
        defaultDate: this._state.point.dateTo,
        onClose: this.#dateToCloseHandler,
        maxDate: this._state.point.dateFrom,
      },
    )
  };

  static parsePointToState = ({ point }) => ({ point });

  static parseStateToPoint = (state) => state.point;
}
