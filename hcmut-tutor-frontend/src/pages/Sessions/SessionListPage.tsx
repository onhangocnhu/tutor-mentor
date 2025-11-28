"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "../../styles/SessionListPage.css"
import SideBarOpen from "../../components/SideBarOpen"
import SidebarRail from "../../components/SidebarRail"
import TopBar from "../../components/TopBar"

interface Session {
  id: string
  date: string
  time: string
  format: string
  location: string
  studentCount: number
  department: string
  status: string
  notes: string
  students: Student[]
}

type Student = {
  studentId: string;
  classCode: string;
  fullName: string;
  email: string;
};

export default function SessionListPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [filteredSessions, setFilteredSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("date")
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      const response = await fetch("http://localhost:3001/sessions")
      const data = await response.json()
      setSessions(data)
      setFilteredSessions(data)
      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch sessions:", error)
      setLoading(false)
    }
  }

  useEffect(() => {
    const filtered = sessions.filter(
      (session) =>
        session.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.department.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (sortBy === "date") {
      filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    } else if (sortBy === "department") {
      filtered.sort((a, b) => a.department.localeCompare(b.department))
    }

    setFilteredSessions(filtered)
    setCurrentPage(1)
  }, [searchTerm, sortBy, sessions])

  const paginatedSessions = filteredSessions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const totalPages = Math.ceil(filteredSessions.length / itemsPerPage)

  const handleAddSession = () => {
    navigate("/tutor-sessions/new")
  }
  const fetchSessionInfo = async (sessionId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/sessions/${sessionId}`,{
        method: "GET",
      })
      if (response.ok) {
        const data = await response.json()
      }
    } catch (error) {
      console.error("Failed to fetch session:", error)
    }
  }

  const handleEditSession = async (sessionId: string) => {
    fetchSessionInfo(sessionId)
    navigate(`/tutor-sessions/${sessionId}`)
  }

  const handleExportExcel = () => {
    // Placeholder for Excel export functionality
    console.log("Export to Excel clicked")
  }

  if (loading) {
    return <div className="sessions-container">Loading...</div>
  }

return (
  <div className="sessions-page relative min-h-screen flex">

    {/* Overlay khi menu mở */}
    {menuOpen && (
      <div
        onClick={() => setMenuOpen(false)}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: "100vw",
          height: "100vh",
          background: "rgba(0,0,0,0.5)",
          zIndex: 202,
        }}
      />
    )}

    {/* Collapsed sidebar */}
    <SidebarRail wrapperClass="sidebar" imgClass="sidebar-avatar" />

    {/* Drawer sidebar khi menu mở */}
    <SideBarOpen open={menuOpen} onClose={() => setMenuOpen(false)} />

    {/* Main content */}
    <div className="flex-1 flex flex-col">

      {/* TopBar */}
      <TopBar
        menuOpen={menuOpen}
        onMenuClick={() => setMenuOpen(true)}
        onLogoClick={() => navigate("/student-dashboard")}
      />

      {/* Nội dung chính */}
      <main className="flex-1 p-6 pt-16">
        {loading ? (
          <div className="sessions-container">Loading...</div>
        ) : (
          <div className="sessions-container">
            {/* Giữ nguyên header + 2 nút */}
            <div className="sessions-header">
              <h2>Các buổi gặp</h2>
              <div className="sessions-actions">
                <button className="btn-export" onClick={handleExportExcel}>
                  <span>📊</span> Xuất Excel
                </button>
                <button className="btn-add-session" onClick={handleAddSession}>
                  <span>+</span> Thêm buổi gặp
                </button>
              </div>
            </div>

            {/* Filter + Table + Pagination */}
            <div className="sessions-filter-section">
              <h3>Danh sách buổi gặp</h3>
              <div className="filter-controls">
                <div className="filter-date">
                  <input type="date" defaultValue="2025-09-15" />
                  <span>-</span>
                  <input type="date" defaultValue="2025-10-15" />
                </div>
                <button className="btn-location">📍 Lọc</button>
                <div className="filter-sort">
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="date">Sắp xếp theo A-Z</option>
                    <option value="department">Sắp xếp theo Bộ môn</option>
                  </select>
                </div>
                <input
                  type="text"
                  placeholder="Tìm kiếm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>

            <div className="sessions-table-wrapper">
              <table className="sessions-table">
                <thead>
                  <tr>
                    <th><input type="checkbox" /></th>
                    <th>ID</th>
                    <th>Thời gian diễn ra</th>
                    <th>Hình thức</th>
                    <th>Số lượng sinh viên</th>
                    <th>Bộ môn</th>
                    <th>Trạng thái</th>
                    <th>Chi tiết buổi gặp</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedSessions.map((session) => (
                    <tr key={session.id}>
                      <td><input type="checkbox" /></td>
                      <td className="session-id">{session.id}</td>
                      <td>{session.time} {session.date}</td>
                      <td>{session.format}</td>
                      <td>{session.studentCount}</td>
                      <td>{session.department}</td>
                      <td>
                        <span className={`status-badge ${session.status === "Đã diễn ra" ? "status-done" : "status-pending"}`}>
                          {session.status === "Đã diễn ra" ? "• Đã diễn ra" : "• Chưa diễn ra"}
                        </span>
                      </td>
                      <td>
                        <button className="btn-edit" onClick={() => handleEditSession(session.id)}>✏️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination-section">
              <span>Trang trước</span>
              {Array.from({ length: Math.min(3, totalPages) }, (_, i) => (
                <button
                  key={i + 1}
                  className={`pagination-btn ${currentPage === i + 1 ? "active" : ""}`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              {totalPages > 3 && <span>...</span>}
              <button className="pagination-btn">{totalPages}</button>
              <span>Trang kế tiếp</span>
            </div>
          </div>
        )}
      </main>
    </div>
  </div>
)

}
