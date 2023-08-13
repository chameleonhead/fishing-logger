import { Link as RouterLink } from "react-router-dom";
import CatchList from "../../components/catch/CatchList";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";

export const IndexPage = () => {
  return (
    <div>
      <PageHeader
        title="漁獲一覧"
        actions={
          <Button as={RouterLink} to="/catches/create" color="primary">
            登録
          </Button>
        }
      />
      <main>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <CatchList />
        </div>
      </main>
    </div>
  );
};

export default IndexPage;
