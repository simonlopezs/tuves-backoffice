import { Box } from "@mui/material";
import { Navigation } from "./Navigation";
import { PropsWithChildren } from "react";

export const Layout = ({ children }: PropsWithChildren) => {
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
        {children}
      </Box>
      <Navigation />
    </Box>
  );
};
