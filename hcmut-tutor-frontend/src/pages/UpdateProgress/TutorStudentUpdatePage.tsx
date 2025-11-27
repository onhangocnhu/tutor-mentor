import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "../../styles/IndexPage.css";
import "../../styles/SubjectTutorListPage.css";
import "../../styles/TutorUpdate.css";
import SidebarRail from "../../components/SidebarRail";
import SideBarOpen from "../../components/SideBarOpen";
import TopBar from "../../components/TopBar";

// Icon Clip
const ClipIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
  </svg>
);

// Icon Check
const CheckIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6L9 17L4 12" stroke="#039855" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function TutorStudentUpdatePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  // expect registration passed in navigation: { registration }
  const registration = location.state?.registration || null;
  const student = registration?.student || (location.state?.student) || { name: "N/A", faculty: "N/A", email: "N/A", subject: "N/A", studentId: id || "" };
  const subjectName = registration?.subjectName ?? registration?.subjectCode ?? (student.subject || "");
  const registrationId = registration?.id ?? null;
  const [menuOpen, setMenuOpen] = useState(false);

  const [note, setNote] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    const draft = localStorage.getItem(`draft_progress_${id}`);
    if (draft) {
      setNote(draft);
    }

    // load existing progress for this registration (latest)
    const loadProgress = async () => {
      try {
        if (!registrationId) return;
        const res = await fetch(`http://localhost:3001/progress?registrationId=${encodeURIComponent(registrationId.toString())}`, { credentials: "include" });
        if (!res.ok) return;
        const json = await res.json();
        const items = Array.isArray(json) ? json : (json.progress ?? []);
        if (items && items.length > 0) {
          // pick latest by createdAt
          items.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          const latest = items[items.length - 1];
          if (latest && latest.note) setNote(latest.note);
        }
      } catch (e) {
        // ignore
      }
    };
    loadProgress();
  }, [id, registrationId]);

  const handleViewList = () => {
    localStorage.setItem(`draft_progress_${id}`, note);
    navigate("/tutor/update-progress");
  };

  const handleExit = () => {
    localStorage.removeItem(`draft_progress_${id}`);
    navigate("/tutor/update-progress");
  };

  const handleSubmit = () => {
    // save progress to backend
    const payload = {
      registrationId,
      student,
      tutor: registration?.tutor ?? null,
      subjectCode: registration?.subjectCode ?? null,
      subjectName: registration?.subjectName ?? subjectName,
      note,
    };
    fetch("http://localhost:3001/student-progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data && data.success) {
          setShowSuccessModal(true);
        } else {
          alert(data?.message || "Lưu tiến bộ thất bại");
        }
      })
      .catch((err) => {
        console.error("save progress error:", err);
        alert("Lỗi khi kết nối server.");
      });
  };

  const handleModalConfirm = () => {
    localStorage.removeItem(`draft_progress_${id}`);
    setShowSuccessModal(false);
    navigate("/tutor/update-progress");
  };

  // --- LOGIC XỬ LÝ NHIỀU FILE ---

  const handleClipClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      // Chuyển FileList thành mảng và gộp vào danh sách cũ
      const newFiles = Array.from(event.target.files);
      setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
    // Reset input value để cho phép chọn lại cùng 1 file nếu muốn
    if (event.target.value) event.target.value = "";
  };

  // Xóa file theo index
  const handleRemoveFile = (indexToRemove: number) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
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
                zIndex: 202, // below SideBarOpen (203) and above topbar (201)
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
            <div className="update-title">Cập nhật tiến bộ sinh viên</div>

            <div className="update-layout">
              {/* CỘT TRÁI */}
              <div className="left-panel">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="section-header">Thông tin sinh viên</div>

                  <div className="input-group">
                    <label className="input-label">Họ và tên</label>
                    <input className="read-only-input" value={student.fullName} readOnly />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Khoa</label>
                    <input className="read-only-input" value={student.faculty} readOnly />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Email liên hệ</label>
                    <input className="read-only-input" value={student.email} readOnly />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Bộ môn đăng ký</label>
                    <input className="read-only-input" value={subjectName} readOnly />
                  </div>
                </div>

                <div className="bottom-actions">
                  <button className="btn-view-list" onClick={handleViewList}>
                    Xem danh sách sinh viên
                  </button>
                </div>
              </div>

              {/* CỘT PHẢI */}
              <div className="right-panel">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', flex: 1 }}>
                  <div className="section-header">Nhận xét sinh viên</div>

                  <textarea
                    className="comment-box"
                    placeholder="Nhập nội dung vào đây ...."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />

                  <div>
                    {/* Thêm thuộc tính multiple */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      multiple
                      onChange={handleFileChange}
                    />

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
                      <div
                        style={{ cursor: 'pointer', display: 'flex' }}
                        onClick={handleClipClick}
                        title="Đính kèm file"
                      >
                        <ClipIcon />
                      </div>

                      {/* Ẩn dòng gợi ý nếu đã có ít nhất 1 file */}
                      {selectedFiles.length === 0 && <span className="file-hint">File đính kèm không vượt quá 200MB</span>}
                    </div>

                    {/* Render danh sách file */}
                    <div className="file-list-container">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="selected-file-chip">
                          <span className="file-name">📎 {file.name}</span>
                          <span className="file-size">({(file.size / 1024).toFixed(1)} KB)</span>
                          <button className="btn-remove-file" onClick={() => handleRemoveFile(index)}>✕</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bottom-actions right-actions">
                  <button className="btn-exit" onClick={handleExit}>Thoát</button>
                  <button className="btn-confirm" onClick={handleSubmit}>Xác nhận cập nhật</button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Modal */}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ width: '450px' }}>
            <div className="modal-close-icon" onClick={() => setShowSuccessModal(false)}>✕</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '10px' }}>
              <div style={{ color: '#667085', marginBottom: '15px', fontWeight: '500' }}>Cập nhật thành công</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', width: '100%' }}>
                <div className="icon-circle-green" style={{ width: '60px', height: '60px' }}>
                  <CheckIcon />
                </div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#101828' }}>
                  Cập nhật thành công!
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: '30px' }}>
                <button className="btn-confirm" onClick={handleModalConfirm}>Xác nhận</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}