import { Tab, Tabs } from "@mui/material";
import { SyntheticEvent, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { last } from "lodash";

interface NavTabsProps {
  tabs: {
    label: string;
    path: string;
  }[];
}

export const NavTabs = ({ tabs }: NavTabsProps) => {
  const [value, setValue] = useState(0);
  const location = useLocation();
  const handleChange = (_: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  useEffect(() => {
    const initialPath = last(location.pathname.split("/"));
    const index = tabs.findIndex(({ path }) => path === initialPath);
    setValue(index >= 0 ? index : 0);
  }, []);
  return (
    <Tabs value={value} onChange={handleChange}>
      {tabs.map(({ label, path }) => (
        <Tab key={path} component={Link} label={label} to={path} />
      ))}
    </Tabs>
  );
};
