import { ThemeProvider, createTheme } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "react-query";
import { Outlet, useNavigate } from "react-router-dom";
import { createContext, useState } from "react";
import { User } from "./models";
import { LoginCredentials } from "./api/session-handler";
import { session } from "./api/db-connector";

const queryClient = new QueryClient()


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
  currentUser: User | null,
  login: (credentials: LoginCredentials) => Promise<void>,
  logout: () => Promise<void>,
} = {
  currentUser: null,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}

export const SessionContext = createContext(defaultSessionValue)

export const App = () => {

  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const navigate = useNavigate()

  const login = async (credentials: LoginCredentials) => {
    const user = await session.login(credentials)
    setCurrentUser(user)
    navigate('main')
  }

  const logout = async () => {
    await session.logout()
    setCurrentUser(null)
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SessionContext.Provider value={{
        currentUser,
        login,
        logout
      }}>
        <ThemeProvider theme={theme}>
          <Outlet />
        </ThemeProvider>
      </SessionContext.Provider>
    </QueryClientProvider>
  );
}
