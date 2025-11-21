import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import hcmut_logo from "../images/hcmut_logo.png"
import edit_icon from "../images/edit.svg";
import checkbox_none from "../images/checkbox-none.svg";
import checkbox_true from "../images/checkbox-true.svg";
import error_icon from "../images/error.svg";
import done_icon from "../images/done-register.svg";
import menu_icon from "../images/menu.png";


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
  const [termsOpen, setTermsOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [faculty, setFaculty] = useState("");
  const [classCode, setClassCode] = useState("");
  const [email, setEmail] = useState("");
  const [degree, setDegree] = useState("");
  const [trainingSystem, setTrainingSystem] = useState("");
  const [year, setYear] = useState("");
  const [registered, setRegistered] = useState(false); // <-- new
  const navigate = useNavigate(); // <-- new
  const [agreed, setAgreed] = useState(false); // <-- new: checkbox state
  const [showAgreeError, setShowAgreeError] = useState(false); // <-- existing
  const [errorFading, setErrorFading] = useState(false); // <-- new: controls opacity fade

  const fadeTimerRef = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);
  const navTimerRef = useRef<number | null>(null); // <-- new: navigation timer

  // helper to show error then auto-fade and hide
  const triggerAgreeError = () => {
    // clear any existing timers
    if (fadeTimerRef.current) window.clearTimeout(fadeTimerRef.current);
    if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);

    setErrorFading(false);
    setShowAgreeError(true);

    // start fade at 3.5s
    fadeTimerRef.current = window.setTimeout(() => {
      setErrorFading(true);
    }, 3500);

    // hide completely at 4s
    hideTimerRef.current = window.setTimeout(() => {
      setShowAgreeError(false);
      setErrorFading(false);
      fadeTimerRef.current = null;
      hideTimerRef.current = null;
    }, 4000);
  };

  // cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (fadeTimerRef.current) window.clearTimeout(fadeTimerRef.current);
      if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
      if (navTimerRef.current) window.clearTimeout(navTimerRef.current);
    };
  }, []);

  // when registration completed, wait 4s then navigate to the "after register" page
  useEffect(() => {
    if (!registered) return;
    // clear existing nav timer if any
    if (navTimerRef.current) window.clearTimeout(navTimerRef.current);
    navTimerRef.current = window.setTimeout(() => {
      navigate("/student-dashboard-after");
    }, 2000);

    return () => {
      if (navTimerRef.current) {
        window.clearTimeout(navTimerRef.current);
        navTimerRef.current = null;
      }
    };
  }, [registered, navigate]);

  const inputStyle: React.CSSProperties = {
    marginTop: 6,
    height: 34, // adjusted for more balanced appearance
    background: "#EEEEEE",
    border: "1px solid #D2D6DE",
    display: "flex",
    alignItems: "center",
    paddingLeft: 9,
    color: "#333",
    fontSize: 16,
    outline: "none",
  };

  return (
    <div
      style={{
        width: 1440,
        height: 1024,
        position: "relative",
        background: "#ECF0F5",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: 1440,
          height: 70,
          left: 0,
          top: 0,
          position: "absolute",
          background: "#3C8DBC",
        }}
      />
      <div
        style={{
          width: 70,
          height: 70,
          left: 0,
          top: 0,
          position: "absolute",
          background: "#367FA9",
        }}
      />
      <div
        style={{
          width: 117,
          height: 29,
          left: -24,
          top: 20,
          position: "absolute",
          textAlign: "center",
          justifyContent: "center",
          display: "flex",
          alignItems: "center",
          color: "white",
          fontSize: 24,
          fontWeight: 700,
        }}
      >
        Bk
      </div>

      {/* menu icon placed to the right of "Bk" (not sidebar) */}
      <div
        style={{
          position: "absolute",
          left: 90, // just to the right of the Bk block
          top: 20,
          height: 29,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 10,
        }}
        role="button"
        aria-label="menu"
      >
        <img src={menu_icon} alt="menu" style={{ width: 24, height: 24 }} />
      </div>

      <div
        style={{
          width: 70,
          height: 954,
          left: 0.02,
          top: 70,
          position: "absolute",
          background: "#222D32",
        }}
      />

      <img
        src={hcmut_logo}
        alt="logo"
        style={{ width: 65, height: 50, left: 2, top: 82, position: "absolute" }}
      />

      <div
        style={{
          width: 385,
          height: 38,
          left: 93,
          top: 112,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          color: "black",
          fontSize: 36,
          fontWeight: 700,
        }}
      >
        Hệ thống hỗ trợ Tutor
      </div>

      <div
        style={{
          width: 2,
          height: 814,
          left: 124,
          top: 211,
          position: "absolute",
          background: "#D9D9D9",
        }}
      />

      <div
        style={{
          width: 242,
          height: 43,
          left: 91,
          top: 172,
          position: "absolute",
          background: "#0073B7",
        }}
      />
      <div
        style={{
          width: 238,
          height: 47,
          left: 93,
          top: 170,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: 15,
          fontWeight: 900,
        }}
      >
        Đăng ký tham gia chương trình
      </div>

      {/* blue circular edit button */}
      <div
        style={{
          width: 45,
          height: 45,
          left: 102,
          top: 241,
          position: "absolute",
          background: "#0073B7",
          borderRadius: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <img src={edit_icon} alt="edit" style={{ width: 20, height: 20 }} />
      </div>

      {/* main white card (form) */}
      <div
        style={{
          width: 1243,
          height: 380,
          left: 165,
          top: 241,
          position: "absolute",
          background: "white",
          boxSizing: "border-box",
          padding: 20,
          // removed blur/opacity/pointerEvents — replaced by overlay element below
        }}
      >
        {/* Header inside white card */}
        <div
          style={{
            width: 476,
            height: 51,
            left: 20,
            top: 11,
            position: "absolute",
            display: "flex",
            alignItems: "center",
            color: "black",
            fontSize: 20,
            fontWeight: 800,
          }}
        >
          Kiểm tra thông tin cá nhân
        </div>

        {/* Row 1 - editable inputs */}
        <div style={{ position: "absolute", left: 20, top: 70, display: "flex", gap: 20 }}>
          <div style={{ width: 320, height: 65 }}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>Họ và tên</div>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nguyễn Văn A"
              style={inputStyle}
            />
          </div>

          <div style={{ width: 260, height: 64 }}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>Mã sinh viên</div>
            <input
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="2312XXX"
              style={{ ...inputStyle, height: 34 }}
            />
          </div>

          <div style={{ width: 260, height: 64 }}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>Khoa/TT Đào tạo</div>
            <input
              value={faculty}
              onChange={(e) => setFaculty(e.target.value)}
              placeholder="KH&KT Máy tính"
              style={{ ...inputStyle, height: 34 }}
            />
          </div>

          <div style={{ width: 260, height: 64 }}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>Mã lớp</div>
            <input
              value={classCode}
              onChange={(e) => setClassCode(e.target.value)}
              placeholder="MT23KHMX"
              style={{ ...inputStyle, height: 34 }}
            />
          </div>
        </div>

        {/* Row 2 - editable inputs */}
        <div style={{ position: "absolute", left: 20, top: 170, display: "flex", gap: 20 }}>
          <div style={{ width: 320, height: 65 }}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>Email sinh viên</div>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nguyenvana@hcmut.edu.vn"
              style={inputStyle}
            />
          </div>

          <div style={{ width: 260, height: 64 }}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>Bậc học</div>
            <input
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              placeholder="Ví dụ: Đại học"
              style={{ ...inputStyle, height: 34 }}
            />
          </div>

          <div style={{ width: 260, height: 64 }}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>Hệ đào tạo</div>
            <input
              value={trainingSystem}
              onChange={(e) => setTrainingSystem(e.target.value)}
              placeholder="Chính quy"
              style={{ ...inputStyle, height: 34 }}
            />
          </div>

          <div style={{ width: 260, height: 64 }}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>Năm CTĐT</div>
            <input
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="2023"
              style={{ ...inputStyle, height: 34 }}
            />
          </div>
        </div>

        {/* Bottom actions */}
        <div style={{ position: "absolute", right: 20, bottom: 20, display: "flex", gap: 12 }}>
          <div style={{ width: 100, height: 40, background: "rgba(68,68,68,0.18)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <span style={{ fontWeight: 800 }}>Hủy</span>
          </div>
          <div
            onClick={() => {
              if (!agreed) {
                triggerAgreeError(); // use auto-hide + fade
                return;
              }
              setRegistered(true);
            }}
            style={{ width: 100, height: 40, background: "#0073B7", display: "flex", alignItems: "center", justifyContent: "center", color: "white", cursor: "pointer" }}
          >
            <span style={{ fontWeight: 800 }}>Đăng ký</span>
          </div>
        </div>
      </div>

      {/* Overlay gray-out the form area (covers form to simulate "grayed" look and blocks interaction) */}
      {registered && (
        <div
          style={{
            position: "absolute",
            left: 165,
            top: 241,
            width: 1243,
            height: 380,
            background: "rgba(209, 217, 221, 0.75)", // gray overlay
            zIndex: 5,
          }}
        />
      )}

      {/* Agreement block */}
      <div style={{ width: 622, height: 32, left: 205, top: 523, position: "absolute" }}>
        <div style={{ position: "absolute", left: 27, top: 0, color: "black", fontSize: 14, fontWeight: 300 }}>
          Tôi đã đọc kỹ và đồng ý với
        </div>
        <div style={{ position: "absolute", left: 209, top: 1, display: "flex", gap: 6 }}>
          <span
            onClick={() => setTermsOpen(true)}
            style={{ fontWeight: 700, textDecoration: "underline", cursor: "pointer" }}
          >
            Điều khoản sử dụng
          </span>
          <span style={{ fontWeight: 300, textDecoration: "underline", cursor: "pointer" }} onClick={() => setTermsOpen(true)}>
            và
          </span>
          <span
            onClick={() => setTermsOpen(true)}
            style={{ fontWeight: 700, textDecoration: "underline", cursor: "pointer" }}
          >
            Chính sách bảo mật
          </span>
        </div>
        {/* clickable checkbox image */}
        <img
          src={agreed ? checkbox_true : checkbox_none}
          alt={agreed ? "checked" : "unchecked"}
          onClick={() => {
            const next = !agreed;
            setAgreed(next);
            if (next) setShowAgreeError(false); // hide error once user agrees
          }}
          style={{
            position: "absolute",
            left: 4,
            top: 7,
            width: 18,
            height: 18,
            cursor: "pointer",
          }}
        />
      </div>

      {/* render modal */}
      <TermsModal open={termsOpen} onClose={() => setTermsOpen(false)} />

      {/* Confirmation block shown after register */}
      {registered && (
        <div
          style={{
            width: 1243,
            height: 326,
            left: 165,
            top: 641,
            position: "absolute",
            background: "white",
            boxSizing: "border-box",
            padding: 24,
            paddingTop: 64, // ensure space for the header
            display: "flex",
            alignItems: "center",
            justifyContent: "center", // center main content horizontally
            gap: 24,
            zIndex: 6, // above overlay
          }}
        >
          {/* header at top-left (like the form header) */}
          <div
            style={{
              width: 476,
              height: 51,
              left: 20,
              top: 11,
              position: "absolute",
              display: "flex",
              alignItems: "center",
              color: "black",
              fontSize: 20,
              fontWeight: 800,
            }}
          >
            Xác nhận đơn đăng ký
          </div>

          {/* center: image with text under it */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 300, gap: 12 }}>
            <img style={{ width: 133, height: 133 }} src={done_icon} alt="confirm" />
            <div style={{ fontSize: 16, fontWeight: 800, color: "black" }}>Đăng ký thành công</div>
            <div style={{ fontSize: 13, fontWeight: 300, color: "black", textAlign: "center", maxWidth: 300 }}>
              Tài khoản của bạn đã được kích hoạt và sẵn sàng sử dụng. Bạn có thể truy cập và trải nghiệm đầy đủ các chức năng mà hệ thống cung cấp.
            </div>
          </div>

          {/* removed spacer so content is centered */}
        </div>
      )}

      {/* error alert shown when user clicks Đăng ký without agreeing (auto-fade after 4s) */}
      {showAgreeError && (
        <div
          style={{
            position: "absolute",
            right: 20,
            top: 74, // slightly below top bar
            zIndex: 60,
            opacity: errorFading ? 0 : 1,
            transition: "opacity 0.5s ease",
            pointerEvents: "none",
          }}
        >
          <div style={{ width: 598, height: 79, position: "relative" }}>
            <div
              style={{
                width: 630,
                height: 79,
                left: 0,
                top: 0,
                position: "absolute",
                background: "rgba(213,1,1,0.20)", // corrected redish background
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: 520,
                  // center vertically inside the 79px container
                  position: "absolute",
                  left: 73,
                  top: "50%",
                  transform: "translateY(-50%)",
                  display: "flex",
                  alignItems: "center",
                  paddingRight: 8,
                }}
              >
                <span style={{ color: "#D50100", fontSize: 20, fontWeight: 400, lineHeight: 1.1 }}>
                  Lỗi: Vui lòng đồng ý với <strong style={{ whiteSpace: "nowrap", color: "#D50100", fontWeight: 700 }}>Điều khoản sử dụng và Chính sách bảo mật</strong> trước khi nhấn Đăng ký.
                </span>
              </div>
            </div>
            <img src={error_icon} alt="error" style={{ width: 79, height: 79, left: 3, top: 0, position: "absolute" }} />
          </div>
        </div>
      )}

    </div>
  );
};

export default RegisterProgramPage;