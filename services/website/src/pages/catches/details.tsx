import { useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Modal, ModalBody, ModalHeader } from "reactstrap";
import CatchDetails from "../../components/catch/CatchDetails";
import EditCatchForm from "../../components/catch/EditCatchForm";

type DetailsPageProps = {
  id: string;
};

export const DetailsPage = ({ id }: DetailsPageProps) => {
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  return (
    <Container fluid>
      <div className="my-3">
        <CatchDetails id={id} onEditRequested={() => setEditModalOpen(true)} />
      </div>
      <Modal
        isOpen={isEditModalOpen}
        toggle={() => setEditModalOpen(!isEditModalOpen)}
      >
        <ModalHeader
          className="bg-primary text-light"
          toggle={() => setEditModalOpen(!isEditModalOpen)}
        >
          漁獲の編集
        </ModalHeader>
        <ModalBody>
          <EditCatchForm
            id={id}
            onSuccess={() => {
              setEditModalOpen(false);
            }}
          ></EditCatchForm>
        </ModalBody>
      </Modal>
    </Container>
  );
};

export default function () {
  const params = useParams();
  return <DetailsPage id={params.id as string} />;
}
