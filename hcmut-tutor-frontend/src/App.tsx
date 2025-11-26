import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import StudentIndexPage from "./pages/StudentIndexPage";
import RegisterProgramPage from "./pages/RegisterProgramPage";
import TutorIndexPage from "./pages/TutorIndexPage";
import PDTIndexPage from "./pages/PDTIndexPage";
import FacultyIndexPage from "./pages/FacultyIndexPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/student-dashboard" element={<StudentIndexPage />} />
        <Route path="/tutor-dashboard" element={<TutorIndexPage />} />
        <Route path="/pdt-dashboard" element={<PDTIndexPage />} />
        <Route path="/faculty-dashboard" element={<FacultyIndexPage />} />
        {/* <Route path="/ctsv-dashboard" element={<CTSVIndexPage />} /> */}

        <Route path="/register-program" element={<RegisterProgramPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
