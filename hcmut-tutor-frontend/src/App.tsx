import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import StudentIndexPage from "./pages/Dashboard/StudentIndexPage";
import RegisterProgramPage from "./pages/RegisterProgram/RegisterProgramPage";
import PDTIndexPage from "./pages/Dashboard/PDTIndexPage";
import FacultyIndexPage from "./pages/Dashboard/FacultyIndexPage";

import SubjectRegistrationPage from "./pages/SubjectRegistration/SubjectRegistrationPage";
import SubjectTutorListPage from "./pages/SubjectRegistration/SubjectTutorListPage";

import TutorIndexPage from "./pages/Dashboard/TutorIndexPage";
import TutorStudentListPage from "./pages/UpdateProgress/TutorStudentListPage";
import TutorStudentUpdatePage from "./pages/UpdateProgress/TutorStudentUpdatePage";
import TutorSchedule from "./pages/TutorSetSchedule/TutorSetSchedule";

import UnauthorizedPage from "./pages/UnauthorizedPage";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword"
import ForgotPasswordOTP from "./pages/ForgotPassword/ForgotPasswordOTP"
import ResetPassword from "./pages/ForgotPassword/ResetPassword"
import SuccessfulResetPassword from "./pages/ForgotPassword/SuccessfulPasswordReset"
import { ShareDocumentSection } from "./pages/ShareDocument/ShareDocument";

import StudentProfile from "./pages/Profile/StudentProfile";
import ViewReport from "./pages/ViewReport/ViewReportPage";
import StudentReviewsPage from "./pages/ViewReport/StudentReviewsPage";
import TutorReviewsPage from "./pages/ViewReport/TutorReviewsPage";
import StudentReviewsSearch from "./pages/ViewReport/StudentReviewsSearch";
import TutorReviewsSearch from "./pages/ViewReport/TutorReviewsSearch";
import TutorProfile from "./pages/Profile/TutorProfile";

import EditSessionPage from "./pages/Sessions/EditSessionPage";
import SessionListPage from "./pages/Sessions/SessionListPage";
import NewSessionPage from "./pages/Sessions/NewSessionPage";
import "./App.css"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/forgot-password-otp" element={<ForgotPasswordOTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/successful-reset-password" element={<SuccessfulResetPassword />} />

        <Route path="/student-dashboard" element={<StudentIndexPage />} />
        <Route path="/tutor-dashboard" element={<TutorIndexPage />} />
        <Route path="/pdt-dashboard" element={<PDTIndexPage />} />
        <Route path="/faculty-dashboard" element={<FacultyIndexPage />} />
        {/* <Route path="/ctsv-dashboard" element={<CTSVIndexPage />} /> */}

        <Route path="/student-profile" element={<StudentProfile />} />
        <Route path="/tutor-profile" element={<TutorProfile />} />

        <Route path="/register-program" element={<RegisterProgramPage />} />
        <Route path="/register-subject" element={<SubjectRegistrationPage />} />
        <Route path="/register-subject/tutors" element={<SubjectTutorListPage />} />

        <Route path="/tutor/update-progress" element={<TutorStudentListPage />} />
        <Route path="/tutor/update-progress/:id" element={<TutorStudentUpdatePage />} />
        <Route path="/tutor/set-schedule" element={<TutorSchedule />} />
        <Route path="/tutor-sessions" element={<SessionListPage />} />
        <Route path="/tutor-sessions/:id" element={<EditSessionPage />} />
        <Route path="/tutor-sessions/new" element={<NewSessionPage />} />

        <Route path="/view-reports" element={<ViewReport />} />
        <Route path="/student-reviews" element={<StudentReviewsPage />} />
        <Route path="/student-reviews/search" element={<StudentReviewsSearch />} />
        <Route path="/tutor-reviews" element={<TutorReviewsPage />} />
        <Route path="/tutor-reviews/search" element={<TutorReviewsSearch />} />


        <Route path="/library/share-document" element={<ShareDocumentSection />} />


      </Routes>
    </BrowserRouter>
  )
}

export default App;
