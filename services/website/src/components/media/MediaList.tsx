import MediaThumbnail from "./MediaThumbnail";

type MediaListProps = {
  data: { id: string }[];
};

export const MediaList = ({ data }: MediaListProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {data.map((media) => {
        return (
          <div key={media.id}>
            <MediaThumbnail id={media.id} />
          </div>
        );
      })}
    </div>
  );
};

export default MediaList;
