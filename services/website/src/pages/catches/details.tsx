import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CatchDetails from "../../components/catch/CatchDetails";
import CatchEditForm from "../../components/catch/CatchEditForm";
import PageHeader from "../../components/common/PageHeader";
import MediaUploader from "../../components/media/MediaUploader";
import { Catch } from "../../components/catch/models";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";

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
            color="primary"
            variant="outline"
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
        open={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        color="primary"
        size="lg"
        title="船の編集"
      >
        <CatchEditForm
          id={id}
          onSuccess={() => {
            onRequestReload();
            setEditModalOpen(false);
          }}
        />
      </Modal >
    </div >
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
