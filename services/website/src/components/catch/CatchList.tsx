import { DateTimeFormatter, Instant, ZoneId } from "@js-joda/core";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Catch } from "./models";
import Badge from "../common/Badge";
import List from "../common/List";

type CatchListProps = {
  data: Catch[];
};

export const CatchList = ({ data }: CatchListProps) => {
  if (data.length == 0) {
    return <Navigate to="/catches/create" />;
  }
  return (
    <List>
      {data.map((item) => {
        return (
          <List.Item key={item.id} action href={`/catches/${item.id}`}>
            <div className="min-w-0 flex-auto">
              <p className="font-semibold leading-6 text-gray-900">
                {item.fishes[0].species}
                {!item.fishes[0].size_text ? null : (
                  <span className="ms-3 text-muted">
                    {item.fishes[0].size_text}
                  </span>
                )}
              </p>

              <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                <Badge color="primary">{item.method.type}</Badge>
                {!(item.method && item.method.details) ? null : (
                  <span className="ml-3">{item.method.details}</span>
                )}
              </p>
            </div>
            <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
              <p className="mt-1 text-xs leading-5 text-gray-500">
                {DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm").format(
                  Instant.parse(item.catched_at).atZone(ZoneId.systemDefault()),
                )}
              </p>
            </div>
          </List.Item>
        );
      })}
    </List>
  );
};

const CatchListWithState = function () {
  const [data, setData] = useState(undefined as Catch[] | undefined);
  useEffect(() => {
    (async () => {
      const result = await fetch("/api/catches", {
        method: "GET",
      });
      if (result.ok) {
        setData((await result.json()).catches);
      }
    })();
  }, []);
  if (data) {
    return <CatchList data={data} />;
  }
  return <div>Loading...</div>;
};

export default CatchListWithState;
