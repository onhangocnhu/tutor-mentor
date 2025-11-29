import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  respondedAt?: string;
}

export default function ReviewDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [menuOpen, setMenuOpen] = useState(false);
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allReviewIds, setAllReviewIds] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

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

  // Fetch all review IDs for pagination
  useEffect(() => {
    const fetchAllReviews = async () => {
      try {
        const response = await fetch("http://localhost:3001/reviews");
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            const ids = data.reviews.map((r: Review) => r.id);
            setAllReviewIds(ids);
          }
        }
      } catch (err) {
        console.error("Failed to fetch all reviews:", err);
      }
    };
    fetchAllReviews();
  }, []);

  // Update current index when review or allReviewIds change
  useEffect(() => {
    if (id && allReviewIds.length > 0) {
      const idx = allReviewIds.indexOf(parseInt(id));
      setCurrentIndex(idx);
    }
  }, [id, allReviewIds]);

  // Fetch review detail
  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await fetch(`http://localhost:3001/reviews/${id}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setReview(data.review);
          } else {
            setError("Không tìm thấy đánh giá");
          }
        } else {
          setError("Không thể tải dữ liệu");
        }
      } catch (err) {
        console.error("Failed to fetch review:", err);
        setError("Lỗi kết nối server");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchReview();
    }
  }, [id]);

  const goToPrevious = () => {
    if (currentIndex > 0) {
      navigate(`/faculty-reviews/${allReviewIds[currentIndex - 1]}`);
    }
  };

  const goToNext = () => {
    if (currentIndex < allReviewIds.length - 1) {
      navigate(`/faculty-reviews/${allReviewIds[currentIndex + 1]}`);
    }
  };

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
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
              <div className="home-title" style={{ margin: 0 }}>Chi tiết đánh giá</div>
              <div className="breadcrumb" style={{ margin: 0, display: "flex", alignItems: "center" }}>
                <img className="home-logo" src={home_icon} alt="home icon" />
                BKTutorPortal &gt;{" "}
                <span
                  style={{ cursor: "pointer", color: "#0073B7", marginLeft: "4px" }}
                  onClick={() => navigate("/faculty-reviews")}
                >
                  Dữ liệu đánh giá
                </span>{" "}
                &gt; Chi tiết
              </div>
            </div>

            {loading ? (
              <div className="loading">Đang tải...</div>
            ) : error ? (
              <div className="no-data">{error}</div>
            ) : review ? (
              <div className="review-detail-container">
                <div className="review-detail-header">
                  <div>
                    <h2 className="review-detail-title">
                      Đánh giá #{review.id}
                    </h2>
                    <span
                      className={`status-badge ${review.status}`}
                      style={{ marginTop: "8px", display: "inline-block" }}
                    >
                      {review.status === "pending"
                        ? "Chờ phản hồi"
                        : "Đã phản hồi"}
                    </span>
                  </div>
                  <div className="review-detail-date">
                    {formatDate(review.date)}
                  </div>
                </div>

                <div className="review-info-grid">
                  <div className="review-info-item">
                    <span className="review-info-label">Sinh viên</span>
                    <span className="review-info-value">
                      {review.studentName} ({review.studentId})
                    </span>
                  </div>
                  <div className="review-info-item">
                    <span className="review-info-label">Tutor</span>
                    <span className="review-info-value">
                      {review.tutorName} ({review.tutorId})
                    </span>
                  </div>
                  <div className="review-info-item">
                    <span className="review-info-label">Môn học</span>
                    <span className="review-info-value">{review.subject}</span>
                  </div>
                  <div className="review-info-item">
                    <span className="review-info-label">Học kỳ</span>
                    <span className="review-info-value">{review.semester}</span>
                  </div>
                  <div className="review-info-item">
                    <span className="review-info-label">Đánh giá</span>
                    <span className="review-info-value">
                      {renderStars(review.rating)} ({review.rating}/5)
                    </span>
                  </div>
                </div>

                <div className="review-comment-section">
                  <div className="review-comment-title">
                    💬 Nhận xét của sinh viên
                  </div>
                  <p className="review-comment-text">{review.comment}</p>
                </div>

                {review.facultyResponse && (
                  <div className="faculty-response-section">
                    <div className="faculty-response-title">
                      ✅ Phản hồi từ Khoa
                      {review.respondedAt && (
                        <span
                          style={{
                            fontWeight: "normal",
                            fontSize: "12px",
                            marginLeft: "8px",
                          }}
                        >
                          ({formatDate(review.respondedAt)})
                        </span>
                      )}
                    </div>
                    <p className="faculty-response-text">
                      {review.facultyResponse}
                    </p>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%', marginTop: '24px' }}>
                  <button
                    className="btn-back"
                    onClick={() => navigate("/faculty-reviews")}
                  >
                    ← Quay lại
                  </button>
                  {review.status === "pending" && (
                    <button
                      className="btn-respond"
                      onClick={() =>
                        navigate(`/faculty-reviews/${review.id}/respond`)
                      }
                    >
                      Phản hồi
                    </button>
                  )}
                </div>

                {/* Pagination */}
                {allReviewIds.length > 0 && currentIndex >= 0 && (
                  <div className="review-pagination">
                    <button
                      className="pagination-btn"
                      onClick={goToPrevious}
                      disabled={currentIndex === 0}
                    >
                      Trước ←
                    </button>
                    <span className="pagination-current">
                      {currentIndex + 1} / {allReviewIds.length}
                    </span>
                    <button
                      className="pagination-btn"
                      onClick={goToNext}
                      disabled={currentIndex === allReviewIds.length - 1}
                    >
                      Tiếp →
                    </button>
                  </div>
                )}
              </div>
            ) : null}
          </main>
        </div>
      </div>
    </div>
  );
}
