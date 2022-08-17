import add from "date-fns/add";
import { useEffect, useRef, useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Page } from "../../components";
import { generateTimeData, generateTimeDataArray } from "./generateTimeData";

const addToDate = (numberOfDays) => {
  var date = new Date();
  if (numberOfDays) {
    date.setDate(date.getDate() + numberOfDays);
  }
  return date;
};

const data1 = [
  {
    date: addToDate(),
    forecast: 4000,
    actual: 2400,
    profit: 2400,
  },
  {
    date: addToDate(2),
    forecast: 3000,
    actual: 1398,
    profit: 2210,
  },
  {
    date: addToDate(3),
    forecast: 2000,
    actual: 9800,
    profit: 2290,
  },
  {
    date: addToDate(4),
    forecast: 2780,
    actual: 3908,
    profit: 2000,
  },
  {
    date: addToDate(5),
    forecast: 1890,
    actual: 4800,
    profit: 2181,
  },
  {
    date: addToDate(6),
    forecast: 2390,
    actual: 3800,
    profit: 2500,
  },
  {
    date: addToDate(7),
    forecast: 3490,
    actual: 4300,
    profit: 2100,
  },
];

const data2 = generateTimeDataArray(20);

const ReCharts = () => {
  const [scrollingState, setScrollingState] = useState(data2);
  const intervalRef = useRef();

  const addItemToScrollingState = () => {
    const newDate = (state) =>
      add(state[state.length - 1].datetime, {
        minutes: 30,
      });
    setScrollingState((state) => [...state, generateTimeData(newDate(state))]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      addItemToScrollingState();
    }, 2000);
    intervalRef.current = interval;

    return () => {
      clearInterval(interval);
    };
  }, []);

  const stopLoadingNewDate = () => {
    clearInterval(intervalRef.current);
  };

  return (
    <Page title="ReCharts">
      <div>
        <p>
          <a href="https://recharts.org/en-US/api">Documentation</a>
        </p>
        <p>
          <a href="https://codesandbox.io/s/l4pq6x00xq?file=/src/Hello.js">
            Zoomable
          </a>
        </p>

        <ul>
          <li>This is really great for static charts</li>
        </ul>
      </div>
      <div>
        <ComposedChart
          width={730}
          height={250}
          data={data1}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis label="£/MwH" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="forecast" stroke="#8884d8" />
          <Line type="monotone" dataKey="actual" stroke="#82ca9d" />
          <Bar dataKey="profit" stroke="red" opacity="0.3" />
        </ComposedChart>
      </div>
      <div>
        <button onClick={stopLoadingNewDate}>Stop Loading New Data</button>
        <ComposedChart
          width={730}
          height={250}
          data={scrollingState}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="datetime" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="output" />
          <Bar stackId="a" dataKey="dcLow" fill="#8884d8" />
          <Bar stackId="a" dataKey="dcHigh" fill="#82ca9d" />
        </ComposedChart>
      </div>
    </Page>
  );
};

export default ReCharts;
