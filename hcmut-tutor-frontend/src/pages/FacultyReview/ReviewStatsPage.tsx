import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import home_icon from "../../images/Home.svg";
import "../../styles/IndexPage.css";
import "../../styles/FacultyReview.css";
import SideBarOpen from "../../components/SideBarOpen";
import SidebarRail from "../../components/SidebarRail";
import TopBar from "../../components/TopBar";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Helper function to convert Vietnamese to non-accented text for PDF
const removeVietnameseAccents = (str: string): string => {
  const accentsMap: { [key: string]: string } = {
    'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
    'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
    'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
    'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
    'ê': 'e', 'ề': 'e', 'ế': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
    'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
    'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
    'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
    'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
    'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
    'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
    'ỳ': 'y', 'ý': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
    'đ': 'd',
    'À': 'A', 'Á': 'A', 'Ả': 'A', 'Ã': 'A', 'Ạ': 'A',
    'Ă': 'A', 'Ằ': 'A', 'Ắ': 'A', 'Ẳ': 'A', 'Ẵ': 'A', 'Ặ': 'A',
    'Â': 'A', 'Ầ': 'A', 'Ấ': 'A', 'Ẩ': 'A', 'Ẫ': 'A', 'Ậ': 'A',
    'È': 'E', 'É': 'E', 'Ẻ': 'E', 'Ẽ': 'E', 'Ẹ': 'E',
    'Ê': 'E', 'Ề': 'E', 'Ế': 'E', 'Ể': 'E', 'Ễ': 'E', 'Ệ': 'E',
    'Ì': 'I', 'Í': 'I', 'Ỉ': 'I', 'Ĩ': 'I', 'Ị': 'I',
    'Ò': 'O', 'Ó': 'O', 'Ỏ': 'O', 'Õ': 'O', 'Ọ': 'O',
    'Ô': 'O', 'Ồ': 'O', 'Ố': 'O', 'Ổ': 'O', 'Ỗ': 'O', 'Ộ': 'O',
    'Ơ': 'O', 'Ờ': 'O', 'Ớ': 'O', 'Ở': 'O', 'Ỡ': 'O', 'Ợ': 'O',
    'Ù': 'U', 'Ú': 'U', 'Ủ': 'U', 'Ũ': 'U', 'Ụ': 'U',
    'Ư': 'U', 'Ừ': 'U', 'Ứ': 'U', 'Ử': 'U', 'Ữ': 'U', 'Ự': 'U',
    'Ỳ': 'Y', 'Ý': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y', 'Ỵ': 'Y',
    'Đ': 'D',
  };
  return str.split('').map(char => accentsMap[char] || char).join('');
};

interface RatingDistribution {
  rating: number;
  count: number;
  percentage: number;
}

interface TutorSummary {
  tutorId: string;
  tutorName: string;
  totalReviews: number;
  averageRating: string;
}

interface Stats {
  totalReviews: number;
  respondedReviews: number;
  pendingReviews: number;
  averageRating: string;
  ratingDistribution: RatingDistribution[];
  tutorSummary: TutorSummary[];
}

