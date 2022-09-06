import { Page } from "../../components";
import React, { useState, useRef, useEffect, useId } from "react";
import * as d3 from "d3";
import { generateTradingData, getMinValue } from "./generateTradingData";
import { select, selectAll } from "d3";
import { XAxis } from "recharts";

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
const TICKS = 24;

const D3 = () => {
  const d3Container = useRef(null);
  const [data, setData] = useState(generateTradingData(TICKS, new Date()));

  const keys = ["dcLow", "intraday", "dcHigh"];

  const COLOR_MAP = {
    dcLow: "blue",
    dcHigh: "red",
    intraday: "black",
  };

  console.log(data);

  useEffect(() => {
    if (data.current === data) return;

    const svg = d3
      .select(d3Container.current)
      .attr("width", TOTAL_WIDTH)
      .attr("height", TOTAL_HEIGHT)
      .style("background-color", "#dcdcdc");

    const chart = svg.append("g").classed("chart", true);

    const createAxis = () => {
      // Build Scales
      const xScale = d3.scaleTime().range([CHART_START_X, CHART_END_X]);
      const yScale = d3.scaleLinear().range([CHART_END_Y, CHART_START_Y]);

      // Set Domain boundaries
      xScale.domain(d3.extent(data, (d) => new Date(d.datetime)));
      yScale.domain([-15, 15]);

      // Define axis
      const xAxis = d3
        .axisBottom(xScale)
        .tickSizeOuter(0)
        .ticks(TICKS)
        // Creates grid line
        .tickSizeInner(-CHART_HEIGHT)
        .tickFormat((d, i) => {
          return i % 3 == 0 ? d3.timeFormat("%-I %-p")(d) : " ";
        });

      const yAxis = d3
        .axisLeft(yScale)
        .tickSizeOuter(0)
        // Creates grid line
        .tickSizeInner(-CHART_WIDTH)
        .ticks(7)
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

    const createMidPointLine = () => {
      chart
        .append("line")
        .style("stroke", "black")
        .style("stroke-width", 1)
        .attr("x1", CHART_START_X)
        .attr("x2", CHART_END_X)
        .attr("y1", CHART_MID_Y + 0.5 + "px")
        .attr("y2", CHART_MID_Y + 0.5 + "px");
    };

    const createStackedBars = () => {
      const stackGenerator = d3
        .stack()
        .offset(d3.stackOffsetDiverging)
        .keys(keys);

      // These are the layers from the keys
      const layers = stackGenerator(data);

      const layerRenders = chart
        .selectAll(".layer")
        .data(layers)
        .join("g")
        .classed("layer", true)
        .attr("fill", (d) => {
          return COLOR_MAP[d.key];
        });

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
        .attr("width", CHART_WIDTH / TICKS)
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
        .attr("rx", 2)
        .attr("width", CHART_WIDTH / TICKS - BAR_PADDING)
        .attr("height", (d) => yScale(d[0]) - yScale(d[1]))
        .attr("x", (d) => xScale(d.data.datetime) + BAR_PADDING / 2)
        .attr("y", (d) => yScale(d[1]));
    };

    // Set colour variations for stacks
    const color = d3
      .scaleOrdinal()
      .domain(keys)
      .range(["#e41a1c", "#377eb8", "#4daf4a"]);

    // Remove bars if needed (Not entirely sure on this one)
    chart.selectAll(".bar").data(data).exit().remove();

    const { xAxis, xScale, yAxis, yScale } = createAxis();
    createMidPointLine();

    createStackedBars();
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
