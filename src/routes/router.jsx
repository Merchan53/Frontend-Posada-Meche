import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import { lazy } from "react";
import Loadable from "../components/shared/Loadable";

// eslint-disable-next-line react-refresh/only-export-components
const Home = lazy(() => import("../pages/Home"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: Loadable(Home),
      },
    ],
  },
]);