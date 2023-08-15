import { useCallback, useEffect, useState } from "react";
import MapWithMarker from "../map/MapWithMarker";
import InputField from "../common/InputField";
import Button from "../common/Button";

const PRECISION = 8;

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
    latitude: value?.latitude ?? undefined,
    latitudeText: !value
      ? ""
      : value.latitude === 0
      ? "0"
      : value.latitude > 0
      ? value.latitude + "N"
      : -value.latitude + "S",
    longitude: value?.longitude ?? undefined,
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
  longitudeText: string,
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
  const [state, setState] = useState(valueToState(value));
  const [isFetchingCurrentLocation, setFetchingCurrentLocation] =
    useState(false);

  const handleFetchCurrentLocation = useCallback(() => {
    setFetchingCurrentLocation(true);
    try {
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
          if (
            typeof value === "undefined" ||
            value === null ||
            value.latitude !== newValue.latitude ||
            value.longitude !== newValue.longitude
          ) {
            onChange?.(newValue);
          }
          setFetchingCurrentLocation(false);
        },
        (error) => {
          setFetchingCurrentLocation(false);
          alert(error.message);
        },
        {
          timeout: 5000,
        },
      );
    } catch (e) {
      setFetchingCurrentLocation(false);
      alert(e);
    }
  }, [value, onChange]);

  useEffect(() => {
    if (typeof value === "undefined") {
      handleFetchCurrentLocation();
    } else if (value !== (null as InvalidValue)) {
      const newValue = valueToState(value);
      if (
        newValue.latitude !== state.latitude ||
        newValue.longitude !== state.longitude
      ) {
        setState(newValue);
      }
    }
  }, [value, state, handleFetchCurrentLocation]);

  return (
    <div>
      <div className="mb-1">
        <MapWithMarker
          className="h-96"
          position={value || undefined}
          onMapClick={(position) => {
            if (isFetchingCurrentLocation) {
              return;
            }
            const newValue = {
              latitude:
                Math.round(position.latitude * 10 ** PRECISION) /
                10 ** PRECISION,
              longitude:
                Math.round(position.longitude * 10 ** PRECISION) /
                10 ** PRECISION,
            };
            setState(valueToState(newValue));
            if (onChange) {
              onChange(newValue);
            }
          }}
        />
      </div>
      <div className="flex my-3 gap-1">
        <InputField
          className="grow"
          name="place_latitude"
          label="緯度"
          placeholder="例) 35.65809922N"
          type="text"
          value={state.latitudeText}
          disabled={isFetchingCurrentLocation}
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
        <InputField
          className="grow"
          name="place_longitude"
          label="経度"
          placeholder="例) 139.74135747E"
          type="text"
          value={state.longitudeText}
          disabled={isFetchingCurrentLocation}
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
      </div>
      <div className="my-3">
        <Button
          className="w-full"
          type="button"
          color="default"
          variant="outline"
          disabled={isFetchingCurrentLocation}
          onClick={handleFetchCurrentLocation}
        >
          {isFetchingCurrentLocation ? "取得中" : "現在地取得"}
        </Button>
      </div>
    </div>
  );
};
