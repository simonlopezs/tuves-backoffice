import { LngLat } from "../models/LngLat.model";

class LocationService {
  constructor() {}

  calculateDistance(location1: LngLat | null, location2: LngLat | null) {
    if (
      !location1 ||
      !location2 ||
      !location1.lat ||
      !location1.lng ||
      !location2.lat ||
      !location2.lng
    )
      return null;
    const R = 6371e3; // metres
    const φ1 = (location1.lat * Math.PI) / 180; // φ, λ in radians
    const φ2 = (location2.lat * Math.PI) / 180;
    const Δφ = ((location2.lat - location1.lat) * Math.PI) / 180;
    const Δλ = ((location2.lng - location1.lng) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round((R * c) / 100) / 10; // in km
  }
}
export const locationService = new LocationService();
