import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";

const redirectedUrl = sessionStorage.getItem("redirect");
if (redirectedUrl) {
  sessionStorage.removeItem("redirect");
  const redirected = new URL(redirectedUrl);
  window.history.replaceState(null, "", `${redirected.pathname}${redirected.search}${redirected.hash}`);
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
