import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarRail from '../../components/SidebarRail';
import TopBar from '../../components/TopBar';
import SideBarOpen from '../../components/SideBarOpen';
import '../../styles/Profile.css';

interface StudentInfo {
  fullName: string;
  studentId: string;
  dob: string;
  hometown: string;
  gender: string;
  idCard: string;
  issueDate: string;
  issuePlace: string;
  phone: string;
  studentEmail: string;
  personalEmail: string;
  relativePhone: string;
  lastUpdate: string;
  avatarUrl: string;
}

const StudentProfile: React.FC = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const studentData: StudentInfo = {
    fullName: 'Nguyễn Văn Hai',
    studentId: '2300018',
    dob: '14/05/2005',
    hometown: 'Nam Định',
    gender: 'Nam',
    idCard: '012205678910',
    issueDate: '17/01/2023',
    issuePlace: 'Cục Cảnh sát QLHC và TTXH',
    phone: '0909909009',
    studentEmail: 'hai.nguyenvan@hcmut.edu.vn',
    personalEmail: 'nguyenvanhai@gmail.com',
    relativePhone: '0919919101',
    lastUpdate: '26/10/2025',
    avatarUrl: 'https://i.pravatar.cc/300?img=11'
  };

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

  // 3. Render
  return (
    <div className="app-container">
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
            zIndex: 202,
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

      {/* --- Main Content --- */}
      <main className="main-content">
        <div className="content-body">
          <div className="page-title-section profile-title">
            <h1 style={{ fontWeight: 700 }}>Thông tin sinh viên</h1>
            <span className="update-info">Thời điểm cập nhật gần nhất: {studentData.lastUpdate}</span>
          </div>

          {/* SECTION 1: CÁ NHÂN */}
          <section className="info-section">
            <div className="section-header-bar">Thông tin cá nhân</div>
            <div className="info-content-box profile-layout">
              <div className="avatar-column">
                <img src={studentData.avatarUrl} alt="Avatar" className="profile-img" />
              </div>
              <div className="details-column">
                <div className="info-grid">
                  <div className="info-item">
                    <label>Họ và tên</label>
                    <span>{studentData.fullName}</span>
                  </div>
                  <div className="info-item">
                    <label>Mã số sinh viên</label>
                    <span>{studentData.studentId}</span>
                  </div>
                  <div className="info-item">
                    <label>Ngày sinh</label>
                    <span>{studentData.dob}</span>
                  </div>
                  <div className="info-item">
                    <label>Quê quán</label>
                    <span>{studentData.hometown}</span>
                  </div>
                  <div className="info-item">
                    <label>Giới tính</label>
                    <span>{studentData.gender}</span>
                  </div>
                  <div className="info-item">
                    <label>Số CCCD</label>
                    <span>{studentData.idCard}</span>
                  </div>
                  <div className="info-item">
                    <label>Ngày cấp</label>
                    <span>{studentData.issueDate}</span>
                  </div>
                  <div className="info-item">
                    <label>Nơi cấp</label>
                    <span>{studentData.issuePlace}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: LIÊN LẠC */}
          <section className="info-section">
            <div className="section-header-bar">Thông tin liên lạc</div>
            <div className="info-content-box">
              <div className="info-grid contact-grid">
                <div className="info-item">
                  <label>Số điện thoại</label>
                  <span>{studentData.phone}</span>
                </div>
                <div className="info-item">
                  <label>Email sinh viên</label>
                  <span>{studentData.studentEmail}</span>
                </div>
                <div className="info-item">
                  <label>Email cá nhân</label>
                  <span>{studentData.personalEmail}</span>
                </div>
                <div className="info-item">
                  <label>Số điện thoại người thân</label>
                  <span>{studentData.relativePhone}</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default StudentProfile;
