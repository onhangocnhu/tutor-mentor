import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import home_icon from "../../images/Home.svg";
import star_empty from "../../images/star_empty.svg";
import star_filled from "../../images/star_filled.svg";
import kebab_icon from "../../images/kebab-menu.svg";
import "../../styles/FeedbackSessionPage.css";
import SideBarOpen from "../../components/SideBarOpen";
import SidebarRail from "../../components/SidebarRail";
import TopBar from "../../components/TopBar";
import { Link } from "react-router-dom";
import sessionsData from "../../../../hcmut-tutor-backend/data/sessions.json";
import feedbackData from "../../../../hcmut-tutor-backend/data/feedback.json";
import { getCurrentStudentId, getCurrentStudentName } from "../../components/auth";

interface Session {
  id: string;
  date: string;
  time: string;
  department: string;
  status: "Đã diễn ra" | "Chưa diễn ra";
}

interface Feedback {
  id: string;
  sessionId: string;
  subjectCode: string;
  studentId: string;
  studentName: string;
  content: string;
  contentRating: number;
  paceRating: number;
  understandingRating: number;
  submittedAt: string;
}

const sessions = sessionsData as Session[];
const hardFeedbacks = feedbackData as Feedback[];

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

export default function FeedbackSessionPage() {
  const { subjectCode, studentId, semester, sessionId } = useParams<{
    subjectCode: string;
    studentId: string;
    semester: string;
    sessionId: string;
  }>();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [kebabOpen, setKebabOpen] = useState(false);
  const [localFeedbacks, setLocalFeedbacks] = useState<Feedback[]>([]);


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

  const [contentRating, setContentRating] = useState(0);
  const [paceRating, setPaceRating] = useState(0);
  const [understandingRating, setUnderstandingRating] = useState(0);
  const [comment, setComment] = useState("");

  const subjectName = subjectCode
    ? (subjectNameMap[subjectCode] || "Môn học không xác định")
    : "Môn học";

  const fullSubjectDisplay = subjectCode
    ? `${subjectCode} - ${subjectName}`
    : "Môn học";
  const session = sessions.find(s => s.id === sessionId);
  if (!session) return <div>Không tìm thấy buổi học</div>;

  const currentStudentId = getCurrentStudentId();
  const studentName = getCurrentStudentName() || "Sinh viên";
  useEffect(() => {
    if (!currentStudentId) {
      alert("Vui lòng đăng nhập!");
      navigate("/login");
    }
  }, [currentStudentId, navigate]);

  const allFeedbacks = [...hardFeedbacks, ...localFeedbacks];
  const existingFeedback = allFeedbacks.find(
    f => f.sessionId === sessionId && f.studentId === studentId
  );

  const startEdit = () => {
    if (!existingFeedback) return;
    setContentRating(existingFeedback.contentRating);
    setPaceRating(existingFeedback.paceRating);
    setUnderstandingRating(existingFeedback.understandingRating);
    setComment(existingFeedback.content);
    setIsEditing(true);
    setShowForm(true);
    setKebabOpen(false);
  };

  const handleSubmit = () => {
    if (!contentRating || !paceRating || !understandingRating || !comment.trim()) {
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
      return;
    }

    const newFb: Feedback = {
      id: `local_${Date.now()}`,
      sessionId: sessionId!,
      subjectCode: "CO1007",
      studentId: studentId!,
      studentName,
      content: comment,
      contentRating,
      paceRating,
      understandingRating,
      submittedAt: new Date().toISOString(),
    };

    if (isEditing && existingFeedback?.id.startsWith("local_")) {
      setLocalFeedbacks(prev => prev.map(f => f.id === existingFeedback.id ? newFb : f));
    } else {
      setLocalFeedbacks(prev => [...prev, newFb]);
    }

    setShowForm(false);
    setIsEditing(false);
    setContentRating(0);
    setPaceRating(0);
    setUnderstandingRating(0);
    setComment("");
  };

  const StarRating = ({ rating, setRating, readonly = false }: any) => (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map(n => (
        <img
          key={n}
          src={n <= rating ? star_filled : star_empty}
          className={`star-icon ${!readonly && "clickable"}`}
          onClick={() => !readonly && setRating(n)}
        />
      ))}
    </div>
  );

  return (
    <div className="page-outer">
      <div className="page-inner">
        <div className="student-page">
          {menuOpen && <div onClick={() => setMenuOpen(false)} className="menu-overlay" />}

          <SidebarRail wrapperClass="sidebar" imgClass="sidebar-avatar" />
          <SideBarOpen open={menuOpen} onClose={() => setMenuOpen(false)} />
          <TopBar menuOpen={menuOpen} onMenuClick={() => setMenuOpen(true)} onLogoClick={() => navigate("/student-dashboard")} />

          <main className="content">
            <div className="breadcrumb-row">
              <div className="breadcrumb">
                <img className="home-logo" src={home_icon} alt="home" />
                BKTutorPortal →
                <Link to="/feedback" className="breadcrumb-link">
                  Các khóa học của tôi
                </Link>
                →
                <Link
                  to={`/feedback/${subjectCode}/${studentId}/${semester}`}
                  className="breadcrumb-link"
                >
                  {fullSubjectDisplay}
                </Link>
                → Buổi học ngày {session.date}
              </div>
            </div>

            <div className="session-detail-card">
              <div className="session-title">
                Buổi học ngày {session.date} • {session.time}
              </div>

              {showError && <div className="lookup-error">Vui lòng điền đầy đủ!</div>}

              {showForm ? (
                <div className="feedback-form">
                  <h3>{isEditing ? "Chỉnh sửa đánh giá" : "Đánh giá buổi học"}</h3>
                  <div className="rating-group"><label>Nội dung giảng dạy</label><StarRating rating={contentRating} setRating={setContentRating} /></div>
                  <div className="rating-group"><label>Tốc độ giảng dạy</label><StarRating rating={paceRating} setRating={setPaceRating} /></div>
                  <div className="rating-group"><label>Mức độ hiểu bài</label><StarRating rating={understandingRating} setRating={setUnderstandingRating} /></div>
                  <div className="comment-section">
                    <label>Nội dung đánh giá</label>
                    <textarea value={comment} onChange={e => setComment(e.target.value)} rows={6} placeholder="Viết đánh giá..." />
                  </div>
                  <div className="form-actions">
                    <button className="cancel-btn" onClick={() => setShowForm(false)}>Hủy</button>
                    <button className="submit-btn" onClick={handleSubmit}>Gửi</button>
                  </div>
                </div>
              ) : existingFeedback ? (
                <div className="existing-feedback">
                  <div className="feedback-header">
                    <div>Đánh giá của bạn</div>
                    <div className="kebab-container">
                      <img
                        src={kebab_icon}
                        className="kebab-icon"
                        alt="menu"
                        onClick={() => setKebabOpen(!kebabOpen)}
                      />
                      {kebabOpen && (
                        <div className="kebab-dropdown">
                          <div onClick={startEdit}>Chỉnh sửa</div>
                          <div
                            onClick={() => {
                              setLocalFeedbacks(prev =>
                                prev.filter(f => f.id !== existingFeedback?.id)
                              );
                              setKebabOpen(false);
                            }}
                            style={{ color: "red" }}
                          >
                            Xóa đánh giá
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="rating-row"><span>Nội dung giảng dạy</span><StarRating rating={existingFeedback.contentRating} readonly /></div>
                  <div className="rating-row"><span>Tốc độ giảng dạy</span><StarRating rating={existingFeedback.paceRating} readonly /></div>
                  <div className="rating-row"><span>Mức độ hiểu bài</span><StarRating rating={existingFeedback.understandingRating} readonly /></div>
                  <div className="comment-box">
                    <strong>Nội dung đánh giá:</strong>
                    <p>{existingFeedback.content}</p>
                    <small>Gửi lúc: {new Date(existingFeedback.submittedAt).toLocaleString("vi-VN")}</small>
                  </div>
                </div>
              ) : (
                <div className="feedback-section">
                  <button className="add-feedback-btn" onClick={() => setShowForm(true)}>
                    Thêm đánh giá
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}