import AbstractView from '../framework/view/abstract-view.js';

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
  #handleSortTypeChange = null;

  constructor({ items, onItemChange }) {
    super();
    this.#items = items;
    this.#handleSortTypeChange = onItemChange;

    this.element.addEventListener('change', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortTemplate({
      items: this.#items
    });
  }

  #sortTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleSortTypeChange(evt.target.dataset.sortType);
  };
}
