import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import { add, addHours, endOfYesterday, subHours } from "date-fns";
import { PlotFigure } from "plot-react";
import { useState, useEffect } from "react";
import { Page } from "../../components";
import { generateTradingData } from "../D3/generateTradingData";

const PlotChart = () => {
  const [data, ,] = useState(generateTradingData(48, new Date()));

  console.log(data);

  return (
    <Page title="Plot">
      <PlotFigure
        options={{
          x: {
            // type: "utc",
            //   domain: data.sort((d) => d.datetime).map((d) => d.datetime),
            // ticks: 24,
            //   tickFormat: (d, i) =>
            //     i % 5 === 0 ? d3.timeFormat("%-I %-p")(d) : "",
          },
          //   grid: true,
          //   y: {
          //     domain: [-10, 10],
          //     grid: true,
          //     ticks: 6,
          //     tickFormat: (d, i) => {
          //       return i % 1 == 0 ? d : " ";
          //     },
          //   },
          marks: [
            // Plot.rectY(
            //   data,
            //   Plot.stackX({
            //     x: "datetime",
            //     y2: "dcLow",
            //   })
            // ),
            Plot.rectX(
              data,
              Plot.bin(
                {},
                {
                  y: "dcHigh",
                  x: "datetime",
                  rx: 4,
                }
              )
              //   Plot.binX({ y: (d) => d.dcHigh }, { rx: 8, x: (d) => d.datetime })
            ),
            Plot.ruleY(data, new Date()),
          ],

          //   marks: [
          //     Plot.barY(data, {
          //       x: "datetime",
          //       y: "dcLow",
          //       insetLeft: 1,
          //       rx: 4,
          //       fill: "red",
          //     }),
          //   ],
          //   legend: true,
        }}
      />
    </Page>
  );
};

export default PlotChart;

// useEffect(() => {
//   createAxis;
//   createMiodpointLine;
// }, []);

// useEffect(() => {
//   creaetStadkedBars();
// }, [data]);
