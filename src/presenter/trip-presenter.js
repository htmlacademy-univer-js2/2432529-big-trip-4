import SortView from '../view/sort-view.js';
import EditPointView from '../view/edit-point-view.js';
import PointView from '../view/point-view.js';
import TripView from '../view/point-list-view.js';
import { render } from '../render.js';

export default class TripPresenter {
    constructor(tripContainer) {
        this.tripContainer = tripContainer;
        this.pointList = new TripView();
    }

    init() {
        render(new SortView(), this.tripContainer);
        render(this.pointList, this.tripContainer);
        render(new EditPointView(), this.pointList.getElement());

        for (let i = 0; i < 3; i++) {
            render(new PointView(), this.pointList.getElement());
        }
    }
}