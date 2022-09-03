import { Routes, Route } from "react-router-dom";
import Layout from "./components/common/Layout";
import IndexPage from "./pages/index";
import CatchesIndexPage from "./pages/catches/index";
import CatchesCreatePage from "./pages/catches/create";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<IndexPage />} />
        <Route path="catches" element={<CatchesIndexPage />} />
        <Route path="catches/create" element={<CatchesCreatePage />} />
      </Route>
    </Routes>
  );
}

export default App;
