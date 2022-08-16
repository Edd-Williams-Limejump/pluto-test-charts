import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ReactCharts } from "./pages";
import { Nav } from "./components";

import "./App.css";

function App() {
  return (
    <Router>
      <Nav />
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
    </Router>
  );
}

export default App;
