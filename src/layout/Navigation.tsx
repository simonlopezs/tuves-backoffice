import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../router";
import { useState } from "react";


export const Navigation = () => {
  const [path, setPath] = useState('customers');
  const navigate = useNavigate();

  const changeRoute = (ev: any, path: string) => {
    setPath(path)
    navigate(path)
  }

  return (
    <BottomNavigation
      showLabels
      value={path}
      onChange={changeRoute}
      sx={{
        borderTop: "1px solid #e0e0e0",
      }}
    >
      {ROUTES.map(({ text, icon, path }) => (
        <BottomNavigationAction key={path} value={path} label={text} icon={icon} />
      ))
      }
    </BottomNavigation>
  );
};
