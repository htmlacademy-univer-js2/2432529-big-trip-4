import Observable from '../framework/observable.js';

export default class OffersModel extends Observable {
  #service = null;
  #offers = [];

  constructor(service) {
    super();
    this.#service = service;
    this.#offers = this.#service.getOffers();
  }

  get() {
    return this.#offers;
  }

  getByType(type) {
    return this.#offers
      .find((offer) => offer.type === type).offers;
  }
}
