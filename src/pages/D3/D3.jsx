import { Page } from "../../components";
import React, { useState, useRef, useEffect } from "react";
import * as d3 from "d3";
import { generateTradingData } from "./generateTradingData";

const D3 = () => {
  const d3Container = useRef(null);
  const [data, setData] = useState(generateTradingData(48, new Date()));

  const margin = { top: 35, right: 35, bottom: 35, left: 35 };

  const CHART_WIDTH = 700 - margin.left - margin.right;
  const CHART_HEIGHT = 400 - margin.top - margin.bottom;

  const CHART_START_X = margin.left;
  const CHART_START_Y = margin.top;
  const CHART_MID_Y = margin.top + CHART_HEIGHT / 2;
  const CHART_MID_X = margin.left + CHART_WIDTH / 2;
  const CHART_END_Y = 400 - margin.bottom;
  const CHART_END_X = margin.left + CHART_WIDTH;

  const TOTAL_WIDTH = CHART_WIDTH + margin.left + margin.right;
  const TOTAL_HEIGHT = CHART_HEIGHT + margin.bottom + margin.top;

  const MIDDLE_AXIS_Y = CHART_HEIGHT / 2 + margin.top;

  useEffect(() => {
    if (data.current === data) return;

    const svg = d3
      .select(d3Container.current)
      .attr("width", TOTAL_WIDTH)
      .attr("height", TOTAL_HEIGHT)
      .style("background-color", "#dcdcdc");

    const chart = svg.append("g");

    // Create axis
    // const x = d3.scaleTime().range([CHART_START_X, CHART_END_X]);
    // x.domain(d3.extent(data, (d) => d.datetime));
    const xScale = d3
      .scaleTime()
      .range([CHART_START_Y, CHART_END_X])
      .domain([
        d3.min(data, (d) => d.datetime),
        d3.max(data, (d) => d.datetime),
      ]);

    const yScale = d3
      .scaleLinear()
      .range([CHART_START_X, CHART_END_Y])
      .domain([10, -10]);

    // Draw X Axis
    svg
      .append("g")
      .attr("transform", `translate(0, ${CHART_END_Y})`)
      .call(d3.axisBottom(xScale).ticks(5));

    // Draw Y Axis
    svg
      .append("g")
      .attr("transform", `translate(${CHART_START_X}, 0)`)
      .call(d3.axisLeft(yScale).ticks(3));

    // Create midpoint line
    chart
      .append("line")
      .style("stroke", "black")
      .style("stroke-width", 1)
      .attr("x1", CHART_START_X)
      .attr("x2", CHART_WIDTH + margin.right)
      .attr("y1", CHART_MID_Y)
      .attr("y2", CHART_MID_Y);

    // Create bars for DC Low
    chart
      .selectAll(".bar")
      .data(data, (d) => d.id)
      .enter()
      .append("rect")
      .classed("bar", true)
      .attr("fill", "rgb(64, 132, 225)")
      .attr("rx", 4)
      .attr("width", 8)
      .attr("height", (d) => {
        return CHART_MID_Y - yScale(d.dcLow);
      })
      .attr("x", (d) => xScale(d.datetime))
      .attr("y", (d) => yScale(d.dcLow));

    // Create bars for DC High?

    // Add some labels for DC High
    chart
      .selectAll(".label")
      .data(data)
      .enter()
      .append("text")
      .text((d) => d.dcLow)
      .attr("x", (d) => xScale(d.datetime))
      .attr("y", (d) => 20);

    // Labels for DC Low
    // chart
    //   .selectAll(".label")
    //   .data(data)
    //   .enter()
    //   .append("text")
    //   .text((d) => d.dcHigh)
    //   .attr("x", (d) => x(d.datetime))
    //   .attr("y", (d) => CHART_END_Y);

    // create bars for DC High

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
