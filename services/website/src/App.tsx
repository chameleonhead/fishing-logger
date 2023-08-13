import { Routes, Route } from "react-router-dom";
import Layout from "./components/common/Layout";
import IndexPage from "./pages/index";
import CatchesIndexPage from "./pages/catches/index";
import CatchesDetailsPage from "./pages/catches/details";
import CatchesCreatePage from "./pages/catches/create";
import ShipsIndexPage from "./pages/ships/index";
import ShipsDetailsPage from "./pages/ships/details";
import ShipsCreatePage from "./pages/ships/create";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<IndexPage />} />
        <Route path="catches" element={<CatchesIndexPage />} />
        <Route path="catches/:id" element={<CatchesDetailsPage />} />
        <Route path="catches/create" element={<CatchesCreatePage />} />
        <Route path="ships" element={<ShipsIndexPage />} />
        <Route path="ships/:id" element={<ShipsDetailsPage />} />
        <Route path="ships/create" element={<ShipsCreatePage />} />
      </Route>
    </Routes>
  );
}

export default App;
