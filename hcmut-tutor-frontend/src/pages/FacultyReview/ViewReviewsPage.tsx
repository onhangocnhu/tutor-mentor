import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import home_icon from "../../images/Home.svg";
import "../../styles/IndexPage.css";
import "../../styles/FacultyReview.css";
import SideBarOpen from "../../components/SideBarOpen";
import SidebarRail from "../../components/SidebarRail";
import TopBar from "../../components/TopBar";

interface Review {
  id: number;
  studentId: string;
  studentName: string;
  tutorId: string;
  tutorName: string;
  subject: string;
  semester: string;
  rating: number;
  comment: string;
  date: string;
  status: "pending" | "responded";
  facultyResponse: string | null;
}

export default function ViewReviewsPage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [semesters, setSemesters] = useState<string[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState(true);

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

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const params = new URLSearchParams();
        if (selectedSemester !== "all") params.append("semester", selectedSemester);
        if (selectedStatus !== "all") params.append("status", selectedStatus);
        if (searchTerm) params.append("search", searchTerm);

        const response = await fetch(`http://localhost:3001/reviews?${params.toString()}`);
        if (response.ok) {
          const data = await response.json();
          setReviews(data.reviews);
          setSemesters(data.semesters);
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [selectedSemester, selectedStatus, searchTerm]);

  const renderStars = (rating: number) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={star <= rating ? "star filled" : "star"}>
            ★
          </span>
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
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
              <div className="home-title" style={{ margin: 0 }}>Dữ liệu đánh giá</div>
              <div className="breadcrumb" style={{ margin: 0, display: "flex", alignItems: "center" }}>
                <img className="home-logo" src={home_icon} alt="home icon" />
                BKTutorPortal &gt; Dữ liệu đánh giá
              </div>
            </div>

            {/* Filter Section */}
            <div className="review-filters">
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

              <div className="filter-group">
                <label>Trạng thái:</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">Tất cả</option>
                  <option value="pending">Chờ phản hồi</option>
                  <option value="responded">Đã phản hồi</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Tìm kiếm:</label>
                <input
                  type="text"
                  placeholder="Tên SV, Tutor, Môn học..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="filter-input"
                />
              </div>

              <button
                className="stats-button"
                onClick={() => navigate("/faculty-reviews/stats")}
              >
                Thống kê
              </button>
            </div>

            {/* Reviews Table */}
            <div className="reviews-table-container">
              {loading ? (
                <div className="loading">Đang tải...</div>
              ) : reviews.length === 0 ? (
                <div className="no-data">Không có đánh giá nào</div>
              ) : (
                <table className="reviews-table">
                  <thead>
                    <tr>
                      <th className="center">STT</th>
                      <th className="center">MSSV</th>
                      <th>Sinh viên</th>
                      <th>Tutor</th>
                      <th>Môn học</th>
                      <th className="center">Đánh giá</th>
                      <th className="center">Ngày</th>
                      <th className="center">Trạng thái</th>
                      <th className="center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.map((review, index) => (
                      <tr key={review.id}>
                        <td className="center">{index + 1}</td>
                        <td className="center">{review.studentId}</td>
                        <td>{review.studentName}</td>
                        <td>{review.tutorName}</td>
                        <td>{review.subject}</td>
                        <td className="center">{renderStars(review.rating)}</td>
                        <td className="center">{formatDate(review.date)}</td>
                        <td className="center">
                          <span className={`status-badge ${review.status}`}>
                            {review.status === "pending" ? "Chờ phản hồi" : "Đã phản hồi"}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons" style={{ justifyContent: "center" }}>
                            <button
                              className="action-btn view"
                              onClick={() => navigate(`/faculty-reviews/${review.id}`)}
                              title="Xem chi tiết"
                            >
                              👁
                            </button>
                            {review.status === "pending" && (
                              <button
                                className="action-btn respond"
                                onClick={() => navigate(`/faculty-reviews/${review.id}/respond`)}
                                title="Phản hồi"
                              >
                                💬
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
