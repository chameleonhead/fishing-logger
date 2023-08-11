import { useNavigate } from "react-router-dom";
import ShipCreateForm from "../../components/ships/ShipCreateForm";
import PageHeader from "../../components/common/PageHeader";

export const CreatePage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <PageHeader title="船登録" />
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <ShipCreateForm
            onSuccess={(value) => navigate(`/ships/${value.id}`)}
          />
        </div>
      </main>
    </div>
  );
};

export default CreatePage;
