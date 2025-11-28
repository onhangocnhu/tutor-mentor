import { useEffect, useState } from "react";
import last_seen_icon from "../../images/last-seen-icon.svg";
import home_icon from "../../images/Home.svg";
import { useNavigate } from "react-router-dom";
import "../../styles/IndexPage.css";
import SideBarOpen from "../../components/SideBarOpen";
import SidebarRail from "../../components/SidebarRail";
import TopBar from "../../components/TopBar";
import { formatDateTime } from "../../utils/FormatDateTime";

export default function TutorIndexPage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

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

  return (
    // outer full-width background wrapper
    <div className="page-outer">
      {/* inner centered container to prevent large white gutter on the right */}
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

          {/* MAIN CONTENT */}
          <main className="content">
            <div className="home-title">
              Hệ thống hỗ trợ Tutor
            </div>

            <div className="breadcrumb-row">
              <div className="breadcrumb">
                <img className="home-logo" src={home_icon} alt="home icon" />
                BKTutorPortal &gt; Trang chủ
              </div>
            </div>

            {/* THỐNG KÊ USAGE SECTION */}
            <h2 className="section-title">Thống kê sử dụng</h2>

            <div className="usage-row">
              {/* LEFT BAR CHART */}

              <div className="chart-card">
                <div className="chart-header">Thống kê tần suất đăng nhập</div>
                <div className="chart">
                  <div className="chart-y">40</div>
                  <div className="chart-y">20</div>
                  <div className="chart-y">0</div>

                  <div className="chart-bars">
                    <div className="bar" style={{ height: "120px" }}></div>
                    <div className="bar" style={{ height: "83px" }}></div>
                    <div className="bar" style={{ height: "151px" }}></div>
                    <div className="bar" style={{ height: "135px" }}></div>
                    <div className="bar" style={{ height: "77px" }}></div>
                    <div className="bar" style={{ height: "104px" }}></div>
                    <div className="bar" style={{ height: "135px" }}></div>
                    <div className="bar" style={{ height: "60px" }}></div>
                  </div>

                  <div className="chart-x">
                    {[
                      "03/2025",
                      "04/2025",
                      "05/2025",
                      "06/2025",
                      "07/2025",
                      "08/2025",
                      "09/2025",
                      "10/2025",
                    ].map((label) => (
                      <div key={label}>{label}</div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT PANEL — LAST LOGIN BOX */}
              <div className="last-login-wrapper">
                <div className="last-login-icon-box">
                  <img
                    src={last_seen_icon}
                    alt="last seen"
                    className="last-login-icon"
                  />
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
