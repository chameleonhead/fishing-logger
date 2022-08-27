import { Container, Navbar, NavbarBrand } from "reactstrap";
import CreateCatchForm from "../components/catch/CreateCatchForm";
import { Catch } from "../components/catch/model";

type IndexPageProps = {
  data: Catch[];
};

export const IndexPage = ({ data }: IndexPageProps) => {
  return (
    <>
      <Navbar color="dark" dark>
        <NavbarBrand href="/">Fishing Logger</NavbarBrand>
      </Navbar>
      <Container fluid>
        <div className="my-3">
          <CreateCatchForm />
        </div>
      </Container>
    </>
  );
};

export default function () {
  return <IndexPage data={[]} />;
}
