import { useEffect, useState } from "react";
import { MapContainer, Polyline, TileLayer } from "react-leaflet";

type Log = {
  timestamp: number;
  position: {
    latitude: number;
    longitude: number;
  };
};

export type ShipLogsProps = {
  position: { latitude: number; longitude: number };
  logs: Log[];
};

export const ShipLogs = ({ position, logs }: ShipLogsProps) => {
  return (
    <div className="w-100" style={{ minHeight: "100px", height: "200px" }}>
      <MapContainer
        center={{ lat: position.latitude, lng: position.longitude }}
        zoom={13}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {logs ? (
          <Polyline
            className="text-blue-500"
            positions={logs.map((log) => ({
              lat: log.position.latitude,
              lng: log.position.longitude,
            }))}
          />
        ) : null}
      </MapContainer>
    </div>
  );
};

const ShipLogsWithState = function ({
  id,
}: {
  id: string;
}) {
  const [data, setData] = useState<{ logs: Log[] } | undefined>(undefined);
  const [requestReload, setRequestReload] = useState(true);
  useEffect(() => {
    setRequestReload(false);
    if (requestReload) {
      (async () => {
        const result = await fetch(`/api/ships/${id}/logs`, {
          method: "GET",
        });
        if (result.ok) {
          setData(await result.json());
        }
      })();
    }
  }, [id, requestReload]);
  if (data) {
    return (
      <>
        <ShipLogs position={data.logs[data.logs.length - 1].position} logs={data.logs} />
      </>
    );
  }
  return <div>Loading...</div>;
};

export default ShipLogsWithState;
