import { useEffect } from "react";
import { MapContainer, Marker, TileLayer, useMapEvent } from "react-leaflet";

type MapProps = {
  position: { lat: number; lng: number } | undefined;
  onPositionChange: (latLng: { lat: number; lng: number }) => void;
};

const MapEventHandler = ({ position, onPositionChange }: MapProps) => {
  const map = useMapEvent("click", (e) => {
    onPositionChange({ lat: e.latlng.lat, lng: e.latlng.lng });
  });
  useEffect(() => {
    if (position && !map.getBounds().contains(position)) {
      map.setView(position);
    }
  }, [position?.lat, position?.lng]);
  return null;
};

export const Map = (props: MapProps) => {
  const { position } = props;
  return (
    <div className="w-100 vh-100">
      <MapContainer center={position} zoom={13} scrollWheelZoom={false}>
        <MapEventHandler {...props} />
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {position && <Marker position={position} />}
      </MapContainer>
    </div>
  );
};

export default Map;
