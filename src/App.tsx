import { ThemeProvider, createTheme } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "react-query";
import { Outlet } from "react-router-dom";
import { createContext, useEffect, useState } from "react";
import { IUser } from "./models";
import { LoginCredentials } from "./api/session-handler";
import { session } from "./api/db-connector";
import { MainSkeleton } from "./components/MainSkeleton";

const queryClient = new QueryClient();

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

const defaultSessionValue: {
  currentUser: IUser | null | undefined;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
} = {
  currentUser: undefined,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
};

export const SessionContext = createContext(defaultSessionValue);

export const App = () => {
  const [currentUser, setCurrentUser] = useState<IUser | null | undefined>(
    undefined
  );

  useEffect(() => {
    const unsubs = session.subscribeToSessionState((user) =>
      setCurrentUser(user)
    );
    return unsubs();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const user = await session.login(credentials);
    setCurrentUser(user);
  };

  const logout = async () => {
    await session.logout();
    setCurrentUser(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <SessionContext.Provider
        value={{
          currentUser,
          login,
          logout,
        }}
      >
        <ThemeProvider theme={theme}>
          {currentUser === undefined ? <MainSkeleton /> : <Outlet />}
        </ThemeProvider>
      </SessionContext.Provider>
    </QueryClientProvider>
  );
};
