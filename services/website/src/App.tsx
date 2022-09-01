import { Routes, Route } from "react-router-dom";
import IndexPage from "./pages/index";
import CatchesCreatePage from "./pages/catches/create";
import Layout from "./components/common/Layout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<IndexPage />} />
        <Route path="catches/create" element={<CatchesCreatePage />} />
      </Route>
    </Routes>
  );
}

export default App;
