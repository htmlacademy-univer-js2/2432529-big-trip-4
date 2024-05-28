import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(relativeTime);

const TimePeriods = {
  MSEC_IN_SEC: 1000,
  SEC_IN_MIN: 60,
  MIN_IN_HOUR: 60,
  HOUR_IN_DAY: 24
};

const MSEC_IN_HOUR = TimePeriods.MIN_IN_HOUR * TimePeriods.SEC_IN_MIN * TimePeriods.MSEC_IN_SEC;
const MSEC_IN_DAY = TimePeriods.HOUR_IN_DAY * MSEC_IN_HOUR;

function formatStringToDateTime(date) {
  return dayjs(date).format('DD/MM/YY HH:mm');
}

function formatStringToShortDate(date) {
  return dayjs(date).format('MMM DD');
}

function formatStringToTime(date) {
  return dayjs(date).format('HH:mm');
}

function capitalize(string) {
  return `${string[0].toUpperCase()}${string.slice(1)}`;
}

function getPointDuration(dateFrom, dateTo) {
  const timeDiff = dayjs(dateTo).diff(dayjs(dateFrom));
  const totalDays = dayjs.duration(timeDiff).days() + (dayjs.duration(timeDiff).years() * 365);
  const totalHours = dayjs.duration(timeDiff).hours();
  const totalMinutes = dayjs.duration(timeDiff).minutes();

  let pointDuration = 0;

  switch (true) {
    case (timeDiff >= MSEC_IN_DAY):
      pointDuration = dayjs.duration({ days: totalDays, hours: totalHours, minutes: totalMinutes }).format('DD[D] HH[H] mm[M]');
      break;
    case (timeDiff >= MSEC_IN_HOUR):
      pointDuration = dayjs.duration(timeDiff).format('HH[H] mm[M]');
      break;
    case (timeDiff < MSEC_IN_HOUR):
      pointDuration = dayjs.duration(timeDiff).format('mm[M]');
      break;
  }

  return pointDuration;
}

function isPointFuture(point) {
  return dayjs().isBefore(point.dateFrom);
}

function isPointPresent(point) {
  return (dayjs().isAfter(point.dateFrom) && dayjs().isBefore(point.dateTo));
}

function isPointPast(point) {
  return dayjs().isAfter(point.dateTo);
}


function getPointsDateDifference(pointA, pointB) {
  return new Date(pointA.dateFrom) - new Date(pointB.dateFrom);
}

function getPointsPriceDifference(pointA, pointB) {
  return pointB.basePrice - pointA.basePrice;
}

function getPointsDurationDifference(pointA, pointB) {
  const durationA = new Date(pointA.dateTo) - new Date(pointA.dateFrom);
  const durationB = new Date(pointB.dateTo) - new Date(pointB.dateFrom);

  return durationB - durationA;
}

function isBigDifference(pointA, pointB) {
  return pointA.dateFrom !== pointB.dateFrom
    || pointA.basePrice !== pointB.basePrice
    || getPointDuration(pointA.dateFrom, pointA.dateTo) !== getPointDuration(pointB.dateFrom, pointB.dateTo);
}

function adaptToClient(point) {
  const adaptedPoint = {
    ...point,
    basePrice: point['base_price'],
    dateFrom: point['date_from'],
    dateTo: point['date_to'],
    isFavorite: point['is_favorite']
  };

  delete adaptedPoint['base_price'];
  delete adaptedPoint['date_from'];
  delete adaptedPoint['date_to'];
  delete adaptedPoint['is_favorite'];

  return adaptedPoint;
}

function adaptToServer(point) {
  const adaptedPoint = {
    ...point,
    ['base_price']: Number(point.basePrice),
    ['date_from']: new Date(point.dateFrom).toISOString(),
    ['date_to']: new Date(point.dateTo).toISOString(),
    ['is_favorite']: point.isFavorite
  };

  delete adaptedPoint.basePrice;
  delete adaptedPoint.dateFrom;
  delete adaptedPoint.dateTo;
  delete adaptedPoint.isFavorite;

  return adaptedPoint;
}

export {
  formatStringToDateTime,
  formatStringToShortDate,
  formatStringToTime,
  capitalize,
  getPointDuration,
  isPointFuture,
  isPointPast,
  isPointPresent,
  getPointsDateDifference,
  getPointsPriceDifference,
  getPointsDurationDifference,
  isBigDifference,
  adaptToClient,
  adaptToServer
};
