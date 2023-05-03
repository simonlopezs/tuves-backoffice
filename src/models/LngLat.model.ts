export type LngLat = {
  lng: number;
  lat: number;
};

export const toLngLat = (coords: [number, number]) => {
  const [lng, lat] = coords;
  return { lng, lat };
};
