import { useNavigate } from "react-router-dom";
import "../../styles/IndexPage.css";
import "../../styles/TutorUpdate.css";
import { useEffect, useState } from "react";
import TopBar from "../../components/TopBar";
import SideBarOpen from "../../components/SideBarOpen";
import SidebarRail from "../../components/SidebarRail";

// ...existing code...

export default function TutorStudentListPage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  // store full registrations so we can access subjectName, registration id and student info
  const [registrations, setRegistrations] = useState<any[]>([]);

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

    if (!cookieRole || decodeURIComponent(cookieRole) !== "tutor") {
      navigate("/unauthorized");
    }
  }, [navigate]);

  // load registrations assigned to this tutor (use cookie username fallback)
  useEffect(() => {
    // read cookie username
    const cookie = document.cookie || "";
    let tutorUsername: string | null = null;
    cookie.split(";").map(s => s.trim()).forEach(pair => {
      const [k, v] = pair.split("=");
      if (k === "username") tutorUsername = decodeURIComponent(v || "");
    });
    const url = tutorUsername
      ? `http://localhost:3001/registrations?tutorUsername=${encodeURIComponent(tutorUsername)}`
      : `http://localhost:3001/registrations`;

    fetch(url, { credentials: "include" })
      .then((res) => res.json())
      .then((payload) => {
        // keep full registrations so we can display subjectName and pass registration when updating
        const regs = Array.isArray(payload) ? payload : (payload.registrations ?? payload.data ?? []);
        setRegistrations(regs);
      })
      .catch((err) => {
        console.warn("Failed to load registrations for tutor:", err);
        setRegistrations([]);
      });
  }, []);

  const handleUpdateClick = (registration: any) => {
    // navigate and pass the registration (contains student and subject info)
    const sid = registration?.student?.studentId ?? registration?.student?.username ?? registration?.student?.id;
    const path = sid ? `/tutor/update-progress/${encodeURIComponent(sid)}` : `/tutor/update-progress`;
    navigate(path, { state: { registration } });
  };

  return (
    <div className="page-outer">
      <div className="page-inner">
        <div className="student-page">
          {/* overlay (fixed) to dim the page when menu is open; sits under the sidebar */}
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

          {/* collapsed sidebar (always present) */}
          <SidebarRail wrapperClass="sidebar" imgClass="sidebar-avatar" />

          {/* render drawer component (separate component) */}
          <SideBarOpen open={menuOpen} onClose={() => setMenuOpen(false)} />

          {/* HEADER (using TopBar component) */}
          <TopBar
            menuOpen={menuOpen}
            onMenuClick={() => setMenuOpen(true)}
            onLogoClick={() => navigate("/student-dashboard")}
          />

          <main className="content">
            <div className="update-title">Cập nhật tiến bộ sinh viên</div>

            <div className="table-card">
              <div style={{ padding: '15px 20px', borderBottom: '1px solid #eee', fontWeight: '700' }}>
                Danh sách sinh viên phụ trách
              </div>
              <table className="tutor-table">
                <thead>
                  <tr>
                    <th>Họ và tên</th>
                    <th>Khoa</th>
                    <th>Email liên hệ</th>
                    <th>Bộ môn đăng ký</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((r) => (
                    <tr key={r.id ?? (r.student?.username ?? r.student?.studentId)}>
                      <td style={{ fontWeight: 'bold' }}>{r.student?.fullName ?? r.student?.name}</td>
                      <td>{r.student?.faculty ?? r.student?.department ?? ""}</td>
                      <td style={{ color: '#666' }}>{r.student?.email}</td>
                      <td>{r.subjectName ?? r.subjectCode ?? (r.student?.subject ?? "")}</td>
                      <td>
                        <span className={`status-badge ${r.student?.status === 'Active' ? 'status-active' : 'status-inactive'}`}>
                          {r.student?.status ?? 'Active'}
                        </span>
                      </td>
                      <td>
                        <button
                          className="action-btn-update"
                          onClick={() => handleUpdateClick(r)}
                        >
                          Cập nhật
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}