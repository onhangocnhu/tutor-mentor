import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import hcmut_logo from "../images/hcmut_logo.png";
import menu_icon from "../images/menu.png";
import "./StudentIndexPage.css";
import "./SubjectTutorListPage.css";
import "./TutorUpdate.css";

// Icon Clip
const ClipIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
  </svg>
);

// Icon Check
const CheckIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6L9 17L4 12" stroke="#039855" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function TutorStudentUpdatePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  
  const student = location.state?.student || { 
    name: "N/A", faculty: "N/A", email: "N/A", subject: "N/A" 
  };

  const [note, setNote] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // 1. Sửa state thành mảng để chứa nhiều file
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const draft = localStorage.getItem(`draft_progress_${id}`);
    if (draft) {
      setNote(draft);
    }
  }, [id]);

  const handleViewList = () => {
    localStorage.setItem(`draft_progress_${id}`, note);
    navigate("/tutor/students");
  };

  const handleExit = () => {
    localStorage.removeItem(`draft_progress_${id}`);
    navigate("/tutor/students");
  };

  const handleSubmit = () => {
    setShowSuccessModal(true);
  };

  const handleModalConfirm = () => {
    localStorage.removeItem(`draft_progress_${id}`);
    setShowSuccessModal(false);
    navigate("/tutor/students");
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
          <aside className="sidebar">
            <img className="sidebar-avatar" src={hcmut_logo} alt="hcmut logo" />
          </aside>
          <header className="topbar">
             <div className="logo-box"><div className="logo-text">Bk</div></div>
             <div className="top-title"><img className="top-menu" src={menu_icon} alt="menu" /></div>
          </header>

          <main className="content">
            <div className="update-title">Cập nhật tiến bộ sinh viên</div>

            <div className="update-layout">
              {/* CỘT TRÁI */}
              <div className="left-panel">
                <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                  <div className="section-header">Thông tin sinh viên</div>
                  
                  <div className="input-group">
                    <label className="input-label">Họ và tên</label>
                    <input className="read-only-input" value={student.name} readOnly />
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
                    <label className="input-label">Bộ môn đăng kí</label>
                    <input className="read-only-input" value={student.subject} readOnly />
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
                <div style={{display: 'flex', flexDirection: 'column', gap: '15px', flex: 1}}>
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

                      <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px'}}>
                          <div 
                            style={{cursor: 'pointer', display: 'flex'}} 
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
          <div className="modal-box" style={{width: '450px'}}>
            <div className="modal-close-icon" onClick={() => setShowSuccessModal(false)}>✕</div>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '10px'}}>
               <div style={{color: '#667085', marginBottom: '15px', fontWeight: '500'}}>Cập nhật thành công</div>
               <div style={{display: 'flex', alignItems: 'center', gap: '15px', width: '100%'}}>
                   <div className="icon-circle-green" style={{width: '60px', height: '60px'}}>
                      <CheckIcon />
                   </div>
                   <div style={{fontSize: '20px', fontWeight: 'bold', color: '#101828'}}>
                       Cập nhật thành công!
                   </div>
               </div>
               <div style={{display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: '30px'}}>
                   <button className="btn-confirm" onClick={handleModalConfirm}>Xác nhận</button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}