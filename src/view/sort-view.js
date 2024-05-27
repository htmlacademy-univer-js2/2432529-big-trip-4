import AbstractView from '../framework/view/abstract-view.js';
import { EnabledSortType, SortType } from '../const.js';

const createSortItemsTemplate = ({ items }) => {
  const sortItems = items.map(sortItem => {
    return (
      `<div class="trip-sort__item  trip-sort__item--${sortItem.type}">
            <input
              id="sort-${sortItem.type}"
              class="trip-sort__input  visually-hidden"
              type="radio"
              name="trip-sort"
              value="sort-${sortItem.type}"
              data-sort-type="${sortItem.type}"
              ${(sortItem.isChecked) ? 'checked' : ''}
              ${(sortItem.isDisabled) ? 'disabled' : ''}
            >
            <label
              class="trip-sort__btn"
              for="sort-${sortItem.type}">${sortItem.type}</label>
          </div>`
    )
  }).join('');

  return sortItems;
}

const createSortTemplate = ({ items }) => {
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
            ${createSortItemsTemplate({ items })}
        </form>`
  );
}

export default class SortView extends AbstractView {
  #items = null;
  #onItemChange = null;

  constructor({ sortType, onItemChange }) {
    super();

    this.#items = Object.values(SortType).map((type) => ({
      type,
      isChecked: (type === sortType),
      isDisabled: !EnabledSortType[type]
    }));

    this.#onItemChange = onItemChange;

    this.element.addEventListener('change', this.#itemChangeHandler);
  }

  get template() {
    return createSortTemplate({
      items: this.#items
    });
  }

  #itemChangeHandler = (evt) => {
    evt.preventDefault();
    this.#onItemChange(evt.target.dataset.sortType);
  };
}
