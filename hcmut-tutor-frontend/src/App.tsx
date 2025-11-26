import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import StudentIndexPage from "./pages/StudentIndexPage";
import RegisterProgramPage from "./pages/RegisterProgramPage";
import StudentIndexAfterRegister from "./pages/StudentIndexAfterRegister";
import SubjectRegistrationPage from "./pages/SubjectRegistrationPage";
import SubjectTutorListPage from "./pages/SubjectTutorListPage";
import TutorStudentListPage from "./pages/TutorStudentListPage";
import TutorStudentUpdatePage from "./pages/TutorStudentUpdatePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/student-dashboard" element={<StudentIndexPage />} />
        <Route path="/register-program" element={<RegisterProgramPage />} />
        <Route path="/student-dashboard-after" element={<StudentIndexAfterRegister />} />
        <Route path="/register-subject" element={<SubjectRegistrationPage />} />
        <Route path="/register-subject/tutors" element={<SubjectTutorListPage />} />
        <Route path="/tutor/students" element={<TutorStudentListPage />} />
        <Route path="/tutor/update-progress/:id" element={<TutorStudentUpdatePage />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;
