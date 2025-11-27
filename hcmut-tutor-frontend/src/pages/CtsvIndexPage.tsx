import hcmut_logo from "../images/hcmut_logo.png";
import last_seen_icon from "../images/last-seen-icon.svg";
import menu_icon from "../images/menu.png";
import home_icon from "../images/Home.svg";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CtsvIndexPage.css";

export default function CtsvIndexPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [gradesOpen, setGradesOpen] = useState(false);

  const navigate = useNavigate();

  const goToResultOne = () => {
    navigate("/result-one");
  };

  const goToResultAll = () => {
    navigate("/result-all");
  };

  const formatDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="page-outer">
      <div className="page-inner">
        {/* THÊM THẺ BAO CHUNG ĐỂ KHÔNG LỖI JSX */}
        {/* HEADER – chỉ giữ lại nút menu, bỏ phần cũ */}
          <header className="topbar">
            <div className={`logo-box ${sidebarOpen ? "open" : ""}`}>
              <div className="logo-text">Bk</div>
            </div>

            <button
              className="menu-btn"
              onClick={() => {
              console.log("Click!");
              setSidebarOpen(o => !o);
            }}
            >
              <img className="top-menu" src={menu_icon} alt="menu" />
            </button>

          </header>
        <div className="student-page">
          
          {/* SIDEBAR */}
          <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
            <div className="iden">
                <img className="sidebar-avatar" src={hcmut_logo} alt="HCMUT logo" />
                <div className="iden-inner"><h3>Phòng Công tác Sinh viên</h3>
                <p>Bách Khoa</p>
                </div>
            </div>
            

            <nav className="sidebar-nav">
              {/* KẾT QUẢ HỌC TẬP – Toggle */}
              <div
                className="sidebar-item toggle"
                onClick={() => sidebarOpen && setGradesOpen(!gradesOpen)}
              >
                {/* <span className="sidebar-icon">🎓</span> */}
                <span className="sidebar-text">Kết quả tham gia chương trình</span>
                <span className={`chevron ${gradesOpen ? "open" : ""}`}>▶</span>
              </div>

              {/* Submenu */}
              {sidebarOpen && gradesOpen && (
                <div className="submenu">
                  <div className="submenu-item" onClick={goToResultOne}>Kết quả tham gia của một sinh viên</div>
                  <div className="submenu-item" onClick={goToResultAll}>Kết quả tham gia của tất cả sinh viên</div>
                </div>
              )}

              {/* CỔNG THƯ VIỆN */}
              <div className="sidebar-item">
                {/* <span className="sidebar-icon">📄</span> */}
                <span className="sidebar-text">Cổng thư viện</span>
              </div>

            </nav>
          </aside>


          

          {/* MAIN CONTENT – giữ nguyên 100% của bạn */}
          <main className="content">
            <div className="home-title">Hệ thống hỗ trợ Tutor</div>

            <div className="breadcrumb-row">
              <div className="breadcrumb">
                <img className="home-logo" src={home_icon} alt="home" />
                BKTutorPortal &gt; Trang chủ
              </div>
            </div>

            <h2 className="section-title">Thống kê sử dụng</h2>

            <div className="usage-row">
              <div className="chart-card">
                <div className="chart-header">Thống kê tần suất đăng nhập</div>
                <div className="chart">
                  <div className="chart-y">40</div>
                  <div className="chart-y">20</div>
                  <div className="chart-y">0</div>

                  <div className="chart-bars">
                    {[120, 83, 151, 135, 77, 104, 135, 60].map((h, i) => (
                      <div key={i} className="bar" style={{ height: `${h}px` }} />
                    ))}
                  </div>

                  <div className="chart-x">
                    {["03/2025", "04/2025", "05/2025", "06/2025", "07/2025", "08/2025", "09/2025", "10/2025"].map((label) => (
                      <div key={label}>{label}</div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="last-login-wrapper">
                <div className="last-login-icon-box">
                  <img src={last_seen_icon} alt="last seen" className="last-login-icon" />
                </div>
                <div className="last-login-card">
                  <div className="last-login-title">LƯỢT ĐĂNG NHẬP GẦN NHẤT</div>
                  <div className="last-login-time">{formatDateTime()}</div>
                  <div className="last-login-count">Tổng lượt đăng nhập: 263</div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}