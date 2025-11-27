import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import edit_icon from "../../images/edit.svg";
import checkbox_none from "../../images/checkbox-none.svg";
import checkbox_true from "../../images/checkbox-true.svg";
import error_icon from "../../images/error.svg";
import done_icon from "../../images/done-register.svg";
import SideBarOpen from "../../components/SideBarOpen";
import SidebarRail from "../../components/SidebarRail";
import TopBar from "../../components/TopBar";
import "../../styles/RegisterProgramPage.css";


const TermsModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 1120,
          height: 750,
          position: "relative",
          background: "white",
          overflow: "hidden",
          borderRadius: 6,
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
        }}
      >
        {/* header */}
        <div style={{ width: "100%", height: 124, top: 0, left: 0, position: "absolute", background: "white", display: "flex", alignItems: "center", paddingLeft: 36 }}>
          <div style={{ fontSize: 40, fontWeight: 700 }}>
            Điều khoản sử dụng & Chính sách bảo mật
          </div>
        </div>

        {/* content area */}
        <div style={{ position: "absolute", left: 71, top: 124, width: 977, height: 537, overflow: "auto" }}>
          <div style={{ width: 919, marginLeft: 22, background: "rgba(217,217,217,0.11)", padding: 16, borderRadius: 6 }}>
            {/* replicate multiple placeholder lines like the design */}
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} style={{ height: 14, background: "rgba(0,0,0,0.20)", borderRadius: 4, marginBottom: 12 }} />
            ))}
          </div>
        </div>

        {/* footer / exit button */}
        <div style={{ position: "absolute", right: 36, bottom: 36, display: "flex", gap: 12 }}>
          <button
            onClick={onClose}
            style={{
              width: 100,
              height: 40,
              background: "rgba(68,68,68,0.18)",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              fontWeight: 800,
            }}
          >
            Thoát
          </button>
        </div>
      </div>
    </div>
  );
};


