export interface LonLat {
  lon: number;
  lat: number;
}

const options = {
  enableHighAccuracy: false,
  timeout: 5000,
  maximumAge: 0,
};

class LocationService {
  currentLocation: LonLat | null = null;

  constructor() {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by your browser");
    } else this.startWatching();
  }

  startWatching() {
    navigator.geolocation.watchPosition(
      (position) => this.onSuccess(position),
      this.onError,
      options
    );
  }

  private onSuccess(position: {
    coords: { latitude: number; longitude: number };
  }) {
    const { latitude: lat, longitude: lon } = position.coords;
    console.log("current location", { lon, lat });
    this.currentLocation = { lon, lat };
  }

  private onError(err: any) {
    console.error(`ERROR(${err.code}): ${err.message}`);
  }
}

export const locationService = new LocationService();
