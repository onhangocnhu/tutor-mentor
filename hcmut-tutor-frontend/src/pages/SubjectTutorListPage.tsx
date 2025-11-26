import React, { useState } from "react";
import hcmut_logo from "../images/hcmut_logo.png";
import menu_icon from "../images/menu.png";
import home_icon from "../images/Home.svg";
// Import các file CSS cần thiết
import "./StudentIndexPage.css"; 
import "./SubjectTutorListPage.css";

// Mock data cho danh sách Tutor
const MOCK_TUTORS = [
  { id: 1, name: "Nguyễn Văn Ba", department: "Khoa học máy tính", email: "ba.nguyen@hcmut.edu.vn", status: "Active" },
  { id: 2, name: "Trần Thị Cẩm", department: "Khoa học máy tính", email: "cam.tran@hcmut.edu.vn", status: "Active" },
  { id: 3, name: "Lê Hoàng Nam", department: "Kỹ thuật phần mềm", email: "nam.le@hcmut.edu.vn", status: "Inactive" },
  { id: 4, name: "Phạm Minh Tâm", department: "Hệ thống thông tin", email: "tam.pham@hcmut.edu.vn", status: "Active" },
];

const CheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6L9 17L4 12" stroke="#039855" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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

  // 1. Khi nhấn nút "Chọn"
  const handleSelectTutor = (tutorName: string) => {
    setSelectedTutor(tutorName);
    setModalStep('confirm'); // Mở modal xác nhận
  };

  // 2. Khi nhấn "Huỷ" hoặc nút X
  const handleClose = () => {
    setModalStep('none');
    setSelectedTutor(null);
  };

  // 3. Khi nhấn "Xác nhận" ở bước 1 -> Chuyển sang bước 2
  const handleConfirmRegistration = () => {
    setModalStep('success'); 
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
            <div className="home-title">Dịch vụ đăng kí Tutor</div>
            <div className="breadcrumb-row">
              <div className="breadcrumb">
                 <img className="home-logo" src={home_icon} alt="home" />
                 BKTutorPortal &gt; Đăng ký bộ môn &gt; Danh sách Tutor
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
                    <th>Đăng kí</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_TUTORS.map((tutor) => (
                    <tr key={tutor.id}>
                      <td>
                        <div className="tutor-info">
                          <div className="tutor-avatar">{tutor.name.charAt(0)}</div>
                          <span>{tutor.name}</span>
                        </div>
                      </td>
                      <td>{tutor.department}</td>
                      <td>{tutor.email}</td>
                      <td style={{ color: "#667085" }}>Thứ 2, Thứ 4...</td>
                      <td>
                        <span className={`status-badge ${tutor.status === 'Active' ? 'status-active' : 'status-inactive'}`}>
                          {tutor.status}
                        </span>
                      </td>
                      <td>
                        {/* Gọi hàm handleSelectTutor khi click */}
                        <button className="select-btn" onClick={() => handleSelectTutor(tutor.name)}>
                          Chọn
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
                  Xác nhận đăng kí Tutor {selectedTutor}?
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
                  Đã đăng kí Tutor thành công!
                </div>
              </div>

              <div className="modal-actions">
                {/* Ở bước thành công chỉ cần 1 nút xác nhận để đóng */}
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
