import { useEffect, useMemo, useState } from "react";
import { DateTimeFormatter, Instant, ZoneId } from "@js-joda/core";
import L from "leaflet";
import { Marker, Polyline } from "react-leaflet";
import { ShipLog } from "./models";
import MapWithMarker from "../map/MapWithMarker";

export type ShipLogsProps = {
  logs: ShipLog[];
};

export const ShipLogs = ({ logs }: ShipLogsProps) => {
  const { lastLog, validLogs, shipLogLine } = useMemo(() => {
    const validLogs = logs
      .filter((log) => log.position.latitude && log.position.longitude)
      .reverse();
    if (validLogs.length === 0) {
      return { lastLog: null, shipLogLine: [] };
    }
    const lastLog = validLogs[validLogs.length - 1];
    return {
      lastLog,
      validLogs,
      shipLogLine: validLogs.map((log) => ({
        lat: log.position.latitude,
        lng: log.position.longitude,
      })),
    };
  }, [logs]);
  const [selectLog, setSelectLog] = useState<ShipLog>();
  if (lastLog === null) {
    return <div>位置情報がありません</div>;
  }

  function handleMapClick(location: ShipLog["position"]) {
    const filtered = validLogs
      ?.map((log) => ({
        distance: Math.sqrt(
          Math.pow(log.position.latitude - location.latitude, 2) +
            Math.pow(log.position.longitude - location.longitude, 2),
        ),
        log,
      }))
      .sort((lhs, rhs) => lhs.distance - rhs.distance)[0];
    if (filtered) {
      setSelectLog(filtered.log);
    }
  }

  return (
    <div style={{ minHeight: "300px", height: "300px" }}>
      <MapWithMarker
        position={selectLog ? selectLog.position : undefined}
        popup={
          selectLog ? (
            <div>
              <strong className="font-bold">時刻</strong>
              <div>
                {DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm").format(
                  Instant.parse(selectLog.time).atZone(ZoneId.SYSTEM),
                )}
              </div>
            </div>
          ) : null
        }
        className="h-96"
        center={lastLog.position}
        onMapClick={handleMapClick}
      >
        <Marker
          icon={
            new L.DivIcon({
              html: '<svg xmlns="http://www.w3.org/2000/svg" class="text-blue-700" fill="currentColor" stroke="white" viewBox="0 0 24 24" height="24px" width="24px"><path d="M4 10.4V4C4 3.44772 4.44772 3 5 3H10V1H14V3H19C19.5523 3 20 3.44772 20 4V10.4L21.0857 10.7257C21.5974 10.8792 21.8981 11.4078 21.7685 11.9261L20.2516 17.9938C20.1682 17.9979 20.0844 18 20 18C18.3644 18 16.9122 17.2147 16 16.0005C15.0878 17.2147 13.6356 18 12 18C10.3644 18 8.91223 17.2147 8 16.0005C7.08777 17.2147 5.6356 18 4 18C3.91564 18 3.83178 17.9979 3.74845 17.9938L2.23152 11.9261C2.10195 11.4078 2.40262 10.8792 2.91431 10.7257L4 10.4ZM6 9.8L12 8L14.7541 8.82624L16.5627 9.36882L18 9.8V5H6V9.8ZM4 20C5.53671 20 6.93849 19.4223 8 18.4722C9.06151 19.4223 10.4633 20 12 20C13.5367 20 14.9385 19.4223 16 18.4722C17.0615 19.4223 18.4633 20 20 20H22V22H20C18.5429 22 17.1767 21.6104 16 20.9297C14.8233 21.6104 13.4571 22 12 22C10.5429 22 9.17669 21.6104 8 20.9297C6.82331 21.6104 5.45715 22 4 22H2V20H4Z"></path></svg>',
              className: "-ml-3 bg-transparent",
            })
          }
          position={{
            lat: lastLog.position.latitude,
            lng: lastLog.position.longitude,
          }}
        />
        {logs.length > 1 ? (
          <Polyline
            className="text-blue-700"
            positions={shipLogLine}
            color="currentColor"
          />
        ) : null}
      </MapWithMarker>
    </div>
  );
};

const ShipLogsWithState = function ({ id }: { id: string }) {
  const [data, setData] = useState<"LOADING" | { logs: ShipLog[] } | null>(
    "LOADING",
  );
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
        } else {
          setData(null);
        }
      })();
    }
  }, [id, requestReload]);
  if (data === "LOADING") {
    return <div>Loading...</div>;
  }

  if (data === null) {
    return <div>現在地のデータを取得できませんでした。</div>;
  }
  return <ShipLogs logs={data.logs} />;
};

export default ShipLogsWithState;
