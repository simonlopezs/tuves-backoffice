import { Outlet } from "react-router-dom";
import { NavTabs } from "../../components/NavTabs";
import { Box } from "@mui/material";

const tabs = [
  {
    label: 'Todos',
    path: 'all'
  },
  {
    label: 'Sin pagar',
    path: 'late'
  },
  {
    label: 'De baja',
    path: 'inactive'
  },
]

export const CustomersPage = () => {

  return (
    <>
      <NavTabs tabs={tabs} />
      <Outlet />
    </>
  );
};
