import { useEffect, useState } from "react";
import { Ship, ShipState } from "./models";
import ShipLogs from "./ShipLogs";
import { DateTimeFormatter, Instant, ZoneId } from "@js-joda/core";
import Chip from "../common/Chip";

type ShipDetailsProps = {
  data: Ship;
  state?: ShipState;
  onEditRequested?: () => void;
  onRequestReload?: () => void;
};

export const ShipDetails = ({ data, state }: ShipDetailsProps) => {
  if (!state) {
    return (
      <div>
        <div className="my-3">
          <ShipLogs id={data.id} />
        </div>
      </div>
    );
  }

  const stateTime = state.signalk?.navigation?.datetime
    ? DateTimeFormatter.ISO_INSTANT.parse(
        state.signalk.navigation.datetime,
        Instant.FROM,
      )
    : undefined;
  return (
    <div>
      {stateTime ? (
        <div className="my-3">
          {stateTime.isBefore(Instant.now().plusSeconds(300)) ? (
            <>
              最終接続時間：
              {DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm").format(
                stateTime.atZone(ZoneId.SYSTEM),
              )}
            </>
          ) : (
            <Chip>接続中</Chip>
          )}
        </div>
      ) : null}
      <div className="my-3">
        <ShipLogs id={data.id} />
      </div>
    </div>
  );
};

export type ShipDetailsWithStateProps = {
  data: Ship;
};

export const ShipDetailsWithState = ({ data }: ShipDetailsWithStateProps) => {
  const [state, setState] = useState(undefined);

  useEffect(() => {
    (async () => {
      const result = await fetch(`/api/ships/${data.id}/state`, {
        method: "GET",
      });
      if (result.ok) {
        setState(await result.json());
      }
    })();
  }, [data.id]);

  return <ShipDetails data={data} state={state} />;
};

export default ShipDetailsWithState;
