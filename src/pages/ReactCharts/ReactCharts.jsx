import React from "react";
import { Chart } from "react-charts";
import { Page } from "../../components";

import "./ReactCharts.scss";

const data = [
  {
    label: "Stars",
    data: [
      {
        date: new Date(),
        stars: 23,
      },
      {
        date: new Date().setDate(new Date().getDate() + 1),
        stars: 23,
      },
      {
        date: new Date().setDate(new Date().getDate() + 2),
        stars: 81,
      },
    ],
  },
  {
    label: "Asteroids",
    // This axis ID is important when defining
    secondaryAxisId: "2",
    data: [
      {
        date: new Date(),
        asteroids: 10,
      },
      {
        date: new Date().setDate(new Date().getDate() + 1),
        asteroids: 50,
      },
      {
        date: new Date().setDate(new Date().getDate() + 2),
        asteroids: 20,
      },
    ],
  },
];

const ReactCharts = () => {
  const primaryAxis = React.useMemo(
    () => ({
      getValue: (datum) => datum.date,
      padBandRange: true,
    }),
    []
  );

  const secondaryAxes = React.useMemo(
    () => [
      {
        getValue: (datum) => datum.stars,
        elementType: "line",
      },
      {
        id: "2",
        getValue: (datum) => datum.asteroids,
        elementType: "line",
      },
    ],
    []
  );

  return (
    <Page title="React Charts">
      <div>
        <p>
          <a href="https://react-charts.tanstack.com/">Documentation</a>
        </p>

        <p>
          <ul>
            <li>
              <strong>Does not support Pie charts:</strong>
              <blockquote style={{ fontStyle: "italic" }}>
                React Charts only supports X/Y chart layouts and purposefully
                does not have support for pie charts, radar charts, or other
                circular nonsense.
              </blockquote>
            </li>
            <li>
              I think this is still in beta and requires a lot of digging
              through source code to understand what's going on under the hood
            </li>
            <li>
              Using typescript with this would help as all of the code is
              written with types and that would likely help our understanding
            </li>
          </ul>
        </p>
      </div>

      {/* Needed to set specific height and width to prevent it expanding 🤷 */}
      <div style={{ width: "80%", height: "400px" }}>
        <Chart
          options={{
            data,
            primaryAxis,
            secondaryAxes,
          }}
        />
      </div>
    </Page>
  );
};

export default ReactCharts;
