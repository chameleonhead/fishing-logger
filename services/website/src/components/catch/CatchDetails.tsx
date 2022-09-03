import { DateTimeFormatter, Instant, ZoneId } from "@js-joda/core";
import { useEffect, useState } from "react";
import { Badge, Button, Col, ListGroup, ListGroupItem, Row } from "reactstrap";
import Map from "../map/Map";
import { Catch } from "./models";

type CatchDetailsProps = {
  data: Catch;
  onEditRequested?: () => void;
};

export const CatchDetails = ({ data, onEditRequested }: CatchDetailsProps) => {
  return (
    <div>
      <Row>
        <Col>
          <Badge color="primary" className="me-2 mb-2">
            {data.method.type}
          </Badge>
        </Col>
        <Col className="text-end">
          <small>
            {DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm").format(
              Instant.parse(data.catched_at).atZone(ZoneId.systemDefault())
            )}
          </small>
        </Col>
      </Row>
      <div className="d-flex justify-content-between align-items-baseline mb-3">
        <h1>{data.fishes[0].species}</h1>
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
      {data.place && (
        <div className="mb-3">
          <Map
            style={{ height: "200px" }}
            position={{ lat: data.place.latitude, lng: data.place.longitude }}
            currentLocationControl={false}
          />
        </div>
      )}
      <div className="mb-3">
        <h2>魚種</h2>
        <ListGroup>
          {data.fishes.map((fish, i) => {
            return (
              <ListGroupItem key={i}>
                <Row>
                  <Col>
                    <div className="d-flex justify-content-between">
                      <div>
                        {fish.species}
                        {!fish.sizeText ? null : (
                          <span className="ms-3 text-muted">
                            {fish.sizeText}
                          </span>
                        )}
                      </div>
                      <div>{fish.count}匹</div>
                    </div>
                  </Col>
                </Row>
              </ListGroupItem>
            );
          })}
        </ListGroup>
      </div>
      {data.method.details && (
        <div className="mb-3">
          <h2>詳細</h2>
          <div>{data.method.details}</div>
        </div>
      )}
    </div>
  );
};

export default function ({
  id,
  onEditRequested,
}: {
  id: string;
  onEditRequested: () => void;
}) {
  const [data, setData] = useState(undefined);
  useEffect(() => {
    (async () => {
      const result = await fetch(`/api/catches/${id}`, {
        method: "GET",
      });
      if (result.ok) {
        setData(await result.json());
      }
    })();
  }, []);
  if (data) {
    return <CatchDetails data={data} onEditRequested={onEditRequested} />;
  }
  return <div>Loading...</div>;
}
