import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  LineController,
  BarController,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { Page } from "../../components";

import { randomIntFromInterval } from "../../generateTimeData";

const labels = ["January", "February", "March", "April", "May", "June"];

export const data = {
  labels,
  datasets: [
    {
      type: "line",
      label: "Dataset 1",
      borderColor: "rgb(255, 99, 132)",
      borderWidth: 2,
      fill: false,
      data: labels.map(() => randomIntFromInterval(0, 1000)),
    },
    {
      type: "bar",
      label: "Dataset 2",
      backgroundColor: "rgb(75, 192, 192)",
      data: labels.map(() => randomIntFromInterval(0, 1000)),
      borderColor: "white",
      borderWidth: 2,
    },
    {
      type: "bar",
      label: "Dataset 3",
      backgroundColor: "rgb(53, 162, 235)",
      data: labels.map(() => randomIntFromInterval(0, 1000)),
    },
  ],
};

const config = {
  type: "line",
  data: data,
  options: {},
};

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController
);

const ChartJs = () => {
  return (
    <Page title="ChartJs">
      <div>
        <p>
          <a href="https://react-chartjs-2.js.org/components/bar">
            {" "}
            ReactChartJs
          </a>
        </p>
        <p>
          <a href="https://www.chartjs.org/docs/latest/getting-started/">
            ChartJs
          </a>
        </p>

        <ul>
          <li>
            This is a react wrapper for the chartJS library so most of the
            documention can be found in the OG library. I don't know if this is
            adding a certain level of complexity
          </li>
          <li>
            On first glance, the data that we pass in looks more complex and the
            UI would have to do a bit more work to line these things up
          </li>
          <li>
            By this I mean the labels will have to exactly match the data in the
            array
          </li>
        </ul>

        <pre>
          <code>
            {`
          const labels = ["January", "February", "March", "April", "May", "June"];

          const data = {
            labels: labels,
            datasets: [
                {
                label: "My First dataset",
                backgroundColor: "rgb(255, 99, 132)",
                borderColor: "rgb(255, 99, 132)",
                data: [0, 10, 5, 2, 20, 30, 45],
                },
            ],
            };

            const config = {
            type: "line",
            data: data,
            options: {},
            };
            `}
          </code>
        </pre>

        <div>
          <Chart type="bar" data={data} />
        </div>
      </div>
    </Page>
  );
};

export default ChartJs;
