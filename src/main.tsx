import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { StrictMode } from "react";
import {
  QueryClient,
  QueryClientProvider,
  HydrationBoundary,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider.tsx";
import AuthProvider from "./context/AuthProvider.tsx";
import { Toaster } from "sonner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={queryClient}>
          <BrowserRouter>
            <AuthProvider>
              <Toaster position="top-center" />
              <Routes>
                <Route path="/*" element={<App />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
          <ReactQueryDevtools />
        </HydrationBoundary>
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>
);
