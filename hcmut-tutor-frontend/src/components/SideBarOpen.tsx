import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import menu_icon from "../images/menu.png";
import hcmut_logo from "../images/hcmut_logo.png";

export type SideBarOpenProps = {
  open: boolean;
  onClose: () => void;
};

const SideBarOpen: React.FC<SideBarOpenProps> = ({ open, onClose }) => {
  if (!open) return null;
  const [fullName, setFullName] = useState<string>("");
  const [faculty, setFaculty] = useState<string>("");
  const [role, setRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // read username and role from cookie (set at login)
    const cookie = document.cookie || "";
    let username: string | null = null;
    let cookieRole: string | null = null;
    cookie.split(";").map(s => s.trim()).forEach(pair => {
      const [k, v] = pair.split("=");
      if (k === "username") username = decodeURIComponent(v || "");
      if (k === "role") cookieRole = decodeURIComponent(v || "");
    });

    setRole(cookieRole);

    if (cookieRole === "ctsv") {
      setFullName("Phòng Công tác sinh viên");
      setFaculty("Bách khoa");
      return;
    }
    if (cookieRole === "pdt") {
      setFullName("Phòng Đào tạo");
      setFaculty("Bách khoa");
      return;
    }
    if (cookieRole === "faculty") {
      setFullName("Khoa Khoa học và Kỹ thuật Máy tính");
      setFaculty("Bách khoa");
      return;
    }

    // for student/tutor, fetch corresponding endpoint if username is available
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
                { label: "Đánh giá", path: "/reviews" },
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
                { label: "Kết quả tham gia chương trình", path: "/ctsv-results" },
                { label: "Cổng thư viện", path: "/library" },
              ],
            };

            const items = role ? (menuMap[role] ?? []) : [];
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
        </nav>
      </div>
    </div>
  );
};

export default SideBarOpen;
