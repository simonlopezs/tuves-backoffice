import { Outlet } from "react-router-dom";
import { NavTabs } from "../../components/NavTabs";
import { DecosProvider } from "./DecosContext";
import { useEffect, useState } from "react";
import { LngLat } from "../../models/LngLat.model";

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
  const [location, setLocation] = useState<LngLat | null>(null);
  const getLocation = () =>
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        setLocation({ lng, lat });
      },
      (err) => console.error(`ERROR(${err.code}):Infinity ${err.message}`),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5 * 60 * 1000,
      }
    );

  useEffect(() => {
    getLocation();
    const timer = setInterval(() => getLocation(), 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <NavTabs tabs={tabs} />
      <DecosProvider value={{ location }}>
        <Outlet />
      </DecosProvider>
    </>
  );
};
