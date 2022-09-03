import { Container } from "reactstrap";
import CatchList from "../../components/catch/CatchList";

type IndexPageProps = {};

export const IndexPage = ({}: IndexPageProps) => {
  return (
    <Container fluid>
      <div className="my-3">
        <CatchList />
      </div>
    </Container>
  );
};

export default function () {
  return <IndexPage />;
}
