import { useCallback, useState } from "react";
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
  onBlur?: () => void;
};

export const PlaceInput = ({ value, onChange, onBlur }: PlaceInputProps) => {
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
  const setLatitude = useCallback((value: string | number | undefined) => {
    if (typeof value === "undefined" || value === "") {
      setState({
        ...state,
        isValidLatitude: true,
        latitude: undefined,
        latitudeText: "",
      });
      return;
    }
    if (typeof value === "number") {
      setState({
        ...state,
        isValidLatitude: true,
        latitude: value,
        latitudeText: value > 0 ? value + "N" : -value + "S",
      });
      return;
    }
    if (value.match(/^-?\d+(\.\d+)?$/)) {
      const numberValue = Number(value);
      setState({
        ...state,
        isValidLatitude: true,
        latitude: numberValue,
        latitudeText: value,
      });
      return;
    }
    if (value.match(/^\d+(\.\d+)?[NS]$/)) {
      const numberValue = Number(value.substring(0, value.length - 1));
      const lastString = value.substring(value.length - 1);
      setState({
        ...state,
        isValidLatitude: true,
        latitude: lastString === "N" ? numberValue : -numberValue,
        latitudeText: value,
      });
      return;
    }
    setState({ ...state, isValidLatitude: false, latitudeText: value });
  }, []);

  const setLongitude = useCallback((value: string | number | undefined) => {
    if (typeof value === "undefined" || value === "") {
      setState({
        ...state,
        isValidLongitude: true,
        longitude: undefined,
        longitudeText: "",
      });
      return;
    }
    if (typeof value === "number") {
      setState({
        ...state,
        isValidLongitude: true,
        longitude: value,
        longitudeText: value > 0 ? value + "E" : -value + "W",
      });
      return;
    }
    if (value.match(/^-?\d+(\.\d+)?$/)) {
      const numberValue = Number(value);
      setState({
        ...state,
        isValidLongitude: true,
        longitude: numberValue,
        longitudeText: value,
      });
      return;
    }
    if (value.match(/^\d+(\.\d+)?[EW]$/)) {
      const numberValue = Number(value.substring(0, value.length - 1));
      const lastString = value.substring(value.length - 1);
      setState({
        ...state,
        isValidLongitude: true,
        longitude: lastString === "E" ? numberValue : -numberValue,
        longitudeText: value,
      });
      return;
    }
    setState({ ...state, isValidLongitude: false, longitudeText: value });
  }, []);
  return (
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
            onChange={(e) => setLatitude(e.target.value)}
            onBlur={onBlur}
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
            onChange={(e) => setLongitude(e.target.value)}
            onBlur={onBlur}
          />
        </FormGroup>
      </Col>
    </Row>
  );
};
