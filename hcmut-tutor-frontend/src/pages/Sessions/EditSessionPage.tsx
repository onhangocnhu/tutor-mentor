"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import SessionForm from "../../components/EditSessionForm"
import SuccessModal from "../../components/SuccessModal"
import "../../styles/SessionFormPage.css"
import SideBarOpen from "../../components/SideBarOpen"
import SidebarRail from "../../components/SidebarRail"
import TopBar from "../../components/TopBar"

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
  students: Student[] | [],
  duration: number | null,
  actualParticipants: number | null,
}



export default function EditSessionPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [session, setSession] = useState<Session | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [isLoading, setIsLoading] = useState(!!id)

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchSession(id)
    }
  }, [id])

  const fetchSession = async (sessionId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/sessions/${sessionId}`)
      if (response.ok) {
        const data = await response.json()
        setSession(data)
      }
      setIsLoading(false)
    } catch (error) {
      console.error("Failed to fetch session:", error)
      setIsLoading(false)
    }
  }

  const handleSave = async (formData: Session) => {
    try {
      const url = id ? `http://localhost:3001/sessions/${id}` : "http://localhost:3001/sessions"
      const method = id ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const message = id ? "Chính sửa buổi gặp thành công" : "Thêm buổi gặp thành công"
        setSuccessMessage(message)
        setShowSuccess(true)
        setTimeout(() => {
          navigate("/tutor-sessions")
        }, 2000)
      }
    } catch (error) {
      console.error("Failed to save session:", error)
    }
  }

  const handleCancel = () => {
    navigate("/tutor-sessions")
  }

  if (isLoading) {
    return <div className="form-container">Loading...</div>
  }

  return (
    <div className="form-page relative min-h-screen flex bg-gray-100">
      
      {/* Overlay khi menu mở */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black/50 z-[202]"
        />
      )}

      {/* Collapsed sidebar (luôn hiện) */}
      
      <SidebarRail wrapperClass="sidebar" imgClass="sidebar-avatar" />

      {/* Drawer sidebar khi menu mở */}
      <SideBarOpen open={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        
        {/* HEADER */}
        <TopBar
          menuOpen={menuOpen}
          onMenuClick={() => setMenuOpen(true)}
          onLogoClick={() => navigate("/student-dashboard")}
        />

        {/* CONTENT */}
        <main className="flex-1 flex justify-center items-start p-6">
          {isLoading ? (
            <div className="text-gray-500 text-lg">Loading...</div>
          ) : (
            <div className="w-full max-w-4xl">
              <SessionForm
                onSave={handleSave}
                onCancel={handleCancel}
                initialData={session}
              />
            </div>
          )}
        </main>

        {/* Success modal */}
        {showSuccess && <SuccessModal message={successMessage} />}
      </div>
    </div>
  )

}
