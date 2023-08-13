import { useEffect, useReducer } from "react";
import FileInputField from "../common/FileInputField";
import List from "../common/List";
import Button from "../common/Button";
import Progress from "../common/Progress";

type FileUploadState = {
  id: number;
  target: File;
  status: "QUEUED" | "UPLOADING" | "SUCCEEDED" | "FAILED";
  progress: number;
  error?: FileUploadError;
};

const statusText = {
  QUEUED: "待機中",
  UPLOADING: "アップロード中",
  SUCCEEDED: "アップロード完了",
  FAILED: "アップロード失敗",
};

type MediaUploaderProps = {
  queue: FileUploadState[];
  onRetry: (id: number) => void;
  onFileSelected?: (value?: File[]) => void;
};

export const MediaUploader = ({
  queue,
  onRetry,
  onFileSelected,
}: MediaUploaderProps) => {
  return (
    <div>
      <FileInputField
        onChange={(e) => {
          onFileSelected &&
            onFileSelected(
              [...Array(e.target.files?.length || 0)].map(
                (_, i) => e.target.files!.item(i)!,
              ),
            );
          e.target.value = "";
        }}
      />
      <List>
        {queue.map((item) => (
          <List.Item key={item.id}>
            <div className="w-full">
              <div className="flex justify-start">
                <div>{item.target.name}</div>
              </div>
              <div>
                {item.status === "FAILED" ? (
                  <Button
                    color="danger"
                    size="sm"
                    onClick={() => onRetry(item.id)}
                    className="w-full"
                  >
                    再実行
                  </Button>
                ) : (
                  <>
                    <Progress animated value={item.progress} />
                    <div className="my-1 text-gray-500 text-sm">
                      {statusText[item.status]}
                    </div>
                  </>
                )}
              </div>
            </div>
          </List.Item>
        ))}
      </List>
    </div>
  );
};

type FileUploadError = Error;

const actions = {
  queueFile: (file: File) => {
    return { type: "QUEUE_FILE" as const, payload: file };
  },
  uploadFile: (id: number) => {
    return { type: "UPLOAD_FILE" as const, payload: { id } };
  },
  resetQueue: (id: number) => {
    return { type: "RESET_QUEUE" as const, payload: { id } };
  },
  progressFileUpload: (id: number, progress: number) => {
    return {
      type: "PROGRESS_FILE_UPLOAD" as const,
      payload: { id, progress },
    };
  },
  fileUploadSucceeded: (id: number) => {
    return {
      type: "FILE_UPLOAD_SUCCEEDED" as const,
      payload: { id },
    };
  },
  fileUploadFailed: (id: number, error: FileUploadError) => {
    return {
      type: "FILE_UPLOAD_FAILED" as const,
      payload: { id, error },
    };
  },
  removeFromQueue: (id: number) => {
    return {
      type: "REMOVE_FROM_QUEUE" as const,
      payload: { id },
    };
  },
};

type Actions =
  | ReturnType<typeof actions.queueFile>
  | ReturnType<typeof actions.resetQueue>
  | ReturnType<typeof actions.uploadFile>
  | ReturnType<typeof actions.progressFileUpload>
  | ReturnType<typeof actions.fileUploadSucceeded>
  | ReturnType<typeof actions.fileUploadFailed>
  | ReturnType<typeof actions.removeFromQueue>;

const initialValue = {
  nextId: 1,
  queued: false,
  fileUploadingState: [] as FileUploadState[],
};

