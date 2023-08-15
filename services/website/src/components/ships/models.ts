export type Ship = {
  id: string;
  name: string;
  iot_enabled: boolean;
  state?: object;
};

export type ShipState = {
  signalk: {
    navigation: Record<string, any> & {
      position: {
        latitude: number | null;
        longitude: number | null;
      };
      datetime: string | null;
    };
  };
};

export type ShipLog = {
  time: string;
  position: {
    latitude: number;
    longitude: number;
  };
};
