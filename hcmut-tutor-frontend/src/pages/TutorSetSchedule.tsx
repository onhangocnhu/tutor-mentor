import React, { useState } from 'react';
import './TutorSchedule.css';

// Định nghĩa kiểu dữ liệu cho môn học
interface ClassSession {
  id: number;
  className: string;
  subjectName: string;
  location: string;
  day: number;
  time: string;
}

const TutorSchedule: React.FC = () => {
  // State để điều khiển việc hiển thị form thêm lịch rảnh
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  // Dữ liệu giả lập 
  const scheduleData: ClassSession[] = [
    { id: 1, className: 'DSA1', subjectName: 'Cấu trúc Dữ liệu và Giải Thuật', location: 'https://meet.google.com/...', day: 3, time: '9:00-11:50' },
    { id: 2, className: 'DS1', subjectName: 'Hệ cơ sở dữ liệu', location: 'https://meet.google.com/...', day: 3, time: '13:00-15:50' },
    { id: 3, className: 'DSA2', subjectName: 'Cấu trúc Dữ liệu và Giải Thuật', location: 'https://meet.google.com/...', day: 5, time: '7:00-9:50' },
    { id: 4, className: 'DS1', subjectName: 'Hệ cơ sở dữ liệu', location: 'https://meet.google.com/...', day: 5, time: '13:00-15:50' },
  ];

  const handleToggleForm = () => {
    setShowAddForm(true); // Hiện form khi bấm nút
  };

  const handleCancel = () => {
    setShowAddForm(false); // Ẩn form khi bấm Thoát
  };

  return (
    <div className="app-container">
      {/* Sidebar bên trái (Mô phỏng) */}
      <aside className="sidebar">
        <div className="logo-area">
          <div className="logo-box">BK</div>
        </div>
        <div className="menu-items">
          <div className="menu-item active"><span className="icon">☰</span></div>
          <div className="menu-item"><span className="icon">📂</span></div>
          <div className="menu-item"><span className="icon">📅</span></div>
        </div>
      </aside>

      {/* Nội dung chính bên phải */}
      <main className="main-content">
        {/* Header */}
        <header className="top-header">
          <div className="header-left">
            <span className="logo-text">Bk</span>
            <button className="menu-toggle">☰</button>
          </div>
        </header>

        <div className="content-body">
          <div className="page-title-section">
            <h1>Thiết lập lịch rảnh</h1>
            <span className="week-info">Tuần 42 (27/10 - 02/11)</span>
          </div>

          {/* Phần Lịch dạy - Table */}
          <section className="schedule-section">
            <div className="section-header-bar">Lịch dạy</div>
            
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Số thứ tự</th>
                    <th>Lớp</th>
                    <th>Tên môn học</th>
                    <th>Phòng học / Link lớp học</th>
                    <th>Thứ</th>
                    <th>Giờ học</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {scheduleData.map((item) => (
                    <tr key={item.id}>
                      <td className="col-id">{item.id}</td>
                      <td>{item.className}</td>
                      <td>{item.subjectName}</td>
                      <td className="col-link">{item.location}</td>
                      <td>{item.day}</td>
                      <td>{item.time}</td>
                      <td><a href="#" className="action-link">Chỉnh sửa</a></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Nút kích hoạt form  */}
          <div className="action-bar">
            <button className="btn-setup" onClick={handleToggleForm}>
              Thiết lập lịch rảnh
            </button>
          </div>

          {/* Form thêm lịch rảnh (Chỉ hiện khi showAddForm = true ) */}
          {showAddForm && (
            <section className="add-schedule-form fade-in">
              <h2>Thêm lịch rảnh</h2>
              
              <form className="form-grid">
                <div className="form-group">
                  <label>Giờ bắt đầu <span className="required">*</span></label>
                  <input type="time" defaultValue="13:00" />
                </div>

                <div className="form-group">
                  <label>Giờ kết thúc <span className="required">*</span></label>
                  <input type="time" defaultValue="15:50" />
                </div>

                <div className="form-group">
                  <label>Thứ <span className="required">*</span></label>
                  <input type="number" min="2" max="8" defaultValue="4" />
                </div>

                <div className="form-group">
                  <label>Ngày bắt đầu <span className="required">*</span></label>
                  <input type="text" defaultValue="30/10/2025" placeholder="dd/mm/yyyy" />
                </div>

                <div className="form-group">
                  <label>Lặp lại <span className="required">*</span></label>
                  <input type="text" defaultValue="Hàng tuần" />
                </div>
              </form>

              <div className="form-actions">
                <button className="btn-cancel" onClick={handleCancel}>Thoát</button>
                <button className="btn-save">Lưu</button>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default TutorSchedule;
