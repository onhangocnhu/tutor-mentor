import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
// import StudentIndexAfterRegister from "./pages/StudentIndexAfterRegister";
import CtsvDashboard from "./pages/Dashboard/CtsvIndexPage";
import ResultOnePage from "./pages/ViewResultCtsv/ResultOne";
import ResultAllPage from "./pages/ViewResultCtsv/ResultAll";
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
import TutorSchedule from "./pages/TutorSetSchedule/TutorSetSchedule";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword"
import ForgotPasswordOTP from "./pages/ForgotPassword/ForgotPasswordOTP"
import ResetPassword from "./pages/ForgotPassword/ResetPassword"
import SuccessfulResetPassword from "./pages/ForgotPassword/SuccessfulPasswordReset"
import { ShareDocumentSection } from "./pages/ShareDocument/ShareDocument";
import FeedbackSubjects from "./pages/Feedback/FeedbackSubjects";
import FeedbackSubjectDetail from "./pages/Feedback/FeedbackSubjectDetail";
import FeedbackSessionPage from "./pages/Feedback/FeedbackSessionPage";
import "./App.css"
import StudentProfile from "./pages/StudentProfile/StudentProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/student-profile" element={<StudentProfile />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/forgot-password-otp" element={<ForgotPasswordOTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/successful-reset-password" element={<SuccessfulResetPassword />} />

        <Route path="/student-dashboard" element={<StudentIndexPage />} />
        <Route path="/tutor-dashboard" element={<TutorIndexPage />} />
        <Route path="/pdt-dashboard" element={<PDTIndexPage />} />
        <Route path="/faculty-dashboard" element={<FacultyIndexPage />} />
        {/* <Route path="/ctsv-dashboard" element={<CTSVIndexPage />} /> */}

        <Route path="/register-program" element={<RegisterProgramPage />} />
        {/* <Route path="/student-dashboard-after" element={<StudentIndexAfterRegister />} /> */}
        <Route path="/ctsv-dashboard" element={<CtsvDashboard />} />
        <Route path="/result-one" element={<ResultOnePage />} />
        <Route path="/result-all" element={<ResultAllPage />} />
        <Route path="/register-subject" element={<SubjectRegistrationPage />} />
        <Route path="/register-subject/tutors" element={<SubjectTutorListPage />} />
        <Route path="/tutor/update-progress" element={<TutorStudentListPage />} />
        <Route path="/tutor/update-progress/:id" element={<TutorStudentUpdatePage />} />
        <Route path="/tutor/set-schedule" element={<TutorSchedule />} />

        <Route path="/library/share-document" element={<ShareDocumentSection />} />

        <Route path="/feedback" element={<FeedbackSubjects/>} />
        <Route path="/feedback/:subjectCode/:studentId/:semester" element={<FeedbackSubjectDetail />} />
        <Route path="/feedback/session/:subjectCode/:studentId/:semester/:sessionId" element={<FeedbackSessionPage />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App;
