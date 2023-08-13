import { useEffect, useState } from "react";
import { Link as RouterLink, Navigate } from "react-router-dom";
import { DateTimeFormatter, Instant, ZoneId } from "@js-joda/core";
import { Catch } from "./models";
import List from "../common/List";
import Chip from "../common/Chip";

type CatchListProps = {
  data: Catch[];
};

export const CatchList = ({ data }: CatchListProps) => {
  if (data.length == 0) {
    return <Navigate to="/catches/create" />;
  }
  return (
    <List className="-m-4">
      {data.map((item) => {
        return (
          <RouterLink key={item.id} to={`/catches/${item.id}`}>
            <List.Item action>
              <div className="w-full">
                <p className="font-semibold leading-6 text-gray-900">
                  {item.fishes[0].species}
                  {!item.fishes[0].size_text ? null : (
                    <span className="ml-3 text-gray-400">
                      {item.fishes[0].size_text}
                    </span>
                  )}
                </p>
                <div className="flex justify-between">
                  <p className="flex items-baseline mt-1 truncate text-xs leading-5 text-gray-600">
                    <Chip color="primary">{item.method.type}</Chip>
                    {!(item.method && item.method.details) ? null : (
                      <span className="ml-3">{item.method.details}</span>
                    )}
                  </p>

                  <small className="text-xs leading-5 text-gray-600">
                    {DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm").format(
                      Instant.parse(item.catched_at).atZone(
                        ZoneId.systemDefault(),
                      ),
                    )}
                  </small>
                </div>
              </div>
            </List.Item>
          </RouterLink>
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
