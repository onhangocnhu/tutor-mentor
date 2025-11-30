import { useEffect, useState } from "react";
import last_seen_icon from "../../images/last-seen-icon.svg";
import home_icon from "../../images/Home.svg";
import { useNavigate } from "react-router-dom";
import "../../styles/IndexPage.css";
import SideBarOpen from "../../components/SideBarOpen";
import SidebarRail from "../../components/SidebarRail";
import TopBar from "../../components/TopBar";
import { formatDateTime } from "../../utils/FormatDateTime";

interface MonthlyStats {
  month: string;
  count: number;
}

interface UserLoginStats {
  userId: string;
  lastLogin: string | null;
  totalLogins: number;
  monthlyStats: MonthlyStats[];
}

export default function CtsvIndexPage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginStats, setLoginStats] = useState<UserLoginStats | null>(null);

  // Get userId from cookie
  const getUserId = () => {
    const cookie = document.cookie || "";
    let userId: string | null = null;
    cookie.split(";").map(s => s.trim()).forEach(pair => {
      const [k, v] = pair.split("=");
      if (k === "userId") userId = decodeURIComponent(v || "");
    });
    return userId;
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

    if (!cookieRole || decodeURIComponent(cookieRole) !== "ctsv") {
      navigate("/unauthorized");
    }
  }, [navigate]);

  // Fetch user login statistics
  useEffect(() => {
    const fetchUserLoginStats = async () => {
      const userId = getUserId();
      if (!userId) return;

      try {
        const response = await fetch(`http://localhost:3001/login-stats/user/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setLoginStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch user login stats:", error);
      }
    };

    fetchUserLoginStats();
  }, []);

  // Get max Y value (max count + 10)
  const getMaxYValue = () => {
    if (!loginStats || loginStats.monthlyStats.length === 0) return 40;
    const maxCount = Math.max(...loginStats.monthlyStats.map(s => s.count));
    return maxCount + 10;
  };

  // Calculate bar heights based on actual data - proportional to max Y value
  const getBarHeight = (count: number) => {
    const maxY = getMaxYValue();
    const maxHeight = 160; // pixels
    return (count / maxY) * maxHeight;
  };

  // Get Y-axis labels based on max count + 10
  const getYAxisLabels = () => {
    const maxY = getMaxYValue();
    const midY = Math.round(maxY / 2);
    return [maxY, midY, 0];
  };

  // Format last login time
  const formatLastLogin = () => {
    if (loginStats?.lastLogin) {
      const date = new Date(loginStats.lastLogin);
      return date.toLocaleString("vi-VN", {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).replace(',', '');
    }
    return formatDateTime();
  };

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
            onLogoClick={() => navigate("/student-dashboard")}
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

            <h2 className="section-title">Thống kê sử dụng</h2>

            <div className="usage-row">
              <div className="chart-card">
                <div className="chart-header">Thống kê tần suất đăng nhập</div>
                <div className="chart">
                  {/* Y-axis label */}
                  <div className="chart-y-label">Số lượt đăng nhập</div>

                  <div className="chart-y-axis">
                    {getYAxisLabels().map((label, index) => (
                      <div key={index} className="chart-y">{label}</div>
                    ))}
                  </div>

                  <div className="chart-content">
                    <div className="chart-bars">
                      {loginStats?.monthlyStats.length ? (
                        loginStats.monthlyStats.map((stat, index) => (
                          <div
                            key={index}
                            className="bar"
                            style={{ height: `${getBarHeight(stat.count)}px` }}
                            title={`${stat.month}: ${stat.count} lượt`}
                          ></div>
                        ))
                      ) : (
                        <div className="no-data-chart">Chưa có dữ liệu đăng nhập</div>
                      )}
                    </div>

                    <div className="chart-x">
                      {loginStats?.monthlyStats.map((stat, index) => (
                        <div key={index}>{stat.month}</div>
                      ))}
                    </div>
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
                  <div className="last-login-time">{formatLastLogin()}</div>
                  <div className="last-login-count">Tổng lượt đăng nhập: {loginStats?.totalLogins || 0}</div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
