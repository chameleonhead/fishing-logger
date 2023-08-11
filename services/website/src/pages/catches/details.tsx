import { useState } from "react";
import { useParams } from "react-router-dom";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import CatchDetails from "../../components/catch/CatchDetails";
import CatchEditForm from "../../components/catch/CatchEditForm";
import PageHeader from "../../components/common/PageHeader";

type DetailsPageProps = {
  id: string;
};

export const DetailsPage = ({ id }: DetailsPageProps) => {
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  return (
    <div>
      <PageHeader title="漁獲詳細" />
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <CatchDetails
            id={id}
            onEditRequested={() => setEditModalOpen(true)}
          />
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
  return <DetailsPage id={params.id as string} />;
};

export default DetailsPageWithState;
