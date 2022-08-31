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
      sizeText?: string;
      count: number;
    }
  ];
  method: {
    type: string;
    details?: string;
  };
  weatherInfo?: {
    weather: string;
    pressureHpa?: number;
    temperature?: number;
    waterTemperature?: number;
    windSpeedMps?: number;
    windDirection?: string;
    humidity?: number;
    visibilityKm?: number;
    comment?: string;
  };
};
