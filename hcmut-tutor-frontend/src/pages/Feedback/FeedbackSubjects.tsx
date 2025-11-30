import { useEffect, useState } from "react";
import home_icon from "../../images/Home.svg";
import { useNavigate } from "react-router-dom";
import "../../styles/FeedbackSubjects.css";
import SideBarOpen from "../../components/SideBarOpen";
import SidebarRail from "../../components/SidebarRail";
import TopBar from "../../components/TopBar";

import registrationsData from "../../../../hcmut-tutor-backend/data/registrations.json";
import studentsData from "../../../../hcmut-tutor-backend/data/students.json";
import {getCurrentStudentId} from "../../components/auth";

interface Registration {
  id: number;
  subjectCode: string;
  subjectName: string;
  status: string;
  student: {
    studentId: string;
  };
}

const registrations: Registration[] = registrationsData;

export default function FeedbackSubjects() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [myCourses, setMyCourses] = useState<Registration[]>([]);

  const [studentId, setStudentId] = useState<string | null>(null);

      useEffect(() => {
    const currentStudentId = getCurrentStudentId();
    const role = document.cookie
      .split("; ")
      .find(row => row.startsWith("role="))
      ?.split("=")[1];
    const decodedRole = role ? decodeURIComponent(role) : null;

    // Kiểm tra quyền truy cập
    if (!decodedRole || decodedRole !== "student") {
      navigate("/unauthorized");
      return;
    }

    if (!currentStudentId) {
      console.error("Không tìm thấy studentId của người dùng hiện tại");
      navigate("/login"); 
      return;
    }

    const enrolled = registrations.filter(
      (reg) =>
        reg.student.studentId === currentStudentId && 
        reg.status === "registered"
    );

    setMyCourses(enrolled);
    setStudentId(currentStudentId); 
  }, [navigate]);

  // Danh sách màu nền cho các ô (tự động lặp lại nếu nhiều hơn 9 môn)
  const colors = [
    "#6C63FF", // tím
    "#4CAF50", // xanh lá
    "#F44336", // đỏ
    "#FFC107", // vàng
    "#2196F3", // xanh dương
    "#8BC34A", // xanh nhạt
    "#E91E63", // hồng
    "#FF9800", // cam
    "#9C27B0", // tím đậm
  ];

  return (
    <div className="page-outer">
      <div className="page-inner">
        <div className="student-page">
          {/* Overlay khi mở menu */}
          {menuOpen && (
            <div
              onClick={() => setMenuOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.5)",
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

          <main className="content">
            <div className="home-title">Các khóa học của tôi</div>

            <div className="breadcrumb-row">
              <div className="breadcrumb">
                <img className="home-logo" src={home_icon} alt="home" />
                BKTutorPortal &gt; Các khóa học của tôi
              </div>
            </div>

            {/* Tổng quan */}
            <div className="courses-summary">
              <h3>Tổng quan các khóa học</h3>
              <div className="courses-count">
                Tổng số môn đã đăng ký: <strong>{myCourses.length}</strong> môn
              </div>
            </div>

            {/* Danh sách môn học - Grid 3 cột */}
            <div className="courses-grid">
              {myCourses.length === 0 ? (
                <div className="no-courses">
                  <p>Bạn chưa đăng ký môn học nào.</p>
                  <button
                    className="register-btn-small"
                    onClick={() => navigate("/register-program")}
                  >
                    Đăng ký ngay
                  </button>
                </div>
              ) : (
                myCourses.map((course, index) => (
                  <div
                    key={course.id}
                    className="course-card cursor-pointer"
                    style={{ backgroundColor: colors[index % colors.length] }}
                    onClick={() => {
                      if (!studentId) {
                        alert("Không thể tải thông tin sinh viên. Vui lòng đăng nhập lại.");
                        return;
                      }
                      const semester = "2024-2025-HK1"; 
                      navigate(`/feedback/${course.subjectCode}/${studentId}/${semester}`);
                    }}
                    >
                    <div className="course-code">{course.subjectCode}</div>
                    <div className="course-name">{course.subjectName}</div>
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