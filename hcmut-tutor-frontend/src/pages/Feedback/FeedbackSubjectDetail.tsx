import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import home_icon from "../../images/Home.svg";
import feedback_icon from "../../images/feedback.svg";
import "../../styles/FeedbackSubjectDetail.css";
import SideBarOpen from "../../components/SideBarOpen";
import SidebarRail from "../../components/SidebarRail";
import TopBar from "../../components/TopBar";

import sessionsData from "../../../../hcmut-tutor-backend/data/sessions.json";

interface Session {
  id: string;
  date: string;
  time: string;
  format: string;
  location: string;
  department: string;
  status: "Đã diễn ra" | "Chưa diễn ra";
  notes: string;
  studentCount: number;
  students: never[];
}

const sessions = sessionsData as Session[];

const subjectNameMap: Record<string, string> = {
  "CO1007": "Cấu trúc Rời rạc cho Khoa học Máy tính",
  "CO3001": "Công nghệ Phần mềm",
  "CO2011": "Mô hình hóa Toán học",
  "CO2017": "Hệ điều hành",
  "CO3093": "Mạng máy tính",
  "CO3005": "Nguyên lý Ngôn ngữ Lập trình",
  "CO2003": "Kỹ thuật Lập trình",
  "CO2013": "Hệ cơ sở Dữ liệu",
  "CO2039": "Lập trình Nâng cao",
  "CO1023": "Hệ thống Số",
};

export default function FeedbackSubjectDetail() {
  const { subjectCode, studentId, semester } = useParams<{
    subjectCode: string;
    studentId: string;
    semester: string;
  }>();

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

    if (!cookieRole || decodeURIComponent(cookieRole) !== "student") {
      navigate("/unauthorized");
    }
  }, [navigate]);

  const subjectName = subjectNameMap[subjectCode || ""] || "Môn học không xác định";
  const fullSubjectDisplay = subjectCode
    ? `${subjectCode} - ${subjectName}`
    : "Môn học";

  const parseDate = (dateStr: string): Date => {
    const [day, month, year] = dateStr.split("/").map(Number);
    return new Date(year, month - 1, day);
  };

  const mySessions = sessions
    .filter(session => {
      const deptMatch = session.department.toLowerCase().includes(subjectName.toLowerCase().replace(/cho.+$/, "").trim());
      return deptMatch && session.status === "Đã diễn ra";
    })
    .map(session => ({
      ...session,
      dateObj: parseDate(session.date)
    }))
    .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

  const weeks: {
    week: string;
    dateRange: string;
    sessions: typeof mySessions;
  }[] = [];

  if (mySessions.length > 0) {
    let currentWeek = 1;
    let weekStartDate = mySessions[0].dateObj;
    let currentWeekSessions: typeof mySessions = [];

    mySessions.forEach((session, index) => {
      const daysDiff = Math.floor((session.dateObj.getTime() - weekStartDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff >= 7 && currentWeekSessions.length > 0) {
        const weekEndDate = new Date(weekStartDate);
        weekEndDate.setDate(weekStartDate.getDate() + 6);

        weeks.push({
          week: `WEEK ${currentWeek}`,
          dateRange: `${weekStartDate.toLocaleDateString("vi-VN")} - ${weekEndDate.toLocaleDateString("vi-VN")}`,
          sessions: currentWeekSessions
        });

        currentWeek++;
        weekStartDate = session.dateObj;
        currentWeekSessions = [session];
      } else {
        currentWeekSessions.push(session);
      }

      if (index === mySessions.length - 1 && currentWeekSessions.length > 0) {
        const weekEndDate = new Date(weekStartDate);
        weekEndDate.setDate(weekStartDate.getDate() + 6);
        const actualEnd = session.dateObj > weekEndDate ? session.dateObj : weekEndDate;

        weeks.push({
          week: `WEEK ${currentWeek}`,
          dateRange: `${weekStartDate.toLocaleDateString("vi-VN")} - ${actualEnd.toLocaleDateString("vi-VN")}`,
          sessions: currentWeekSessions
        });
      }
    });
  }

  return (
    <div className="page-outer">
      <div className="page-inner">
        <div className="student-page">
          {menuOpen && <div onClick={() => setMenuOpen(false)} className="menu-overlay" />}

          <SidebarRail wrapperClass="sidebar" imgClass="sidebar-avatar" />
          <SideBarOpen open={menuOpen} onClose={() => setMenuOpen(false)} />

          <TopBar
            menuOpen={menuOpen}
            onMenuClick={() => setMenuOpen(true)}
            onLogoClick={() => navigate("/student-dashboard")}
          />

          <main className="content">
            <div className="breadcrumb-row">
              <div className="breadcrumb">
                <img className="home-logo" src={home_icon} alt="home" />
                BKTutorPortal →
                <span className="breadcrumb-link" onClick={() => navigate("/feedback")}>
                  Các khóa học của tôi
                </span>
                → <span className="breadcrumb-current">{fullSubjectDisplay}</span>
              </div>
            </div>

            <div className="subject-header">
              <h1 className="subject-title">{fullSubjectDisplay}</h1>
            </div>

            <div className="sessions-container">
              {weeks.length === 0 ? (
                <div className="week-card inactive">
                  <div className="week-header">
                    <span className="arrow-icon">▼</span>
                    <span className="week-title">Chưa có buổi học nào đã diễn ra</span>
                  </div>
                </div>
              ) : (
                weeks.map((week, idx) => (
                  <div key={idx} className="week-card">
                    <div className="week-header">
                      <span className="arrow-icon">▼</span>
                      <span className="week-title">{week.week} ({week.dateRange})</span>
                    </div>

                    <div className="session-list">
                      {week.sessions.map((session) => (
                        <div
                          key={session.id}
                          className="session-item"
                          onClick={() =>
                            navigate(`/feedback/session/${subjectCode}/${studentId}/${semester}/${session.id}`)
                          }
                        >
                          <img src={feedback_icon} alt="feedback" className="feedback-icon" />
                          <div className="session-info">
                            <div className="session-main">
                              Buổi học ngày {session.date}
                            </div>
                            <div className="session-sub">
                              {session.time} • {session.format} •{" "}
                              {session.location.includes("Meet") ? "Online" : session.location}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}