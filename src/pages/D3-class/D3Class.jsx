/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { useRef } from "react";
import StackedChart from "./StackedChart";
import { Page } from "../../components";
import { generateTradingData } from "../D3/generateTradingData";
import set from "date-fns/set";

import { ReactComponent as DcLow } from "./legend/dcLow.svg";
import { ReactComponent as DcHigh } from "./legend/dcHigh.svg";

import "./style.scss";
import { add, format } from "date-fns";

const LEGEND_ICON_MAPPING = {
  dcLow: DcLow,
  dcHigh: DcHigh,
};

const INIT_DATA = generateTradingData(
  47,
  set(new Date(), { hours: 23, minutes: 0, seconds: 0 })
);
const INIT_DIMS = { height: 500, width: 1000 };

const KEYS = ["dcLow", "dcHigh"];

const D3Class = () => {
  const domNode = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [data, setData] = useState(INIT_DATA);
  const [vizInitialized, setVizInitialized] = useState(false);
  const [tooltipData, setTooltipData] = useState(undefined);

  // Effect to deal with adding/removing chart to DOM
  useEffect(() => {
    const canvasChart = new StackedChart(domNode.current);
    setCanvas(canvasChart);

    return () => {
      // This deals with not having multiple svgs with hot reload
      canvasChart.remove();
      setVizInitialized(false);
    };
  }, []);

  // Effect to deal with initalising
  useEffect(() => {
    if (!vizInitialized && canvas && data) {
      canvas.init(data, INIT_DIMS, KEYS, setTooltipData);
      setVizInitialized(true);
    }
  }, [canvas, data]);

  // Effect to deal with updating the data
  useEffect(() => {
    if (vizInitialized && data) {
      canvas.updateData(data);
    }
  }, [data]);

  const refreshData = () => {
    setData(
      generateTradingData(
        47,
        set(new Date(), { hours: 23, minutes: 0, seconds: 0 })
      )
    );
  };

  return (
    <Page title="D3 with Class">
      <button onClick={refreshData}>RefreshData</button>
      <div
        ref={domNode}
        style={{
          height: INIT_DIMS.height + 75 + "px",
          width: INIT_DIMS.width + "px",
          boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
          position: "relative",
        }}
      >
        <div className="legend">
          {KEYS.map((k) => {
            const Icon = LEGEND_ICON_MAPPING[k];
            return (
              <div className="legend__item" key={k}>
                <Icon />
                <p>{k}</p>
              </div>
            );
          })}
        </div>
        {tooltipData ? (
          <div
            className="tooltip"
            style={{ top: tooltipData.pos.y, left: tooltipData.pos.x }}
          >
            <div className="tooltip__line">
              <p>{format(tooltipData.datetime, "d LLL y")}</p>
              <p>
                {format(tooltipData.datetime, "HH:mm")} -
                {format(add(tooltipData.datetime, { minutes: 30 }), "HH:mm")}
              </p>
            </div>
            {Object.entries(tooltipData.data).map(([key, value]) => (
              <div className="tooltip__line" key={key}>
                <p>{key}</p>
                <p>{value}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </Page>
  );
};

export default D3Class;
