const moment = require('moment');
const { interval } = require('rxjs');

const { get$ } = require('../utils/request');
const Loop = require('../utils/loop');

const startTradingHoursAM = (now) => moment(now).set({ hour: 9, minute: 15 });
const endTradingHoursAM = (now) => moment(now).set({ hour: 11, minute: 30 });

const startTradingHoursPM = (now) => moment(now).set({ hour: 12, minute: 45 });
const endTradingHoursPM = (now) => moment(now).set({ hour: 15, minute: 0 });

const startIntermission = (now) => moment(now).set({ hour: 11, minute: 30 });
const endIntermisssion = (now) => moment(now).set({ hour: 12, minute: 45 });

const isTradingHours = (now) => {
  const startAM = startTradingHoursAM(now);
  const endAm = endTradingHoursAM(now);
  const startPM = startTradingHoursPM(now);
  const endPM = endTradingHoursPM(now);
  return moment(now).isBetween(startAM, endAm, 'minute', '(]') ||
  moment(now).isBetween(startPM, endPM, 'minute', '(]')
};

const getDelay = (now) => {
  const startIM = startIntermission(now);
  const endIM = endIntermisssion(now);
  if (moment(now).isBetween(startIM, endIM, 'minute', '(]')) {
    return startTradingHoursPM(now).diff(now);
  }

  const startAM = startTradingHoursAM(now);
  if (moment(now).isBefore(startAM, 'minute')) {
    return startAM.diff(now);
  }

  const tomorrow = moment(now).add(1, 'days');
  return startTradingHoursAM(tomorrow).diff(now);
};

const updateCnstocksIndexDb = () => {

};

const updateCnStocksIndex = (notJudge = false) => {
  const now = moment().utcOffset(8);

  if (notJudge || isTradingHours(now)) {
    // updateCnstocksIndexDb();
  } else {
    const delay = getDelay(now);
    setTimeout(() => updateCnStocksIndex(true), delay);
  }
};

module.exports = updateCnStocksIndex;
