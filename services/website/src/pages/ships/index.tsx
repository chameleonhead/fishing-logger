import { Link as RouterLink } from "react-router-dom";
import ShipList from "../../components/ships/ShipList";
import PageHeader from "../../components/common/PageHeader";

export const IndexPage = () => {
  return (
    <div>
      <PageHeader
        title="船一覧"
        actions={
          <RouterLink to="/catches/create">
            <Button color="blue">登録</Button>
          </RouterLink>
        }
      />
      <main>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <ShipList />
        </div>
      </main>
    </div>
  );
};

export default IndexPage;
