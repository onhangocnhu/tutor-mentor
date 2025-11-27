import { useState, useEffect } from "react";
import home_icon from "../../images/Home.svg";
import error_icon from "../../images/error.svg";
import "../../styles/IndexPage.css";
import "../../styles/SubjectRegistrationPage.css";
import { useNavigate } from "react-router-dom";
import SidebarRail from "../../components/SidebarRail";
import SideBarOpen from "../../components/SideBarOpen";
import TopBar from "../../components/TopBar";

export default function SubjectRegistrationPage() {
  // 2. Thêm state để quản lý ẩn/hiện lỗi
  const [showError] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState<{ code: string; name: string }[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>(() => {
    try {
      return localStorage.getItem("selectedSubject") || "";
    } catch {
      return "";
    }
  });

  useEffect(() => {
    const cookieRole = document.cookie
      .split(";")
      .map((s) => s.trim())
      .find((s) => s.startsWith("role="))
      ? document.cookie
        .split(";")
        .map((s) => s.trim())
        .find((s) => s.startsWith("role="))!
        .split("=")[1]
      : null;

    if (!cookieRole || decodeURIComponent(cookieRole) !== "student") {
      navigate("/unauthorized");
    }
  }, [navigate]);

  useEffect(() => {
    fetch("http://localhost:3001/subjects")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setSubjects(data);
        else if (data && Array.isArray((data as any).subjects)) setSubjects((data as any).subjects);
        else setSubjects([]);
      })
      .catch(() => setSubjects([]));
  }, []);

  // persist selection to localStorage whenever it changes
  useEffect(() => {
    try {
      if (selectedSubject) localStorage.setItem("selectedSubject", selectedSubject);
      else localStorage.removeItem("selectedSubject");
    } catch {
      /* ignore storage errors */
    }
  }, [selectedSubject]);

  const handleSearch = () => {
    // ensure localStorage is in sync (in case user didn't trigger change)
    try { if (selectedSubject) localStorage.setItem("selectedSubject", selectedSubject); } catch { }
    const url = selectedSubject
      ? `/register-subject/tutors?subject=${encodeURIComponent(selectedSubject)}`
      : "/register-subject/tutors";
    navigate(url);
  };

  return (
    <div className="page-outer">
      <div className="page-inner">
        <div className="student-page">
          {menuOpen && (
            <div
              onClick={() => setMenuOpen(false)}
              style={{
                position: "fixed",
                left: 0,
                top: 0,
                width: "100vw",
                height: "100vh",
                background: "rgba(0, 0, 0, 0.5)",
                zIndex: 202, // below SideBarOpen (300) and above topbar (200)
              }}
            />
          )}
          <SidebarRail wrapperClass="sidebar" imgClass="sidebar-avatar" />

          <SideBarOpen open={menuOpen} onClose={() => setMenuOpen(false)} />

          {/* HEADER (using TopBar component) */}
          <TopBar
            menuOpen={menuOpen}
            onMenuClick={() => setMenuOpen(true)}
            onLogoClick={() => navigate("/tutor-dashboard")}
          />

          <main className="content">
            <div className="home-title">Dịch vụ đăng ký Tutor</div>

            <div className="breadcrumb-row">
              <div className="breadcrumb">
                <img className="home-logo" src={home_icon} alt="home" />
                BKTutorPortal &gt; Đăng ký bộ môn
              </div>
            </div>

            {/* --- 3. KHỐI THÔNG BÁO LỖI (Hiển thị khi showError = true) --- */}
            {showError && (
              <div className="error-modal">
                <img src={error_icon} alt="error" className="error-icon" />
                <div className="error-content">
                  <span className="error-title">Error:</span>
                  <span className="error-message"> Không tìm thấy tutor!!!</span>
                </div>
              </div>
            )}

            <div className="register-subject-card">
              <h2 className="card-title">Đăng ký bộ môn</h2>
              <div className="divider"></div>

              <div className="form-group">
                <label className="form-label">Môn học</label>
                <div className="select-wrapper">
                  <select className="form-select" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
                    <option value="">Chọn môn học...</option>
                    {subjects.map((s) => (
                      <option key={s.code} value={s.code}>{s.name} ({s.code})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Gắn hàm handleSearch vào nút bấm */}
              <button className="search-btn" onClick={handleSearch}>
                Tìm kiếm
              </button>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}

