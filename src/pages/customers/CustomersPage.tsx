import { Outlet } from "react-router-dom";
import { NavTabs } from "../../components/NavTabs";

const tabs = [
  {
    label: "Bajas",
    path: "late",
  },
  {
    label: "Todos",
    path: "all",
  },
  {
    label: "Buscar",
    path: "search",
  },
];

export const CustomersPage = () => {
  return (
    <>
      <NavTabs tabs={tabs} />
      <Outlet />
    </>
  );
};
