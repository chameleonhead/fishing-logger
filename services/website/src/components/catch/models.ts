export type Catch = {
  id: string;
  catched_at: string;
  place?:
    | {
        latitude: number;
        longitude: number;
        altitude?: number;
      }
    | undefined;
  fishes: [
    {
      species: string;
      size_text?: string;
      count: number;
    }
  ];
  method: {
    type: string;
    details?: string;
  };
  media?: { id: string }[];
  weather_info?: {
    weather: string;
    pressure_hpa?: number;
    temperature?: number;
    water_temperature?: number;
    wind_speed_mps?: number;
    wind_direction?: string;
    humidity?: number;
    visibility_km?: number;
    comment?: string;
  };
};
