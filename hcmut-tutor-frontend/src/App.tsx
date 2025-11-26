import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import StudentIndexPage from "./pages/StudentIndexPage";
import RegisterProgramPage from "./pages/RegisterProgramPage";
import StudentIndexAfterRegister from "./pages/StudentIndexAfterRegister";
import {ShareDocumentSection} from "./pages/ShareDocument/ShareDocument.tsx";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/student-dashboard" element={<StudentIndexPage />} />
        <Route path="/register-program" element={<RegisterProgramPage />} />
        <Route path="/student-dashboard-after" element={<StudentIndexAfterRegister />} />
        <Route path="/library/share-document" element={<ShareDocumentSection />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
