import { useState, useEffect } from "react";
import home_icon from "../../images/Home.svg";
import "../../styles/IndexPage.css";
import { useNavigate } from "react-router-dom";
import SidebarRail from "../../components/SidebarRail";
import SideBarOpen from "../../components/SideBarOpen";
import TopBar from "../../components/TopBar";
import '../../styles/ReviewsPage.css'

export default function StudentReviewsPage() {
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
                &gt; Danh sách đánh giá sinh viên
              </div>
            </div>

            <div className="student-reviews-wrapper">
              <div className="sr-container">
                <div className="sr-topbar">
                  <div className="sr-page-title">Danh sách các đánh giá của sinh viên</div>
                  <div className="sr-actions">
                    <button
                      className="sr-action sr-action--mssv"
                      onClick={() => navigate("/student-reviews/search")}
                    >
                      Tra cứu theo MSSV
                    </button>
                    <button
                      className="sr-action sr-action--term"
                      onClick={() => navigate("/student-reviews/search")}
                    >
                      Tra cứu theo học kỳ
                    </button>
                    <div className="sr-hint">Cú pháp: 231, 232,...</div>
                  </div>
                </div>

                <div className="sr-panel">
                  <div className="sr-panel__outline">
                    {/* Search rows / result rows (responsive stacked rows) */}
                    <div className="sr-row"> {/* example row 1 */} </div>
                    <div className="sr-row"> {/* example row 2 */} </div>
                    <div className="sr-row"> {/* example row 3 */} </div>
                    <div className="sr-row"> {/* example row 4 */} </div>
                    <div className="sr-row"> {/* example row 5 */} </div>
                    <div className="sr-row"> {/* example row 6 */} </div>
                  </div>
                </div>

                <div className="sr-meta">
                  <div className="sr-last-evaluated">Thời gian đánh giá gần nhất: 26/03/2025</div>
                  <div className="sr-pagination">
                    <button className="sr-page-btn">Previous</button>
                    <div className="sr-page-num">3</div>
                    <button className="sr-page-btn">Next</button>
                  </div>
                </div>
              </div>

            </div>
          </main>
        </div>
      </div >
    </div >
  );
}
