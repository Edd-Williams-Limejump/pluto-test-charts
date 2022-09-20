import React from "react";
import { useState } from "react";
import { Page } from "../../components";
import StackedChart from "../../components/StackedChart/StackedChart";
import { generateTradingData } from "../D3/generateTradingData";

const Custom = () => {
  const [data, ,] = useState(generateTradingData(48, new Date()));

  //   console.log("hello");

  return (
    <Page title="Custom">
      <StackedChart data={data} keys={["dcLow"]} />
    </Page>
  );
};

export default Custom;
