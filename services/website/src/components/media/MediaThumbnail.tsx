import { useEffect, useReducer, useState } from "react";
import {
  Button,
  Card,
  CardText,
  Col,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";

type Media = {
  id: string;
  name: string;
  content_type: string;
  last_modified: string;
  size: number;
  url: string;
};

type MediaThumbnailProps = {
  data: Media;
  isPreviewOpen: boolean;
  onTogglePreview: () => void;
};

export const MediaThumbnail = (props: MediaThumbnailProps) => {
  const { data } = props;
  if (data.content_type.startsWith("image/")) {
    return <ImageThumbnail {...props} />;
  }
  if (data.content_type.startsWith("audio/")) {
    return <AudioThumbnail {...props} />;
  }
  if (data.content_type.startsWith("video/")) {
    return <VideoThumbnail {...props} />;
  }
  return (
    <Card body className="h-100">
      <CardText>{data.name}</CardText>
      <Button tag="a" href={data.url} download={data.name} color="primary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-cloud-arrow-down"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M7.646 10.854a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L8.5 9.293V5.5a.5.5 0 0 0-1 0v3.793L6.354 8.146a.5.5 0 1 0-.708.708l2 2z"
          />
          <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383zm.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z" />
        </svg>{" "}
        Download
      </Button>
    </Card>
  );
};

export const ImageThumbnail = ({
  data,
  isPreviewOpen,
  onTogglePreview,
}: MediaThumbnailProps) => {
  return (
    <Card
      onClick={onTogglePreview}
      style={{ overflow: "clip" }}
      className="h-100"
    >
      <img src={data.url} />
      <Modal
        isOpen={isPreviewOpen}
        toggle={onTogglePreview}
        style={{
          maxWidth: "100vw",
          maxHeight: "100vh",
          width: "100vw",
          height: "100vh",
          padding: 0,
          margin: 0,
        }}
        className="d-flex"
        contentClassName="rounded-0"
      >
        <ModalHeader
          style={{
            borderTop: "none",
            borderLeft: "none",
            borderRight: "none",
          }}
          toggle={onTogglePreview}
        >
          <Row className="d-flex align-items-center">
            <Col xs="auto">
              <Button
                tag="a"
                href={data.url}
                download={data.name}
                color="primary"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-cloud-arrow-down"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M7.646 10.854a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L8.5 9.293V5.5a.5.5 0 0 0-1 0v3.793L6.354 8.146a.5.5 0 1 0-.708.708l2 2z"
                  />
                  <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383zm.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z" />
                </svg>
              </Button>
            </Col>
            <Col>{data.name}</Col>
          </Row>
        </ModalHeader>
        <ModalBody
          style={{
            border: "none",
            borderRadius: "none",
            padding: 0,
            overflow: "auto",
            textAlign: "center",
          }}
          className="p-3"
        >
          <img
            src={data.url}
            style={{ maxHeight: "100%", maxWidth: "100%", margin: "auto" }}
          />
        </ModalBody>
      </Modal>
    </Card>
  );
};

export const AudioThumbnail = ({ data }: MediaThumbnailProps) => {
  return (
    <Card
      style={{ overflow: "clip" }}
      className="h-100 d-flex align-items-center justify-content-center p-3"
    >
      <audio controls src={data.url} style={{ width: "100%" }} />
    </Card>
  );
};

export const VideoThumbnail = ({ data }: MediaThumbnailProps) => {
  return (
    <Card
      style={{ overflow: "clip" }}
      className="h-100 d-flex align-items-center justify-content-center"
    >
      <video controls style={{ maxHeight: "100%", maxWidth: "100%" }}>
        <source src={data.url} type={data.content_type} />
        Sorry, your browser doesn't support embedded videos.
      </video>
    </Card>
  );
};

const initialValue = {
  id: null as unknown as string,
  data: undefined as Media | undefined,
  status: "PENDING" as "PENDING" | "LOADING" | "SUCCEEDED",
};

function reducer(
  state: typeof initialValue,
  action: { type: "FETCH" } | { type: "FETCHED"; payload: Media },
): typeof initialValue {
  switch (action.type) {
    case "FETCH":
      return { ...state, status: "LOADING" };
    case "FETCHED":
      return { ...state, status: "SUCCEEDED", data: action.payload };
  }
  return state;
}

const MediaThumbnailWithState = function ({ id }: { id: string }) {
  const [state, dispatch] = useReducer(reducer, initialValue);
  const [isPreviewOpen, setPreviewOpen] = useState(false);
  useEffect(() => {
    if (state.status === "PENDING" || state.data?.id !== id) {
      dispatch({ type: "FETCH" });
      (async () => {
        const result = await fetch("/api/media/" + id);
        const data = await result.json();
        dispatch({ type: "FETCHED", payload: data });
      })();
    }
  }, [dispatch, id, state.status, state.data]);
  if (!state.data) {
    return <div>Loading...</div>;
  }
  return (
    <MediaThumbnail
      data={state.data}
      isPreviewOpen={isPreviewOpen}
      onTogglePreview={() => setPreviewOpen(!isPreviewOpen)}
    />
  );
};

export default MediaThumbnailWithState;
