import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import { lazy } from "react";
import Loadable from "../components/shared/Loadable";
import AdminLayout from "../components/layout/AdminLayout";

// eslint-disable-next-line react-refresh/only-export-components
const Home = lazy(() => import("../pages/Home"));
// eslint-disable-next-line react-refresh/only-export-components
const Rooms = lazy(() => import("../pages/Rooms"));
// eslint-disable-next-line react-refresh/only-export-components
const About = lazy(() => import("../pages/About"));
// eslint-disable-next-line react-refresh/only-export-components
const Services = lazy(() => import("../pages/Services"));

//rutas admin
// eslint-disable-next-line react-refresh/only-export-components
const AdminLogin = lazy(() => import("../pages/AdminLogin"));
// eslint-disable-next-line react-refresh/only-export-components
const AdminDashboard = lazy(() => import("../pages/AdminDashboard"));
// eslint-disable-next-line react-refresh/only-export-components
const AdminReservas = lazy(() => import("../pages/AdminReservas"));
// eslint-disable-next-line react-refresh/only-export-components
const AdminHabitaciones = lazy(() => import("../pages/AdminHabitaciones"));
// eslint-disable-next-line react-refresh/only-export-components
const AdminContabilidad = lazy(() => import("../pages/AdminContabilidad"));
// eslint-disable-next-line react-refresh/only-export-components
const AdminClientes = lazy(() => import("../pages/AdminClientes"));

export const router = createBrowserRouter([
  // Rutas públicas
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: Loadable(Home) },
      { path: "rooms", element: Loadable(Rooms) },
      { path: "about", element: Loadable(About) },
      { path: "services", element: Loadable(Services) },
    ],
  },
  // Login admin (fuera del layout)
  {
    path: "/admin",
    element: Loadable(AdminLogin),
  },
  // Panel admin protegido (simulado)
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { path: "dashboard", element: Loadable(AdminDashboard) },
      { path: "reservas", element: Loadable(AdminReservas) },
      { path: "habitaciones", element: Loadable(AdminHabitaciones) },
      { path: "contabilidad", element: Loadable(AdminContabilidad) },
      { path: "clientes", element: Loadable(AdminClientes) },
    ],
  },
]);
