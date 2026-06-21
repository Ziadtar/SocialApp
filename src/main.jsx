import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { HeroUIProvider } from "@heroui/react";
import { RouterProvider } from "react-router";
import { myRouter } from "./Routing/AppRouter";
import { Toaster } from "react-hot-toast";
import AuthContextProvider from "./component/context/AuthContextProvider/AuthContextProvider";
import "react-loading-skeleton/dist/skeleton.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
const query = new QueryClient();
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={query}>
      <AuthContextProvider>
          <HeroUIProvider>
            <RouterProvider router={myRouter} />
            <ReactQueryDevtools initialIsOpen={false} />
            <Toaster />
          </HeroUIProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  </StrictMode>,
);
