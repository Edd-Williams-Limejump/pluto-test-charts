import { useState } from "react";
import reactLogo from "./assets/react.svg";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import "./App.css";
import { ReactCharts } from "./pages";
import { Nav } from "./components";

function App() {
  return (
    <Router>
      <Nav />
      <div>
        <Routes>
          <Route
            path="/"
            element={() => (
              <>
                <div>
                  <h1>Charting ideas for Pluto</h1>
                </div>
              </>
            )}
          />
          <Route path="/react-charts" element={<ReactCharts />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
