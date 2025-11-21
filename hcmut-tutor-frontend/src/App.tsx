import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import StudentIndexPage from "./pages/StudentIndexPage";
import RegisterProgramPage from "./pages/RegisterProgramPage";
import StudentIndexAfterRegister from "./pages/StudentIndexAfterRegister";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/student-dashboard" element={<StudentIndexPage />} />
        <Route path="/register-program" element={<RegisterProgramPage />} />
        <Route path="/student-dashboard-after" element={<StudentIndexAfterRegister />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
