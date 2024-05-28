import AbstractView from '../framework/view/abstract-view';

const Message = {
  'LOADING': 'Loading...',
  'LOADING_ERROR': 'Failed to load latest route information',
};

const createLoadingTemplate = ({ message }) => (
  `<p class="trip-events__msg">
            ${message}
        </p >`
);

export default class LoadingView extends AbstractView {
  #isLoading;
  #isLoadingError;

  constructor({ isLoading, isLoadingError }) {
    super();
    this.#isLoading = isLoading;
    this.#isLoadingError = isLoadingError;
  }

  get template() {
    let message;
    if (this.#isLoading) {
      message = Message['LOADING'];
    } else if (this.#isLoadingError) {
      message = Message['LOADING_ERROR'];
    }

    return createLoadingTemplate({ message });
  }
}
