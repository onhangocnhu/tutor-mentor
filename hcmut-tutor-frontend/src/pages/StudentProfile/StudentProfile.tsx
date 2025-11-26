import React from 'react';

// 1. Định nghĩa kiểu dữ liệu (Interfaces)
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
  // 2. Dữ liệu giả lập
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

  // 3. Render
  return (
    <div className="app-container">
      <style>{`
        /* Reset & Base */
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', sans-serif; }
        .app-container { display: flex; min-height: 100vh; background-color: #eef1f5; }

        /* Sidebar */
        .sidebar { width: 60px; background-color: #263238; display: flex; flex-direction: column; align-items: center; padding-top: 10px; color: white; }
        .logo-box { width: 40px; height: 40px; background: #0056b3; margin-bottom: 20px; display: flex; justify-content: center; align-items: center; font-weight: bold; border-radius: 4px; }
        .menu-item { width: 100%; padding: 15px 0; text-align: center; cursor: pointer; color: #b0bec5; font-size: 20px; }
        .menu-item.active { background-color: #37474f; color: white; }

        /* Main Content & Header */
        .main-content { flex: 1; display: flex; flex-direction: column; }
        .top-header { background-color: #4aa3d3; height: 50px; display: flex; align-items: center; padding: 0 20px; color: white; }
        .header-left { display: flex; gap: 15px; font-weight: bold; font-size: 20px; }
        .menu-toggle { background: none; border: none; color: white; font-size: 24px; cursor: pointer; }
        
        /* Content Body */
        .content-body { padding: 20px 40px; flex: 1; }
        .page-title-section { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 20px; }
        .page-title-section h1 { font-size: 28px; color: #000; }
        .update-info { font-size: 14px; color: #333; font-style: italic; }

        /* Sections */
        .info-section { margin-bottom: 30px; background-color: white; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
        .section-header-bar { background-color: #4682b4; color: white; padding: 10px 20px; font-weight: bold; font-size: 16px; }
        .info-content-box { padding: 30px; min-height: 200px; }

        /* Layout Profile */
        .profile-layout { display: flex; gap: 40px; align-items: center; }
        .avatar-column { flex: 0 0 200px; }
        .profile-img { width: 100%; height: auto; border-radius: 4px; object-fit: cover; display: block; }
        .details-column { flex: 1; }

        /* Grid Layout */
        .info-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 30px 20px; }
        .info-item { display: flex; flex-direction: column; align-items: center; text-align: center; }
        .info-item label { font-weight: bold; font-size: 15px; color: #000; margin-bottom: 8px; }
        .info-item span { font-size: 15px; color: #555; }
        .contact-grid { width: 100%; }

        /* Responsive */
        @media (max-width: 900px) {
            .profile-layout { flex-direction: column; align-items: center; }
            .info-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
            .content-body { padding: 15px; }
            .info-grid { grid-template-columns: 1fr; }
            .page-title-section { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      {/* --- Sidebar --- */}
      <aside className="sidebar">
        <div className="logo-area">
          <div className="logo-box">BK</div>
        </div>
        <div className="menu-items">
          <div className="menu-item"><span className="icon">☰</span></div>
          <div className="menu-item active"><span className="icon">👤</span></div>
          <div className="menu-item"><span className="icon">📅</span></div>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className="main-content">
        <header className="top-header">
          <div className="header-left">
            <span className="logo-text">Bk</span>
            <button className="menu-toggle">☰</button>
          </div>
        </header>

        <div className="content-body">
          <div className="page-title-section profile-title">
            <h1>Thông tin sinh viên</h1>
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
