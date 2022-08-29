import { randomIntFromInterval } from "../../generateTimeData";
import add from "date-fns/add";

export const generateTimeData = (date) => {
  return {
    id: Math.floor(Math.random() * 100),
    daHourly: randomIntFromInterval(-5, 0),
    haHHourly: randomIntFromInterval(-1, 0),
    intraday: randomIntFromInterval(0, 3),
    dcLow: randomIntFromInterval(0, 9),
    dcHigh: randomIntFromInterval(-9, 0),
    datatime: date,
  };
};

export const generateTradingData = (length, startDate = new Date()) => {
  const timeSeries = [];
  let baseDate = startDate;

  for (var i = 0; i < length; i++) {
    timeSeries.push(generateTimeData(add(baseDate, { minutes: 30 })));
    baseDate = add(baseDate, { minutes: 30 });
  }

  return timeSeries;
};
