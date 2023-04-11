import { Box } from "@mui/material";
import { Navigation } from "./Navigation";
import { PropsWithChildren } from "react";
import { Header } from "./Header";

const HEADER_HEIGHT = 44;

export const Layout = ({ children }: PropsWithChildren) => {

  return (
    <Box>
      <Header height={HEADER_HEIGHT} />
      <Box
        sx={{
          height: `calc(100vh - 56px -${HEADER_HEIGHT}px)`,
          position: "fixed",
          top: `${HEADER_HEIGHT}px`,
          overflow: "scroll",
          width: "100%",
        }}
      >
        {children}
      </Box>
      <Navigation />
    </Box>
  );
};
