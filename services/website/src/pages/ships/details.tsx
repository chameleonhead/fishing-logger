import { useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Modal, ModalBody, ModalHeader } from "reactstrap";
import ShipDetails from "../../components/ships/ShipDetails";
import ShipEditForm from "../../components/ships/ShipEditForm";

type DetailsPageProps = {
  id: string;
};

export const DetailsPage = ({ id }: DetailsPageProps) => {
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  return (
    <Container fluid>
      <div className="my-3">
        <ShipDetails id={id} onEditRequested={() => setEditModalOpen(true)} />
      </div>
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
    </Container>
  );
};

const DetailsPageWithState = function () {
  const params = useParams();
  return <DetailsPage id={params.id as string} />;
};

export default DetailsPageWithState;
