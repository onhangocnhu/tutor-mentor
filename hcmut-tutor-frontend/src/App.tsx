import { BrowserRouter, Routes, Route } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import StudentIndexPage from "./pages/StudentIndexPage"
import RegisterProgramPage from "./pages/RegisterProgramPage"
import StudentIndexAfterRegister from "./pages/StudentIndexAfterRegister"

import ForgotPassword from "./pages/ForgotPassword/ForgotPassword"
import ForgotPasswordOTP from "./pages/ForgotPassword/ForgotPasswordOTP"
import ResetPassword from "./pages/ForgotPassword/ResetPassword"
import SuccessfulResetPassword from "./pages/ForgotPassword/SuccessfulPasswordReset"

import "./App.css"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/forgot-password-otp" element={<ForgotPasswordOTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/successful-reset-password" element={<SuccessfulResetPassword />} />
        
        <Route path="/student-dashboard" element={<StudentIndexPage />} />
        <Route path="/register-program" element={<RegisterProgramPage />} />
        <Route path="/student-dashboard-after" element={<StudentIndexAfterRegister />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
