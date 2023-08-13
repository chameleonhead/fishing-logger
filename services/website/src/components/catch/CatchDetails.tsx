import { DateTimeFormatter, Instant, ZoneId } from "@js-joda/core";
import Map from "../map/Map";
import { Catch } from "./models";
import { MediaList } from "../media/MediaList";
import { Chip } from "../common/Chip";

type CatchDetailsProps = {
  data: Catch;
};

export const CatchDetails = ({ data }: CatchDetailsProps) => {
  return (
    <div>
      <div className="my-3 flex justify-between">
        <Chip color="blue" className="me-2 mb-2">
          {data.method.type}
        </Chip>
        <small className="text-xs leading-5 text-gray-600">
          {DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm").format(
            Instant.parse(data.catched_at).atZone(ZoneId.systemDefault()),
          )}
        </small>
      </div>
      {data.place && (
        <div className="my-3">
          <Map
            style={{ height: "200px" }}
            position={{ lat: data.place.latitude, lng: data.place.longitude }}
            currentLocationControl={false}
          />
        </div>
      )}
      <div className="my-3">
        <h4 className="mb-1">魚種</h4>
        {data.fishes.map((fish, i) => {
          return (
            <div key={i} className="flex justify-between">
              <div>
                {fish.species}
                {!fish.size_text ? null : (
                  <span className="inline ms-3 text-gray-600">
                    {fish.size_text}
                  </span>
                )}
              </div>
              <div>{fish.count}匹</div>
            </div>
          );
        })}
      </div>
      {data.method.details && (
        <div className="my-3">
          <h4 className="mb-1">詳細</h4>
          <div>{data.method.details}</div>
        </div>
      )}
      {data.media && data.media.length > 0 && (
        <div className="my-3">
          <h4 className="mb-1">添付ファイル</h4>
          <MediaList data={data.media} />
        </div>
      )}
    </div>
  );
};

export default CatchDetails;
