import { useState } from "react";
import { useParams } from "react-router-dom";
import ShipDetails from "../../components/ships/ShipDetails";
import ShipEditForm from "../../components/ships/ShipEditForm";
import PageHeader from "../../components/common/PageHeader";

type DetailsPageProps = {
  id: string;
};

export const DetailsPage = ({ id }: DetailsPageProps) => {
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  return (
    <div>
      <PageHeader title="船詳細" />
      <main>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <ShipDetails id={id} onEditRequested={() => setEditModalOpen(true)} />
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
          <ShipEditForm
            id={id}
            onSuccess={() => {
              setEditModalOpen(false);
            }}
          ></ShipEditForm>
        </ModalBody>
      </Modal>
    </div>
  );
};

const DetailsPageWithState = function () {
  const params = useParams();
  return <DetailsPage id={params.id as string} />;
};

export default DetailsPageWithState;
