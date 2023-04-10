import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Layout } from "./layout/Layout";
import { Outlet } from "react-router-dom";


export const Main = () => (
    <Layout>
        <Outlet />
    </Layout>
)
