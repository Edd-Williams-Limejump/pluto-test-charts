/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { useRef } from "react";
import StackedChart from "./StackedChart";
import { Page } from "../../components";
import { generateTradingData } from "../D3/generateTradingData";

const INIT_DATA = generateTradingData(48, new Date());
const INIT_DIMS = { height: 500, width: 800 };

const D3Class = () => {
  const domNode = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [data, setData] = useState(INIT_DATA);
  const [vizInitialized, setVizInitialized] = useState(false);

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
      canvas.init(data, INIT_DIMS);
      setVizInitialized(true);
    }

    return () => {
      console.log("init cleanup being called");
    };
  }, [canvas, data]);

  // Effect to deal with updating the data
  useEffect(() => {
    if (vizInitialized && data) {
      canvas.updateData(data);
    }
  }, [data]);

  const refreshData = () => {
    setData(generateTradingData(48, new Date()));
  };

  return (
    <Page title="D3 with Class">
      <button onClick={refreshData}>RefreshData</button>
      <div
        ref={domNode}
        style={{ display: "grid", height: "500px", width: "800px" }}
      />
    </Page>
  );
};

export default D3Class;
