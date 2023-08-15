import { Marker, useMap } from "react-leaflet";
import Map, { Location } from "./Map";
import React, { useEffect, useState } from "react";

export type { Location };

export type MapWithMarkerProps = Exclude<
  React.ComponentProps<typeof Map>,
  { center: Location }
> & {
  position?: Location;
  popup?: string;
};

const PositionChangeDetector = ({ position }: { position?: Location }) => {
  const map = useMap();
  const [prevPosition, setPrevPosition] = useState(position);
  useEffect(() => {
    if (
      position &&
      !map
        .getBounds()
        .contains({ lat: position.latitude, lng: position.longitude })
    ) {
      if (prevPosition) {
        map.flyTo({ lat: position.latitude, lng: position.longitude });
      } else {
        map.setView({ lat: position.latitude, lng: position.longitude });
      }
    }
    setPrevPosition(position);
  }, [map, position, prevPosition, setPrevPosition]);
  return null;
};

export const MapWithMarker = ({
  position,
  popup,
  ...props
}: MapWithMarkerProps) => {
  return (
    <Map {...props} center={position}>
      <PositionChangeDetector position={position} />
      {position && (
        <>
          <Marker
            position={{ lat: position.latitude, lng: position.longitude }}
          />
        </>
      )}
    </Map>
  );
};

export default MapWithMarker;
