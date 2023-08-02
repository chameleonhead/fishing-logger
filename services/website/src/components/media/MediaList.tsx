import { Col, Row } from "reactstrap";
import MediaThumbnail from "./MediaThumbnail";

type MediaListProps = {
  data: { id: string }[];
};

export const MediaList = ({ data }: MediaListProps) => {
  return (
    <Row>
      {data.map((media) => {
        return (
          <Col key={media.id} xs="12" sm="6" md="4" className="mb-2">
            <MediaThumbnail id={media.id} />
          </Col>
        );
      })}
    </Row>
  );
};
