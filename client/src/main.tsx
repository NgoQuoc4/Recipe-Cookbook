import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.tsx";
import { PopupProvider } from "./context/PopupContext.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PopupProvider>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </PopupProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
