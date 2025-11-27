import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import StudentIndexPage from "./pages/StudentIndexPage";
import RegisterProgramPage from "./pages/RegisterProgramPage";
import StudentIndexAfterRegister from "./pages/StudentIndexAfterRegister";
import CtsvDashboard from "./pages/CtsvIndexPage";
import ResultOnePage from "./pages/ResultOne";
import ResultAllPage from "./pages/ResultAll";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/student-dashboard" element={<StudentIndexPage />} />
        <Route path="/register-program" element={<RegisterProgramPage />} />
        <Route path="/student-dashboard-after" element={<StudentIndexAfterRegister />} />
        <Route path="/ctsv-dashboard" element={<CtsvDashboard />} />
        <Route path="/result-one" element={<ResultOnePage />} />
        <Route path="/result-all" element={<ResultAllPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
