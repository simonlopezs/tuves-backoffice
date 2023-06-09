import { Navigate, createBrowserRouter } from "react-router-dom";
import { App } from "./App";
import { Login } from "./login/Login";
import { Main } from "./Main";
import { Settings } from "./pages/Settings";
import { UploadFile } from "./pages/UploadFile";
import { Decos } from "./pages/decos/DecosPage";
import SettingsIcon from "@mui/icons-material/Settings";
import UploadIcon from "@mui/icons-material/Upload";
import PeopleIcon from "@mui/icons-material/People";
import RouterIcon from "@mui/icons-material/Router";
import { CustomersPage } from "./pages/customers/CustomersPage";
import { AllCustomers } from "./pages/customers/AllCustomers";
import { LateCustomers } from "./pages/customers/LateCustomers";
import { SearchCustomers } from "./pages/customers/SearchCustomers";
import { RequiredDecos } from "./pages/decos/RequiredDecos";
import { OptionalDecos } from "./pages/decos/OptionalDecos";

export interface AppRoute {
  path: string;
  element: JSX.Element;
  text?: string;
  icon?: JSX.Element;
  children?: AppRoute[];
}

export const ROUTES: AppRoute[] = [
  {
    text: "Clientes",
    icon: <PeopleIcon />,
    path: "customers",
    element: <CustomersPage />,
    children: [
      {
        path: "",
        element: <Navigate to="late" />,
      },
      {
        text: "Todos",
        icon: <PeopleIcon />,
        path: "all",
        element: <AllCustomers />,
      },
      {
        text: "Bajas",
        icon: <PeopleIcon />,
        path: "late",
        element: <LateCustomers />,
      },
      {
        text: "Buscar cliente",
        icon: <PeopleIcon />,
        path: "search",
        element: <SearchCustomers />,
      },
    ],
  },
  {
    text: "Retiro decos",
    icon: <RouterIcon />,
    path: "decos",
    element: <Decos />,
    children: [
      {
        path: "",
        element: <Navigate to="free" />,
      },
      {
        text: "Propios",
        path: "own",
        element: <RequiredDecos />,
      },
      {
        text: "Libres",
        path: "free",
        element: <OptionalDecos />,
      },
    ],
  },
  {
    text: "Cargar datos",
    icon: <UploadIcon />,
    path: "upload",
    element: <UploadFile />,
  },
  {
    text: "Ajustes",
    icon: <SettingsIcon />,
    path: "settings",
    element: <Settings />,
  },
];

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Navigate to="main" />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "main",
        element: <Main />,
        children: [
          {
            path: "",
            element: <Navigate to="customers" />,
          },
          ...ROUTES.map(({ path, element, children }) => ({
            path,
            element,
            children,
          })),
        ],
        errorElement: <h2 style={{ textAlign: "center" }}> Hubo un error</h2>,
      },
    ],
  },

  {
    path: "*",
    element: <Navigate to="/" />,
  },
]);
