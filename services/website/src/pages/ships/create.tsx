import { useNavigate } from "react-router-dom";
import { Container } from "reactstrap";
import ShipCreateForm from "../../components/ships/ShipCreateForm";

export const CreatePage = () => {
  const navigate = useNavigate();
  return (
    <Container fluid>
      <div className="my-3">
        <ShipCreateForm onSuccess={(value) => navigate(`/ships/${value.id}`)} />
      </div>
    </Container>
  );
};

export default CreatePage;
