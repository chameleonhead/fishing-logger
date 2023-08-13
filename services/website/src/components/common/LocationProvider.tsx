import React, { createContext, useCallback, useState } from "react";

type GeoLocation = {
  latitude: number;
  longitude: number;
};

type LocationContext = {
  location: GeoLocation | undefined;
  getCurrentPosition: () => Promise<GeoLocation | undefined>;
  watch: () => void;
  clearWatch: () => void;
};

export const LocationContext = createContext<LocationContext>({
  location: undefined,
  getCurrentPosition: async () => undefined,
  watch: () => {},
  clearWatch: () => {},
});

export type LocationProviderProps = React.PropsWithChildren<{}>;

export const LocationProvider = ({ children }: LocationProviderProps) => {
  const [state, setState] = useState({
    location: undefined as GeoLocation | undefined,
    watchId: null as number | null,
  });
  const getCurrentPosition = useCallback(async () => {
    if (state.watchId !== null) {
      return Promise.resolve(state.location);
    }
    const position = await new Promise<GeolocationPosition>(
      (resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve(position);
          },
          (error) => {
            reject(error);
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          },
        );
      },
    );
    setState((state) => ({
      ...state,
      location: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
    }));
  }, [state]);
  const watch = useCallback(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setState((state) => ({
          ...state,
          location: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        }));
      },
      (error) => {
        console.error(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      },
    );
    setState((state) => ({ ...state, watchId }));
  }, []);

  const clearWatch = useCallback(() => {
    if (state.watchId !== null) {
      navigator.geolocation.clearWatch(state.watchId);
    }
  }, [state.watchId]);

  return (
    <LocationContext.Provider
      value={{
        location: state.location,
        getCurrentPosition,
        watch,
        clearWatch,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};
