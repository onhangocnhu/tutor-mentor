import hcmut_logo from "../../images/hcmut_logo.png";
import menu_icon from "../../images/menu.png";
import home_icon from "../../images/Home.svg";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import TimesNewRomanBase64 from "./base64";
import registrationsData from "../../../../hcmut-tutor-backend/data/registrations.json";
import studentsData from "../../../../hcmut-tutor-backend/data/students.json";

import "../../styles/CtsvIndexPage.css";

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
  subjectCount: number;
}

const registrations: Registration[] = registrationsData;
const students: Student[] = studentsData;

export default function ResultAllPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [gradesOpen, setGradesOpen] = useState(false);
  const navigate = useNavigate();
  
    const goToResultOne = () => {
      navigate("/result-one");
    };
  
    const goToResultAll = () => {
      navigate("/result-all");
    };
  
  const [semester, setSemester] = useState("Học kỳ 1 năm học 2024-2025");
  const [resultsAll, setResultsAll] = useState<ResultType[]>([]);
  const [showError, setShowError] = useState(false);

  const getSemesterFromDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    if (month >= 8 && month <= 12) {
      return `Học kỳ 1 năm học ${year}-${year + 1}`;
    } else if (month >= 1 && month <= 6) {
      return `Học kỳ 2 năm học ${year - 1}-${year}`;
    }
    return "Không xác định";
  };

  const handleSearch = () => {
    const filteredRegistrations = registrations.filter((reg) => {
      if (reg.status !== "registered") return false;
      const regSemester = getSemesterFromDate(reg.registerTime);
      return regSemester === semester;
    });

    if (filteredRegistrations.length === 0) {
      setResultsAll([]);
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
      return;
    }

    const studentMap = new Map<string, Registration[]>();

    filteredRegistrations.forEach((reg) => {
      const id = reg.student.studentId;
      if (!studentMap.has(id)) {
        studentMap.set(id, []);
      }
      studentMap.get(id)!.push(reg);
    });

    const results: ResultType[] = [];

    studentMap.forEach((regs, studentId) => {
      const student = students.find((s) => s.studentId === studentId);
      if (!student) return;

      const subjectCount = regs.length;

      let evaluationResult = "Hoàn thành tốt";
      let score = "5";

      if (subjectCount >= 6) {
        evaluationResult = "Hoàn thành xuất sắc";
        score = "15";
      } else if (subjectCount >= 5) {
        score = "10";
      }

      results.push({
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
        subjectCount,
      });
    });

    // Sắp xếp theo tên
    results.sort((a, b) => a.name.localeCompare(b.name, "vi"));

    setResultsAll(results);
    setShowError(false);
  };

  const handleDownloadAllPDF = () => {
  if (resultsAll.length === 0) {
    alert("Không có dữ liệu để xuất PDF!");
    return;
  }

  const doc = new jsPDF("l", "mm", "a4"); 
  doc.addFileToVFS("times-new-roman.ttf", TimesNewRomanBase64);
  doc.addFont("times-new-roman.ttf", "TimesNewRoman", "normal");
  doc.addFont("times-new-roman.ttf", "TimesNewRoman", "bold");
  doc.setFont("TimesNewRoman"); 

  // === TIÊU ĐỀ ===
  doc.setFontSize(20);
  doc.setFont("TimesNewRoman", "bold");
  doc.text("KẾT QUẢ THAM GIA CHƯƠNG TRÌNH TUTOR", 148, 20, { align: "center" });

  doc.setFontSize(16);
  doc.setFont("TimesNewRoman", "normal");
  doc.text(semester, 148, 30, { align: "center" });

  const headers = [
    "STT",
    "Họ và tên",
    "MSSV",
    "Khoa/TT Đào tạo",
    "Lớp",
    "Kết quả đánh giá",
    "Số môn",
    "Điểm RL",
  ];

  const tableData = resultsAll.map((r, i) => [
    (i + 1).toString(),
    r.name,
    r.studentId,
    r.faculty,
    r.classCode,
    r.evaluationResult,
    r.subjectCount.toString(),
    r.score,
  ]);

  autoTable(doc, {
    head: [headers],
    body: tableData,
    startY: 40,
    theme: "grid",
    styles: {
      font: "TimesNewRoman",     
      fontStyle: "normal",
      fontSize: 11,
      cellPadding: 5,
      overflow: "linebreak",
      halign: "center",
    },
    headStyles: {
      fillColor: [0, 102, 204],
      textColor: 255,
      fontStyle: "bold",
      fontSize: 12,
      halign: "center",
    },
    alternateRowStyles: {
      fillColor: [240, 248, 255],
    },
    columnStyles: {
      0: { cellWidth: 15, halign: "center" },
      1: { cellWidth: 40 },
      2: { cellWidth: 30, halign: "center" },
      3: { cellWidth: 60 },
      4: { cellWidth: 30, halign: "center" },
      5: { cellWidth: 50 },
      6: { cellWidth: 20, halign: "center" },
      7: { cellWidth: 25, halign: "center" },
    },
    margin: { top: 40 },
  });

  // === FOOTER: Ngày in ===
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(
      `Ngày in: ${new Date().toLocaleDateString("vi-VN")} | Trang ${i}/${pageCount}`,
      148,
      205,
      { align: "center" }
    );
  }

  // === LƯU FILE ===
  const safeSemester = semester.replace(/[^a-zA-Z0-9]/g, "_");
  doc.save(`KetQua_TatCaSinhVien_${safeSemester}.pdf`);
};

  return (
    <div className="page-outer">
      <div className="page-inner">
        <header className="topbar">
          <div className={`logo-box ${sidebarOpen ? "open" : ""}`}>
            <div className="logo-text">Bk</div>
          </div>
          <button className="menu-btn" onClick={() => setSidebarOpen((o) => !o)}>
            <img className="top-menu" src={menu_icon} alt="menu" />
          </button>
        </header>

        <div className="student-page">
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

          <main className="content">
            <div className="home-title">Tra cứu kết quả tham gia</div>

            <div className="breadcrumb-row">
              <div className="breadcrumb">
                <img className="home-logo" src={home_icon} alt="home" />
                BKTutorPortal &gt; Kết quả tham gia
              </div>
            </div>

            <div className="lookup-card">
              <div className="lookup-card-title">Chọn học kỳ</div>
              <div className="lookup-form-row">
                <label>Thời gian</label>
                <div className="custom-select-wrapper">
                  <select value={semester} onChange={(e) => setSemester(e.target.value)} className="lookup-input">
                    <option>Học kỳ 1 năm học 2024-2025</option>
                    <option>Học kỳ 2 năm học 2024-2025</option>
                    <option>Học kỳ 1 năm học 2025-2026</option>
                    <option>Học kỳ 2 năm học 2025-2026</option>
                  </select>
                  <span className="custom-arrow">▼</span>
                </div>
              </div>
              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <button className="lookup-btn" onClick={handleSearch}>
                  Xem tất cả
                </button>
              </div>
            </div>

            {showError && (
              <div className="lookup-error">
                Không có dữ liệu trong học kỳ này.
              </div>
            )}

            {resultsAll.length > 0 && (
              <div className="result-all-card">
                <div className="result-all-card-header">
                  <span className="result-all-card-title">
                    Kết quả tham gia - {semester} ({resultsAll.length} sinh viên)
                  </span>
                  <button className="download-btn" onClick={handleDownloadAllPDF}>
                    Tải xuống PDF
                  </button>
                </div>

                <div style={{ overflowX: "auto" }}>
                  <table className="result-table">
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Họ và tên</th>
                        <th>MSSV</th>
                        <th>Khoa</th>
                        <th>Lớp</th>
                        <th>Kết quả đánh giá</th>
                        <th>Số môn</th>
                        <th>Điểm RL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resultsAll.map((r, i) => (
                        <tr key={r.studentId}>
                          <td>{i + 1}</td>
                          <td>{r.name}</td>
                          <td>{r.studentId}</td>
                          <td>{r.faculty}</td>
                          <td>{r.classCode}</td>
                          <td>{r.evaluationResult}</td>
                          <td>{r.subjectCount}</td>
                          <td>{r.score}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}