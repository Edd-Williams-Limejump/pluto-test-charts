import { Page } from "../../components";
import React, { useState, useRef, useEffect } from "react";
import * as d3 from "d3";
import { generateTradingData } from "./generateTradingData";

const D3 = () => {
  const d3Container = useRef(null);
  const [data, setData] = useState(generateTradingData(48, new Date()));

  const margin = { top: 35, right: 35, bottom: 35, left: 35 };

  const CHART_WIDTH = 800 - margin.left - margin.right;
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
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.datetime))
      .range([CHART_START_Y, CHART_END_X])
      .paddingOuter(0)
      .paddingInner(0.2)
      .align(0.5);

    const yScale = d3
      .scaleLinear()
      .domain([15, -15])
      .range([CHART_START_X, CHART_END_Y]);

    // Draw X Axis
    const xAxis = d3
      .axisBottom(xScale)
      .tickFormat(d3.timeFormat("%-I %p"))
      .tickSizeInner(0)
      .tickPadding(6)
      .tickValues(xScale.domain().filter((d, i) => !(i % 6)));

    svg
      .append("g")
      .attr("transform", `translate(0, ${CHART_END_Y})`)
      .call(xAxis);

    // Draw Y Axis
    const yAxis = d3.axisLeft(yScale).ticks(5);

    svg
      .append("g")
      .attr("transform", `translate(${CHART_START_X}, 0)`)
      .call(yAxis);

    // Create midpoint line
    chart
      .append("line")
      .style("stroke", "black")
      .style("stroke-width", 1)
      .attr("x1", CHART_START_X)
      .attr("x2", CHART_WIDTH + 100)
      .attr("y1", CHART_MID_Y)
      .attr("y2", CHART_MID_Y);

    const keys = ["dcLow", "intraday", "dcHigh"];
    // const keys = ["dcLow", "intraday"];

    // Set colour variations for stacks
    const color = d3
      .scaleOrdinal()
      .domain(keys)
      .range(["#e41a1c", "#377eb8", "#4daf4a"]);

    // Build stacked data
    const stackedData = d3.stack().keys(keys)(data);

    const groups = chart
      .append("g")
      .selectAll("g")
      .data(stackedData)
      .join("g")
      .attr("fill", (d) => color(d));

    // Loop through groups and then sub data and draw bars
    groups
      .selectAll("rect")
      .data((d) => d)
      .join("rect")
      .attr("rx", 6)
      .attr("stroke-width", 0)
      .attr("x", (d) => xScale(d.data.datetime))
      .attr("y", (d) => {
        return yScale(d[1]);
        // return yScale(Math.min(0, d[1]));
      })
      .attr("width", xScale.bandwidth() - 3)
      .attr("height", (d) => {
        const calculatedHeight = yScale(d[0]) - yScale(d[1]);
        // if (d[1] < 0) {
        //   return Math.abs(calculatedHeight);
        // }

        // if (calculatedHeight === 0) return calculatedHeight;
        return Math.abs(calculatedHeight);
      });

    // Create an invisible group that acts as a hover
    // chart
    //   .selectAll(".hover")
    //   .data(data)
    //   .enter()
    //   .append("rect")
    //   .attr("x", (d) => xScale(d.datetime))
    //   .attr("y", CHART_START_Y)
    //   .attr("height", CHART_HEIGHT)
    //   .attr("width", (d) => 15)
    //   //   .attr("stroke", "black")
    //   .attr("fill", "#a8a8a8")
    //   .attr("fill-opacity", 0)
    //   .on("mouseover", (element) =>
    //     select(element.currentTarget).attr("fill-opacity", 0.2)
    //   )
    //   .on("mouseout", (element) =>
    //     select(element.currentTarget).attr("fill-opacity", 0)
    //   );

    // Remove bars if needed (Not entirely sure on this one)
    chart.selectAll(".bar").data(data).exit().remove();
  }, []);

  return (
    <Page title="D3">
      <svg className="d3-component" ref={d3Container} />
    </Page>
  );
};

export default D3;
