import React, { useLayoutEffect } from "react";
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { add } from "date-fns";
import { svg } from "d3";

const margin = { top: 30, right: 30, bottom: 30, left: 30 };

const CHART_WIDTH = 600 - margin.left - margin.right;
const CHART_HEIGHT = 400 - margin.top - margin.bottom;

const CHART_START_X = margin.left;
const CHART_START_Y = margin.top;
const CHART_MID_Y = margin.top + CHART_HEIGHT / 2;
const CHART_MID_X = margin.left + CHART_WIDTH / 2;
const CHART_END_Y = 400 - margin.bottom;
const CHART_END_X = margin.left + CHART_WIDTH;

const TOTAL_WIDTH = CHART_WIDTH + margin.left + margin.right;
const TOTAL_HEIGHT = CHART_HEIGHT + margin.bottom + margin.top;

const BAR_PADDING = 4;
const X_TICKS = 24;
const Y_TICKS = 7;
const TICK_DURATION = 30;

const COLOR_MAP = {
  dcLow: "rgb(191,101,178)",
  dcHigh: "rgb(1,205,79)",
  intraday: "rgb(137,192,238)",
};

const drawBaseChart = (container) => {
  const chart = d3.select(container);

  chart
    .attr("width", TOTAL_WIDTH)
    .attr("height", TOTAL_HEIGHT)
    .classed("stacked-bar-chart", true)
    .style("background-color", "rgb(241,241,241)");
};

const drawAxis = (container, xScale, yScale) => {
  // clear all previous content on refresh
  const chart = d3.select(container);

  // Remove the old Axis
  chart.selectAll(".axis__x").remove();
  chart.selectAll(".axis__y").remove();

  chart
    .append("g")
    .attr("class", "axis__x")
    .attr("transform", `translate(0, ${CHART_END_Y})`)
    .call(d3.axisBottom(xScale).tickSizeOuter(0));

  chart
    .append("g")
    .attr("class", "axis__y")
    .attr("transform", `translate(${CHART_START_X}, 0)`)
    .call(d3.axisLeft(yScale).ticks(10));
};

const drawGrid = (container, xScale, yScale) => {
  const chart = d3.select(container);

  chart.selectAll(".vertical-grid-container").remove();
  chart.selectAll(".horizontal-grid-container").remove();

  // Create X lines
  const xLines = chart
    .append("g")
    .classed("vertical-grid-container", true)
    .selectAll("line.vertical-grid")
    .data(xScale.ticks(X_TICKS));

  xLines
    .enter()
    .append("line")
    .classed("vertical-grid", true)
    .attr("x1", (d) => xScale(d))
    .attr("x2", (d) => xScale(d))
    .attr("y1", CHART_START_Y - 10)
    .attr("y2", CHART_END_Y)
    .attr("fill", "none")
    .attr("shape-rendering", "crispEdges")
    .attr("stroke", "black")
    .attr("stroke-width", "1px")
    .attr("stroke-opacity", 0.2);

  // Create Y lines
  const yLines = chart
    .append("g")
    .classed("horizontal-grid-container", true)
    .selectAll("line.horizontal-grid")
    .data(yScale.ticks(Y_TICKS));

  yLines
    .enter()
    .append("line")
    .classed("horizontal-grid", true)
    .attr("x1", CHART_START_X)
    .attr("x2", CHART_END_X + 10)
    .attr("y1", (d) => {
      return yScale(d);
    })
    .attr("y2", (d) => {
      return yScale(d);
    })
    .attr("fill", "none")
    .attr("shape-rendering", "crispEdges")
    .attr("stroke", "black")
    .attr("stroke-width", "1px");
};

const StackedBarChart = ({ data }) => {
  const svgRef = useRef();

  const [min, max] = d3.extent(data, (d) => new Date(d.datetime));

  const xScale = d3.scaleTime().range([CHART_START_X, CHART_END_X]);
  xScale.domain([min, add(max, { minutes: TICK_DURATION })]);

  const yScale = d3.scaleLinear().range([CHART_END_Y, CHART_START_Y]);
  yScale.domain([-15, 15]);

  useLayoutEffect(() => {
    // Draw the graph and axis
    drawBaseChart(svgRef.current);
    drawAxis(svgRef.current, xScale, yScale);
    drawGrid(svgRef.current, xScale, yScale);
    // Need to draw bars somehow
  }, [data, svgRef]);

  return <svg ref={svgRef}></svg>;
};

export default StackedBarChart;
