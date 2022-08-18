import add from "date-fns/add";
import { useEffect, useRef, useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Label,
  Legend,
  Line,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Page } from "../../components";
import {
  generateTimeData,
  generateTimeDataArray,
  randomIntFromInterval,
} from "../../generateTimeData";

const addToDate = (numberOfDays) => {
  var date = new Date();
  if (numberOfDays) {
    date.setDate(date.getDate() + numberOfDays);
  }
  return date.toDateString();
};

const data1 = [
  {
    dcLow: randomIntFromInterval(1, 5),
    dcHigh: randomIntFromInterval(1, 12),
    date: addToDate(),
    forecast: 4000,
    actual: 2400,
    profit: 2400,
  },
  {
    dcLow: randomIntFromInterval(1, 5),
    dcHigh: randomIntFromInterval(1, 12),
    date: addToDate(2),
    forecast: 3000,
    actual: 1398,
    profit: 2210,
  },
  {
    dcLow: randomIntFromInterval(1, 5),
    dcHigh: randomIntFromInterval(1, 12),
    date: addToDate(3),
    forecast: 2000,
    actual: 9800,
    profit: 2290,
  },
  {
    dcLow: randomIntFromInterval(1, 5),
    dcHigh: randomIntFromInterval(1, 12),
    date: addToDate(4),
    forecast: 2780,
    actual: 3908,
    profit: 2000,
  },
  {
    dcLow: randomIntFromInterval(1, 5),
    dcHigh: randomIntFromInterval(1, 12),
    date: addToDate(5),
    forecast: 1890,
    actual: 4800,
    profit: 2181,
  },
  {
    dcLow: randomIntFromInterval(1, 5),
    dcHigh: randomIntFromInterval(1, 12),
    date: addToDate(6),
    forecast: 2390,
    actual: 3800,
    profit: 2500,
  },
  {
    dcLow: randomIntFromInterval(1, 5),
    dcHigh: randomIntFromInterval(1, 12),
    date: addToDate(7),
    forecast: 3490,
    actual: 4300,
    profit: 2100,
  },
  {
    dcLow: randomIntFromInterval(1, 5),
    dcHigh: randomIntFromInterval(1, 12),
    date: addToDate(8),
    forecast: 4000,
  },
  {
    dcLow: randomIntFromInterval(1, 5),
    dcHigh: randomIntFromInterval(1, 12),
    date: addToDate(9),
    forecast: 5000,
  },
  {
    dcLow: randomIntFromInterval(1, 5),
    dcHigh: randomIntFromInterval(1, 12),
    date: addToDate(10),
    forecast: 5500,
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

  useEffect(() => {
    if (scrollingState.length >= 30) stopLoadingNewData();
  }, [scrollingState]);

  const stopLoadingNewData = () => {
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
          <li>Handles incoming data well (see below)</li>
          <li>Everything is very customisable in the same way that SVGs are</li>
          <li>
            The data is much nicer to handle as it comes as an object with all
            our fields in this case something like
          </li>

          <pre>
            <code>
              {`let data = {
                  datetime: date,
                  output: randomIntFromInterval(0, 25),
                  dcLow: randomIntFromInterval(1, 5),
                  dcHigh: randomIntFromInterval(1, 12),
                }`}
            </code>
          </pre>

          <li>
            Since we're just setting a time period and would be fetching this
            from the API with a websocket, I think this could be a very good
            candidate
          </li>
        </ul>
      </div>
      <div>
        <ComposedChart
          width={730}
          height={250}
          data={data1}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="1" vertical={true} />
          <XAxis dataKey="date" />
          <YAxis
            label={{ value: "£/mwH", angle: -90, position: "insideLeft" }}
          />
          <YAxis yAxisId="right" orientation="right" />

          <Tooltip />
          <Legend />
          <ReferenceLine
            x={data1[4].date}
            stroke="green"
            label={{ value: "Now", angle: -90 }}
          />
          <Line type="linear" dot={false} dataKey="forecast" stroke="#8884d8" />
          <Line type="linear" dot={false} dataKey="actual" stroke="#82ca9d" />
          {/* <Bar dataKey="profit" stroke="red" opacity="0.3" /> */}
          <Bar yAxisId="right" stackId="a" dataKey="dcLow" fill="#dc3c3c" />
          <Bar yAxisId="right" stackId="a" dataKey="dcHigh" fill="#743cdc" />
        </ComposedChart>
      </div>
      <div>
        <button onClick={stopLoadingNewData}>Stop Loading New Data</button>
        {/* <ComposedChart
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
        </ComposedChart> */}
      </div>
    </Page>
  );
};

export default ReCharts;
