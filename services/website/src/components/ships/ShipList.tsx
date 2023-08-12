import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Ship } from "./models";
import List from "../common/List";

type ShipListProps = {
  data: Ship[];
};

export const ShipList = ({ data }: ShipListProps) => {
  if (data.length == 0) {
    return <Navigate to="/ships/create" />;
  }
  return (
    <List>
      {data.map((item) => {
        return (
          <List.Item key={item.id} action href={`/ships/${item.id}`}>
            {item.name}
          </List.Item>
        );
      })}
    </List>
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
