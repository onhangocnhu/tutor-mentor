import React, { useEffect, useState } from "react";
import menu_icon from "../images/menu.png";
import hcmut_logo from "../images/hcmut_logo.png";

export type SideBarOpenProps = {
  open: boolean;
  onClose: () => void;
};

const SideBarOpen: React.FC<SideBarOpenProps> = ({ open, onClose }) => {
  if (!open) return null;
  const [studentName, setStudentName] = useState<string>("");
  const [faculty, setFaculty] = useState<string>("");

  useEffect(() => {
    // read username from cookie (set at login)
    const cookie = document.cookie || "";
    let username: string | null = null;
    cookie.split(";").map(s => s.trim()).forEach(pair => {
      const [k, v] = pair.split("=");
      if (k === "username") username = decodeURIComponent(v || "");
    });
    if (!username) return;

    // fetch student info
    fetch(`http://localhost:3001/student/${encodeURIComponent(username)}`)
      .then((res) => {
        if (!res.ok) throw new Error("not found");
        return res.json();
      })
      .then((data) => {
        if (data && (data.fullName || data.name) && (data.faculty)) {
          setStudentName(data.fullName ?? data.name);
          setFaculty(data.faculty);
        }
      })
      .catch(() => {
      });
  }, []);

  const width = "min(372px, 90vw)";
  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        height: "100vh",
        width,
        zIndex: 300,
        display: "flex",
        flexDirection: "column",
        pointerEvents: "auto",
      }}
    >
      {/* header (matches topbar style) */}
      <div
        style={{
          height: 70,
          background: "#3C8DBC",
          position: "relative",
          display: "flex",
          alignItems: "center",
          paddingLeft: 48,
        }}
      >
        {/* clickable icon at top-right that closes the drawer (replaces topbar img) */}
        <img
          src={menu_icon}
          alt="close"
          onClick={onClose}
          style={{ position: "absolute", right: 12, top: 18, width: 30, height: 30, cursor: "pointer" }}
        />

        <div style={{ fontSize: 24, fontWeight: 700, color: "white" }}>bkTutor/app</div>
      </div>

      {/* body */}
      <div style={{ flex: 1, background: "#222D32", color: "white", overflowY: "auto", padding: 20 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
          <img src={hcmut_logo} alt="avatar" style={{ width: 85, height: 68, borderRadius: 6 }} />
          <div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{studentName || "Sinh viên"}</div>
            <div style={{ fontSize: 14, opacity: 0.9, marginTop: 4 }}>{faculty || "Khoa"}</div>
          </div>
        </div>

        <nav style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 12 }}>
          <button onClick={onClose} style={{ display: "flex", alignItems: "center", gap: 12, background: "transparent", border: "none", color: "rgba(255,255,255,0.5)", fontSize: 18, textAlign: "left", padding: 6, cursor: "pointer" }}>
            <img src={menu_icon} alt="icon" style={{ width: 18, height: 18 }} /> Thông tin sinh viên
          </button>
          <button onClick={onClose} style={{ display: "flex", alignItems: "center", gap: 12, background: "transparent", border: "none", color: "rgba(255,255,255,0.5)", fontSize: 18, textAlign: "left", padding: 6, cursor: "pointer" }}>
            <img src={menu_icon} alt="icon" style={{ width: 18, height: 18 }} /> Đăng ký Tutor
          </button>
          <button onClick={onClose} style={{ display: "flex", alignItems: "center", gap: 12, background: "transparent", border: "none", color: "rgba(255,255,255,0.5)", fontSize: 18, textAlign: "left", padding: 6, cursor: "pointer" }}>
            <img src={menu_icon} alt="icon" style={{ width: 18, height: 18 }} /> Cổng thư viện
          </button>
          <button onClick={onClose} style={{ display: "flex", alignItems: "center", gap: 12, background: "transparent", border: "none", color: "rgba(255,255,255,0.5)", fontSize: 18, textAlign: "left", padding: 6, cursor: "pointer" }}>
            <img src={menu_icon} alt="icon" style={{ width: 18, height: 18 }} /> Đánh giá
          </button>
        </nav>
      </div>
    </div>
  );
};

export default SideBarOpen;
