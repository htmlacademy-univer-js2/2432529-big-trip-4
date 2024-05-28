import AbstractView from '../framework/view/abstract-view.js';
import { capitalize } from '../utils/point.js';

const createFilterItemsTemplate = ({ filters }) => {
  const filterItems = filters.map((filter) => (
    `<div class="trip-filters__filter">
                <input id="filter-${filter.type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter.type}"
                ${(filter.isChecked) ? 'checked' : ''}
                ${(filter.isDisabled) ? 'disabled' : ''}>
                <label class="trip-filters__filter-label" for="filter-${filter.type}">${capitalize(filter.type)}</label>
            </div>`
  )).join('');

  return filterItems;
};

const createFilterTemplate = ({ filters }) => (
  `<form class="trip-filters" action="#" method="get">
            ${createFilterItemsTemplate({ filters })}
            <button class="visually-hidden" type="submit">Accept filter</button>
      </form>`
);

export default class FilterView extends AbstractView {
  #filters = null;
  #handleFilterTypeChange = null;

  constructor({ items, onItemChange }) {
    super();
    this.#filters = items;
    this.#handleFilterTypeChange = onItemChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createFilterTemplate({
      filters: this.#filters
    });
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleFilterTypeChange(evt.target.value);
  };
}
