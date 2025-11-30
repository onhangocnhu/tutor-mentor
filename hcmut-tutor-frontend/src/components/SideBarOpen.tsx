import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import menu_icon from "../images/menu.png";
import hcmut_logo from "../images/hcmut_logo.png";
import '../styles/CtsvIndexPage.css';

export type SideBarOpenProps = {
  open: boolean;
  onClose: () => void;
};

const SideBarOpen: React.FC<SideBarOpenProps> = ({ open, onClose }) => {
  const [fullName, setFullName] = useState<string>("");
  const [faculty, setFaculty] = useState<string>("");
  const [role, setRole] = useState<string | null>(null);
  const [ctsvOpen, setCtsvOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    document.cookie.split(";").forEach((cookie) => {
      const [name] = cookie.split("=");
      document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
    
    localStorage.clear();
    sessionStorage.clear();
    
    onClose();
    navigate("/");
  };

  useEffect(() => {
    if (!open) return;
    const cookie = document.cookie || "";
    let username: string | null = null;
    let cookieRole: string | null = null;
    cookie.split(";").map(s => s.trim()).forEach(pair => {
      const [k, v] = pair.split("=");
      if (k === "username") username = decodeURIComponent(v || "");
      if (k === "role") cookieRole = decodeURIComponent(v || "");
    });

    let immediateFullName: string | null = null;
    let immediateFaculty: string | null = null;

    if (cookieRole === "ctsv") {
      immediateFullName = "Phòng Công tác sinh viên";
      immediateFaculty = "Bách khoa";
    } else if (cookieRole === "pdt") {
      immediateFullName = "Phòng Đào tạo";
      immediateFaculty = "Bách khoa";
    } else if (cookieRole === "faculty") {
      immediateFullName = "Khoa Khoa học và Kỹ thuật Máy tính";
      immediateFaculty = "Bách khoa";
    }

    Promise.resolve().then(() => {
      setRole(cookieRole);
      if (immediateFullName !== null) setFullName(immediateFullName);
      if (immediateFaculty !== null) setFaculty(immediateFaculty);
    });

    if (!username) return;

    const endpoint = cookieRole === "tutor"
      ? `http://localhost:3001/tutor/${encodeURIComponent(username)}`
      : `http://localhost:3001/student/${encodeURIComponent(username)}`;

    fetch(endpoint)
      .then((res) => {
        if (!res.ok) throw new Error("not found");
        return res.json();
      })
      .then((data) => {
        if (data && (data.fullName || data.name)) {
          setFullName(data.fullName ?? data.name);
        }
        if (data) {
          if (data.faculty) setFaculty(data.faculty);
          else if (data.department) setFaculty(data.department);
        }
      })
      .catch(() => {
      });
  }, [open]);

  if (!open) return null;

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
            <div style={{ fontSize: 20, fontWeight: 700 }}>{fullName || "Người dùng"}</div>
            <div style={{ fontSize: 14, opacity: 0.9, marginTop: 4 }}>{faculty || ""}</div>
          </div>
        </div>

        <nav style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 12 }}>
          {(() => {
            type MenuItem = { label: string; path?: string };
            const menuMap: Record<string, MenuItem[]> = {
              student: [
                { label: "Thông tin sinh viên", path: "/student-profile" },
                { label: "Đăng ký Tutor", path: "/register-subject" },
                { label: "Cổng thư viện", path: "/library" },
                { label: "Đánh giá", path: "/feedback" },
              ],
              tutor: [
                { label: "Thông tin cá nhân", path: "/tutor-profile" },
                { label: "Thiết lập lịch rảnh", path: "/tutor/set-schedule" },
                { label: "Quản lý buổi gặp", path: "/tutor-sessions" },
                { label: "Cổng thư viện", path: "/library" },
                { label: "Ghi nhận", path: "/tutor/update-progress" },
              ],
              pdt: [
                { label: "Báo cáo tổng quan", path: "/view-reports" },
                { label: "Cổng thư viện", path: "/library" },
              ],
              faculty: [
                { label: "Dữ liệu đánh giá", path: "/faculty-reviews" },
                { label: "Cổng thư viện", path: "/library" },
              ],
              ctsv: [
                { label: "Cổng thư viện", path: "/library" },
              ],
            };

            if (!role) return null;

            if (role === "ctsv") {
              const items = menuMap.ctsv || [];
              return (
                <>
                  <div
                    className="sidebar-item toggle"
                    onClick={() => setCtsvOpen(s => !s)}
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <img src={menu_icon} alt="icon" style={{ width: 18, height: 18 }} />
                    <span style={{ display: "flex", alignItems: "center", gap: 12, background: "transparent", border: "none", color: "rgba(255,255,255,0.85)", fontSize: 18, textAlign: "left", padding: 6, cursor: "pointer" }}>Kết quả tham gia chương trình</span>
                    <span className={`chevron ${ctsvOpen ? "open" : ""}`}>▶</span>
                  </div>

                  {ctsvOpen && (
                    <div className="submenu">
                      <div className="submenu-item" onClick={() => { onClose(); navigate("/result-one"); }}>
                        Kết quả tham gia của 1 sinh viên
                      </div>
                      <div className="submenu-item" onClick={() => { onClose(); navigate("/result-all"); }}>
                        Kết quả tham gia của tất cả sinh viên
                      </div>
                    </div>
                  )}

                  {items.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        onClose();
                        if (item.path) {
                          navigate(item.path);
                        }
                      }}
                      style={{ display: "flex", alignItems: "center", gap: 12, background: "transparent", border: "none", color: "rgba(255,255,255,0.85)", fontSize: 18, textAlign: "left", padding: 6, cursor: "pointer" }}
                    >
                      <img src={menu_icon} alt="icon" style={{ width: 18, height: 18 }} /> {item.label}
                    </button>
                  ))}
                </>
              );
            }

            const items = menuMap[role] ?? [];
            return items.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  onClose();
                  if (item.path) {
                    navigate(item.path);
                  }
                }}
                style={{ display: "flex", alignItems: "center", gap: 12, background: "transparent", border: "none", color: "rgba(255,255,255,0.85)", fontSize: 18, textAlign: "left", padding: 6, cursor: "pointer" }}
              >
                <img src={menu_icon} alt="icon" style={{ width: 18, height: 18 }} /> {item.label}
              </button>
            ));
          })()}

          {/* Logout button */}
          <div style={{ marginTop: 20, borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: 16 }}>
            <button
              onClick={handleLogout}
              style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 12, 
                background: "transparent", 
                border: "none", 
                color: "#ff6b6b", 
                fontSize: 18, 
                textAlign: "left", 
                padding: 6, 
                cursor: "pointer",
                width: "100%"
              }}
            >
              <svg 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Đăng xuất
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default SideBarOpen;
