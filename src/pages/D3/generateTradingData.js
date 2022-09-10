import { randomIntFromInterval } from "../../generateTimeData";
import add from "date-fns/add";

function roundMinutes(date) {
  date.setHours(date.getHours() + Math.round(date.getMinutes() / 60));
  date.setMinutes(0, 0, 0); // Resets also seconds and milliseconds

  return date;
}

export const generateTimeData = (date, id) => {
  return {
    id,
    // id: Math.floor(Math.random() * 100),
    // daHourly: randomIntFromInterval(-5, 0),
    haHHourly: randomIntFromInterval(-1, 0),
    intraday: randomIntFromInterval(0, 3),
    dcLow: randomIntFromInterval(0, 9),
    dcHigh: randomIntFromInterval(-5, 0),
    datetime: new Date(date),
  };
};

export const generateTradingData = (length, startDate = new Date()) => {
  const timeSeries = [];
  let baseDate = roundMinutes(startDate);

  for (var i = 0; i < length; i++) {
    timeSeries.push(generateTimeData(add(baseDate, { minutes: 30 }), i + 1));
    baseDate = add(baseDate, { minutes: 30 });
  }

  return timeSeries;
};

export const getMinValue = (obj) => {
  const arr = Object.values(obj);
  return Math.min(arr);
};

export const getMaxValue = (obj) => {
  const arr = Object.values(obj);
  return Math.max(arr);
};
