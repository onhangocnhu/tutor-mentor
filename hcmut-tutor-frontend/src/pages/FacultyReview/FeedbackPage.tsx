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
}

export default function FeedbackPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [menuOpen, setMenuOpen] = useState(false);
  const [review, setReview] = useState<Review | null>(null);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  // Fetch review detail
  useEffect(() => {
    const fetchReview = async () => {
      try {
        const res = await fetch(`http://localhost:3001/reviews/${id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setReview(data.review);
            // If already responded, redirect to detail page
            if (data.review.status === "responded") {
              navigate(`/faculty-reviews/${id}`);
            }
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
  }, [id, navigate]);

  const renderStars = (rating: number) => {
    return (
      <span>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            style={{ color: star <= rating ? "#ffc107" : "#ddd" }}
          >
            ★
          </span>
        ))}
      </span>
    );
  };

  const handleSubmit = async () => {
    if (!response.trim()) {
      alert("Vui lòng nhập nội dung phản hồi");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`http://localhost:3001/reviews/${id}/respond`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ response: response.trim() }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          alert("Phản hồi thành công!");
          navigate(`/faculty-reviews/${id}`);
        } else {
          alert("Có lỗi xảy ra: " + data.message);
        }
      } else {
        alert("Không thể gửi phản hồi. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Failed to submit response:", err);
      alert("Lỗi kết nối server");
    } finally {
      setSubmitting(false);
    }
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
              <div className="home-title" style={{ margin: 0 }}>Phản hồi đánh giá</div>
              <div className="breadcrumb" style={{ margin: 0, display: "flex", alignItems: "center" }}>
                <img className="home-logo" src={home_icon} alt="home icon" />
                BKTutorPortal &gt;{" "}
                <span
                  style={{ cursor: "pointer", color: "#0073B7", marginLeft: "4px" }}
                  onClick={() => navigate("/faculty-reviews")}
                >
                  Dữ liệu đánh giá
                </span>{" "}
                &gt; Phản hồi
              </div>
            </div>

            {loading ? (
              <div className="loading">Đang tải...</div>
            ) : error ? (
              <div className="no-data">{error}</div>
            ) : review ? (
              <div className="feedback-form-container">
                <div className="feedback-form-header">
                  <h2 className="feedback-form-title">
                    Phản hồi đánh giá #{review.id}
                  </h2>
                  <p className="feedback-form-subtitle">
                    Vui lòng nhập nội dung phản hồi cho sinh viên
                  </p>
                </div>

                <div className="feedback-review-summary">
                  <p>
                    <strong>Sinh viên:</strong> {review.studentName} (
                    {review.studentId})
                  </p>
                  <p>
                    <strong>Tutor:</strong> {review.tutorName}
                  </p>
                  <p>
                    <strong>Môn học:</strong> {review.subject}
                  </p>
                  <p>
                    <strong>Đánh giá:</strong> {renderStars(review.rating)} (
                    {review.rating}/5)
                  </p>
                  <p>
                    <strong>Nhận xét:</strong> "{review.comment}"
                  </p>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "600",
                    }}
                  >
                    Nội dung phản hồi <span style={{ color: "red" }}>*</span>
                  </label>
                  <textarea
                    className="feedback-textarea"
                    placeholder="Nhập nội dung phản hồi của Khoa..."
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    disabled={submitting}
                  />
                </div>

                <div className="feedback-form-actions">
                  <button
                    className="btn-cancel"
                    onClick={() => navigate(`/faculty-reviews/${review.id}`)}
                    disabled={submitting}
                  >
                    Hủy
                  </button>
                  <button
                    className="btn-submit"
                    onClick={handleSubmit}
                    disabled={submitting || !response.trim()}
                  >
                    {submitting ? "Đang gửi..." : "Gửi phản hồi"}
                  </button>
                </div>
              </div>
            ) : null}
          </main>
        </div>
      </div>
    </div>
  );
}
