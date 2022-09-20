import React from "react";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import StackedChartGenerator from "./StackedChartGenerator";

const StackedChart = ({ data, keys }) => {
  const svgRef = useRef();

  useEffect(() => {
    const chart = new StackedChartGenerator(svgRef.current, data, keys);
    return () => {
      d3.select(chart).remove();
    };
  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default StackedChart;
