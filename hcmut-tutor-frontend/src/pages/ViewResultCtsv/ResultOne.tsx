import hcmut_logo from "../../images/hcmut_logo.png";
import menu_icon from "../../images/menu.png";
import home_icon from "../../images/Home.svg";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import registrationsData from "../../../../hcmut-tutor-backend/data/registrations.json";
import studentsData from "../../../../hcmut-tutor-backend/data/students.json";
import { jsPDF } from "jspdf";
import "../../styles/CtsvIndexPage.css";
import TimesNewRomanBase64 from "./base64";


interface ResultType {
  studentId: string;
  semester: string;
  name: string;
  faculty: string;
  classCode: string;
  email: string;
  educationLevel: string;
  trainingType: string;
  programYear: string;
  evaluationResult: string;
  score: string;
  subjectCount: string;
}

interface Registration {
  id: number;
  registerTime: string;
  status: string;
  subjectCode: string;
  subjectName: string;
  student: {
    username: string;
    fullName: string;
    studentId: string;
    email: string;
    classCode: string;
    faculty: string;
  };
  tutor: {
    username: string;
    fullName: string;
    tutorId: string;
  };
}

interface Student {
  username: string;
  fullName: string;
  studentId: string;
  faculty: string;
  classCode: string;
  email: string;
  degree: string;
  trainingSystem: string;
  year: string;
}

const registrations: Registration[] = registrationsData;
const students: Student[] = studentsData;

function getSemesterDates(semester: string): { start: Date; end: Date } {
  if (semester === "Học kỳ 1 năm học 2024-2025") {
    return { start: new Date("2024-08-01"), end: new Date("2025-01-31") };
  } else if (semester === "Học kỳ 2 năm học 2024-2025") {
    return { start: new Date("2025-02-01"), end: new Date("2025-06-30") };
  } else if (semester === "Học kỳ 1 năm học 2025-2026") {
    return { start: new Date("2025-08-01"), end: new Date("2026-01-31") };
  } else if (semester === "Học kỳ 2 năm học 2025-2026") {
    return { start: new Date("2026-02-01"), end: new Date("2026-06-30") };
  }
  throw new Error("Unknown semester");
}

function isInSemester(registerTime: string, semester: string): boolean {
  const date = new Date(registerTime);
  const { start, end } = getSemesterDates(semester);
  return date >= start && date <= end;
}

