import { useState, useEffect } from "react";
import home_icon from "../../images/Home.svg";
import "../../styles/IndexPage.css";
import { useNavigate } from "react-router-dom";
import SidebarRail from "../../components/SidebarRail";
import SideBarOpen from "../../components/SideBarOpen";
import TopBar from "../../components/TopBar";
import '../../styles/ReviewsSearch.css';

export default function StudentReviewsSearch() {
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

            <div className="search-page">
              <section className="search-main">
                <div className="search-sidebar__title">Xem đánh giá của sinh viên</div>
                <div className="search-header">
                  <h2>Danh sách các đánh giá của sinh viên</h2>
                </div>

                <div className="search-card">
                  <div className="search-card__meta">Thời gian đánh giá gần nhất: 26/03/2025</div>

                  <div className="search-card__outline">
                    {/* top search results area */}
                    <div className="detail-row">
                      <label>Họ và tên:</label>
                      <div className="detail-value">Nguyễn Văn A</div>
                    </div>

                    <div className="detail-row">
                      <label>MSSV:</label>
                      <div className="detail-value">2312001</div>
                    </div>

                    <div className="detail-row">
                      <label>Lớp:</label>
                      <div className="detail-value">CO1007</div>
                    </div>

                    <div className="detail-row">
                      <label>Môn học:</label>
                      <div className="detail-value">Cấu trúc Rời rạc cho Khoa học Máy tính</div>
                    </div>

                    <div className="detail-row detail-row--large">
                      <label>Nội dung đánh giá:</label>
                      <div className="detail-value">Thầy dạy rất dễ hiểu ạ</div>
                    </div>
                  </div>
                </div>

                <div className="search-pagination">
                  <button className="page-btn">Previous</button>
                  <div className="page-number">1</div>
                  <button className="page-btn">Next</button>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
