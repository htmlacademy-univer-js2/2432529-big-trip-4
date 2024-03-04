import SortView from '../view/sort-view.js';
import EditPointView from '../view/edit-point-view.js';
import PointView from '../view/point-view.js';
import TripView from '../view/point-list-view.js';
import { render } from '../render.js';

export default class TripPresenter {
  constructor({tripContainer, destinationsModel, offersModel, pointsModel}) {
    this.tripContainer = tripContainer;
    this.pointList = new TripView();
    this.destinationsModel = destinationsModel;
    this.offersModel = offersModel;
    this.pointsModel = pointsModel;
    this.points = [...pointsModel.get()];
}

  init() {
    render(new SortView(), this.tripContainer);
    render(this.pointList, this.tripContainer);
    render(
      new EditPointView({
        point: this.points[0],
        pointDestination: this.destinationsModel.getById(this.points[0].destination),
        pointOffers: this.offersModel.getByType(this.points[0].type),
      }),
      this.pointList.getElement()
    );

    for (let i = 1; i < this.points.length; i++) {
      const point = this.points[i];
      render(
        new PointView({
          point,
          pointDestination: this.destinationsModel.getById(point.destination),
          pointOffers: this.offersModel.getByType(point.type)
        }),
        this.pointList.getElement()
      );
    }
  }
}
