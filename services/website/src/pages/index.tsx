import { useState } from "react";
import { Container, Navbar, NavbarBrand } from "reactstrap";
import CreateCatchForm from "../components/catch/CreateCatchForm";
import { Catch } from "../components/catch/models";

type IndexPageProps = {
  data: Catch[];
};

export const IndexPage = ({ data }: IndexPageProps) => {
  const [state, setState] = useState({ formKey: 0 });
  return (
    <>
      <Navbar color="dark" dark>
        <NavbarBrand href="/">Fishing Logger</NavbarBrand>
      </Navbar>
      <Container fluid>
        <div className="my-3">
          <CreateCatchForm
            key={state.formKey}
            onSuccess={() => setState({ formKey: state.formKey + 1 })}
          />
        </div>
      </Container>
    </>
  );
};

export default function () {
  return <IndexPage data={[]} />;
}
