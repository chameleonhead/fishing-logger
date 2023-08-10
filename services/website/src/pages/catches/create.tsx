import { useNavigate } from "react-router-dom";
import { Container } from "reactstrap";
import CatchCreateForm from "../../components/catch/CatchCreateForm";

export const CreatePage = () => {
  const navigate = useNavigate();
  return (
    <Container fluid>
      <div className="my-3">
        <CatchCreateForm
          onSuccess={(value) => navigate(`/catches/${value.id}`)}
        />
      </div>
    </Container>
  );
};

export default CreatePage;
