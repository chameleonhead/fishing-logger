import React from "react";
import {
  MapContainer,
  ScaleControl,
  TileLayer,
  ZoomControl,
  useMap,
  useMapEvent,
} from "react-leaflet";
import { createControlComponent } from "@react-leaflet/core";
import L from "leaflet";

export type Location = {
  latitude: number;
  longitude: number;
};

const DEFAULT_POSITION = { latitude: 35.65809922, longitude: 139.74135747 };

type CurrentLocationControllerProps = L.ControlOptions & {
  enabled?: boolean;
  onEnabledChange?: (enabled: boolean) => void;
};

const CurrentLocationController = createControlComponent(
  ({ enabled = false, onEnabledChange }: CurrentLocationControllerProps) => {
    const notTrackingContent =
      '<div class="leaflet-bar"><a href="#" title="Current Location" class="!text-dark" role="button" aria-label="Current Location" aria-disabled="false"><span aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bullseye" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M8 13A5 5 0 1 1 8 3a5 5 0 0 1 0 10zm0 1A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"/><path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/><path d="M9.5 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/></svg></span></a></div>';
    const trackingContent =
      '<div class="leaflet-bar"><a href="#" title="Current Location" class="!text-blue-500" role="button" aria-label="Current Location" aria-disabled="false"><span aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bullseye" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M8 13A5 5 0 1 1 8 3a5 5 0 0 1 0 10zm0 1A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"/><path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/><path d="M9.5 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/></svg></span></a></div>';

    const CurrentLocation = L.Control.extend({
      version: "1.0.1",
      options: {
        position: "topright",
        id: "",
        title: "",
        classes: "",
      },
      map: null as unknown as L.Map,
      container: null as unknown as HTMLElement,
      observer: null as unknown as MutationObserver,
      trackLocation: enabled,
      circleRef: null as L.Circle | null,
      onClick: function (e: Event) {
        e.stopPropagation();
        e.preventDefault();
        if (!this.trackLocation) {
          this.trackLocation = true;
          this.container.innerHTML = trackingContent;
          onEnabledChange && onEnabledChange(true);
          this.map.locate().on("locationfound", (e) => {
            if (this.circleRef === null) {
              this.circleRef = L.circle(e.latlng, e.accuracy);
              this.circleRef.addTo(this.map);
              this.map.flyTo(e.latlng, this.map.getZoom());
            } else {
              this.circleRef.setLatLng(e.latlng);
              this.circleRef.setRadius(e.accuracy);
            }
          });
        } else {
          this.trackLocation = false;
          this.container.innerHTML = notTrackingContent;
          onEnabledChange && onEnabledChange(false);
          this.map.stopLocate();
          if (this.circleRef !== null) {
            this.circleRef.removeFrom(this.map);
            this.circleRef = null;
          }
        }
      },
      onAdd: function (map: L.Map) {
        this.map = map;
        this.container = L.DomUtil.create("div");
        this.container.id = this.options.id;
        this.container.title = this.options.title;
        this.container.className = this.options.classes;
        this.container.innerHTML = notTrackingContent;

        /* Prevent click events propagation to map */
        L.DomEvent.disableClickPropagation(this.container);

        /* Prevent right click event propagation to map */
        L.DomEvent.on(this.container, "contextmenu", function (ev) {
          L.DomEvent.stopPropagation(ev);
        });

        /* Prevent scroll events propagation to map when cursor on the div */
        L.DomEvent.disableScrollPropagation(this.container);

        L.DomEvent.on(
          this.container,
          "click",
          this.onClick.bind(this),
          this.container,
        );

        return this.container;
      },

      onRemove: function () {
        if (this.circleRef !== null) {
          this.circleRef.removeFrom(this.map);
        }
      },
    });
    return new CurrentLocation();
  },
);

const MapClickEventHandler = ({
  onMapClick,
}: {
  onMapClick: (position: Location, zoom: number) => void;
}) => {
  const map = useMap();
  useMapEvent("click", (e) => {
    onMapClick(
      { latitude: e.latlng.lat, longitude: e.latlng.lng },
      map.getZoom(),
    );
  });
  return null;
};

type MapProps = React.PropsWithChildren<{
  center?: Location;
  className?: string;
  currentLocationControl?: boolean;
  onMapClick?: (location: Location, zoom: number) => void;
}>;

export const Map = ({
  center = DEFAULT_POSITION,
  className,
  currentLocationControl = true,
  children,
  onMapClick,
}: MapProps) => {
  return (
    <div
      className={className ? className : "h-32 w-full"}
      style={{ minHeight: "100px", minWidth: "100%" }}
    >
      <MapContainer
        center={{ lat: center.latitude, lng: center.longitude }}
        zoom={13}
        scrollWheelZoom={true}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl />
        <ScaleControl />
        {onMapClick ? <MapClickEventHandler onMapClick={onMapClick} /> : null}
        {currentLocationControl ? <CurrentLocationController /> : null}
        {children}
      </MapContainer>
    </div>
  );
};

export default Map;
