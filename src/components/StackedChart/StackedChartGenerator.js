import * as d3 from "d3";
import { add } from "date-fns";

const COLOR_MAP = {
  dcLow: "blue",
  dcHigh: "red",
  intraday: "black",
};

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

class StackedChartGenerator {
  svgElement;

  constructor(element, data, keys) {
    this.data = data;
    this.keys = keys;

    this.svgElement = d3
      .select(element)
      .attr("width", TOTAL_WIDTH)
      .attr("height", TOTAL_HEIGHT)
      .style("background-color", "lightgrey");

    this.generateScales();
    this.generateAxis();

    // this.generateGrid();
    this.generateMidPoint();

    this.generateBars();
  }

  generateScales() {
    this.xScale = d3.scaleTime().range([CHART_START_X, CHART_END_X]);
    this.yScale = d3.scaleLinear().range([CHART_END_Y, CHART_START_Y]);

    const [min, max] = d3.extent(this.data, (d) => new Date(d.datetime));
    // Set Domain boundaries
    this.xScale.domain([min, add(max, { minutes: TICK_DURATION })]);
    this.yScale.domain([-15, 15]);
  }

  generateAxis() {
    // Define axis
    const xAxis = d3
      .axisBottom(this.xScale)
      .tickSizeOuter(0)
      .ticks(X_TICKS)
      .tickFormat((d, i) => {
        return i % 3 == 0 ? d3.timeFormat("%-I %-p")(d) : " ";
      });

    const yAxis = d3
      .axisLeft(this.yScale)
      .tickSizeOuter(0)
      // .ticks(Y_TICKS)
      .tickFormat((d, i) => {
        return i % 5 == 0 ? d : " ";
      });
    // Append to Chart
    this.svgElement
      .append("g")
      .classed("xAxis", true)
      .attr("transform", `translate(0, ${CHART_END_Y})`)
      .call(xAxis);

    this.svgElement
      .append("g")
      .classed("yAxis", true)
      .attr("transform", `translate(${CHART_START_X}, 0)`)
      .call(yAxis);
  }

  generateGrid() {
    this.svgElement
      .selectAll(".vertical-line")
      .data(this.data)
      .join("line")
      .classed("vertical-line", true)
      .attr("x1", (d) => this.xScale(d.datetime))
      .attr("x2", (d) => this.xScale(d.datetime))
      .attr("y1", 400)
      .attr("y2", 0)
      .attr("stroke", "black")
      .attr("stroke-opacity", 0.4);

    this.svgElement
      .selectAll(".horizontal-line")
      .data(this.yScale.ticks(7))
      .join("line")
      .classed("horizontal-line", true)
      .attr("x1", 0)
      .attr("x2", 600)
      .attr("y1", (d) => this.yScale(d))
      .attr("y2", (d) => this.yScale(d))
      .attr("stroke", "black")
      .attr("stroke-opacity", 0.4);
  }

  generateMidPoint() {
    this.svgElement
      .append("line")
      .style("stroke", "black")
      .style("stroke-width", 1)
      .attr("x1", CHART_START_X)
      .attr("x2", CHART_END_X)
      .attr("y1", CHART_MID_Y + 0.5 + "px")
      .attr("y2", CHART_MID_Y + 0.5 + "px");
  }

  generateBars() {
    const stackGenerator = d3
      .stack()
      .offset(d3.stackOffsetDiverging)
      .keys(this.keys);

    // These are the layers from the keys
    const layers = stackGenerator(this.data);

    // Give each layer a color using the map
    const layerRenders = this.svgElement
      .selectAll(".layer")
      .data(layers)
      .join("g")
      .classed("layer", true)
      .attr("fill", (d) => {
        return COLOR_MAP[d.key];
      });

    // Draw hover bars (Add Tooltip functionality)
    this.svgElement
      .selectAll(".hover-overlay")
      .classed("hover-overlay", true)
      .data(this.data)
      .join("rect")
      .attr("fill", "purple")
      .attr("fill-opacity", 0)
      .attr("y", CHART_START_Y)
      .attr("x", (d) => this.xScale(d.datetime))
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
      .attr("height", (d) => this.yScale(d[0]) - this.yScale(d[1]))
      .attr("x", (d) => this.xScale(d.data.datetime) + BAR_PADDING / 2)
      .attr("y", (d) => this.yScale(d[1]));
  }

  remove() {}
}

export default StackedChartGenerator;