export default function ResultOnePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [gradesOpen, setGradesOpen] = useState(false);

  const navigate = useNavigate();

  const goToResultOne = () => {
    navigate("/result-one");
  };

  const goToResultAll = () => {
    navigate("/result-all");
  };

  const [studentId, setStudentId] = useState("");
  const [semester, setSemester] = useState("Học kỳ 1 năm học 2025-2026");
  const [result, setResult] = useState<ResultType | null>(null);

  const [showError, setShowError] = useState(false);

  const handleSearch = () => {
    const student = students.find((s: Student) => s.studentId === studentId);
    if (!student) {
      setResult(null);
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
      return;
    }

    const registeredSubjects = registrations.filter(
      (r: Registration) =>
        r.student.studentId === studentId &&
        r.status === "registered" &&
        isInSemester(r.registerTime, semester)
    );

    const subjectCountNum = registeredSubjects.length;

    if (subjectCountNum === 0) {
      setResult(null);
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
      return;
    }

    let evaluationResult = "Hoàn thành tốt";
    let score = "5";

    if (subjectCountNum >= 6) {
      evaluationResult = "Hoàn thành xuất sắc";
      score = "92";
    } else if (subjectCountNum >= 5) {
      score = "10";
    }

    const newResult: ResultType = {
      studentId: student.studentId,
      semester,
      name: student.fullName,
      faculty: student.faculty,
      classCode: student.classCode,
      email: student.email,
      educationLevel: student.degree,
      trainingType: student.trainingSystem,
      programYear: student.year,
      evaluationResult,
      score,
      subjectCount: subjectCountNum.toString(),
    };

    setResult(newResult);
    setShowError(false);
  };

  const handleDownloadPDF = async () => {
  if (!result) return;

  try {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    doc.addFileToVFS("times-new-roman.ttf", TimesNewRomanBase64);
    doc.addFont("times-new-roman.ttf", "TimesNewRoman", "normal");
    doc.addFont("times-new-roman.ttf", "TimesNewRoman", "bold");
    doc.setFont("TimesNewRoman"); 

    // ==================== NỘI DUNG PDF ====================
    doc.setFontSize(18);
    doc.setFont("TimesNewRoman", "bold");
    doc.text("KẾT QUẢ THAM GIA CHƯƠNG TRÌNH TUTOR", 105, 25, { align: "center" });

    doc.setFontSize(14);
    doc.setFont("TimesNewRoman", "normal");
    doc.text("ĐẠI HỌC QUỐC GIA TP.HCM - TRƯỜNG ĐẠI HỌC BÁCH KHOA", 105, 35, { align: "center" });

    doc.setFontSize(13);
    doc.text("PHÒNG CÔNG TÁC SINH VIÊN", 105, 43, { align: "center" });

    doc.setLineWidth(0.5);
    doc.line(20, 50, 190, 50);

    let y = 65;

    const fields = [
      { label: "Họ và tên", value: result.name },
      { label: "Mã sinh viên", value: result.studentId },
      { label: "Thời gian", value: result.semester },
      { label: "Khoa/TT Đào tạo", value: result.faculty },
      { label: "Mã lớp", value: result.classCode },
      { label: "Email", value: result.email },
      { label: "Bậc đào tạo", value: result.educationLevel },
      { label: "Hình thức đào tạo", value: result.trainingType },
      { label: "Năm vào trường", value: result.programYear },
      { label: "Kết quả đánh giá", value: result.evaluationResult },
      { label: "Số môn đã hỗ trợ", value: result.subjectCount + " môn" },
      { label: "Điểm cộng rèn luyện quy đổi", value: result.score + " điểm" },
    ];

    doc.setFontSize(12);
    doc.setFont("TimesNewRoman", "normal");

    fields.forEach((field) => {
      doc.text(`${field.label}:`, 30, y);
      doc.setFont("TimesNewRoman", "bold");
      doc.text(field.value, 80, y);
      doc.setFont("TimesNewRoman", "normal");
      y += 12;
    });

    doc.setFontSize(11);
    doc.text(`Ngày in: ${new Date().toLocaleDateString("vi-VN")}`, 30, y + 20);

    const fileName = `${result.studentId}_KetQuaHoTroHocTap_${new Date()
      .toISOString()
      .slice(0, 10)}.pdf`;
    doc.save(fileName);
  } catch (err) {
    console.error(err);
    alert("Lỗi tạo PDF - kiểm tra console!");
  }
};

  return (
    <div className="page-outer">
      <div className="page-inner">
        <header className="topbar">
          <div className={`logo-box ${sidebarOpen ? "open" : ""}`}>
            <div className="logo-text">Bk</div>
          </div>

          <button
            className="menu-btn"
            onClick={() => {
              console.log("Click!");
              setSidebarOpen((o) => !o);
            }}
          >
            <img className="top-menu" src={menu_icon} alt="menu" />
          </button>
        </header>
        <div className="student-page">
          {/* SIDEBAR */}
          <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
            <div className="iden">
              <img
                className="sidebar-avatar"
                src={hcmut_logo}
                alt="HCMUT logo"
              />
              <div className="iden-inner">
                <h3>Phòng Công tác Sinh viên</h3>
                <p>Bách Khoa</p>
              </div>
            </div>

            <nav className="sidebar-nav">
              {/* KẾT QUẢ HỌC TẬP – Toggle */}
              <div
                className="sidebar-item toggle"
                onClick={() => sidebarOpen && setGradesOpen(!gradesOpen)}
              >
                <span className="sidebar-text">
                  Kết quả tham gia chương trình
                </span>
                <span className={`chevron ${gradesOpen ? "open" : ""}`}>▶</span>
              </div>

              {/* Submenu */}
              {sidebarOpen && gradesOpen && (
                <div className="submenu">
                  <div className="submenu-item" onClick={goToResultOne}>
                    Kết quả tham gia của một sinh viên
                  </div>
                  <div className="submenu-item" onClick={goToResultAll}>
                    Kết quả tham gia của tất cả sinh viên
                  </div>
                </div>
              )}

              {/* CỔNG THƯ VIỆN */}
              <div className="sidebar-item">
                <span className="sidebar-text">Cổng thư viện</span>
              </div>
            </nav>
          </aside>

          {/* MAIN CONTENT */}
          <main className="content">
            <div className="home-title">Tra cứu kết quả tham gia</div>

            <div className="breadcrumb-row">
              <div className="breadcrumb">
                <img className="home-logo" src={home_icon} alt="home" />
                BKTutorPortal &gt; Xem kết quả tham gia
              </div>
            </div>

            <div className="lookup-card">
              <div className="lookup-card-title">Điền thông tin tra cứu</div>

              {/* Form nhập thông tin */}
              <div className="lookup-form">
                <div className="lookup-form-row">
                  <label>Mã số sinh viên</label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="Nhập mã số sinh viên"
                  />
                </div>

                <div className="lookup-form-row">
                  <label>Thời gian</label>
                  <div className="custom-select-wrapper">
                    <select
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      className="lookup-input"
                    >
                      <option>Học kỳ 1 năm học 2024-2025</option>
                      <option>Học kỳ 2 năm học 2024-2025</option>
                      <option>Học kỳ 1 năm học 2025-2026</option>
                      <option>Học kỳ 2 năm học 2025-2026</option>
                    </select>
                    <span className="custom-arrow">▼</span>
                  </div>
                </div>
              </div>

              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <button className="lookup-btn" onClick={handleSearch}>
                  Tra cứu
                </button>
              </div>
            </div>

            {showError && (
              <div className="lookup-error">
                Lỗi: Không tìm thấy dữ liệu được tra cứu.
              </div>
            )}

            {result && (
              <div className="result-one-card">
                <div className="result-one-card-header">
                  <span className="result-one-card-title">
                    Kết quả tham gia
                  </span>
                  <button className="download-btn" onClick={handleDownloadPDF}>
                    Tải xuống PDF
                  </button>
                </div>

                <div className="lookup-result">
                  <div className="result-item">
                    <span className="result-label">Họ và tên</span>
                    <span className="result-value">{result.name}</span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">Mã sinh viên</span>
                    <span className="result-value">{result.studentId}</span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">Thời gian</span>
                    <span className="result-value">{result.semester}</span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">Khoa/TT Đào tạo</span>
                    <span className="result-value">{result.faculty}</span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">Mã lớp</span>
                    <span className="result-value">{result.classCode}</span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">Email</span>
                    <span className="result-value">{result.email}</span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">Bậc học:</span>
                    <span className="result-value">
                      {result.educationLevel}
                    </span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">Hình thức đào tạo</span>
                    <span className="result-value">{result.trainingType}</span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">Năm CTĐT</span>
                    <span className="result-value">{result.programYear}</span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">Kết quả đánh giá</span>
                    <span className="result-value">
                      {result.evaluationResult}
                    </span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">Số lượng môn tham gia</span>
                    <span className="result-value">{result.subjectCount}</span>
                  </div>
                  <div className="result-item">
                    <span className="result-label">
                      Điểm cộng điểm rèn luyện quy đổi
                    </span>
                    <span className="result-value">{result.score}</span>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}