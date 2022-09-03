import { DateTimeFormatter, Instant, ZoneId } from "@js-joda/core";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Badge,
  Col,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
  Row,
} from "reactstrap";
import { Catch } from "./models";

type CatchListProps = {
  data: Catch[];
};

export const CatchList = ({ data }: CatchListProps) => {
  return (
    <ListGroup>
      {data.map((item) => {
        console.log(item);
        return (
          <ListGroupItem
            key={item.id}
            action
            tag={RouterLink}
            to={`/catches/${item.id}`}
          >
            <Row>
              <Col>
                <Badge color="primary" className="me-2 mb-2">
                  {item.method.type}
                </Badge>
              </Col>
              <Col className="text-end">
                <small>
                  {DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm").format(
                    Instant.parse(item.catched_at).atZone(
                      ZoneId.systemDefault()
                    )
                  )}
                </small>
              </Col>
            </Row>
            <Row>
              <Col>
                <ListGroupItemHeading className="d-inline">
                  {item.fishes[0].species}
                  {!item.fishes[0].sizeText ? null : (
                    <span className="ms-3 text-muted">
                      {item.fishes[0].sizeText}
                    </span>
                  )}
                </ListGroupItemHeading>
                {!(item.method && item.method.details) ? null : (
                  <ListGroupItemText className="m-0">
                    {item.method.details}
                  </ListGroupItemText>
                )}
              </Col>
            </Row>
          </ListGroupItem>
        );
      })}
    </ListGroup>
  );
};

export default function () {
  const [data, setData] = useState([]);
  useEffect(() => {
    (async () => {
      const result = await fetch("/api/catches", {
        method: "GET",
      });
      if (result.ok) {
        setData(await result.json());
      }
    })();
  }, []);
  return <CatchList data={data} />;
}
