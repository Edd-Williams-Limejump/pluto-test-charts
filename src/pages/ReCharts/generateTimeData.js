import add from "date-fns/add";

const randomIntFromInterval = (min, max) => {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const generateTimeData = (date) => {
  return {
    datetime: date,
    output: randomIntFromInterval(0, 25),
    dcLow: randomIntFromInterval(1, 5),
    dcHigh: randomIntFromInterval(1, 12),
  };
};

export const generateTimeDataArray = (length, startDate = new Date()) => {
  const timeSeries = [];
  let baseDate = startDate;

  for (var i = 0; i < length; i++) {
    timeSeries.push(generateTimeData(add(baseDate, { minutes: 30 })));
    baseDate = add(baseDate, { minutes: 30 });
  }

  return timeSeries;
};