const reducer = function (
  state: typeof initialValue,
  action: Actions,
): typeof initialValue {
  switch (action.type) {
    case "QUEUE_FILE":
      return {
        ...state,
        nextId: state.nextId + 1,
        queued: true,
        fileUploadingState: [
          ...state.fileUploadingState,
          {
            id: state.nextId,
            target: action.payload,
            status: "QUEUED",
            progress: 0,
          },
        ],
      };
    case "REMOVE_FROM_QUEUE": {
      const newFileUploadingState = state.fileUploadingState.filter(
        (value) => value.id != action.payload.id,
      );
      return {
        ...state,
        fileUploadingState: newFileUploadingState,
        queued: !!newFileUploadingState.find(
          (value) => value.status === "QUEUED",
        ),
      };
    }
    case "RESET_QUEUE": {
      const newFileUploadingState = state.fileUploadingState.map((value) =>
        value.id == action.payload.id ? { ...value, status: "QUEUED" } : value,
      ) as (typeof initialValue)["fileUploadingState"];
      return {
        ...state,
        fileUploadingState: newFileUploadingState,
        queued: true,
      };
    }
    case "UPLOAD_FILE": {
      const newFileUploadingState = state.fileUploadingState.map((value) =>
        value.id == action.payload.id
          ? { ...value, status: "UPLOADING" }
          : value,
      ) as (typeof initialValue)["fileUploadingState"];
      return {
        ...state,
        fileUploadingState: newFileUploadingState,
        queued: !!newFileUploadingState.find(
          (value) => value.status === "QUEUED",
        ),
      };
    }
    case "PROGRESS_FILE_UPLOAD":
      return {
        ...state,
        fileUploadingState: state.fileUploadingState.map((value) =>
          value.id == action.payload.id
            ? { ...value, progress: action.payload.progress }
            : value,
        ),
      };
    case "FILE_UPLOAD_SUCCEEDED": {
      const newFileUploadingState = state.fileUploadingState.map((value) =>
        value.id == action.payload.id
          ? { ...value, progress: 100, status: "SUCCEEDED" }
          : value,
      ) as (typeof initialValue)["fileUploadingState"];
      return {
        ...state,
        fileUploadingState: newFileUploadingState,
        queued: !!newFileUploadingState.find(
          (value) => value.status === "QUEUED",
        ),
      };
    }
    case "FILE_UPLOAD_FAILED": {
      const newFileUploadingState = state.fileUploadingState.map((value) =>
        value.id == action.payload.id
          ? {
              ...value,
              progress: 0,
              status: "FAILED",
              error: action.payload.error,
            }
          : value,
      ) as (typeof initialValue)["fileUploadingState"];
      return {
        ...state,
        fileUploadingState: newFileUploadingState,
        queued: !!newFileUploadingState.find(
          (value) => value.status === "QUEUED",
        ),
      };
    }
  }
  return state;
};

async function uploadFile(
  file: File,
  onProgress: (progress: number) => void,
  onSuccess: (result: { id: string }) => void,
  onError: (err: FileUploadError) => void,
) {
  try {
    onProgress(1);
    const initiateResult = await fetch("/api/media/initiate-upload", {
      method: "POST",
      body: JSON.stringify({
        name: file.name,
        content_type: file.type,
        last_modified: file.lastModified,
        size: file.size,
      }),
    });
    onProgress(10);
    if (!initiateResult.ok) {
      onError(new Error("File upload failed."));
      return;
    }
    const data = await initiateResult.json();
    const formData = new FormData();
    Object.entries(data.fields).forEach(([k, v]) => {
      formData.append(k, v as string);
    });
    formData.append("file", file);
    const uploadResult = await fetch(data.url, {
      method: "POST",
      body: formData,
    });
    onProgress(100);
    if (!uploadResult.ok) {
      onError(new Error("File upload failed."));
      return;
    }
    onSuccess({ id: data.data.id as string });
  } catch (error) {
    console.error(error);
    onError(new Error("File upload failed."));
    return;
  }
}

const MediaUploaderWithState = function ({
  onSuccess,
}: {
  onSuccess: (result: { id: string }) => void;
}) {
  const [state, dispatch] = useReducer(reducer, initialValue);
  useEffect(() => {
    let uploadingCount = 0;
    for (const f of state.fileUploadingState) {
      if (uploadingCount > 3) {
        break;
      }
      if (f.status == "QUEUED") {
        uploadingCount++;
        dispatch(actions.uploadFile(f.id));
        uploadFile(
          f.target,
          (p) => dispatch(actions.progressFileUpload(f.id, p)),
          (r) => {
            dispatch(actions.fileUploadSucceeded(f.id));
            setTimeout(() => {
              dispatch(actions.removeFromQueue(f.id));
            }, 1000);
            onSuccess(r);
          },
          (err) => dispatch(actions.fileUploadFailed(f.id, err)),
        );
      }
    }
  }, [onSuccess, state.fileUploadingState, state.queued]);
  return (
    <MediaUploader
      queue={state.fileUploadingState}
      onFileSelected={(files) =>
        files?.forEach((file) => dispatch(actions.queueFile(file)))
      }
      onRetry={(id) => dispatch(actions.resetQueue(id))}
    />
  );
};

export default MediaUploaderWithState;
