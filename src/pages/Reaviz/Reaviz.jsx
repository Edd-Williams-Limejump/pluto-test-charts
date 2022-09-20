import { add } from "date-fns";
import React from "react";
import {
  StackedBarChart,
  StackedBarSeries,
  Bar,
  LinearYAxis,
  LinearYAxisTickSeries,
  LinearYAxisTickLabel,
  LinearXAxis,
  LinearXAxisTickSeries,
  GuideBar,
  GridlineSeries,
  Gridline,
  TooltipArea,
  ChartTooltip,
  LinearXAxisTickLine,
  LinearXAxisTickLabel,
} from "reaviz";
import { Page } from "../../components";

const height = 400;
const width = 600;

const data = [
  {
    key: new Date(),
    data: [
      {
        key: "dcLow",
        data: 10,
      },
      {
        key: "dcHigh",
        data: -9,
      },
    ],
  },
  {
    key: add(new Date(), { minutes: 30 }),
    data: [
      {
        key: "dcLow",
        data: 4,
      },
      {
        key: "dcHigh",
        data: -20,
      },
    ],
  },
  {
    key: add(new Date(), { minutes: 60 }),
    data: [
      {
        key: "dcLow",
        data: 2,
      },
      {
        key: "dcHigh",
        data: -11,
      },
    ],
  },
];

const Reaviz = () => {
  const padding = 8;
  const rx = 12;
  const ry = 12;
  const height = 250;
  const width = 400;
  const hasGuideBar = true;
  const guide = hasGuideBar ? <GuideBar fill="black" /> : null;

  return (
    <Page title="Reavis">
      <StackedBarChart
        style={{ filter: "drop-shadow(0 0 10px 2px white)" }}
        width={width}
        height={height}
        margins={0}
        data={data}
        gridlines={<GridlineSeries line={<Gridline direction="all" />} />}
        centerX={true}
        series={
          <StackedBarSeries
            type="stackedDiverging"
            padding={0.2}
            bar={[
              <Bar
                rx={rx}
                ry={ry}
                guide={guide}
                style={() => ({ fill: "#3f38be" })}
              />,
              <Bar
                rx={rx}
                ry={ry}
                guide={guide}
                style={() => ({ fill: "#987474" })}
              />,
            ]}
            tooltip={
              <TooltipArea
                tooltip={
                  <ChartTooltip
                    followCursor={true}
                    modifiers={{
                      offset: "5px, 5px",
                    }}
                    content={(data, color) => "something"}
                  />
                }
              />
            }
          />
        }
        yAxis={
          <LinearYAxis
            roundDomains={true}
            tickSeries={
              <LinearYAxisTickSeries
                line={null}
                label={<LinearYAxisTickLabel padding={5} />}
              />
            }
          />
        }
      />
    </Page>
  );
};

export default Reaviz;
