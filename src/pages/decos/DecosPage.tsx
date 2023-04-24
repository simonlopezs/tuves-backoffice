import { Outlet } from "react-router-dom";
import { NavTabs } from "../../components/NavTabs";

const tabs = [
  {
    label: "Propios",
    path: "own",
  },
  {
    label: "Libres",
    path: "free",
  },
];

export const Decos = () => {
  return (
    <>
      <NavTabs tabs={tabs} />
      <Outlet />
    </>
  );
};
