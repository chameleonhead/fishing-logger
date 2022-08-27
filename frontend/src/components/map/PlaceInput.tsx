import { useCallback, useEffect, useState } from "react";
import { Row, Col, FormGroup, Label, Input } from "reactstrap";
import Map from "./Map";

type Place = {
  isValid: boolean;
  latitude: number | undefined;
  longitude: number | undefined;
};

type PlaceInputProps = {
  value: Place;
  onChange?: (value: Place) => void;
};

export const PlaceInput = ({ value, onChange }: PlaceInputProps) => {
  const [state, setState] = useState({
    isValidLatitude: true,
    isValidLongitude: true,
    latitude: value.latitude,
    longitude: value.longitude,
    latitudeText: !value.latitude
      ? ""
      : value.latitude === 0
      ? "0"
      : value.latitude > 0
      ? value.latitude + "N"
      : -value.latitude + "S",
    longitudeText: !value.longitude
      ? ""
      : value.longitude === 0
      ? "0"
      : value.longitude > 0
      ? value.longitude + "E"
      : -value.longitude + "W",
  });
  const calculateState = useCallback(
    (
      latitudeInput: string | number | undefined,
      longitudeInput: string | number | undefined
    ) => {
      let newState = { ...state };
      if (typeof latitudeInput === "undefined") {
        newState.isValidLatitude = true;
        newState.latitude = undefined;
        newState.latitudeText = "";
      } else if (typeof latitudeInput === "number") {
        newState.isValidLatitude = true;
        newState.latitude = latitudeInput;
        newState.latitudeText =
          latitudeInput === 0
            ? "0"
            : latitudeInput > 0
            ? latitudeInput + "N"
            : -latitudeInput + "S";
      } else if (latitudeInput.match(/^-?\d+(\.\d+)?$/)) {
        const numberLatitude = Number(latitudeInput);
        newState.isValidLatitude = true;
        newState.latitude = numberLatitude;
        newState.latitudeText = latitudeInput;
      } else if (latitudeInput.match(/^\d+(\.\d+)?[NS]$/)) {
        const numberLatitude = Number(
          latitudeInput.substring(0, latitudeInput.length - 1)
        );
        const lastString = latitudeInput.substring(latitudeInput.length - 1);
        newState.isValidLatitude = true;
        newState.latitude =
          lastString === "N" ? numberLatitude : -numberLatitude;
        newState.latitudeText = latitudeInput;
      } else {
        newState.isValidLatitude = false;
        newState.latitudeText = latitudeInput;
      }

      if (typeof longitudeInput === "undefined") {
        newState.isValidLongitude = true;
        newState.longitude = undefined;
        newState.longitudeText = "";
      } else if (typeof longitudeInput === "number") {
        newState.isValidLongitude = true;
        newState.longitude = longitudeInput;
        newState.longitudeText =
          longitudeInput === 0
            ? "0"
            : longitudeInput > 0
            ? longitudeInput + "E"
            : -longitudeInput + "W";
      } else if (longitudeInput.match(/^-?\d+(\.\d+)?$/)) {
        const numberLongitude = Number(longitudeInput);
        newState.isValidLongitude = true;
        newState.longitude = numberLongitude;
        newState.longitudeText = longitudeInput;
      } else if (longitudeInput.match(/^\d+(\.\d+)?[NS]$/)) {
        const numberLatitude = Number(
          longitudeInput.substring(0, longitudeInput.length - 1)
        );
        const lastString = longitudeInput.substring(longitudeInput.length - 1);
        newState.isValidLongitude = true;
        newState.longitude =
          lastString === "E" ? numberLatitude : -numberLatitude;
        newState.longitudeText = longitudeInput;
      } else {
        newState.isValidLongitude = false;
        newState.longitudeText = longitudeInput;
      }
      return newState;
    },
    []
  );
  useEffect(() => {
    if (
      value.latitude !== state.latitude &&
      value.longitude !== state.longitude
    ) {
      setState(calculateState(value.latitude, value.longitude));
    }
  }, [value.latitude, value.longitude]);

  return (
    <div>
      <div className="mb-1">
        <Map
          style={{ height: "300px" }}
          position={
            state.isValidLatitude && state.isValidLongitude
              ? { lat: state.latitude!, lng: state.longitude! }
              : undefined
          }
          onPositionChange={(position) => {
            const newState = calculateState(position.lat, position.lng);
            setState(newState);
            if (onChange) {
              onChange({
                isValid: newState.isValidLatitude && newState.isValidLongitude,
                latitude: newState.latitude,
                longitude: newState.longitude,
              });
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
                const newState = calculateState(
                  e.target.value,
                  state.longitudeText
                );
                setState(newState);
                if (onChange) {
                  onChange({
                    isValid:
                      newState.isValidLatitude && newState.isValidLongitude,
                    latitude: newState.latitude,
                    longitude: newState.longitude,
                  });
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
                const newState = calculateState(
                  state.latitudeText,
                  e.target.value
                );
                setState(newState);
                if (onChange) {
                  onChange({
                    isValid:
                      newState.isValidLatitude && newState.isValidLongitude,
                    latitude: newState.latitude,
                    longitude: newState.longitude,
                  });
                }
              }}
            />
          </FormGroup>
        </Col>
      </Row>
    </div>
  );
};
