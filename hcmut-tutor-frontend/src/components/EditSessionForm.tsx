"use client"

import type React from "react"

import { useState } from "react"
import ConfirmModal from "./ConfirmModal"
import "../styles/SessionForm.css"
import AddMeetingReport from "./AddMeetingReport"
import StudentListPage from "../pages/Sessions/StudentListPage"

type Student = {
  studentId: string;
  classCode: string;
  fullName: string;
  email: string;
};
interface Session {
  id: string
  date: string
  time: string
  format: string
  location: string
  studentCount: number
  tutor: string,
  report: boolean,
  department: string
  status: string
  notes: string
  students: Student[],
  duration: number | null,
  actualParticipants: number | null,
}

interface SessionFormProps {
  onSave: (data: Session) => void
  onCancel: () => void
  initialData?: Session | null
}

export default function SessionForm({ onSave, onCancel, initialData }: SessionFormProps) {
  const [formData, setFormData] = useState<Session>(
    initialData || {
      id: `C${Date.now()}`,
      date: new Date().toISOString().split("T")[0].split("-").reverse().join("/"),
      time: "14:00",
      format: "Trực tuyến",
      location: "",
      studentCount: 30,
      tutor: "Tên tutor",
      report: false,
      department: "Hệ thống số",
      status: "Chưa diễn ra",
      notes: "",
      students: [],
      duration: 0,
      actualParticipants: 0
    },
  )
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const [showMeetingReportModal, setShowMeetingReportModal] = useState(false);
  const handleOpenMeetingReport = () => setShowMeetingReportModal(true);
  const handleCloseMeetingReport = () => setShowMeetingReportModal(false);

  const [showStudentList, setShowStudentList] = useState(false);

  const handleOpenStudentList = () => setShowStudentList(true);
  const handleCloseStudentList = () => setShowStudentList(false);

  const handleSubmitMeetingReport = (file: File | null) => {
  console.log("File được chọn:", file);
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "studentCount" ? Number.parseInt(value) : value,
    }))
  }

  const handleSave = () => {
    onSave(formData)
  }

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true)
  }

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3001/sessions/${formData.id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        onCancel()
      }
    } catch (error) {
      console.error("Failed to delete session:", error)
    }
  }

  return (
    <div className="session-form-container">
      <h2>Thông tin buổi gặp</h2>

      <div className="form-section">
        <div className="form-row">
          <div className="form-group">
            <label>Ngày diễn ra *</label>
            <input
              type="date"
              name="date"
              value={formData.date.split("/").reverse().join("-")}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  date: e.target.value.split("-").reverse().join("/"),
                }))
              }
            />
          </div>
          <div className="form-group">
            <label>Thời gian *</label>
            <input type="time" name="time" value={formData.time} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Hình thức *</label>
            <select name="format" value={formData.format} onChange={handleChange}>
              <option>Trực tuyến</option>
              <option>Trực tiếp</option>
            </select>
          </div>
          <div className="form-group">
            <label>Địa điểm/Đường dẫn *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Meet - link hoặc địa điểm"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>ID</label>
            <input type="text" value={formData.id} disabled />
          </div>
          <div className="form-group">
            <label>Trạng thái</label>
            <input type="text" value={formData.status} disabled />
          </div>
          <div className="form-group">
            <label>Số lượng sinh viên</label>
            <input type="number" name="studentCount" value={formData.studentCount} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Bộ môn</label>
            <input type="text" name="department" value={formData.department} onChange={handleChange} />
          </div>
        </div>

        <div className="form-group full-width">
          <label>Nội dung buổi gặp</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Nhập nội dung vào đây ...."
            rows={5}
          />
        </div>

        <div className="file-attachment">
          <div className="attachment-icons">
            <span>📝</span>
            <span>🔗</span>
            <span>😊</span>
            <span>🖼️</span>
            <span>📎</span>
          </div>
          <p>File định kèm không vượt quá 200MB</p>
        </div>
      </div>

      <div className="form-actions">
        <button className="btn-cancel" onClick={onCancel}>
          Thoát
        </button>
        <button className="btn-add-student" onClick={handleOpenStudentList}>Xem danh sách sinh viên</button>
        <button className="btn-add-minutes" onClick={handleOpenMeetingReport}>Thêm biên bản buổi gặp</button>
        <button className="btn-delete" onClick={handleDeleteClick}>
          Hủy buổi gặp
        </button>
        <button className="btn-confirm" onClick={handleSave}>
          Xác nhận chính sửa
        </button>
      </div>

      {showDeleteConfirm && (
        <ConfirmModal
          title="Hủy buổi gặp"
          message="Bạn có chắc chắn muốn hủy buổi gặp này ?"
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}

      {showMeetingReportModal && (
      <AddMeetingReport
        onClose={handleCloseMeetingReport}
        onSubmit={handleSubmitMeetingReport}
        meetingInfo={{
          id: formData.id,
          time: formData.time,
          date: formData.date,
          method: formData.format,
          location: formData.location,
          department: formData.department,
          registered: formData.studentCount, 
          maxParticipants: formData.studentCount, 
          topic: formData.notes || "Chưa có chủ đề",
          tutorName: formData.tutor, 
          actualParticipants: formData.actualParticipants, 
          duration: formData.duration,
          report: formData.report

        }}
      />
      )}


      {showStudentList && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative bg-white rounded-lg shadow-xl w-[85%] max-w-[1500px] max-h-[80vh] p-6 mx-auto flex flex-col">
            {/* Nút đóng */}
            <button
              onClick={() => handleCloseStudentList()}
              className="absolute top-10 right-10 text-black-500 hover:text-black-700 text-5xl font-bold cursor-pointer">
              ⨯
            </button>
                <StudentListPage />
          </div>
        </div>
      )}


    </div>
  )
}
