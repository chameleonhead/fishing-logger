import { Link as RouterLink } from "react-router-dom";
import { Button } from "@material-tailwind/react";
import CatchList from "../../components/catch/CatchList";
import PageHeader from "../../components/common/PageHeader";

export const IndexPage = () => {
  return (
    <div>
      <PageHeader
        title="漁獲一覧"
        actions={
          <RouterLink to="/catches/create">
            <Button color="blue">登録</Button>
          </RouterLink>
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
