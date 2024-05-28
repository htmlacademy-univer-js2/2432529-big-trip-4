import ApiService from '../framework/api-service.js';
import { Method } from '../const.js';

export default class PointsApiService extends ApiService {
  getDestinations() {
    return this._load({ url: 'destinations' })
      .then(ApiService.parseResponse);
  }

  getOffers() {
    return this._load({ url: 'offers' })
      .then(ApiService.parseResponse);
  }

  getPoints() {
    return this._load({ url: 'points' })
      .then(ApiService.parseResponse);
  }

  async updatePoint(update) {
    const response = await this._load({
      url: `points/${update.id}`,
      method: Method.PUT,
      body: JSON.stringify(update),
      headers: new Headers({ 'Content-Type': 'application/json' })
    });


    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  addPoint(data) {
    return { ...data, id: crypto.randomUUID() };
  }

  deletePoint() {
    //...
  }
}
