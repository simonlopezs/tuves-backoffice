import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../router";
import { useEffect, useState } from "react";

export const Navigation = () => {
  const [path, setPath] = useState("customers");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const realPath = location.pathname.split("/")[2];
    setPath(realPath);
  }, [location]);

  const changeRoute = (_: any, path: string) => {
    setPath(path);
    navigate(path);
  };

  return (
    <BottomNavigation
      value={path}
      onChange={changeRoute}
      sx={{
        boxSizing: "border-box",
        borderTop: "1px solid #e0e0e0",
      }}
    >
      {ROUTES.map(({ icon, path }) => (
        <BottomNavigationAction key={path} value={path} icon={icon} />
      ))}
    </BottomNavigation>
  );
};
