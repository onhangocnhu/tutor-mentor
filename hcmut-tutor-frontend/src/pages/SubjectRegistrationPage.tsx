import React, { useState } from "react";
import hcmut_logo from "../images/hcmut_logo.png";
import menu_icon from "../images/menu.png";
import home_icon from "../images/Home.svg";
import error_icon from "../images/error.svg";
// Import CSS layout chung từ StudentIndexPage để tái sử dụng Sidebar/Header chuẩn
import "./StudentIndexPage.css"; 
// Import CSS riêng cho trang này
import "./SubjectRegistrationPage.css"; 
import { useNavigate } from "react-router-dom";

export default function SubjectRegistrationPage() {
  // 2. Thêm state để quản lý ẩn/hiện lỗi
    const [showError] = useState(false);
    const navigate = useNavigate();

  const handleSearch = () => {
    // Logic giả lập: Nếu tìm thấy thì chuyển trang
    navigate("/register-subject/tutors");
  };
  

  return (
    <div className="page-outer">
      <div className="page-inner">
        <div className="student-page">
          <aside className="sidebar">
            <img className="sidebar-avatar" src={hcmut_logo} alt="hcmut logo" />
          </aside>

          <header className="topbar">
            <div className="logo-box">
              <div className="logo-text">Bk</div>
            </div>
            <div className="top-title">
              <img className="top-menu" src={menu_icon} alt="menu" />
            </div>
          </header>

          <main className="content">
            <div className="home-title">Dịch vụ đăng kí Tutor</div>

            <div className="breadcrumb-row">
              <div className="breadcrumb">
                 <img className="home-logo" src={home_icon} alt="home" />
                 BKTutorPortal &gt; Đăng ký bộ môn
              </div>
            </div>

            {/* --- 3. KHỐI THÔNG BÁO LỖI (Hiển thị khi showError = true) --- */}
            {showError && (
              <div className="error-modal">
                <img src={error_icon} alt="error" className="error-icon" />
                <div className="error-content">
                  <span className="error-title">Error:</span>
                  <span className="error-message"> Không tìm thấy tutor!!!</span>
                </div>
              </div>
            )}

            <div className="register-subject-card">
              <h2 className="card-title">Đăng kí bộ môn</h2>
              <div className="divider"></div>

              <div className="form-group">
                <label className="form-label">Môn học</label>
                <div className="select-wrapper">
                  <select className="form-select">
                    <option>Chọn môn học...</option>
                    <option>Lập trình (CO1027)</option>
                    <option>Giải tích 1</option>
                  </select>
                </div>
              </div>

              {/* Gắn hàm handleSearch vào nút bấm */}
              <button className="search-btn" onClick={handleSearch}>
                Tìm kiếm
              </button>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}

