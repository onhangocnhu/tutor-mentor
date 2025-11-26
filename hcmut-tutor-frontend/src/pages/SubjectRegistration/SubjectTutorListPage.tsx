import { useEffect, useState } from "react";
import home_icon from "../../images/Home.svg";
import "../../styles/IndexPage.css";
import "../../styles/SubjectTutorListPage.css";
import SidebarRail from "../../components/SidebarRail";
import SideBarOpen from "../../components/SideBarOpen";
import TopBar from "../../components/TopBar";
import { useNavigate } from "react-router-dom";

const CheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6L9 17L4 12" stroke="#039855" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default function SubjectTutorListPage() {
  // --- STATE QUẢN LÝ MODAL ---
  // 'none': Đóng | 'confirm': Hỏi xác nhận | 'success': Thông báo thành công
  const [modalStep, setModalStep] = useState<'none' | 'confirm' | 'success'>('none');
  const [selectedTutor, setSelectedTutor] = useState<string | null>(null);
  const [selectedTutorUsername, setSelectedTutorUsername] = useState<string | null>(null);
  const [registeredTutors, setRegisteredTutors] = useState<string[]>([]); // <-- track tutors already chosen
  const [menuOpen, setMenuOpen] = useState(false);
  const [tutors, setTutors] = useState<any[]>([]);
  const [filterSubject, setFilterSubject] = useState<string>("");
  const navigate = useNavigate();

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

  // helper: load student's registrations to mark disabled tutors
  const fetchRegisteredTutors = async () => {
    try {
      // read username from cookie (optional; server also accepts cookie)
      const cookie = document.cookie || "";
      let studentUsername: string | null = null;
      cookie.split(";").map(s => s.trim()).forEach(pair => {
        const [k, v] = pair.split("=");
        if (k === "username") studentUsername = decodeURIComponent(v || "");
      });

      const url = studentUsername
        ? `http://localhost:3001/registrations?studentUsername=${encodeURIComponent(studentUsername)}`
        : `http://localhost:3001/registrations`;

      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch registrations");
      const payload = await res.json();
      const regs = Array.isArray(payload) ? payload : (payload.registrations ?? payload.data ?? []);
      const tutorUsernames = regs.map((r: any) => r.tutor?.username).filter(Boolean);
      setRegisteredTutors(Array.from(new Set(tutorUsernames)));
    } catch (err) {
      console.warn("Failed to fetch registrations:", err);
    }
  };

  // gọi khi mount
  useEffect(() => {
    fetchRegisteredTutors();
  }, []);

  // 1. Khi nhấn nút "Chọn"
  const handleSelectTutor = (tutorUsername: string, tutorName: string) => {
    setSelectedTutor(tutorName);
    setSelectedTutorUsername(tutorUsername);
    setModalStep('confirm'); // Mở modal xác nhận
  };

  // 2. Khi nhấn "Huỷ" hoặc nút X
  const handleClose = () => {
    setModalStep('none');
    setSelectedTutor(null);
  };

  // 3. Khi nhấn "Xác nhận" ở modal
  const handleConfirmRegistration = async () => {
    // lấy student username từ cookie
    const cookie = document.cookie || "";
    let studentUsername: string | null = null;
    cookie.split(";").map(s => s.trim()).forEach(pair => {
      const [k, v] = pair.split("=");
      if (k === "username") studentUsername = decodeURIComponent(v || "");
    });

    if (!studentUsername) {
      alert("Không tìm thấy thông tin đăng nhập (username). Vui lòng đăng nhập lại.");
      return;
    }
    if (!selectedTutorUsername) {
      alert("Không có tutor được chọn.");
      return;
    }

    // subject: ưu tiên filterSubject, fallback localStorage
    let subjectCode = filterSubject;
    try {
      if (!subjectCode) subjectCode = localStorage.getItem("selectedSubject") || "";
    } catch { }
    // gửi subjectCode (chuỗi rỗng cho trường hợp không có)
    try {
      const res = await fetch("http://localhost:3001/register-program", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentUsername, tutorUsername: selectedTutorUsername, subject: subjectCode || undefined }),
      });
      const data = await res.json();
      if (data && data.success) {
        // cập nhật UI: đánh dấu tutor đã đăng ký
        if (selectedTutorUsername) {
          setRegisteredTutors((prev) => {
            if (prev.includes(selectedTutorUsername)) return prev;
            return [...prev, selectedTutorUsername];
          });
        }
        // refresh registrations từ server (đảm bảo đồng bộ)
        await fetchRegisteredTutors();
        setModalStep('success');
      } else {
        alert(data?.message || "Đăng ký thất bại");
        setModalStep('none');
      }
    } catch (err) {
      console.error("register-program error:", err);
      alert("Lỗi khi kết nối server. Vui lòng thử lại.");
      setModalStep('none');
    }
  };

  // --- Fetch API khi component mount ---
  useEffect(() => {
    fetch("http://localhost:3001/tutors")
      .then(res => res.json())
      .then((data) => {
        // backend may return an array or an object { success, tutors } or { tutors: [...] }
        if (Array.isArray(data)) setTutors(data);
        else if (data && Array.isArray((data as any).tutors)) setTutors((data as any).tutors);
        else if (data && Array.isArray((data as any).data)) setTutors((data as any).data);
        else setTutors([]);
      })
      .catch(err => {
        console.error("Failed to fetch tutors:", err);
        setTutors([]);
      });
  }, []);

  // read filter subject from localStorage OR query param on mount
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("subject");
      if (q) {
        setFilterSubject(q);
        return;
      }
    } catch { }
    try {
      const stored = localStorage.getItem("selectedSubject");
      if (stored) setFilterSubject(stored);
    } catch { }
  }, []);

  // load registrations for current student and mark registered tutors (disables "Chọn" button)
  useEffect(() => {
    // read username from cookie (optional; server also accepts cookie)
    const cookie = document.cookie || "";
    let studentUsername: string | null = null;
    cookie.split(";").map(s => s.trim()).forEach(pair => {
      const [k, v] = pair.split("=");
      if (k === "username") studentUsername = decodeURIComponent(v || "");
    });

    const url = studentUsername
      ? `http://localhost:3001/registrations?studentUsername=${encodeURIComponent(studentUsername)}`
      : `http://localhost:3001/registrations`;

    fetch(url, { credentials: "include" })
      .then(res => res.json())
      .then((payload) => {
        // payload shape: { success: true, registrations: [...] } or array
        const regs = Array.isArray(payload) ? payload : (payload.registrations ?? payload.data ?? []);
        const tutorUsernames = regs.map((r: any) => r.tutor?.username).filter(Boolean);
        setRegisteredTutors(Array.from(new Set(tutorUsernames)));
      })
      .catch((err) => {
        console.warn("Failed to fetch registrations:", err);
      });
  }, []);


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

          <TopBar
            menuOpen={menuOpen}
            onMenuClick={() => setMenuOpen(true)}
            onLogoClick={() => navigate("/student-dashboard")}
          />

          <main className="content">
            <div className="home-title">Dịch vụ đăng ký Tutor</div>
            <div className="breadcrumb-row">
              <div className="breadcrumb">
                <img className="home-logo" src={home_icon} alt="home" />
                <span className="breadcrumb-link" onClick={() => navigate("/student-dashboard")}>BKTutorPortal</span>
                <span className="breadcrumb-sep">&gt;</span>
                <span className="breadcrumb-link" onClick={() => navigate("/register-subject")}>Đăng ký bộ môn</span>
                <span className="breadcrumb-sep current">&gt; Danh sách Tutor</span>
              </div>
            </div>

            {/* --- TABLE LIST --- */}
            <div className="tutor-list-card">
              <div className="card-header">
                <div>
                  <div className="header-title">Danh sách Tutor</div>
                  <div className="header-desc">Danh sách các Tutor phụ trách môn học này</div>
                </div>
              </div>

              <table className="tutor-table">
                <thead>
                  <tr>
                    <th>Họ và tên</th>
                    <th>Khoa/ Bộ môn</th>
                    <th>Email liên hệ</th>
                    <th>Lịch rảnh</th>
                    <th>Trạng thái</th>
                    <th>Đăng ký</th>
                  </tr>
                </thead>
                <tbody>
                  {tutors
                    .filter((t: any) => !filterSubject || (t.subjectCode ?? "").toString() === filterSubject)
                    .map((tutor: any) => {
                      const keyId = tutor.tutorId ?? tutor.username;
                      const tutorUsername = tutor.username ?? tutor.tutorId ?? keyId;
                      const isSelected = registeredTutors.includes(tutorUsername);
                      return (
                        <tr key={keyId}>
                          <td>
                            <div className="tutor-info">
                              <div className="tutor-avatar">{(tutor.fullName ?? tutor.name ?? "").charAt(0)}</div>
                              <span>{tutor.fullName ?? tutor.name}</span>
                            </div>
                          </td>
                          <td>{tutor.department}{tutor.subjectCode ? `/${tutor.subjectCode}` : ""}</td>
                          <td>{tutor.email}</td>
                          <td style={{ color: "#667085" }}>{tutor.freeSlots}</td>
                          <td>
                            <span className={`status-badge ${tutor.status === 'Active' ? 'status-active' : 'status-inactive'}`}>
                              {tutor.status ?? 'Active'}
                            </span>
                          </td>
                          <td>
                            <button
                              className="select-btn"
                              onClick={() => handleSelectTutor(tutorUsername, tutor.fullName ?? tutor.name)}
                              disabled={isSelected}
                              style={isSelected ? { opacity: 0.6, cursor: "default" } : undefined}
                            >
                              {isSelected ? "Đã chọn" : "Chọn"}
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>

      {/* --- MODAL LOGIC --- */}
      {modalStep !== 'none' && (
        <div className="modal-overlay">

          {/* TRƯỜNG HỢP 1: MODAL XÁC NHẬN */}
          {modalStep === 'confirm' && (
            <div className="modal-box">
              <div className="modal-close-icon" onClick={handleClose}><CloseIcon /></div>

              <div className="modal-body">
                <div className="icon-circle-green">
                  <CheckIcon />
                </div>
                <div className="modal-title">
                  Xác nhận đăng ký Tutor {selectedTutor}?
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn-cancel" onClick={handleClose}>
                  Huỷ
                </button>
                <button className="btn-confirm-blue" onClick={handleConfirmRegistration}>
                  Xác nhận
                </button>
              </div>
            </div>
          )}

          {/* TRƯỜNG HỢP 2: MODAL THÀNH CÔNG */}
          {modalStep === 'success' && (
            <div className="modal-box">
              <div className="modal-close-icon" onClick={handleClose}><CloseIcon /></div>

              <div className="modal-body">
                <div className="icon-circle-green">
                  <CheckIcon />
                </div>
                <div className="modal-title">
                  Đã đăng ký Tutor thành công!
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn-confirm-blue" onClick={handleClose}>
                  Xác nhận
                </button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
