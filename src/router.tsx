import { Navigate, createBrowserRouter } from "react-router-dom";
import { App } from "./App";
import { Customers } from "./features/Customers";
import { Settings } from "./features/Settings";
import { Upload } from "./features/Upload";
import { Decos } from "./features/Decos";
import SettingsIcon from "@mui/icons-material/Settings";
import UploadIcon from "@mui/icons-material/Upload";
import PeopleIcon from "@mui/icons-material/People";
import RouterIcon from "@mui/icons-material/Router";
import { Login } from "./login/Login";
import { Main } from "./Main";

export const ROUTES = [
    {
        text: "Clientes",
        icon: <PeopleIcon />,
        path: "customers",
        element: <Customers />,
    },
    {
        text: "Retiro decos",
        icon: <RouterIcon />,
        path: "decos",
        element: <Decos />,
    },
    {
        text: "Cargar datos",
        icon: <UploadIcon />,
        path: "upload",
        element: <Upload />,
    },
    {
        text: "Ajustes",
        icon: <SettingsIcon />,
        path: "settings",
        element: <Settings />,
    },
]

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <Navigate to='main' />
            },
            {
                path: "login",
                element: <Login />
            },
            {
                path: "main",
                element: <Main />,
                children: [
                    {
                        path: "",
                        element: <Navigate to='customers' />
                    },
                    ...ROUTES.map(({ path, element }) => ({ path, element }))
                ],
                errorElement: <h2 style={{ textAlign: "center" }}> Hubo un error</h2>,
            },
        ]
    },

    {
        path: "*",
        element: <Navigate to='/' />
    }
]);