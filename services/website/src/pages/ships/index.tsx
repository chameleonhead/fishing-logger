import { Link as RouterLink } from "react-router-dom";
import ShipList from "../../components/ships/ShipList";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";

export const IndexPage = () => {
  return (
    <div>
      <PageHeader
        title="船一覧"
        actions={
          <Button as={RouterLink} to="/ships/create" color="primary">登録</Button>
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
