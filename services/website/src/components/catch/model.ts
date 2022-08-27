export type Catch = {
  id: string;
  catched_at: string;
  place:
    | {
        latitude: number;
        longitude: number;
        altitude?: number;
      }
    | undefined;
  fishes: [
    {
      species: string;
    }
  ];
  method: {
    type: string;
    details: string;
  };
};
