import { useNavigate } from "react-router-dom";
import { Container } from "reactstrap";
import CreateCatchForm from "../../components/catch/CreateCatchForm";

type CreatePageProps = {};

export const CreatePage = ({}: CreatePageProps) => {
  const navigate = useNavigate();
  return (
    <Container fluid>
      <div className="my-3">
        <CreateCatchForm
          onSuccess={(value) => navigate(`/catches/${value.id}`)}
        />
      </div>
    </Container>
  );
};

export default function () {
  return <CreatePage />;
}
