import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "./Home";
import Work from "./Work";
import ProjectDetail from "./ProjectDetail";
import About from "./About";
import Contact from "./Contact";

function Portfolio() {
  return (
    <>
      <Home />
      <Work />
      <About />
      <Contact />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portfolio />} />

        <Route
          path="/projects/:slug"
          element={<ProjectDetail />}
        />
      </Routes>
    </BrowserRouter>
  );
}