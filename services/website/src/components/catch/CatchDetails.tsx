import { DateTimeFormatter, Instant, ZoneId } from "@js-joda/core";
import { Chip, Typography } from "@material-tailwind/react";
import Map from "../map/Map";
import { Catch } from "./models";
import { MediaList } from "../media/MediaList";

type CatchDetailsProps = {
  data: Catch;
  onEditRequested?: () => void;
  onRequestReload?: () => void;
};

export const CatchDetails = ({ data }: CatchDetailsProps) => {
  return (
    <div>
      <div className="flex justify-between">
        <Chip color="blue" className="me-2 mb-2" value={data.method.type} />
        <Typography className="text-xs leading-5 text-gray-600">
          {DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm").format(
            Instant.parse(data.catched_at).atZone(ZoneId.systemDefault()),
          )}
        </Typography>
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
        <Typography as="h2" className="mb-2 text-xl font-bold">
          魚種
        </Typography>
        {data.fishes.map((fish, i) => {
          return (
            <div key={i} className="flex justify-between">
              <div>
                {fish.species}
                {!fish.size_text ? null : (
                  <Typography as="span" className="inline ms-3 text-gray-600">
                    {fish.size_text}
                  </Typography>
                )}
              </div>
              <div>{fish.count}匹</div>
            </div>
          );
        })}
      </div>
      {data.method.details && (
        <div className="mb-3">
          <Typography as="h2" className="mb-2 text-xl font-bold">
            詳細
          </Typography>
          <div>{data.method.details}</div>
        </div>
      )}
      {data.media && data.media.length > 0 && (
        <div className="mb-3">
          <Typography as="h2" className="mb-2 text-xl font-bold">
            添付ファイル
          </Typography>
          <MediaList data={data.media} />
        </div>
      )}
    </div>
  );
};

export default CatchDetails;
