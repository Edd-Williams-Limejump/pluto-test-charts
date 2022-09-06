import { Page } from "../../components";
import React, { useState, useRef, useEffect } from "react";
import * as d3 from "d3";
import { generateTradingData } from "./generateTradingData";
import { add } from "date-fns";

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

const D3 = () => {
  const d3Container = useRef(null);
  const [data, ,] = useState(generateTradingData(X_TICKS, new Date()));

  const keys = ["dcLow", "intraday", "dcHigh"];

  const COLOR_MAP = {
    dcLow: "blue",
    dcHigh: "red",
    intraday: "black",
  };

  useEffect(() => {
    if (data.current === data) return;

    const svg = d3
      .select(d3Container.current)
      .attr("width", TOTAL_WIDTH)
      .attr("height", TOTAL_HEIGHT)
      .style("background-color", "#dcdcdc");

    const createAxis = () => {
      // Build Scales
      const xScale = d3.scaleTime().range([CHART_START_X, CHART_END_X]);
      const yScale = d3.scaleLinear().range([CHART_END_Y, CHART_START_Y]);

      const [min, max] = d3.extent(data, (d) => new Date(d.datetime));
      // Set Domain boundaries
      xScale.domain([min, add(max, { minutes: TICK_DURATION })]);
      yScale.domain([-15, 15]);

      // Define axis
      const xAxis = d3
        .axisBottom(xScale)
        .tickSizeOuter(0)
        .ticks(X_TICKS)
        .tickFormat((d, i) => {
          return i % 3 == 0 ? d3.timeFormat("%-I %-p")(d) : " ";
        });

      const yAxis = d3
        .axisLeft(yScale)
        .tickSizeOuter(0)
        .ticks(Y_TICKS)
        .tickFormat((d, i) => {
          return i % 5 == 0 ? d : " ";
        });

      // Append to Chart
      svg
        .append("g")
        .classed("xAxis", true)
        .attr("transform", `translate(0, ${CHART_END_Y})`)
        .call(xAxis);

      svg
        .append("g")
        .classed("yAxis", true)
        .attr("transform", `translate(${CHART_START_X}, 0)`)
        .call(yAxis);

      return { xAxis, xScale, yAxis, yScale };
    };

    const createGrid = (xScale, yScale) => {
      // Create X lines
      svg
        .append("g")
        .classed("vertical-grid-container", true)
        .selectAll("line.vertical-grid")
        .data(xScale.ticks(X_TICKS - 1))
        .enter()
        .append("line")
        .classed("vertical-grid", true)
        .attr("x1", (d) => xScale(d))
        .attr("x2", (d) => xScale(d))
        .attr("y1", CHART_START_Y)
        .attr("y2", CHART_END_Y)
        .attr("fill", "none")
        .attr("shape-rendering", "crispEdges")
        .attr("stroke", "black")
        .attr("stroke-width", "1px");

      // Create Y lines
      svg
        .append("g")
        .classed("horizontal-grid-container", true)
        .selectAll("line.horizontal-grid")
        .data(yScale.ticks(Y_TICKS))
        .enter()
        .append("line")
        .classed("horizontal-grid", true)
        .attr("x1", CHART_START_X)
        .attr("x2", CHART_END_X)
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

    const createMidPointLine = () => {
      svg
        .append("line")
        .style("stroke", "black")
        .style("stroke-width", 1)
        .attr("x1", CHART_START_X)
        .attr("x2", CHART_END_X)
        .attr("y1", CHART_MID_Y + 0.5 + "px")
        .attr("y2", CHART_MID_Y + 0.5 + "px");
    };

    const createStackedBars = (xScale, yScale) => {
      const stackGenerator = d3
        .stack()
        .offset(d3.stackOffsetDiverging)
        .keys(keys);

      // These are the layers from the keys
      const layers = stackGenerator(data);

      // Give each layer a color using the map
      const layerRenders = chart
        .selectAll(".layer")
        .data(layers)
        .join("g")
        .classed("layer", true)
        .attr("fill", (d) => {
          return COLOR_MAP[d.key];
        });

      // Draw hover bars (Add Tooltip functionality)
      chart
        .selectAll(".hover-overlay")
        .classed("hover-overlay", true)
        .data(data)
        .join("rect")
        .attr("fill", "purple")
        .attr("fill-opacity", 0)
        .attr("y", CHART_START_Y)
        .attr("x", (d) => xScale(d.datetime))
        .attr("height", CHART_HEIGHT)
        .attr("width", CHART_WIDTH / X_TICKS)
        .on("mouseover", (event, data) => {
          d3.select(event.target).attr("fill-opacity", 0.2);
        })
        .on("mouseout", (event, data) => {
          d3.select(event.target).attr("fill-opacity", 0);
        });

      // Draw Bars
      layerRenders
        .selectAll(".bar")
        .data((d) => d)
        .join("rect")
        .classed("bar", true)
        .attr("shape-rendering", "crispEdges")
        .attr("rx", 8)
        .attr("width", CHART_WIDTH / X_TICKS - BAR_PADDING)
        .attr("height", (d) => yScale(d[0]) - yScale(d[1]))
        .attr("x", (d) => xScale(d.data.datetime) + BAR_PADDING / 2)
        .attr("y", (d) => yScale(d[1]));
    };

    // Remove bars if needed (Not entirely sure on this one)
    // chart.selectAll(".bar").data(data).exit().remove();

    // Setup Axis
    const { xAxis, xScale, yAxis, yScale } = createAxis();
    createGrid(xScale, yScale);
    createMidPointLine();

    const chart = svg.append("g").classed("chart", true);
    createStackedBars(xScale, yScale);
  }, [data]);

  return (
    <Page title="D3">
      <div id="d3-container" style={{ position: "relative" }}>
        <svg className="d3-component" ref={d3Container} />
      </div>
    </Page>
  );
};

export default D3;
