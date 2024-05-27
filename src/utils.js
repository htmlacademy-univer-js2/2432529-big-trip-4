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
}

const MSEC_IN_HOUR = TimePeriods.MIN_IN_HOUR * TimePeriods.SEC_IN_MIN * TimePeriods.MSEC_IN_SEC;
const MSEC_IN_DAY = TimePeriods.HOUR_IN_DAY * MSEC_IN_HOUR;

const Duration = {
    HOUR: 5,
    DAY: 5,
    MIN: 59
};

let date = dayjs().subtract(getRandomInteger(0, Duration.DAY), 'day').toDate();

function getDate({next}) {
    const minsGap = getRandomInteger(0, Duration.MIN);
    const hoursGap = getRandomInteger(1, Duration.HOUR);
    const daysGap = getRandomInteger(0, Duration.DAY);

    if (next) {
        date = dayjs(date)
            .add(minsGap, 'minute')
            .add(hoursGap, 'hour')
            .add(daysGap, 'day')
            .toDate();
    }

    return date;
}

function getRandomInteger(a = 0, b = 1) {
    const lower = Math.ceil(Math.min(a,b));
    const upper = Math.floor(Math.max(a,b));

    return Math.floor(lower + Math.random() * (upper - lower + 1));
}

function getRandomValue(items) {
    return items[getRandomInteger(0, items.length - 1)];
}

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

    let pointDuration = 0;

    switch (true) {
        case (timeDiff >= MSEC_IN_DAY):
            pointDuration = dayjs.duration(timeDiff).format('DD[D] HH[H] mm[M]');
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

function updateItem(items, update) {
    return items.map((item) => item.id === update.id ? update : item);
}

export {
    getDate,
    getRandomInteger,
    getRandomValue,
    formatStringToDateTime,
    formatStringToShortDate,
    formatStringToTime,
    capitalize,
    getPointDuration,
    isPointFuture,
    isPointPast,
    isPointPresent,
    updateItem
}
