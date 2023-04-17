import { Box } from "@mui/material";
import { Navigation } from "./Navigation";
import { PropsWithChildren, useState } from "react";
import { Header } from "./Header";
import { DrawerContent, LayoutProvider } from "./LayoutContext";
import { Drawer } from "./Drawer";

const HEADER_HEIGHT = 44;

export const Layout = ({ children }: PropsWithChildren) => {

  const [drawerContent, setDrawerContent] = useState<DrawerContent>(null);
  const closeDrawer = () => setDrawerContent(null);

  return (
    <LayoutProvider value={{
      drawerContent,
      setDrawerContent,
      closeDrawer,
    }}>
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
      <Drawer />
    </LayoutProvider>
  );
};
