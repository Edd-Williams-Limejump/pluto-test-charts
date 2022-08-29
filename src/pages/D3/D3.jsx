import { Page } from "../../components";
import React, { useState, useRef, useEffect } from "react";
import * as d3 from "d3";
import { generateTradingData } from "./generateTradingData";

const D3 = () => {
  const d3Container = useRef(null);
  const [data, setData] = useState(generateTradingData(10, new Date()));

  const margin = { top: 10, right: 30, bottom: 20, left: 50 };
  const CHART_WIDTH = 700 - margin.left - margin.right;
  const CHART_HEIGHT = 400 - margin.top - margin.bottom;

  useEffect(() => {
    console.log("effect", data);
    const svg = d3
      .select(d3Container.current)
      .attr("width", CHART_WIDTH)
      .attr("height", CHART_HEIGHT)
      .style("background-color", "#dcdcdc");

    const chart = svg.append("g");

    // We will need to add all the bars together to get min/max
    // Create axis
    const x = d3.scaleBand().rangeRound([0, CHART_WIDTH]).padding(0.1);
    x.domain(data.map((d) => d.id));

    const y = d3.scaleLinear().range([CHART_HEIGHT, 0]);
    y.domain([
      d3.min(data, (d) => d.dcLow) - 1,
      d3.max(data, (d) => d.dcLow) + 1,
    ]);

    // Create bars
    chart
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .classed("bar", true)
      .attr("width", x.bandwidth())
      .attr("height", (d) => CHART_HEIGHT - y(d.dcLow))
      .attr("x", (d) => x(d.id))
      .attr("y", (d) => y(d.dcLow));

    // Remove bars if needed
    chart.selectAll(".bar").data(data).exit().remove();
  }, []);

  return (
    <Page title="D3">
      <svg className="d3-component" ref={d3Container} />
    </Page>
  );
};

export default D3;
