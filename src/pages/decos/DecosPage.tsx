import { Outlet } from "react-router-dom";
import { NavTabs } from "../../components/NavTabs";

const tabs = [
  {
    label: "Libres",
    path: "free",
  },
  {
    label: "Propios",
    path: "own",
  },
];

export const Decos = () => {
  return (
    <>
      {/* {JSON.stringify(location)} */}
      <NavTabs tabs={tabs} />
      <Outlet />
    </>
  );
};
