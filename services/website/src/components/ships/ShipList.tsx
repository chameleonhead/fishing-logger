import { useEffect, useState } from "react";
import { Link as RouterLink, Navigate } from "react-router-dom";
import { Ship } from "./models";

type ShipListProps = {
  data: Ship[];
};

export const ShipList = ({ data }: ShipListProps) => {
  if (data.length == 0) {
    return <Navigate to="/ships/create" />;
  }
  return (
    <List className="-m-4">
      {data.map((item) => {
        return (
          <RouterLink key={item.id} to={`/ships/${item.id}`}>
            <ListItem>{item.name}</ListItem>
          </RouterLink>
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
