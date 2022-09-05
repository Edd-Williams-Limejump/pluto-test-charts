import { Page } from "../../components";
import React, { useState, useRef, useEffect, useId } from "react";
import * as d3 from "d3";
import { generateTradingData } from "./generateTradingData";
import { select } from "d3";

const D3 = () => {
  const d3Container = useRef(null);
  const [data, setData] = useState(generateTradingData(10, new Date()));

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

    const createAxis = () => {
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
    };

    // Create axis
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.datetime))
      .paddingInner(0.02)
      .paddingOuter(0.02)
      .range([CHART_START_X, CHART_END_X])
      .align(0.5);

    const yScale = d3
      .scaleLinear()
      .domain([15, -15])
      .range([CHART_START_Y, CHART_END_Y]);

    // Create chart group
    const chart = svg.append("g").classed("chart", true);

    const createMidPointLine = (chart) => {
      chart
        .append("line")
        .style("stroke", "black")
        .style("stroke-width", 1)
        .attr("x1", CHART_START_X)
        .attr("x2", CHART_END_X)
        .attr("y1", CHART_MID_Y + 0.5 + "px")
        .attr("y2", CHART_MID_Y + 0.5 + "px");
    };

    const keys = ["dcLow", "intraday", "dcHigh"];
    // const keys = ["dcLow", "intraday"];

    // Set colour variations for stacks
    const color = d3
      .scaleOrdinal()
      .domain(keys)
      .range(["#e41a1c", "#377eb8", "#4daf4a"]);

    const createHoverBars = (chart, data) => {
      chart
        .selectAll("mybar")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", (d) => xScale(d.datetime))
        .attr("y", CHART_START_Y)
        .attr("width", xScale.bandwidth())
        .attr("height", CHART_HEIGHT)
        .attr("fill", "#69b3a2")
        .attr("fill-opacity", 0)
        .on("mouseover", (event, data) => {
          select(event.currentTarget).attr("fill-opacity", 0.2);
          console.log(data);
          // Handle showing the tooltip and pass in the data!
        })
        .on("mouseout", (event) => {
          select(event.currentTarget).attr("fill-opacity", 0);
        });
    };

    const createStackedBars = (chart, data) => {
      const stackGenerator = d3
        .stack()
        .keys(keys)
        .offset(0.1)
        .offset(d3.stackOffsetDiverging);

      const stackedData = stackGenerator(data);

      const groups = chart
        .selectAll("g")
        .data(stackedData)
        .join("g")
        .attr("fill", (d) => color(d))
        .classed("stack-key-container", true);

      groups
        .selectAll("rect")
        .data((d) => d)
        .join("rect");

      groups
        .selectAll("rect")
        .data((d) => d)
        .join("rect")
        .attr("rx", 2)
        .attr("stroke-width", 0)
        .attr("x", (d) => xScale(d.data.datetime))
        .attr("y", (d) => {
          const yPos = yScale(Math.max(0, d[1]));

          // Adds "padding" below 0 baseline
          if (yPos >= CHART_MID_Y) {
            return yPos + 2;
          }

          return yScale(Math.max(0, d[1]));
        })
        .attr("width", xScale.bandwidth())
        .attr("height", (d) => {
          // Adds minimal space between bars
          return yScale(d[0]) - yScale(d[1]) - 1;
        });
    };

    // Functions to build chart
    createAxis(chart);
    createStackedBars(chart, data);
    createMidPointLine(chart);
    // createHoverBars(chart, data);

    // // Build stacked data

    // const tooltip = d3
    //   .select(`#d3-container`)
    //   .append("div")
    //   .style("background-color", "rgba(117,117,117,0.9")
    //   .style("position", "absolute")
    //   .style("width", "300px")
    //   .style("height", "200px")
    //   .style("visibility", "hidden");

    // Create an invisible group that acts as a hover
    // Rather than doing it this way:
    //    - I need to create a group of all the bars
    //    - Then I can pass in the data for that group

    // chart
    //   .selectAll(".hover")
    //   .data(data)
    //   .enter()
    //   .append("rect")
    //   .attr("x", (d) => xScale(d.datetime) - 3)
    //   .attr("y", CHART_START_Y)
    //   .attr("height", CHART_HEIGHT)
    //   .attr("width", (d) => xScale.bandwidth() + 6)
    //   .attr("fill", "#a8a8a8")
    //   .attr("fill-opacity", 0)
    //   .on("mouseover", (event) => {
    //     // console.log(event);
    //     select(event.currentTarget).attr("fill-opacity", 0.2);
    //     tooltip.style("visibility", "visible");
    //     tooltip.style("top", "25%");

    //     if (event.offsetX > 500) {
    //       tooltip.style("left", event.offsetX - 320 + "px");
    //     } else {
    //       tooltip.style("left", event.offsetX + 20 + "px");
    //     }
    //   })
    //   .on("mouseout", (element) => {
    //     tooltip.style("visibility", "hidden");
    //     select(element.currentTarget).attr("fill-opacity", 0);
    //   });

    // Remove bars if needed (Not entirely sure on this one)
    chart.selectAll(".bar").data(data).exit().remove();
  }, []);

  return (
    <Page title="D3">
      <div id="d3-container" style={{ position: "relative" }}>
        <svg className="d3-component" ref={d3Container} />
      </div>
    </Page>
  );
};

export default D3;
