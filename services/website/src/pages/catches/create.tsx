import { useNavigate } from "react-router-dom";
import CatchCreateForm from "../../components/catch/CatchCreateForm";
import PageHeader from "../../components/common/PageHeader";

export const CreatePage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <PageHeader title="漁獲登録" />
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <CatchCreateForm
            onSuccess={(value) => navigate(`/catches/${value.id}`)}
          />
        </div>
      </main>
    </div>
  );
};

export default CreatePage;
