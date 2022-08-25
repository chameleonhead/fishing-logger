import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvent,
} from "react-leaflet";

type MapProps = {
  position: [number, number];
  onPositionChange: (latLng: [number, number]) => void;
};

const MapEventHandler = ({ position, onPositionChange }: MapProps) => {
  const map = useMapEvent("click", (e) => {
    onPositionChange([e.latlng.lat, e.latlng.lng]);
  });
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
        <Marker position={position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};
