import { select } from "d3-selection";
import { scaleLinear } from "d3-scale";
import { axisBottom, axisLeft } from "d3-axis";
import add from "date-fns/add";
import { format, set } from "date-fns";

class StackedChart {
  margin = { left: 30, top: 30, bottom: 30, right: 30 };

  constructor(domNodeCurrent) {
    this.svg = select(domNodeCurrent).append("svg");
    this.svg.attr("width", "100%").attr("height", "100%");
    return this;
  }

  init = (data, dims) => {
    this.setDims(dims); //<-----one
    this.setScales(data); //<-------two
    this.chart = this.svg.append("g");
    this.chart.attr(
      "transform",
      `translate(${this.margin.left}, ${this.margin.top})`
    );

    this.createAxes(); //<-----three
    this.updateData(data);
  };

  // first; set up initial dimensions.
  setDims = (dims) => {
    this.dims = dims;
    this.innerHeight =
      this.dims.height - (this.margin.top + this.margin.bottom);
    this.innerWidth = this.dims.width - (this.margin.left + this.margin.right);
  };

  // second; set up scales using new dims
  setScales = () => {
    const baseTime = set(new Date(), { hours: 23, minutes: 0 });
    const startTime = baseTime;
    const endTime = add(baseTime, { hours: 24 });

    // Set up the time scale (we could have this is an arg)
    this.xScale = scaleLinear()
      .domain([startTime, endTime])
      .range([0, this.innerWidth]);

    this.yScale = scaleLinear().domain([-15, 15]).range([this.innerHeight, 0]);
  };

  // third; create axis groups using the following methods.
  createAxes = () => {
    // this.scaleAxes();
    // Create xAxis
    this.xAxisBottom = this.chart.append("g");
    this.yAxisLeft = this.chart.append("g");
    //   .attr("transform", `translate(0, ${this.innerHeight})`);

    const startDate = set(new Date(), { hours: 23, minutes: 0 });
    this.xAxisBottom
      .append("line")
      .attr("x1", this.xScale(startDate))
      .attr("x2", this.xScale(add(startDate, { hours: 24 })))
      .attr("y1", this.innerHeight)
      .attr("y2", this.innerHeight)
      .attr("stroke-width", 1)
      .attr("stroke", "#E4E7ED");

    this.yAxisLeft
      .append("line")
      .attr("x1", this.xScale(startDate))
      .attr("x2", this.xScale(startDate))
      .attr("y1", this.yScale(-15))
      .attr("y2", this.yScale(15))
      .attr("stroke-width", 1)
      .attr("stroke", "#E4E7ED");
  };

  scaleAxes = () => {
    this.xAxisBottom = axisBottom()
      .scale(this.xScale)
      .tickSize(-this.innerHeight)
      .tickSizeOuter(0);
    this.yAxisLeft = axisLeft().scale(this.yScale).tickSize(-this.innerWidth);
  };

  updateData = (data) => {
    this.data = data;
    console.log(this.data);

    this.allCircles = this.chart.selectAll(".myCircle").data(this.data);
    this.allCircles
      .transition()
      .duration(500)
      .attr("class", "myCircle")
      .attr("fill", "green");

    this.allCircles.join(
      (enter) => {
        enter
          .append("circle")
          .attr("r", 10)
          .attr("class", "myCircle")
          .attr("r", 10)
          .attr("cx", (d) => this.xScale(d.datetime))
          .attr("cy", (d) => this.yScale(d.dcLow))
          .attr("fill", "yellow");
        enter
          .append("text")
          .classed("text", true)
          .attr("x", (d) => this.xScale(d.datetime))
          .attr("y", (d) => this.yScale(d.dcLow) - 10)
          .text((d) => format(d.datetime, "h:m"));
      },
      (update) => {
        update
          .transition()
          .duration(500)
          .attr("cx", (d) => this.xScale(d.datetime))
          .attr("cy", (d) => this.yScale(d.dcLow));
      },
      (exit) => {
        exit.remove();
      }
    );
  };

  updateDims = (dims) => {};

  remove = () => {
    this.svg.remove();
  };
}

export default StackedChart;