export default function ReviewStatsPage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [semesters, setSemesters] = useState<string[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const exportDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target as Node)) {
        setExportDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auth check
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

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const params = new URLSearchParams();
        if (selectedSemester !== "all") {
          params.append("semester", selectedSemester);
        }

        const response = await fetch(
          `http://localhost:3001/reviews/stats/summary?${params.toString()}`
        );
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setStats(data.stats);
            setSemesters(data.semesters);
          }
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [selectedSemester]);

  const exportToCSV = () => {
    if (!stats) return;

    // Create CSV content
    let csvContent = "Thống kê đánh giá chương trình Tutor\n\n";
    csvContent += `Học kỳ: ${selectedSemester === "all" ? "Tất cả" : selectedSemester}\n`;
    csvContent += `Ngày xuất: ${new Date().toLocaleDateString("vi-VN")}\n\n`;

    csvContent += "TỔNG QUAN\n";
    csvContent += `Tổng số đánh giá,${stats.totalReviews}\n`;
    csvContent += `Đã phản hồi,${stats.respondedReviews}\n`;
    csvContent += `Chờ phản hồi,${stats.pendingReviews}\n`;
    csvContent += `Đánh giá trung bình,${stats.averageRating}/5\n\n`;

    csvContent += "PHÂN BỐ ĐÁNH GIÁ\n";
    csvContent += "Số sao,Số lượng,Tỷ lệ\n";
    stats.ratingDistribution.forEach((item) => {
      csvContent += `${item.rating} sao,${item.count},${item.percentage}%\n`;
    });

    csvContent += "\nTHỐNG KÊ THEO TUTOR\n";
    csvContent += "Mã Tutor,Tên Tutor,Số đánh giá,Điểm trung bình\n";
    stats.tutorSummary.forEach((tutor) => {
      csvContent += `${tutor.tutorId},${tutor.tutorName},${tutor.totalReviews},${tutor.averageRating}\n`;
    });

    // Create blob and download
    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `thong-ke-danh-gia-${selectedSemester === "all" ? "tat-ca" : selectedSemester.replace(/\s/g, "-")}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToXLSX = () => {
    if (!stats) return;

    // Create workbook
    const wb = XLSX.utils.book_new();

    // Summary sheet
    const summaryData = [
      ["THỐNG KÊ ĐÁNH GIÁ CHƯƠNG TRÌNH TUTOR"],
      [],
      ["Học kỳ", selectedSemester === "all" ? "Tất cả" : selectedSemester],
      ["Ngày xuất", new Date().toLocaleDateString("vi-VN")],
      [],
      ["TỔNG QUAN"],
      ["Tổng số đánh giá", stats.totalReviews],
      ["Đã phản hồi", stats.respondedReviews],
      ["Chờ phản hồi", stats.pendingReviews],
      ["Đánh giá trung bình", `${stats.averageRating}/5`],
    ];
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summarySheet, "Tổng quan");

    // Rating distribution sheet
    const ratingData = [
      ["PHÂN BỐ ĐÁNH GIÁ"],
      [],
      ["Số sao", "Số lượng", "Tỷ lệ (%)"],
      ...stats.ratingDistribution.map((item) => [
        `${item.rating} sao`,
        item.count,
        item.percentage,
      ]),
    ];
    const ratingSheet = XLSX.utils.aoa_to_sheet(ratingData);
    XLSX.utils.book_append_sheet(wb, ratingSheet, "Phân bố đánh giá");

    // Tutor stats sheet
    const tutorData = [
      ["THỐNG KÊ THEO TUTOR"],
      [],
      ["STT", "Mã Tutor", "Tên Tutor", "Số đánh giá", "Điểm trung bình"],
      ...stats.tutorSummary.map((tutor, index) => [
        index + 1,
        tutor.tutorId,
        tutor.tutorName,
        tutor.totalReviews,
        tutor.averageRating,
      ]),
    ];
    const tutorSheet = XLSX.utils.aoa_to_sheet(tutorData);
    XLSX.utils.book_append_sheet(wb, tutorSheet, "Thống kê Tutor");

    // Download
    XLSX.writeFile(
      wb,
      `thong-ke-danh-gia-${selectedSemester === "all" ? "tat-ca" : selectedSemester.replace(/\s/g, "-")}.xlsx`
    );
    setExportDropdownOpen(false);
  };

  const exportToPDF = () => {
    if (!stats) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Title
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("THONG KE DANH GIA CHUONG TRINH TUTOR", pageWidth / 2, 20, { align: "center" });

    // Info
    doc.setFontSize(13);
    doc.setFont("helvetica", "normal");
    doc.text(`Hoc ky: ${selectedSemester === "all" ? "Tat ca" : removeVietnameseAccents(selectedSemester)}`, 14, 35);
    doc.text(`Ngay xuat: ${new Date().toLocaleDateString("vi-VN")}`, 14, 42);

    // Summary section
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("TONG QUAN", 14, 55);

    autoTable(doc, {
      startY: 60,
      head: [["Chi tieu", "Gia tri"]],
      body: [
        ["Tong so danh gia", stats.totalReviews.toString()],
        ["Da phan hoi", stats.respondedReviews.toString()],
        ["Cho phan hoi", stats.pendingReviews.toString()],
        ["Danh gia trung binh", `${stats.averageRating}/5`],
      ],
      styles: { fontSize: 13, font: "helvetica" },
      headStyles: { fillColor: [0, 115, 183] },
    });

    // Rating distribution
    const finalY1 = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("PHAN BO DANH GIA", 14, finalY1 + 15);

    autoTable(doc, {
      startY: finalY1 + 20,
      head: [["So sao", "So luong", "Ty le (%)"]],
      body: stats.ratingDistribution.map((item) => [
        `${item.rating} sao`,
        item.count.toString(),
        `${item.percentage}%`,
      ]),
      styles: { fontSize: 13, font: "helvetica" },
      headStyles: { fillColor: [0, 115, 183] },
    });

    // Tutor stats
    const finalY2 = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("THONG KE THEO TUTOR", 14, finalY2 + 15);

    autoTable(doc, {
      startY: finalY2 + 20,
      head: [["STT", "Ma Tutor", "Ten Tutor", "So danh gia", "Diem TB"]],
      body: stats.tutorSummary.map((tutor, index) => [
        (index + 1).toString(),
        tutor.tutorId,
        removeVietnameseAccents(tutor.tutorName),
        tutor.totalReviews.toString(),
        tutor.averageRating,
      ]),
      styles: { fontSize: 13, font: "helvetica" },
      headStyles: { fillColor: [0, 115, 183] },
    });

    // Save
    doc.save(
      `thong-ke-danh-gia-${selectedSemester === "all" ? "tat-ca" : selectedSemester.replace(/\s/g, "-")}.pdf`
    );
    setExportDropdownOpen(false);
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
            onLogoClick={() => navigate("/faculty-dashboard")}
          />

          <main className="content">
            {/* Header with title and breadcrumb aligned */}
            <div className="faculty-review-header">
              <div className="home-title" style={{ margin: 0 }}>Thống kê đánh giá</div>
              <div className="breadcrumb" style={{ margin: 0, display: "flex", alignItems: "center" }}>
                <img className="home-logo" src={home_icon} alt="home icon" />
                BKTutorPortal &gt;{" "}
                <span
                  style={{ cursor: "pointer", color: "#0073B7", marginLeft: 4 }}
                  onClick={() => navigate("/faculty-reviews")}
                >
                  Dữ liệu đánh giá
                </span>{" "}
                &gt; Thống kê
              </div>
            </div>

            {/* Filter & Export */}
            <div className="stats-filter-section" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end'}}>
              <div className="filter-group">
                <label>Học kỳ:</label>
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">Tất cả</option>
                  {semesters.map((sem) => (
                    <option key={sem} value={sem}>
                      {sem}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: '12px' }}>
                <button
                  className="btn-back"
                  onClick={() => navigate("/faculty-reviews")}
                >
                  ← Quay lại
                </button>

                <div className="export-dropdown-container" ref={exportDropdownRef}>
                  <button
                    className="export-dropdown-btn"
                    onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
                  >
                    Xuất báo cáo ▼
                  </button>
                  {exportDropdownOpen && (
                    <div className="export-dropdown-menu">
                      <button className="export-dropdown-item" onClick={exportToCSV}>
                        Xuất CSV (.csv)
                      </button>
                      <button className="export-dropdown-item" onClick={exportToXLSX}>
                        Xuất Excel (.xlsx)
                      </button>
                      <button className="export-dropdown-item" onClick={exportToPDF}>
                        Xuất PDF (.pdf)
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {loading ? (
              <div className="loading">Đang tải...</div>
            ) : stats ? (
              <div className="stats-container">
                {/* Summary Cards */}
                <div className="stats-summary-cards">
                  <div className="stats-card">
                    <div className="stats-card-value">{stats.totalReviews}</div>
                    <div className="stats-card-label">Tổng đánh giá</div>
                  </div>
                  <div className="stats-card responded">
                    <div className="stats-card-value">
                      {stats.respondedReviews}
                    </div>
                    <div className="stats-card-label">Đã phản hồi</div>
                  </div>
                  <div className="stats-card pending">
                    <div className="stats-card-value">
                      {stats.pendingReviews}
                    </div>
                    <div className="stats-card-label">Chờ phản hồi</div>
                  </div>
                  <div className="stats-card rating">
                    <div className="stats-card-value">
                      {stats.averageRating} ★
                    </div>
                    <div className="stats-card-label">Đánh giá TB</div>
                  </div>
                </div>

                {/* Rating Distribution */}
                <div className="stats-section">
                  <h3 className="stats-section-title">Phân bố đánh giá</h3>
                  <div className="rating-distribution">
                    {stats.ratingDistribution.map((item) => (
                      <div key={item.rating} className="rating-bar">
                        <span className="rating-label">
                          {item.rating}{" "}
                          <span style={{ color: "#ffc107" }}>★</span>
                        </span>
                        <div className="rating-bar-container">
                          <div
                            className="rating-bar-fill"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                        <span className="rating-count">
                          {item.count} ({item.percentage}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tutor Stats */}
                <div className="stats-section">
                  <h3 className="stats-section-title">Thống kê theo Tutor</h3>
                  {stats.tutorSummary.length > 0 ? (
                    <table className="tutor-stats-table">
                      <thead>
                        <tr>
                          <th>STT</th>
                          <th>Mã Tutor</th>
                          <th>Tên Tutor</th>
                          <th>Số đánh giá</th>
                          <th>Điểm trung bình</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.tutorSummary.map((tutor, index) => (
                          <tr key={tutor.tutorId}>
                            <td>{index + 1}</td>
                            <td>{tutor.tutorId}</td>
                            <td>{tutor.tutorName}</td>
                            <td>{tutor.totalReviews}</td>
                            <td>
                              <span style={{ color: "#ffc107" }}>
                                {tutor.averageRating} ★
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="no-data">Không có dữ liệu</div>
                  )}
                </div>
              </div>
            ) : (
              <div className="no-data">Không có dữ liệu thống kê</div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
