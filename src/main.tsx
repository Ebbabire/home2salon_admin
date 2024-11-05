import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { ListDataContextProvider } from "./context/ListDataStore";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ListDataContextProvider>
      <ThemeProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </ListDataContextProvider>
  </React.StrictMode>,
);
