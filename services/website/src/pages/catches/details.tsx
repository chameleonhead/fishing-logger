import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@material-tailwind/react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import CatchDetails from "../../components/catch/CatchDetails";
import CatchEditForm from "../../components/catch/CatchEditForm";
import PageHeader from "../../components/common/PageHeader";
import MediaUploader from "../../components/media/MediaUploader";
import { Catch } from "../../components/catch/models";

type DetailsPageProps = {
  id: string;
  data?: Catch;
  onRequestReload: () => void;
  onMediaUploadSuccess: (param: { id: string }) => void;
};

export const DetailsPage = ({
  id,
  data,
  onRequestReload,
  onMediaUploadSuccess,
}: DetailsPageProps) => {
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  if (!data) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <PageHeader
        title={data.fishes[0].species}
        actions={
          <Button
            type="button"
            color="blue"
            variant="outlined"
            onClick={() => setEditModalOpen(true)}
          >
            編集
          </Button>
        }
      />
      <main>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <CatchDetails
            data={data}
            onEditRequested={() => setEditModalOpen(true)}
          />
          <MediaUploader onSuccess={onMediaUploadSuccess} />
        </div>
      </main>
      <Modal
        isOpen={isEditModalOpen}
        toggle={() => setEditModalOpen(!isEditModalOpen)}
      >
        <ModalHeader
          className="bg-primary text-light"
          toggle={() => setEditModalOpen(!isEditModalOpen)}
        >
          船の編集
        </ModalHeader>
        <ModalBody>
          <CatchEditForm
            id={id}
            onSuccess={() => {
              onRequestReload();
              setEditModalOpen(false);
            }}
          ></CatchEditForm>
        </ModalBody>
      </Modal>
    </div>
  );
};

const DetailsPageWithState = function () {
  const params = useParams();
  const id = params.id as string;

  const [data, setData] = useState(undefined);
  const [requestReload, setRequestReload] = useState(true);

  useEffect(() => {
    setRequestReload(false);
    if (requestReload) {
      (async () => {
        const result = await fetch(`/api/catches/${id}`, {
          method: "GET",
        });
        if (result.ok) {
          setData(await result.json());
        }
      })();
    }
  }, [id, requestReload]);

  const handleSuccess = useCallback(
    async (r: { id: string }) => {
      await fetch(`/api/catches/${id}/media`, {
        method: "POST",
        body: JSON.stringify(r),
      });
      setRequestReload(true);
    },
    [id],
  );
  return (
    <DetailsPage
      id={id}
      data={data}
      onRequestReload={() => setRequestReload(true)}
      onMediaUploadSuccess={handleSuccess}
    />
  );
};

export default DetailsPageWithState;
