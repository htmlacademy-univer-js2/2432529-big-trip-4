import AbstractView from "../framework/view/abstract-view.js";
import { FilterType } from "../const.js";

const FilterMessage = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.PAST]: 'There are no past events now'
}

const createMessageTemplate = ({ message }) => {
  return (
    `<section class="trip-events">
            <h2 class="visually-hidden">Trip events</h2>
            <p class="trip-events__msg">${message}</p>
        </section>`
  );
}

export default class MessageView extends AbstractView {
  #filterType;

  constructor({ filterType }) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    const message = FilterMessage[this.#filterType];

    return createMessageTemplate({ message });
  }
}
