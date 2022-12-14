import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChartJs, Custom, D3, Plot, ReactCharts, ReCharts } from "./pages";
import { Nav, Page } from "./components";

import "./App.css";
import Reaviz from "./pages/Reaviz/Reaviz";

const Home = () => (
  <Page title="Home">
    <h1>Charting ideas for Pluto</h1>

    <p>Things we want to be able to do and should be tested</p>
    <ul>
      <li>actual asset output (line)</li>
      <li>stacked trades (stacked bars)</li>
      <li>hover plates when hovering a specific time HH:MM:SS</li>
      <li>line to show “now”</li>
      <li>scroll between past and future</li>
      <li>choose between granularities (seconds/minutes/half hours/hours)</li>
      <li>mobile: pinch to zoom in/out?</li>
      <li>desktop: dropdown to choose granularity?</li>
      <li>New Data coming in live?</li>
    </ul>
  </Page>
);

function App() {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/react-charts" element={<ReactCharts />} />
        <Route path="/recharts" element={<ReCharts />} />
        <Route path="/chartjs" element={<ChartJs />} />
        <Route path="/d3" element={<D3 />} />
        <Route path="/plot" element={<Plot />} />
        <Route path="/custom" element={<Custom />} />
        <Route path="/reaviz" element={<Reaviz />} />
      </Routes>
    </Router>
  );
}

export default App;
