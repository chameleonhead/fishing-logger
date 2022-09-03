import { useParams } from "react-router-dom";
import { Container } from "reactstrap";
import CatchDetails from "../../components/catch/CatchDetails";

type DetailsPageProps = {
  id: string;
};

export const DetailsPage = ({ id }: DetailsPageProps) => {
  return (
    <Container fluid>
      <div className="my-3">
        <CatchDetails id={id} />
      </div>
    </Container>
  );
};

export default function () {
  const params = useParams();
  return <DetailsPage id={params.id as string} />;
}
