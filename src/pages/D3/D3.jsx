import { Page } from "../../components";
import React, { useState, useRef, useEffect } from "react";
import * as d3 from "d3";
import { generateTradingData } from "./generateTradingData";
import { add } from "date-fns";
import { da } from "date-fns/locale";

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
const X_TICKS = 8;
const Y_TICKS = 7;
const TICK_DURATION = 30;

const D3 = () => {
  const d3Container = useRef(null);
  const [data, ,] = useState(generateTradingData(X_TICKS, new Date()));
  // const [data, ,] = useState(generateTradingData(8, new Date()));

  // const keys = ["dcLow", "intraday", "dcHigh"];
  // const keys = ["dcLow"];
  const keys = ["dcHigh"];
  // const keys = ["intraday"];

  const COLOR_MAP = {
    dcLow: "rgb(191,101,178)",
    dcHigh: "rgb(1,205,79)",
    intraday: "rgb(137,192,238)",
  };

  useEffect(() => {
    if (data.current === data) return;

    const svg = d3
      .select(d3Container.current)
      .attr("width", TOTAL_WIDTH)
      .attr("height", TOTAL_HEIGHT)
      .style("background-color", "rgb(241,241,241)");

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
        .ticks(d3.timeMinute.every(60))
        .tickFormat(d3.timeFormat("%-I %-p"));

      const yAxis = d3.axisLeft(yScale).tickSizeOuter(0).ticks(Y_TICKS);

      // Append to Chart
      svg
        .append("g")
        .classed("xAxis", true)
        .attr("transform", `translate(0, ${CHART_END_Y})`)
        .style("font-family", "Roboto")
        .call(xAxis);

      svg
        .append("g")
        .classed("yAxis", true)
        .attr("transform", `translate(${CHART_START_X}, 0)`)
        .style("font-family", "Roboto")
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
        .attr("y1", CHART_START_Y - 10)
        .attr("y2", CHART_END_Y)
        .attr("fill", "none")
        .attr("shape-rendering", "crispEdges")
        .attr("stroke", "black")
        .attr("stroke-width", "1px")
        .attr("stroke-opacity", 0.2);

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

    const calculateHeight = (d) => {
      const calculatedHeight = yScale(d[0]) - yScale(d[1]);

      if (calculatedHeight === 0) return calculatedHeight;

      const yPos = yScale(d[1]);
      if (yPos === CHART_MID_Y) {
        return calculatedHeight - 2;
      }
      return calculatedHeight - 4;
    };

    const calculateYPos = (d) => {
      const yPos = yScale(d[1]);
      if (yPos === CHART_MID_Y) {
        return yPos + 2;
      }
      return yPos + 2;
    };

    let allLayersData;

    const calculateNeighbourData = (index) => {
      const calculated = {
        previous: {
          height:
            index > 0 ? calculateHeight(allLayersData[index - 1]) : undefined,
          y: index > 0 ? calculateYPos(allLayersData[index - 1]) : undefined,
        },
        current: {
          height: calculateHeight(allLayersData[index]),
          y: calculateYPos(allLayersData[index]),
        },
        next: {
          height:
            index + 1 === allLayersData.length
              ? undefined
              : calculateHeight(allLayersData[index + 1]),
          y:
            index + 1 === allLayersData.length
              ? undefined
              : calculateYPos(allLayersData[index + 1]),
        },
      };

      calculated.current["sameAsPrevious"] =
        calculated.previous.height === calculated.current.height &&
        calculated.previous.y === calculated.current.y;

      calculated.current["sameAsNext"] =
        calculated.next.height === calculated.current.height &&
        calculated.next.y === calculated.current.y;

      return calculated;
    };

    const calculateWidth = (index) => {
      const baseBarWidth = CHART_WIDTH / X_TICKS;

      const neighbours = calculateNeighbourData(index);
      // Set width to 0 if same as the alst
      if (neighbours.current.sameAsPrevious) return 0;

      // Extend width to fill space
      let width = baseBarWidth;
      // Count how many of the next matching neighbours there are
      for (var i = index; i < allLayersData.length - 1; i++) {
        // Check if the following is the same
        const { current } = calculateNeighbourData(i);

        console.log(current);

        // if (current.sameAsNext && !current.sameAsPrevious) {
        //   width += baseBarWidth;
        // }
      }

      return width - BAR_PADDING;
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
        .data((d) => {
          // Add key to the data binding to use later
          allLayersData = d.map((dataPoint) => ({
            ...dataPoint,
            data: { ...dataPoint.data, key: d.key },
          }));
          console.log(allLayersData);
          return allLayersData;
        })
        .join("rect")
        .classed("bar", true)
        .attr("shape-rendering", "crispEdges")
        .attr("rx", 8)
        .attr("width", (d, i) => calculateWidth(i))
        .attr("height", (d) => calculateHeight(d))
        .attr("x", (d) => xScale(d.data.datetime) + BAR_PADDING / 2)
        .attr("y", (d) => calculateYPos(d));
    };

    // Remove bars if needed (Not entirely sure on this one)
    // chart.selectAll(".bar").data(data).exit().remove();

    // Setup Axis
    const { xAxis, xScale, yAxis, yScale } = createAxis();
    createGrid(xScale, yScale);
    createMidPointLine();

    const chart = svg.append("g").classed("chart", true);
    createStackedBars(xScale, yScale);

    return () => {
      d3.select(d3Container.current).selectAll("*").remove();
    };
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
