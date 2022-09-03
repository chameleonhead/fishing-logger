import { Navigate } from "react-router-dom";

type IndexPageProps = {};

export const IndexPage = ({}: IndexPageProps) => {
  return <Navigate to="catches" />;
};

export default IndexPage;
