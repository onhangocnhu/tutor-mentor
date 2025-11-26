import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import StudentIndexPage from "./pages/Dashboard/StudentIndexPage";
import RegisterProgramPage from "./pages/RegisterProgram/RegisterProgramPage";
import TutorIndexPage from "./pages/Dashboard/TutorIndexPage";
import PDTIndexPage from "./pages/Dashboard/PDTIndexPage";
import FacultyIndexPage from "./pages/Dashboard/FacultyIndexPage";
import SubjectRegistrationPage from "./pages/SubjectRegistration/SubjectRegistrationPage";
import SubjectTutorListPage from "./pages/SubjectRegistration/SubjectTutorListPage";
import TutorStudentListPage from "./pages/UpdateProgress/TutorStudentListPage";
import TutorStudentUpdatePage from "./pages/UpdateProgress/TutorStudentUpdatePage";
import UnauthorizedPage from "./pages/UnauthorizedPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/student-dashboard" element={<StudentIndexPage />} />
        <Route path="/tutor-dashboard" element={<TutorIndexPage />} />
        <Route path="/pdt-dashboard" element={<PDTIndexPage />} />
        <Route path="/faculty-dashboard" element={<FacultyIndexPage />} />
        {/* <Route path="/ctsv-dashboard" element={<CTSVIndexPage />} /> */}

        <Route path="/register-program" element={<RegisterProgramPage />} />
        <Route path="/register-subject" element={<SubjectRegistrationPage />} />
        <Route path="/register-subject/tutors" element={<SubjectTutorListPage />} />
        <Route path="/tutor/update-progress" element={<TutorStudentListPage />} />
        <Route path="/tutor/update-progress/:id" element={<TutorStudentUpdatePage />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;
