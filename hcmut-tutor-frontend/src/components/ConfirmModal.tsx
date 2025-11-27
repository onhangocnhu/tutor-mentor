"use client"

import "../styles/ConfirmModal.css"

interface ConfirmModalProps {
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({ title, message, onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <div className="confirm-modal-overlay">
      <div className="confirm-modal">
        <div className="confirm-icon">⚠️</div>
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="confirm-actions">
          <button className="btn-cancel" onClick={onCancel}>
            Không
          </button>
          <button className="btn-confirm" onClick={onConfirm}>
            Có
          </button>
        </div>
      </div>
    </div>
  )
}
