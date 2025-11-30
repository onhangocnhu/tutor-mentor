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

interface LoginStats {
  lastReset: string;
  totalLogins: number;
  monthlyStats: MonthlyStats[];
}

export default function FacultyIndexPage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginStats, setLoginStats] = useState<LoginStats | null>(null);

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

    if (!cookieRole || decodeURIComponent(cookieRole) !== "faculty") {
      navigate("/unauthorized");
    }
  }, [navigate]);

  // Fetch login statistics
  useEffect(() => {
    const fetchLoginStats = async () => {
      try {
        const response = await fetch("http://localhost:3001/login-stats");
        if (response.ok) {
          const data = await response.json();
          setLoginStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch login stats:", error);
      }
    };

    fetchLoginStats();
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
                      {loginStats?.monthlyStats.map((stat, index) => (
                        <div 
                          key={index} 
                          className="bar" 
                          style={{ height: `${getBarHeight(stat.count)}px` }}
                          title={`${stat.month}: ${stat.count} lượt`}
                        ></div>
                      ))}
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
                  <div className="last-login-time">{formatDateTime()}</div>
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
