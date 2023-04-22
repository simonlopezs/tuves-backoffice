import { PropsWithChildren, useState } from "react";
import { Alert, Box, Snackbar } from "@mui/material";
import { Navigation } from "./Navigation";
import { Header } from "./Header";
import { DrawerContent, LayoutProvider } from "./LayoutContext";
import { Drawer } from "./Drawer";
import { OverallSpinner } from "../components/OverallSpinner";

const HEADER_HEIGHT = 52;

export type SnackbarContent = {
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export const Layout = ({ children }: PropsWithChildren) => {

  // drawer
  const [drawerContent, setDrawerContent] = useState<DrawerContent>(null);
  const closeDrawer = () => setDrawerContent(null);

  // spinner
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const load = () => setIsLoading(true);
  const stopLoad = () => setIsLoading(false);

  // snackbar
  const [snackbar, setSnackbar] = useState<SnackbarContent | null>(null);

  const handleClose = (_: any, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(null);
  };

  return (
    <LayoutProvider value={{
      drawerContent,
      setDrawerContent,
      closeDrawer,
      isLoading,
      load,
      stopLoad,
      showSnackbar: setSnackbar,
    }}>
      <Box>
        <Header height={HEADER_HEIGHT} />
        <Box
          sx={{
            height: `calc(100vh - 56px - ${HEADER_HEIGHT}px)`,
            overflow: 'hidden'
          }}
        >
          <OverallSpinner open={isLoading} />
          <Snackbar
            open={!!snackbar}
            autoHideDuration={6000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert variant='filled' onClose={handleClose} severity={snackbar?.type} sx={{ width: '100%' }}>
              {snackbar?.message}
            </Alert>
          </Snackbar>
          {children}
        </Box>
        <Navigation />
      </Box>
      <Drawer />
    </LayoutProvider>
  );
};
