import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ShipDetails from "../../components/ships/ShipDetails";
import ShipEditForm from "../../components/ships/ShipEditForm";
import PageHeader from "../../components/common/PageHeader";
import { Ship } from "../../components/ships/models";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";

type DetailsPageProps = {
  id: string;
  data?: Ship;
  onRequestReload: () => void;
};

export const DetailsPage = ({
  id,
  data,
  onRequestReload,
}: DetailsPageProps) => {
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  if (!data) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <PageHeader
        title={data.name}
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
          <ShipDetails
            data={data}
            onEditRequested={() => setEditModalOpen(true)}
          />
        </div>
      </main>
      <Modal
        open={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        color="primary"
        size="lg"
        title="船の編集"
      >
        <ShipEditForm
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
        const result = await fetch(`/api/ships/${id}`, {
          method: "GET",
        });
        if (result.ok) {
          setData(await result.json());
        }
      })();
    }
  }, [id, requestReload]);
  return (
    <DetailsPage
      id={id}
      data={data}
      onRequestReload={() => setRequestReload(true)}
    />
  );
};

export default DetailsPageWithState;
