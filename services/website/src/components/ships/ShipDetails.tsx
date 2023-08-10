import { useEffect, useState } from "react";
import { Badge, Button, Col, Row } from "reactstrap";
import { Ship } from "./models";

type ShipDetailsProps = {
  data: Ship;
  onEditRequested?: () => void;
  onRequestReload?: () => void;
};

export const ShipDetails = ({ data, onEditRequested }: ShipDetailsProps) => {
  return (
    <div>
      {data.iot_enabled ? (
        <Row>
          <Col>
            <Badge color="primary" className="me-2 mb-2">
              データ連携設定済み
            </Badge>
          </Col>
        </Row>
      ) : null}
      <div className="d-flex justify-content-between align-items-baseline mb-3">
        <h1>{data.name}</h1>
        <div>
          {onEditRequested && (
            <Button
              type="button"
              color="secondary"
              outline
              size="sm"
              onClick={() => onEditRequested()}
            >
              編集
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

const ShipDetailsWithState = function ({
  id,
  onEditRequested,
}: {
  id: string;
  onEditRequested: () => void;
}) {
  const [data, setData] = useState(undefined);
  const [requestReload, setRequestReload] = useState(true);
  useEffect(() => {
    setRequestReload(false);
    if (requestReload) {
      (async () => {
        const result = await fetch(`/api/ships/${id}`, {
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
        <ShipDetails data={data} onEditRequested={onEditRequested} />
      </>
    );
  }
  return <div>Loading...</div>;
};

export default ShipDetailsWithState;
