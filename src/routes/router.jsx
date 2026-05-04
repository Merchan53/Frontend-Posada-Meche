import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import { lazy } from "react";
import Loadable from "../components/shared/Loadable";

// eslint-disable-next-line react-refresh/only-export-components
const Home = lazy(() => import("../pages/Home"));
// eslint-disable-next-line react-refresh/only-export-components
const Rooms = lazy(() => import("../pages/Rooms"));
// eslint-disable-next-line react-refresh/only-export-components
const About = lazy(() => import("../pages/About"));
// eslint-disable-next-line react-refresh/only-export-components
const Services = lazy(() => import("../pages/Services"));

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
  {
    path: "/rooms",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: Loadable(Rooms),
      },
    ],
  },
  {
    path: "/about",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: Loadable(About),
      },
    ],
  },
  {
    path: "/services",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: Loadable(Services),
      },
    ],
  },
]);
