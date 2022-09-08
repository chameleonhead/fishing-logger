import { useEffect, useReducer } from "react";
import { Input } from "reactstrap";

type MediaUploaderProps = {
  onFileSelected?: (value?: File[]) => void;
};

export const MediaUploader = ({ onFileSelected }: MediaUploaderProps) => {
  return (
    <Input
      type="file"
      onChange={(e) =>
        onFileSelected &&
        onFileSelected(
          [...Array(e.target.files?.length || 0)].map(
            (_, i) => e.target.files?.item(i)!
          )
        )
      }
    />
  );
};

type FileUploadError = any;

const actions = {
  queueFile: (file: File) => {
    return { type: "QUEUE_FILE" as "QUEUE_FILE", payload: file };
  },
  uploadFile: (id: number) => {
    return { type: "UPLOAD_FILE" as "UPLOAD_FILE", payload: { id } };
  },
  progressFileUpload: (id: number, progress: number) => {
    return {
      type: "PROGRESS_FILE_UPLOAD" as "PROGRESS_FILE_UPLOAD",
      payload: { id, progress },
    };
  },
  fileUploadSucceeded: (id: number) => {
    return {
      type: "FILE_UPLOAD_SUCCEEDED" as "FILE_UPLOAD_SUCCEEDED",
      payload: { id },
    };
  },
  fileUploadFailed: (id: number, error: FileUploadError) => {
    return {
      type: "FILE_UPLOAD_FAILED" as "FILE_UPLOAD_FAILED",
      payload: { id, error },
    };
  },
};

type Actions =
  | ReturnType<typeof actions.queueFile>
  | ReturnType<typeof actions.uploadFile>
  | ReturnType<typeof actions.progressFileUpload>
  | ReturnType<typeof actions.fileUploadSucceeded>
  | ReturnType<typeof actions.fileUploadFailed>;

const initialValue = {
  nextId: 1,
  queued: false,
  fileUploadingState: [] as {
    id: number;
    target: File;
    state: "QUEUED" | "UPLOADING" | "SUCCEEDED" | "FAILED";
    progress: number;
    error?: FileUploadError;
  }[],
};

const reducer = function (
  state: typeof initialValue,
  action: Actions
): typeof initialValue {
  console.log(action);
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
            state: "QUEUED",
            progress: 0,
          },
        ],
      };
    case "UPLOAD_FILE":
      const newFileUploadingState = state.fileUploadingState.map((value) =>
        value.id == action.payload.id ? { ...value, state: "UPLOADING" } : value
      ) as typeof initialValue["fileUploadingState"];
      return {
        ...state,
        fileUploadingState: newFileUploadingState,
        queued: !!newFileUploadingState.find(
          (value) => value.state === "QUEUED"
        ),
      };
    case "PROGRESS_FILE_UPLOAD":
      return {
        ...state,
        fileUploadingState: state.fileUploadingState.map((value) =>
          value.id == action.payload.id
            ? { ...value, progress: action.payload.progress }
            : value
        ),
      };
    case "FILE_UPLOAD_SUCCEEDED":
      return {
        ...state,
        fileUploadingState: state.fileUploadingState.map((value) =>
          value.id == action.payload.id
            ? { ...value, progress: 100, state: "SUCCEEDED" }
            : value
        ),
      };
    case "FILE_UPLOAD_FAILED":
      return {
        ...state,
        fileUploadingState: state.fileUploadingState.map((value) =>
          value.id == action.payload.id
            ? {
                ...value,
                progress: 0,
                state: "FAILED",
                error: action.payload.error,
              }
            : value
        ),
      };
  }
  return state;
};

async function uploadFile(
  file: File,
  onProgress: (progress: number) => void,
  onSuccess: () => void,
  onError: (err: FileUploadError) => void
) {
  onProgress(1);
  const initiateResult = await fetch("/api/media/initiate-upload", {
    method: "POST",
    body: "{}",
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
  onSuccess();
}

export default function ({ onSuccess }: { onSuccess: () => void }) {
  const [state, dispatch] = useReducer(reducer, initialValue);
  useEffect(() => {
    let uploadingCount = 0;
    for (const f of state.fileUploadingState) {
      if (uploadingCount > 3) {
        break;
      }
      if (f.state == "QUEUED") {
        uploadingCount++;
        uploadFile(
          f.target,
          (p) => dispatch(actions.progressFileUpload(f.id, p)),
          () => {
            dispatch(actions.fileUploadSucceeded(f.id));
            onSuccess();
          },
          (err) => dispatch(actions.fileUploadFailed(f.id, err))
        );
      }
    }
  }, [state.queued]);
  return (
    <MediaUploader
      onFileSelected={(files) =>
        files?.forEach((file) => dispatch(actions.queueFile(file)))
      }
    />
  );
}
