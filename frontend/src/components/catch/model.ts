export type Catch = {
  id: string;
  catched_at: string;
  place: {
    latitude: string;
    longitude: string;
  };
  fish: {
    species: string;
  };
  method: {
    type: string;
    details: string;
  };
};
