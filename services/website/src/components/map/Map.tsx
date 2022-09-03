import { CSSProperties, useEffect } from "react";
import { MapContainer, Marker, ScaleControl, TileLayer, useMapEvent, ZoomControl } from "react-leaflet";
import { createControlComponent } from 'react-leaflet/node_modules/@react-leaflet/core';
import { Control, DomEvent, DomUtil, Map as LfMap } from 'leaflet';

export const CurrentLocationController = createControlComponent(function createZoomControl(props) {
  const notTrackingContent = '<div class="leaflet-bar"><a href="#" title="Current Location" role="button" aria-label="Current Location" aria-disabled="false"><span aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bullseye" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M8 13A5 5 0 1 1 8 3a5 5 0 0 1 0 10zm0 1A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"/><path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/><path d="M9.5 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/></svg></span></a></div>';
  const trackingContent = '<div class="leaflet-bar"><a href="#" title="Current Location" class="text-primary" role="button" aria-label="Current Location" aria-disabled="false"><span aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bullseye" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M8 13A5 5 0 1 1 8 3a5 5 0 0 1 0 10zm0 1A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"/><path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/><path d="M9.5 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/></svg></span></a></div>';

  const CurrentLocation = Control.extend({
    version: '1.0.1',
    options: {
      position: 'topright',
      id: '',
      title: '',
      classes: '',
    },
    map: (null as unknown) as LfMap,
    container: (null as unknown) as HTMLElement,
    trackLocation: false,
    watchId: NaN,
    onClick: function (e: Event) {
      e.stopPropagation();
      e.preventDefault();
      if (!this.trackLocation) {
        this.trackLocation = true;
        this.container.innerHTML = trackingContent;
        this.watchId = navigator.geolocation.watchPosition(this.onWatchPosition.bind(this), this.onWatchError.bind(this))
        console.log('tracking')
      } else {
        this.trackLocation = false;
        this.container.innerHTML = notTrackingContent;
        navigator.geolocation.clearWatch(this.watchId!);
        console.log('not-tracking')
      }
    },
    onWatchPosition: function (position: GeolocationPosition) {
      this.map.setView({ lat: position.coords.latitude, lng: position.coords.longitude });
      console.log(position);
    },
    onWatchError: function (error: GeolocationPositionError) {
      console.log(error);
    },
    onAdd: function (map: LfMap) {
      this.map = map;
      this.container = DomUtil.create('div');
      this.container.id = this.options.id;
      this.container.title = this.options.title;
      this.container.className = this.options.classes;
      this.container.innerHTML = notTrackingContent;

      /* Prevent click events propagation to map */
      DomEvent.disableClickPropagation(this.container);

      /* Prevent right click event propagation to map */
      DomEvent.on(this.container, 'contextmenu', function (ev) {
        DomEvent.stopPropagation(ev);
      });

      /* Prevent scroll events propagation to map when cursor on the div */
      DomEvent.disableScrollPropagation(this.container);

      DomEvent.on(this.container, 'click', this.onClick.bind(this), this.container);

      return this.container;
    },

    onRemove: function (map: LfMap) {
      DomEvent.off(this.container!, 'click', this.onClick, this.container);
      if (this.trackLocation) {
        navigator.geolocation.clearWatch(this.watchId!);
      }
    }
  });
  return new CurrentLocation();
});

type MapProps = {
  style: CSSProperties;
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
  const { position, style } = props;
  return (
    <div
      className="w-100"
      style={{ minHeight: "100px", height: "100px", ...style }}
    >
      <MapContainer center={position} zoom={13} scrollWheelZoom={true} zoomControl={false}>
        <MapEventHandler {...props} />
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {position && <Marker position={position} />}
        <ZoomControl />
        <ScaleControl />
        <CurrentLocationController />
      </MapContainer>
    </div>
  );
};

export default Map;
