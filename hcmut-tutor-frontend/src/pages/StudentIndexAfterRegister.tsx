import hcmut_logo from "../images/hcmut_logo.png"
import last_seen_icon from "../images/last-seen-icon.svg";
import menu_icon from "../images/menu.png";
import home_icon from "../images/Home.svg";
import "../styles/StudentIndexPage.css"
export default function StudentIndexAfterRegister() {
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
    // outer full-width background wrapper
    <div className="page-outer">
      {/* inner centered container to prevent large white gutter on the right */}
      <div className="page-inner">
        <div className="student-page">
          {/* SIDEBAR */}
          <aside className="sidebar">
            <img
              className="sidebar-avatar"
              src={hcmut_logo}
              alt="hcmut logo"
            />
          </aside>

          {/* HEADER (BLUE BAR) */}
          <header className="topbar">
            <div className="logo-box">
              <div className="logo-text">Bk</div>
            </div>
            <div className="top-title">
              <img
                className="top-menu"
                src={menu_icon}
                alt="menu"
              />
            </div>
          </header>

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
