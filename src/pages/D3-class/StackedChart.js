import { select } from "d3-selection";
import { scaleLinear, scaleTime } from "d3-scale";
import add from "date-fns/add";
import { format, set } from "date-fns";
import { stack, stackOffsetDiverging } from "d3";

class StackedChart {
  margin = { left: 60, top: 30, bottom: 50, right: 30 };
  colorMap = {
    dcLow: "#BF65B2",
    dcHigh: "#01CD4F",
    intraday: "rgb(137,192,238)",
  };

  constructor(domNodeCurrent) {
    this.svg = select(domNodeCurrent).append("svg").lower();
    this.svg.attr("width", "100%").attr("height", "85%");
    return this;
  }

  init = (data, dims, keys, tooltipDataCallback = () => {}) => {
    this.keys = keys;
    this.tooltipDataCallback = tooltipDataCallback;

    this.setDims(dims); //<-----one
    this.setScales(data); //<-------two
    this.chart = this.svg.append("g").classed("chart", true);
    this.chart.attr(
      "transform",
      `translate(${this.margin.left}, ${this.margin.top})`
    );

    this.createAxes(); //<-----three

    // Create bar + hovers groups only want to call this once
    this.bars = this.chart.append("g").classed("bars", true);
    this.hoverBars = this.chart.append("g").classed("hover-bars", true);

    // Update (Create initial data)
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
    this.xScale = scaleTime()
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
        .attr("font-size", "0px")
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
        .attr("y", () => this.yScale(t) + 5)
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

  addHoverBars = () => {
    this.hoverBars
      .selectAll("g")
      .data(this.data)
      .join(
        (enter) => {
          enter
            .append("rect")
            .attr("height", this.innerHeight)
            .attr("width", this._calculateBarWidth() + 1)
            .attr("x", this.xScale(this.startDate))
            .attr("fill", "grey")
            .attr("fill-opacity", 0)
            .attr("x", (d) => this.xScale(d.datetime))
            .on("mouseover", (event, data) => {
              select(event.target).attr("fill-opacity", 0.2);

              const callbackData = { ...data };
              delete callbackData.id;
              delete callbackData.datetime;

              select(".tooltip").style("width", this._calculateBarWidth * 14);

              const xPos = () => {
                const basePos = this.xScale(data.datetime);

                if (basePos > this.innerWidth / 2) {
                  return (
                    basePos + this.margin.left - 264 - this._calculateBarWidth()
                  );
                }

                return (
                  basePos + this.margin.left + this._calculateBarWidth() * 2
                );
              };

              this.tooltipDataCallback({
                id: data.id,
                datetime: data.datetime,
                data: callbackData,
                pos: { x: xPos(), y: 100 },
              });
              select(".tooltip").style("opacity", 1);
            })
            .on("mouseout", (event, data) => {
              // We probably want to remove this data after 200ms
              //   this.tooltipDataCallback(undefined);
              select(".tooltip").style("opacity", 0);
              select(event.target).attr("fill-opacity", 0);
            });
        },
        null,
        (exit) => exit.remove()
      );
  };

  // Creates the bars
  updateData = (data) => {
    this.data = data;
    this.addHoverBars();

    const stackData = stack().offset(stackOffsetDiverging).keys(this.keys)(
      data
    );

    this.bars
      .selectAll("g")
      .data(stackData)
      .join(
        (enter) =>
          enter
            .append("g")
            .attr("fill", (d) => this.colorMap[d.key])
            .classed("stack-group", true),
        null,
        (exit) => exit.remove()
      )
      .selectAll("rect")
      .data(
        (d) => d,
        (d) => d.data.key
      )
      .join(
        (enter) =>
          enter
            .append("rect")
            .attr("class", "bar")
            // Base bar attributes
            .attr("rx", 4)
            .attr("width", () => {
              // Adds padding at end of bar
              return this._calculateBarWidth() - 1;
            }),

        null,
        (exit) => exit.remove()
      )
      // Returns the enter + update selection
      // Computed attributes
      // Adds padding at start of bar
      .attr("x", (d) => this.xScale(d.data.datetime) + 1)
      .attr("y", (d) => this.yScale(d[1]))
      .attr("height", (d) => this.yScale(d[0]) - this.yScale(d[1]));
  };

  updateDims = (dims) => {};

  remove = () => {
    this.svg.remove();
  };

  _calculateBarWidth = () => {
    return this.innerWidth / 48;
  };
}

export default StackedChart;
