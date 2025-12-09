"use client"

import type React from "react"

import { useState } from "react"
import ConfirmModal from "./ConfirmModal"
import SuccessModal from "./SuccessModal"
import "../styles/SessionForm.css"

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
  students: string[]
}

interface SessionFormProps {
  onAdd: (data: Session) => void
  onCancel: () => void
  initialData?: Session | null
}

export default function NewSessionForm({ onAdd, onCancel, initialData }: SessionFormProps) {
  const [formData, setFormData] = useState<Session>(
    initialData || {
      id: `C${Date.now()}`,
      date: new Date().toISOString().split("T")[0].split("-").reverse().join("/"),
      time: "14:00",
      format: "Trực tuyến",
      location: "",
      studentCount: 30,
      department: "Hệ thống số",
      status: "Chưa diễn ra",
      notes: "",
      students: [],
    },
  )

  const [showAddConfirm, setShowAddConfirm] = useState(false)
  const [showAddSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "studentCount" ? Number.parseInt(value) : value,
    }))
  }

  const handleAddClick = () => {
    setShowAddConfirm(true)
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

        <button className="btn-confirm" onClick={handleAddClick}>
          Xác nhận thêm buổi gặp
        </button>
      </div>

      {showAddConfirm && (
        <ConfirmModal
          title="Xác nhận thêm buổi gặp"
          message="Bạn có chắc chắn muốn thêm buổi gặp này?"
          onConfirm={() => onAdd(formData)}
          onCancel={() => setShowAddConfirm(false)}
        />
      )}

      {showAddSuccess && (
        <SuccessModal
          message={"Thêm buổi gặp thành công"}
        />
      )}
    </div>
  )
}
