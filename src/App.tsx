import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./Home";
import Work from "./Work";
import About from "./About";
import Contact from "./Contact";
import ProjectDetail from "./ProjectDetail";
import Archive from "./Archive";
import { VaultTransitionProvider } from "./components/VaultTransition/VaultTransition";

function Portfolio() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;

    const frame = requestAnimationFrame(() => {
      document.querySelector(location.hash)?.scrollIntoView({
        behavior: "auto",
        block: "start",
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [location.hash]);

  return (
    <>
      <Home />
      <About />
      <Work />
      <Contact />
    </>
  );
}

export default function App() {
  return (
    <VaultTransitionProvider>
      <Routes>
      <Route path="/" element={<Portfolio />} />
      <Route path="/archive" element={<Archive />} />
      <Route path="/project/:slug" element={<ProjectDetail />} />
      </Routes>
    </VaultTransitionProvider>
  );
}
