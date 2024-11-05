import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import App from "./App.tsx";

import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ListDataContextProvider } from "./context/ListDataStore";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ListDataContextProvider>
      <ThemeProvider>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </BrowserRouter>
      </ThemeProvider>
    </ListDataContextProvider>
  </React.StrictMode>,
);
