import ShipList from "../../components/ships/ShipList";
import PageHeader from "../../components/common/PageHeader";
import LinkButton from "../../components/common/LinkButton";

export const IndexPage = () => {
  return (
    <div>
      <PageHeader
        title="船一覧"
        actions={
          <LinkButton color="primary" to="/ships/create">
            船登録
          </LinkButton>
        }
      />
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <ShipList />
        </div>
      </main>
    </div>
  );
};

export default IndexPage;
