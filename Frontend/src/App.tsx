import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GlobalChainPage from "./pages/GlobalChainPage";
import ProvinceDashboard from "./pages/ProvinceDashboard";
import NavBar from "./components/NavBar";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <main className="flex-1 p-4">
          <Routes>
            <Route path="/" element={<GlobalChainPage />} />
            <Route path="/province/:provinceId" element={<ProvinceDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
