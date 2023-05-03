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

  useEffect(() => {
    const id = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        setLocation({ lng, lat });
      },
      (err) => console.error(`ERROR(${err.code}): ${err.message}`),
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 0,
      }
    );
    return () => navigator.geolocation.clearWatch(id);
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
