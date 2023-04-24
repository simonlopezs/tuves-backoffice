import { Outlet } from "react-router-dom";
import { NavTabs } from "../../components/NavTabs";

const tabs = [
  {
    label: "Bajas",
    path: "late",
  },
  {
    label: "Buscar",
    path: "search",
  },
  {
    label: "Todos",
    path: "all",
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
