import { Container } from "reactstrap";
import ShipList from "../../components/ships/ShipList";

export const IndexPage = () => {
  return (
    <Container fluid>
      <div className="my-3">
        <ShipList />
      </div>
    </Container>
  );
};

export default IndexPage;
