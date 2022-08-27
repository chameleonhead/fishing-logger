import { useEffect, useState } from "react";
import { Row, Col, FormGroup, Label, Input } from "reactstrap";
import Map from "../map/Map";

const PRECISION = 8;
const DEFAULT_VALUE = { latitude: 35.65809922, longitude: 139.74135747 };

type InvalidValue = null;

type Place = {
  latitude: number;
  longitude: number;
};

type PlaceInputProps = {
  value: Place | undefined | InvalidValue;
  onChange?: (value: Place | undefined | InvalidValue) => void;
};

function valueToState(value: PlaceInputProps["value"]) {
  return {
    latitude: value && value.latitude,
    longitude: value && value.longitude,
    latitudeText: !value
      ? ""
      : value.latitude === 0
      ? "0"
      : value.latitude > 0
      ? value.latitude + "N"
      : -value.latitude + "S",
    longitudeText: !value
      ? ""
      : value.longitude === 0
      ? "0"
      : value.longitude > 0
      ? value.longitude + "E"
      : -value.longitude + "W",
  };
}

function tryParse(
  latitudeText: string,
  longitudeText: string
): PlaceInputProps["value"] {
  let latitudeNumber: number | undefined;
  let longitudeNumber: number | undefined;
  if (!latitudeText && !longitudeText) {
    return undefined;
  }
  if (latitudeText.match(/^-?\d+(\.\d+)?$/)) {
    latitudeNumber = Number(latitudeText);
  } else if (latitudeText.match(/^\d+(\.\d+)?[NS]$/)) {
    const topString = latitudeText.substring(0, latitudeText.length - 1);
    const lastString = latitudeText.substring(latitudeText.length - 1);
    latitudeNumber =
      lastString === "N" ? Number(topString) : -Number(topString);
  }
  if (longitudeText.match(/^-?\d+(\.\d+)?$/)) {
    longitudeNumber = Number(longitudeText);
  } else if (longitudeText.match(/^\d+(\.\d+)?[WE]$/)) {
    const topString = longitudeText.substring(0, longitudeText.length - 1);
    const lastString = longitudeText.substring(longitudeText.length - 1);
    longitudeNumber =
      lastString === "E" ? Number(topString) : -Number(topString);
  }
  if (
    typeof latitudeNumber === "undefined" ||
    typeof longitudeNumber === "undefined"
  ) {
    return null;
  } else {
    return {
      latitude: Math.round(latitudeNumber * 10 ** PRECISION) / 10 ** PRECISION,
      longitude:
        Math.round(longitudeNumber * 10 ** PRECISION) / 10 ** PRECISION,
    };
  }
}

export const PlaceInput = ({ value, onChange }: PlaceInputProps) => {
  const [state, setState] = useState(valueToState(value || DEFAULT_VALUE));
  useEffect(() => {
    if (!value) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newValue = {
            latitude:
              Math.round(position.coords.latitude * 10 ** PRECISION) /
              10 ** PRECISION,
            longitude:
              Math.round(position.coords.longitude * 10 ** PRECISION) /
              10 ** PRECISION,
          };
          setState(valueToState(newValue));
          if (onChange) {
            onChange(newValue);
          }
        },
        () => {
          if (onChange) {
            onChange(DEFAULT_VALUE);
          }
        }
      );
    }
  }, []);
  useEffect(() => {
    if (value !== (null as InvalidValue)) {
      const newValue = valueToState(value);
      if (typeof value === "undefined") {
        setState(newValue);
      } else if (
        value.latitude !== state.latitude ||
        value.longitude !== state.longitude
      ) {
        setState(newValue);
      }
    }
  }, [value]);

  return (
    <div>
      <div className="mb-1">
        <Map
          style={{ height: "300px" }}
          position={
            typeof state.latitude !== "undefined" &&
            typeof state.longitude !== "undefined"
              ? { lat: state.latitude!, lng: state.longitude! }
              : { lat: DEFAULT_VALUE.latitude, lng: DEFAULT_VALUE.longitude }
          }
          onPositionChange={(position) => {
            const newValue = {
              latitude:
                Math.round(position.lat * 10 ** PRECISION) / 10 ** PRECISION,
              longitude:
                Math.round(position.lng * 10 ** PRECISION) / 10 ** PRECISION,
            };
            setState(valueToState(newValue));
            if (onChange) {
              onChange(newValue);
            }
          }}
        />
      </div>
      <Row>
        <Col md={6}>
          <FormGroup>
            <Label for="place_latitude">緯度</Label>
            <Input
              id="place_latitude"
              name="place_latitude"
              placeholder="35.65809922N"
              type="text"
              value={state.latitudeText}
              onChange={(e) => {
                const newValue = tryParse(e.target.value, state.longitudeText);
                setState({
                  ...state,
                  ...newValue,
                  latitudeText: e.target.value,
                });
                if (onChange) {
                  onChange(newValue);
                }
              }}
            />
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup>
            <Label for="place_longitude">経度</Label>
            <Input
              id="place_longitude"
              name="place_longitude"
              placeholder="139.74135747E"
              type="text"
              value={state.longitudeText}
              onChange={(e) => {
                const newValue = tryParse(state.latitudeText, e.target.value);
                setState({
                  ...state,
                  ...newValue,
                  longitudeText: e.target.value,
                });
                if (onChange) {
                  onChange(newValue);
                }
              }}
            />
          </FormGroup>
        </Col>
      </Row>
    </div>
  );
};
