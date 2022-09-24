/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { useRef } from "react";
import StackedChart from "./StackedChart";
import { Page } from "../../components";
import { generateTradingData } from "../D3/generateTradingData";

const INIT_DATA = generateTradingData(48, new Date());

const D3Class = ({ dims = { height: 500, width: 800 } }) => {
  const domNode = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [data, setData] = useState(INIT_DATA);
  const [vizInitialized, setVizInitialized] = useState(false);

  useEffect(() => {
    const canvasChart = new StackedChart(domNode.current);
    setCanvas(canvasChart);
  }, []);

  useEffect(() => {
    console.log("reinit chart", { canvas });
    if (canvas && data.length > 1 && dims.width && vizInitialized === false) {
      canvas.init(data, dims);
      setVizInitialized(true);
    }
  }, [canvas, vizInitialized]);

  useEffect(() => {
    if (vizInitialized) {
      console.log("updating data");

      canvas.updateData(data);
    }
  }, [data]);

  const refreshData = () => {
    setData(() => generateTradingData(48, new Date()));
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
