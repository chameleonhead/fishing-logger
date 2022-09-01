import { useState } from "react";
import { Container } from "reactstrap";
import CreateCatchForm from "../../components/catch/CreateCatchForm";

type CreatePageProps = {};

export const CreatePage = ({}: CreatePageProps) => {
  const [state, setState] = useState({ formKey: 0 });
  return (
    <Container fluid>
      <div className="my-3">
        <CreateCatchForm
          key={state.formKey}
          onSuccess={() => setState({ formKey: state.formKey + 1 })}
        />
      </div>
    </Container>
  );
};

export default function () {
  return <CreatePage />;
}
