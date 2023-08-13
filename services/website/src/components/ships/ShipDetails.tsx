import { Ship } from "./models";
import ShipLogs from "./ShipLogs";

type ShipDetailsProps = {
  data: Ship;
  onEditRequested?: () => void;
  onRequestReload?: () => void;
};

export const ShipDetails = ({ data }: ShipDetailsProps) => {
  return (
    <div>
      <div className="my-3">
        <ShipLogs id={data.id} />
      </div>
    </div>
  );
};

export default ShipDetails;
