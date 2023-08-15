import { Marker, Popup, useMap } from "react-leaflet";
import Map, { Location } from "./Map";
import React, { useEffect, useRef, useState } from "react";

export type { Location };

export type MapWithMarkerProps = Exclude<
  React.ComponentProps<typeof Map>,
  { center: Location }
> & {
  position?: Location;
  popup?: React.ReactNode;
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
  children,
  ...props
}: MapWithMarkerProps) => {
  const markerRef = useRef<L.Marker>(null);
  const mapProps = props;
  if (!mapProps.center && position) {
    mapProps.center = position;
  }
  useEffect(() => {
    if (position && popup) {
      setTimeout(() => {
        markerRef.current!.openPopup();
      });
    }
  }, [position, popup]);

  return (
    <Map {...mapProps}>
      <PositionChangeDetector position={position} />
      {position && (
        <>
          <Marker
            ref={markerRef}
            position={{ lat: position.latitude, lng: position.longitude }}
          >
            {popup ? <Popup>{popup}</Popup> : null}
          </Marker>
        </>
      )}
      {children}
    </Map>
  );
};

export default MapWithMarker;
