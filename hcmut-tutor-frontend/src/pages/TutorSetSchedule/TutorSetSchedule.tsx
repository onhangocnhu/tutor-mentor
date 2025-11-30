import React, { useEffect, useState } from "react";
import "../../styles/TutorSetSchedule.css";
import { useNavigate } from "react-router-dom";
import SidebarRail from "../../components/SidebarRail";
import SideBarOpen from "../../components/SideBarOpen";
import TopBar from "../../components/TopBar";

interface ClassSession {
  id: number;
  className: string;
  subjectName: string;
  location: string;
  day: number | string;
  time: string;
}

const TutorSchedule: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Dữ liệu mẫu 4 môn
  const [schedule, setSchedule] = useState<ClassSession[]>([
    {
      id: 1,
      className: "DSA1",
      subjectName: "Cấu trúc Dữ liệu và Giải Thuật",
      location: "https://meet.google.com/abc-xyz",
      day: 3,
      time: "9:00-11:50",
    },
    {
      id: 2,
      className: "DS1",
      subjectName: "Hệ cơ sở dữ liệu",
      location: "H6-301",
      day: 3,
      time: "13:00-15:50",
    },
    {
      id: 3,
      className: "CO1005",
      subjectName: "Nhập môn Điện toán",
      location: "H1-202",
      day: 5,
      time: "07:00-09:50",
    },
    {
      id: 4,
      className: "MT1003",
      subjectName: "Giải tích 1",
      location: "https://meet.google.com/def-ghk",
      day: 6,
      time: "13:00-15:50",
    },
  ]);

  const [formData, setFormData] = useState({
    subjectName: "",
    className: "",
    location: "",
    day: 2,
    startTime: "07:00",
    endTime: "09:00",
  });

  const handleToggleForm = () => {
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setShowAddForm(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newSession: ClassSession = {
      id: Date.now(),
      subjectName: formData.subjectName,
      className: formData.className,
      location: formData.location,
      day: formData.day,
      time: `${formData.startTime}-${formData.endTime}`,
    };
    setSchedule([...schedule, newSession]);
    setShowAddForm(false);
    setFormData({
      subjectName: "",
      className: "",
      location: "",
      day: 2,
      startTime: "07:00",
      endTime: "09:00",
    });
  };

  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift();
      return null;
    };

    const role = getCookie("role");
    if (!role || role !== "tutor") {
      // navigate("/unauthorized");
    }
  }, [navigate]);

  return (
    <div className="app-container">
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
        onLogoClick={() => navigate("/tutor-dashboard")}
      />

      <main className="main-content">
        <div className="content-body">
          <div className="page-title-section">
            <h1>Quản lý lịch dạy</h1>
            <span className="week-info">Tuần 42 (27/10 - 02/11)</span>
          </div>

          <div className="session-wrapper">
            <section className="schedule-section">
              <div className="section-header-bar">Danh sách lớp đã mở</div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Lớp</th>
                      <th>Môn học</th>
                      <th>Địa điểm / Link</th>
                      <th>Thứ</th>
                      <th>Thời gian</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedule.map((item, index) => (
                      <tr key={item.id}>
                        <td className="col-id">{index + 1}</td>
                        <td style={{ fontWeight: "bold", color: "#034079" }}>
                          {item.className}
                        </td>
                        <td>{item.subjectName}</td>
                        <td className="col-link">
                          <a
                            href={
                              item.location.startsWith("http")
                                ? item.location
                                : "#"
                            }
                            target="_blank"
                            rel="noreferrer"
                          >
                            {item.location}
                          </a>
                        </td>
                        <td>{item.day}</td>
                        <td>{item.time}</td>
                        <td>
                          <a href="#" className="action-link">
                            Sửa
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* --- NÚT THÊM LỊCH (LUÔN HIỂN THỊ) --- */}
          <div className="action-bar" style={{ marginTop: "20px" }}>
            <button
              className="btn-setup"
              onClick={handleToggleForm}
              disabled={showAddForm} // Vô hiệu hóa nút nếu form đang mở (tránh bấm lại)
              style={{
                opacity: showAddForm ? 0.6 : 1,
                cursor: showAddForm ? "default" : "pointer",
              }}
            >
              + Thêm lịch mới
            </button>
          </div>

          {showAddForm && (
            <section
              className="add-schedule-form fade-in"
              style={{ marginTop: "20px" }}
            >
              <h2 style={{ marginBottom: "20px", color: "#034079" }}>
                Thêm thông tin lớp học
              </h2>

              <form
                onSubmit={handleSave}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "25px",
                  alignItems: "end",
                }}
              >
                {/* HÀNG 1 */}
                <div className="form-group">
                  <label
                    style={{
                      fontWeight: "600",
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
                    Tên môn học <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="subjectName"
                    value={formData.subjectName}
                    onChange={handleInputChange}
                    placeholder="VD: Giải tích 1"
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                    }}
                  />
                </div>
                <div className="form-group">
                  <label
                    style={{
                      fontWeight: "600",
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
                    Tên lớp <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="className"
                    value={formData.className}
                    onChange={handleInputChange}
                    placeholder="VD: L01"
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                    }}
                  />
                </div>
                <div className="form-group">
                  <label
                    style={{
                      fontWeight: "600",
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
                    Địa điểm / Link Meet <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Phòng học hoặc Link online"
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                    }}
                  />
                </div>

                {/* HÀNG 2 */}
                <div className="form-group">
                  <label
                    style={{
                      fontWeight: "600",
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
                    Thứ <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    name="day"
                    min="2"
                    max="8"
                    value={formData.day}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                    }}
                  />
                </div>
                <div className="form-group">
                  <label
                    style={{
                      fontWeight: "600",
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
                    Giờ bắt đầu <span className="required">*</span>
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                    }}
                  />
                </div>
                <div className="form-group">
                  <label
                    style={{
                      fontWeight: "600",
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
                    Giờ kết thúc <span className="required">*</span>
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                    }}
                  />
                </div>

                {/* BUTTONS */}
                <div
                  style={{
                    gridColumn: "1 / -1",
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "15px",
                    marginTop: "10px",
                  }}
                >
                  <button
                    type="button"
                    onClick={handleCancel}
                    style={{
                      padding: "10px 25px",
                      borderRadius: "6px",
                      border: "1px solid #999",
                      background: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: "10px 25px",
                      borderRadius: "6px",
                      border: "none",
                      background: "#034079",
                      color: "#fff",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    Lưu lại
                  </button>
                </div>
              </form>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default TutorSchedule;
