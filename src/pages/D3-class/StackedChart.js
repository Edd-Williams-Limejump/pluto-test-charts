import { select } from "d3-selection";
import { scaleLinear } from "d3-scale";
import { axisBottom, axisLeft } from "d3-axis";
import add from "date-fns/add";

class StackedChart {
  margin = { left: 30, top: 30, bottom: 30, right: 30 };

  constructor(domNodeCurrent) {
    this.svg = select(domNodeCurrent).append("svg");
    this.svg.attr("width", "100%").attr("height", "100%");
    this.svg.style("background-color", "lightgrey");
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
  setScales = (data) => {
    // Set up the time scale (we could have this is an arg)
    this.xScale = scaleLinear()
      .domain([new Date(), add(new Date(), { hours: 24 })])
      .range([0, this.innerWidth]);

    this.yScale = scaleLinear().domain([-15, 15]).range([this.innerHeight, 0]);
  };

  // third; create axis groups using the following methods.
  createAxes = () => {
    this.scaleAxes();
    this.xAxisBottomG = this.chart
      .append("g")
      .attr("transform", `translate(0, ${this.innerHeight})`)
      .call(this.xAxisBottom);
    this.yAxisLeftG = this.svg
      .append("g")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
      .call(this.yAxisLeft);
  };

  scaleAxes = () => {
    this.xAxisBottom = axisBottom()
      .scale(this.xScale)
      .tickSize(-this.innerHeight);
    this.yAxisLeft = axisLeft().scale(this.yScale).tickSize(-this.innerWidth);
  };

  updateData = (data) => {
    this.data = data;

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
      },
      (update) => {
        update
          .attr("cx", (d) => this.xScale(d.datetime))
          .attr("cy", (d) => this.yScale(d.dcLow));
      },
      (exit) => exit.remove()
    );

    // this.enter();
  };

  enter = () => {
    console.log("calling enter", this.allCircles);
    this.allCircles
      .enter()
      .append("circle")
      .attr("r", 10)
      .attr("class", "myCircle")
      .attr("r", 10)
      .attr("cx", (d) => this.xScale(d.datetime))
      .attr("cy", (d) => this.yScale(d.dcLow))
      .attr("fill", "yellow");

    this.exit(); //<---- call this.exit immediately.
  };

  exit = () => {
    this.allCircles.exit().remove();
  };

  updateDims = (dims) => {};

  remove = () => {
    this.svg.remove();
  };
}

// class StackedChart {
//   margin = { left: 30, top: 30, bottom: 30, right: 30 };

//   constructor(domElement) {
//     this.svg = select(domElement).append("svg");
//     this.svg.attr("width", "100%").attr("height", "100%");
//     this.svg.style("background-color", "lightgrey");
//     return this;
//   }

//   init = (data) => {
//     this.data = data;
//     this.setDims({ width: 500, height: 800 });
//     this.setScales(this.data);
//     this.chart = this.svg.append("g");
//     this.chart.attr(
//       "transform",
//       `translate(${this.margin.left}, ${this.margin.top})`
//     );

//     this.createAxes(); //<-----three
//     // this.updateData(data);
//   };

//   // first; set up initial dimensions.
//   setDims = (dims) => {
//     this.dims = dims;
//     this.innerHeight =
//       this.dims.height - (this.margin.top + this.margin.bottom);
//     this.innerWidth = this.dims.width - (this.margin.left + this.margin.right);
//   };

//   setScales = () => {
//     // Set up the time scale (we could have this is an arg)
//     this.xScale = scaleLinear()
//       .domain([new Date(), add(new Date(), { hours: 24 })])
//       .range([0, this.innerWidth]);

//     this.yScale = scaleLinear().domain([-15, 15]).range([this.innerHeight, 0]);
//   };

//   // third; create axis groups using the following methods.
//   createAxes = () => {
//     this.scaleAxes();

//     this.xAxisBottomG = this.chart
//       .append("g")
//       .attr("transform", `translate(0, ${this.innerHeight})`)
//       .call(this.xAxisBottom);

//     this.yAxisLeftG = this.svg
//       .append("g")
//       .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
//       .call(this.yAxisLeft);
//   };

//   scaleAxes = () => {
//     this.xAxisBottom = axisBottom()
//       .scale(this.xScale)
//       .tickSize(-this.innerHeight);
//     this.yAxisLeft = axisLeft().scale(this.yScale).tickSize(-this.innerWidth);
//   };

//   remove = () => {
//     this.svg.remove();
//   };
// }

export default StackedChart;
