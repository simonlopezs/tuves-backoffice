import { Box } from "@mui/material";
import { Navigation } from "./Navigation";
import { Outlet } from "react-router-dom";

export const Layout = () => {
  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          height: "100%",
          overflow: "scroll",
        }}
      >
        <Outlet />
      </Box>

      <Navigation />
    </Box>
  );
};
