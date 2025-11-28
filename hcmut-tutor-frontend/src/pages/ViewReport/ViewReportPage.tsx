import { useState, useEffect } from "react";
import home_icon from "../../images/Home.svg";
import last_seen_icon from "../../images/last-seen-icon.svg";
import "../../styles/IndexPage.css";
import { useNavigate } from "react-router-dom";
import SidebarRail from "../../components/SidebarRail";
import SideBarOpen from "../../components/SideBarOpen";
import TopBar from "../../components/TopBar";
import { formatDateTime } from "../../utils/FormatDateTime";
import '../../styles/ViewReportPage.css'

export default function ViewReport() {
  const [menuOpen, setMenuOpen] = useState(false);
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

    if (!cookieRole || decodeURIComponent(cookieRole) !== "pdt") {
      navigate("/unauthorized");
    }
  }, [navigate]);


  return (
    <div className="page-outer">
      <div className="page-inner">
        <div className="student-page">
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
          <SidebarRail wrapperClass="sidebar" imgClass="sidebar-avatar" />

          <SideBarOpen open={menuOpen} onClose={() => setMenuOpen(false)} />

          <TopBar
            menuOpen={menuOpen}
            onMenuClick={() => setMenuOpen(true)}
            onLogoClick={() => navigate("/tutor-dashboard")}
          />

          <main className="content">
            <div className="home-title">Báo cáo tổng quan chương trình Tutor</div>

            <div className="breadcrumb-row">
              <div className="breadcrumb">
                <img className="home-logo" src={home_icon} alt="home" />
                <span
                  role="button"
                  tabIndex={0}
                  className="breadcrumb-link"
                  onClick={() => navigate("/pdt-dashboard")}
                  onKeyDown={(e) => { if (e.key === "Enter") navigate("/pdt-dashboard"); }}
                  style={{ marginRight: 8 }}
                >
                  BKTutorPortal
                </span>
                &gt;{" "}
                <span
                  role="button"
                  tabIndex={0}
                  className="breadcrumb-link"
                  onClick={() => navigate("/view-reports")}
                  onKeyDown={(e) => { if (e.key === "Enter") navigate("/view-reports"); }}
                  style={{ marginLeft: 8 }}
                >
                  Báo cáo tổng quan
                </span>
              </div>
            </div>

            <div className="main-wrapper">
              <div className="view-container">
                <div className="report-panel">
                  <div className="report-panel__bg" />
                  <div className="report-panel__accent" />
                  <div className="report-panel__count">Tổng lượt: 263</div>
                  <div
                    className="report-panel__title"
                    role="button"
                    tabIndex={0}
                    onClick={() => navigate("/student-reviews")}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") navigate("/student-reviews");
                    }}
                  >
                    Xem đánh giá của sinh viên
                  </div>
                  <div className="report-panel__accent-2" />
                  <div className="report-panel__count-2">Tổng lượt: 263</div>
                  <div
                    className="report-panel__title-2"
                    role="button"
                    tabIndex={0}
                    onClick={() => navigate("/tutor-reviews")}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") navigate("/tutor-reviews");
                    }}
                  >
                    Xem ghi nhận từ Tutor</div>
                </div>
              </div>

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

      </div >

    </div >
  );
}

