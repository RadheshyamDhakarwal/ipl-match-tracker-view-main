import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./pages/ThemeContext.tsx";
import { HelmetProvider } from "react-helmet-async";

const helmetContext = {};
createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    {" "}
    <HelmetProvider context={helmetContext}>
      <App />{" "}
    </HelmetProvider>
  </ThemeProvider>
);
