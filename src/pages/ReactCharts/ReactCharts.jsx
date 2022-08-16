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
        <p>Does not support Pie charts:</p>
        <blockquote style={{ fontStyle: "italic" }}>
          React Charts only supports X/Y chart layouts and purposefully does not
          have support for pie charts, radar charts, or other circular nonsense.
        </blockquote>

        <p>
          I also think this is still in beta and not working exactly as
          expected. It's forever zooming and I can't work out why
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
