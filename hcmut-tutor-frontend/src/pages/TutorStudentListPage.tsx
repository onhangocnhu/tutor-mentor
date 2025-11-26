import React from "react";
import { useNavigate } from "react-router-dom";
import hcmut_logo from "../images/hcmut_logo.png";
import menu_icon from "../images/menu.png";
import "./StudentIndexPage.css";
import "./TutorUpdate.css"; // Import CSS mới

// Mock data
const MY_STUDENTS = [
  { id: 101, name: "Nguyễn Văn A", faculty: "Khoa học và Kĩ thuật máy tính", email: "annguyen@hcmut.edu.vn", subject: "Nhập môn điện toán", status: "Active" },
  { id: 102, name: "Trần Thị B", faculty: "Khoa học và Kĩ thuật máy tính", email: "b.tran@hcmut.edu.vn", subject: "Kĩ thuật lập trình", status: "Active" },
  { id: 103, name: "Lê Văn C", faculty: "Khoa học và Kĩ thuật máy tính", email: "c.le@hcmut.edu.vn", subject: "Cấu trúc dữ liệu và giải thuật", status: "Inactive" },
];

export default function TutorStudentListPage() {
  const navigate = useNavigate();

  const handleUpdateClick = (student: any) => {
    // Chuyển hướng sang trang chi tiết, kèm theo thông tin student
    navigate(`/tutor/update-progress/${student.id}`, { state: { student } });
  };

  return (
    <div className="page-outer">
      <div className="page-inner">
        <div className="student-page">
          <aside className="sidebar">
            <img className="sidebar-avatar" src={hcmut_logo} alt="hcmut logo" />
          </aside>
          <header className="topbar">
            <div className="logo-box"><div className="logo-text">Bk</div></div>
            <div className="top-title"><img className="top-menu" src={menu_icon} alt="menu" /></div>
          </header>

          <main className="content">
            <div className="update-title">Cập nhật tiến bộ sinh viên</div>

            <div className="table-card">
               <div style={{padding: '15px 20px', borderBottom: '1px solid #eee', fontWeight: '700'}}>
                 Danh sách sinh viên phụ trách
               </div>
               <table className="tutor-table">
                <thead>
                  <tr>
                    <th>Họ và tên</th>
                    <th>Khoa</th>
                    <th>Email liên hệ</th>
                    <th>Bộ môn đăng kí</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {MY_STUDENTS.map((st) => (
                    <tr key={st.id}>
                      <td style={{fontWeight: 'bold'}}>{st.name}</td>
                      <td>{st.faculty}</td>
                      <td style={{color: '#666'}}>{st.email}</td>
                      <td>{st.subject}</td>
                      <td>
                         <span className={`status-badge ${st.status === 'Active' ? 'status-active' : 'status-inactive'}`}>
                          {st.status}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="action-btn-update"
                          onClick={() => handleUpdateClick(st)}
                        >
                          Cập nhật
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}