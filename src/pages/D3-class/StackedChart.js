import { select } from "d3-selection";
import { scaleLinear } from "d3-scale";
import add from "date-fns/add";
import { format, set } from "date-fns";

class StackedChart {
  margin = { left: 60, top: 30, bottom: 30, right: 30 };

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

    this.yScale = scaleLinear()
      .domain([-100, 100])
      .range([this.innerHeight, 0]);
  };

  // third; create axis groups using the following methods.
  createAxes = () => {
    // Create xAxis
    this.xAxisBottom = this.chart.append("g");
    this.yAxisLeft = this.chart.append("g");
    //   .attr("transform", `translate(0, ${this.innerHeight})`);

    this.startDate = set(new Date(), { hours: 23, minutes: 0 });
    this.endDate = add(this.startDate, { hours: 24 });

    this.xAxisBottom
      .append("line")
      .attr("x1", this.xScale(this.startDate))
      .attr("x2", this.xScale(add(this.startDate, { hours: 24 })))
      .attr("y1", this.innerHeight)
      .attr("y2", this.innerHeight)
      .attr("stroke-width", 1)
      .attr("stroke", "#E4E7ED");

    this.yAxisLeft
      .append("line")
      .attr("x1", this.xScale(this.startDate))
      .attr("x2", this.xScale(this.startDate))
      .attr("y1", this.yScale(-100))
      .attr("y2", this.yScale(100))
      .attr("stroke-width", 1)
      .attr("stroke", "#E4E7ED");

    this.addTicks();
  };

  addTicks = () => {
    this.addXTimeLabels();
    this.addXEFALabels();
    this.addYLabels();
  };

  addXEFALabels = () => {
    const tickTimes = [
      { time: add(this.startDate, { hours: 2 }), text: "EFA 1" },
      { time: add(this.startDate, { hours: 6 }), text: "EFA 2" },
      { time: add(this.startDate, { hours: 10 }), text: "EFA 3" },
      { time: add(this.startDate, { hours: 14 }), text: "EFA 4" },
      { time: add(this.startDate, { hours: 18 }), text: "EFA 5" },
      { time: add(this.startDate, { hours: 22 }), text: "EFA 6" },
    ];

    tickTimes.forEach((t) => {
      this.xAxisBottom
        .append("text")
        .text(t.text)
        .attr("x", this.xScale(t.time))
        .attr("y", this.innerHeight + 20)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill", "#8F9697");
    });
  };

  addXTimeLabels = () => {
    const tickTimes = [
      this.startDate,
      add(this.startDate, { hours: 4 }),
      add(this.startDate, { hours: 8 }),
      add(this.startDate, { hours: 12 }),
      add(this.startDate, { hours: 16 }),
      add(this.startDate, { hours: 20 }),
      add(this.startDate, { hours: 24 }),
    ];

    // Add Time xAxis gridlines
    tickTimes.forEach((t) => {
      this.xAxisBottom
        .append("line")
        .classed("x-grid-line", true)
        .attr("x1", this.xScale(t))
        .attr("x2", this.xScale(t))
        .attr("y1", 0)
        .attr("y2", this.innerHeight + 10)
        .attr("stroke-width", 1)
        .attr("stroke", "#E4E7ED");

      // Add text label
      this.xAxisBottom
        .append("text")
        .text(format(t, "hbbb"))
        .attr("x", this.xScale(t))
        .attr("y", this.innerHeight + 20)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill", "#8F9697");
    });
  };

  addYLabels = () => {
    const ticks = [-100, -50, 0, 50, 100];
    const gridLines = [-100, -75, -50, -25, 0, 25, 50, 75, 100];

    ticks.forEach((t) => {
      this.yAxisLeft
        .append("text")
        .text(`${t} MW`)
        .attr("x", this.xScale(this.startDate) - 10)
        .attr("y", () => this.yScale(t))
        .attr("text-anchor", "end")
        .attr("font-size", "12px")
        .attr("fill", "#8F9697");
    });

    // Add gridlines
    gridLines.forEach((g) => {
      this.yAxisLeft
        .append("line")
        .classed("y-grid-line", true)
        .attr("x1", this.xScale(this.startDate) - 10)
        .attr("x2", this.xScale(this.endDate))
        .attr("y1", this.yScale(g))
        .attr("y2", this.yScale(g))
        .attr("stroke-width", 1)
        .attr("stroke", "#E4E7ED");
    });
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
          .attr("fill", "lightblue");
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
