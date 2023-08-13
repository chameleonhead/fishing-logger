import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Polyline, TileLayer } from "react-leaflet";

type Log = {
  timestamp: number;
  position: {
    latitude: number;
    longitude: number;
  };
};

export type ShipLogsProps = {
  logs: Log[];
};

export const ShipLogs = ({ logs }: ShipLogsProps) => {
  const { lastLog, shipLogLine } = useMemo(() => {
    const validLogs = logs.filter(
      (log) => log.position.latitude && log.position.longitude,
    );
    if (validLogs.length === 0) {
      return { lastLog: null, shipLogLine: [] };
    }
    const lastLog = validLogs[validLogs.length - 1];
    return {
      lastLog,
      shipLogLine: validLogs.map((log) => ({
        lat: log.position.latitude,
        lng: log.position.longitude,
      })),
    };
  }, [logs]);
  if (lastLog === null) {
    return <div>位置情報がありません</div>;
  }
  return (
    <div className="w-100" style={{ minHeight: "100px", height: "200px" }}>
      <MapContainer
        center={{
          lat: lastLog.position.latitude,
          lng: lastLog.position.longitude,
        }}
        zoom={13}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          position={{
            lat: lastLog.position.latitude,
            lng: lastLog.position.longitude,
          }}
        />
        {logs.length > 1 ? (
          <Polyline className="text-blue-500" positions={shipLogLine} />
        ) : null}
      </MapContainer>
    </div>
  );
};

const ShipLogsWithState = function ({ id }: { id: string }) {
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
        <ShipLogs logs={data.logs} />
      </>
    );
  }
  return <div>Loading...</div>;
};

export default ShipLogsWithState;
