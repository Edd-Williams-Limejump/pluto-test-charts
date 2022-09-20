import { add } from "date-fns";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
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
  MarkLine,
} from "reaviz";
import { Page } from "../../components";
import { randomIntFromInterval } from "../../generateTimeData";

const height = 400;
const width = 600;

const generateDataItem = (date) => {
  return {
    key: date,
    data: [
      { key: "dcLow", data: randomIntFromInterval(0, 10) },
      { key: "dcHigh", data: randomIntFromInterval(-4, 0) },
    ],
  };
};

const BASE_DATA = [
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

const ReavizContainer = () => {
  const [data, setData] = useState(BASE_DATA);

  const addNewData = () => {
    const latestDate = data.at(data.length - 1).key;

    const newData = [...data];

    newData.shift();
    const newItemDate = generateDataItem(
      add(new Date(latestDate), { minutes: 30 })
    );
    // console.log(add(new Date(latestDate), { minutes: 30 }));
    newData.push(newItemDate);

    setData(newData);
    console.log({ newData });
  };

  const handleAddData = () => {
    addNewData();
  };

  return (
    <Page title="Reavis">
      <button onClick={handleAddData}>Add Data</button>
      <Reaviz data={data} />
    </Page>
  );
};

const Reaviz = ({ data }) => {
  const padding = 8;
  const rx = 4;
  const ry = 4;
  const height = 250;
  const width = 400;
  const hasGuideBar = true;
  const guide = hasGuideBar ? <GuideBar fill="black" /> : null;

  return (
    <StackedBarChart
      style={{ filter: "drop-shadow(0 0 10px 2px white)" }}
      width={width}
      height={height}
      margins={0}
      data={data}
      gridlines={
        <GridlineSeries line={<Gridline direction="all" />} />
        // <GridlineSeries line={<Gridline direction="x" centerX />} />,
      }
      centerX={true}
      series={
        <StackedBarSeries
          animated={false}
          type="stackedDiverging"
          padding={0.2}
          bar={[
            <Bar
              rx={rx}
              ry={ry}
              guide={guide}
              style={() => ({
                fill: "#3f38be",
              })}
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
                  content={(data, color) => {
                    if (!data) return null;

                    console.log(data.data);

                    return (
                      <div
                        style={{
                          backgroundColor: "rgba(100, 100, 100, 0.3)",
                          padding: "8px 12px",
                        }}
                      >
                        {/* <h4>{data?.key}</h4> */}
                        {data.data.map((d) => (
                          <p key={d.key}>
                            {d.key}: {d.value}
                          </p>
                        ))}
                      </div>
                    );
                  }}
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
    >
      {/* <MarkLine height={"100%"} pointX={new Date()} /> */}
    </StackedBarChart>
  );
};

export default ReavizContainer;
