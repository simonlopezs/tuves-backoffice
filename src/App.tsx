import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Layout } from "./layout/Layout";

const theme = createTheme({
  components: {
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          "&.Mui-selected .MuiBottomNavigationAction-label": {
            fontSize: "0.75rem",
          },
        },
      },
    },
  },
});

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Layout />
    </ThemeProvider>
  );
}
