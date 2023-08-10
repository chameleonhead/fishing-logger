import { Container } from "reactstrap";
import CatchList from "../../components/catch/CatchList";

export const IndexPage = () => {
  return (
    <Container fluid>
      <div className="my-3">
        <CatchList />
      </div>
    </Container>
  );
};

export default IndexPage;