const RegisterProgramPage: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [faculty, setFaculty] = useState("");
  const [classCode, setClassCode] = useState("");
  const [email, setEmail] = useState("");
  const [degree, setDegree] = useState("");
  const [trainingSystem, setTrainingSystem] = useState("");
  const [year, setYear] = useState("");
  const [registered, setRegistered] = useState(false);
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);
  const [showAgreeError, setShowAgreeError] = useState(false);
  const [errorFading, setErrorFading] = useState(false);

  const fadeTimerRef = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);
  const navTimerRef = useRef<number | null>(null);

  // load current student info from backend and populate the form values (read-only)
  useEffect(() => {
    const loadStudent = async () => {
      try {
        const res = await fetch("http://localhost:3001/current-student", { credentials: "include" });
        if (!res.ok) return;
        const data = await res.json();
        setFullName(data.fullName ?? data.name ?? "");
        setStudentId(data.studentId ?? data.id ?? "");
        setFaculty(data.faculty ?? "");
        setClassCode(data.classCode ?? data.class ?? "");
        setEmail(data.email ?? "");
        setDegree(data.degree ?? "");
        setTrainingSystem(data.trainingSystem ?? data.training_system ?? "");
        setYear(String(data.year ?? data.graduationYear ?? ""));
      } catch (e) {
      }
    };
    loadStudent();
  }, []);

  const triggerAgreeError = () => {
    if (fadeTimerRef.current) window.clearTimeout(fadeTimerRef.current);
    if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);

    setErrorFading(false);
    setShowAgreeError(true);

    fadeTimerRef.current = window.setTimeout(() => {
      setErrorFading(true);
    }, 3500);

    hideTimerRef.current = window.setTimeout(() => {
      setShowAgreeError(false);
      setErrorFading(false);
      fadeTimerRef.current = null;
      hideTimerRef.current = null;
    }, 4000);
  };

  useEffect(() => {
    return () => {
      if (fadeTimerRef.current) window.clearTimeout(fadeTimerRef.current);
      if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
      if (navTimerRef.current) window.clearTimeout(navTimerRef.current);
    };
  }, []);

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
      // go to centralized unauthorized page
      navigate("/unauthorized");
    }
  }, [navigate]);

  useEffect(() => {
    if (!registered) return;
    try {
      localStorage.setItem("programRegistered", "true");
    } catch (e) {
    }
    document.cookie = `programRegistered=true; path=/; max-age=${60 * 60 * 24 * 365}`;

    if (navTimerRef.current) window.clearTimeout(navTimerRef.current);
    navTimerRef.current = window.setTimeout(() => {
      navigate("/student-dashboard");
    }, 2000);

    return () => {
      if (navTimerRef.current) {
        window.clearTimeout(navTimerRef.current);
        navTimerRef.current = null;
      }
    };
  }, [registered, navigate]);

  return (
    <div className="register-page">
      <TopBar onLogoClick={() => navigate("/student-dashboard")} menuOpen={menuOpen} onMenuClick={() => setMenuOpen(true)} />

      {menuOpen && <div className="register-drawer-overlay" onClick={() => setMenuOpen(false)} />}

      {/* drawer component */}
      <SideBarOpen open={menuOpen} onClose={() => setMenuOpen(false)} />
      <SidebarRail wrapperClass="register-sidebar-rail" imgClass="sidebar-avatar" />

      <div className="register-main-title">Hệ thống hỗ trợ Tutor</div>
      <div className="register-vertical-divider" />
      <div className="register-ribbon" />
      <div className="register-ribbon-text">Đăng ký tham gia chương trình</div>
      <div className="register-edit-circle"><img src={edit_icon} alt="edit" style={{ width: 20, height: 20 }} /></div>

      {/* main white card (form) */}
      <div className="register-form-card">
        <div className="register-form-card-header">Kiểm tra thông tin cá nhân</div>

        <div className="register-form-row row-1">
          <div className="register-input-wrap">
            <div className="register-input-label">Họ và tên</div>
            <input className="register-input" value={fullName} readOnly placeholder={fullName} />
          </div>
          <div className="register-input-wrap">
            <div className="register-input-label">Mã sinh viên</div>
            <input className="register-input" value={studentId} readOnly placeholder={studentId} />
          </div>
          <div className="register-input-wrap">
            <div className="register-input-label">Khoa/TT Đào tạo</div>
            <input className="register-input" value={faculty} readOnly placeholder={faculty} />
          </div>
          <div className="register-input-wrap">
            <div className="register-input-label">Mã lớp</div>
            <input className="register-input" value={classCode} readOnly placeholder={classCode} />
          </div>
        </div>

        <div className="register-form-row row-2">
          <div className="register-input-wrap">
            <div className="register-input-label">Email sinh viên</div>
            <input className="register-input" value={email} readOnly placeholder={email} />
          </div>
          <div className="register-input-wrap">
            <div className="register-input-label">Bậc học</div>
            <input className="register-input" value={degree} readOnly placeholder={degree} />
          </div>
          <div className="register-input-wrap">
            <div className="register-input-label">Hệ đào tạo</div>
            <input className="register-input" value={trainingSystem} readOnly placeholder={trainingSystem} />
          </div>
          <div className="register-input-wrap">
            <div className="register-input-label">Năm CTĐT</div>
            <input className="register-input" value={year} readOnly placeholder={year} />
          </div>
        </div>

        <div className="register-actions">
          <div className="register-btn-cancel" onClick={() => navigate('/student-dashboard')}><span style={{ fontWeight: 800 }}>Hủy</span></div>
          <div className="register-btn-submit" onClick={() => { if (!agreed) { triggerAgreeError(); return; } setRegistered(true); }}><span style={{ fontWeight: 800 }}>Đăng ký</span></div>
        </div>
      </div>

      {registered && <div className="register-form-overlay" />}

      {/* Agreement block */}
      <div className="register-agreement">
        <div className="text-left">Tôi đã đọc kỹ và đồng ý với</div>
        <div className="links">
          <span onClick={() => setTermsOpen(true)} style={{ fontWeight: 700, textDecoration: "underline", cursor: "pointer" }}>Điều khoản sử dụng</span>
          <span onClick={() => setTermsOpen(true)} style={{ fontWeight: 300, textDecoration: "underline", cursor: "pointer" }}>và</span>
          <span onClick={() => setTermsOpen(true)} style={{ fontWeight: 700, textDecoration: "underline", cursor: "pointer" }}>Chính sách bảo mật</span>
        </div>
        <img className="register-checkbox" src={agreed ? checkbox_true : checkbox_none} alt={agreed ? "checked" : "unchecked"} onClick={() => { const next = !agreed; setAgreed(next); if (next) setShowAgreeError(false); }} />
      </div>

      {/* render modal */}
      <TermsModal open={termsOpen} onClose={() => setTermsOpen(false)} />

      {/* Confirmation block shown after register */}
      {registered && (
        <div className="register-confirm">
          <div className="confirm-header">Xác nhận đơn đăng ký</div>
          <div className="confirm-center">
            <img style={{ width: 133, height: 133 }} src={done_icon} alt="confirm" />
            <div style={{ fontSize: 16, fontWeight: 800, color: "black" }}>Đăng ký thành công</div>
            <div style={{ fontSize: 13, fontWeight: 300, color: "black", textAlign: "center", maxWidth: 300 }}>
              Tài khoản của bạn đã được kích hoạt và sẵn sàng sử dụng. Bạn có thể truy cập và trải nghiệm đầy đủ các chức năng mà hệ thống cung cấp.
            </div>
          </div>
        </div>
      )}

      {/* error alert shown when user clicks Đăng ký without agreeing (auto-fade after 4s) */}
      {/* {showAgreeError && (
        // <div className={`register-error-alert ${errorFading ? "fading" : ""}`} >
        <div className={`register-error-alert ${errorFading ? "fading" : ""}`} >
          <div className="box">
            <div className="text-wrap">
              Lỗi: Vui lòng đồng ý với <strong style={{ whiteSpace: "nowrap", color: "#D50100", fontWeight: 700 }}>Điều khoản sử dụng và Chính sách bảo mật</strong> trước khi nhấn Đăng ký.
            </div>
          </div>
          <img src={error_icon} alt="error" />
        </div>
      )} */}

      {showAgreeError && (
        <div className={`register-error-alert ${errorFading ? "fading" : ""}`}>
          <img src={error_icon} alt="error" style={{ width: 32, height: 32 }} />

          <div className="text-wrap">
            Lỗi: Vui lòng đồng ý với{" "}
            <strong style={{ whiteSpace: "nowrap", color: "#D50100", fontWeight: 700 }}>
              Điều khoản sử dụng và Chính sách bảo mật
            </strong>{" "}
            trước khi nhấn Đăng ký.
          </div>
        </div>
      )}

    </div>
  );
};

export default RegisterProgramPage;