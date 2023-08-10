import { useEffect, useState } from "react";
import { Link as RouterLink, Navigate } from "react-router-dom";
import { ListGroup, ListGroupItem } from "reactstrap";
import { Ship } from "./models";

type ShipListProps = {
  data: Ship[];
};

export const ShipList = ({ data }: ShipListProps) => {
  if (data.length == 0) {
    return <Navigate to="/ships/create" />;
  }
  return (
    <ListGroup>
      {data.map((item) => {
        return (
          <ListGroupItem
            key={item.id}
            action
            tag={RouterLink}
            to={`/ships/${item.id}`}
          >
            {item.name}
          </ListGroupItem>
        );
      })}
    </ListGroup>
  );
};

const ShipListWithState = function () {
  const [data, setData] = useState(undefined as Ship[] | undefined);
  useEffect(() => {
    (async () => {
      const result = await fetch("/api/ships", {
        method: "GET",
      });
      if (result.ok) {
        setData((await result.json()).ships);
      }
    })();
  }, []);
  if (data) {
    return <ShipList data={data} />;
  }
  return <div>Loading...</div>;
};

export default ShipListWithState;
