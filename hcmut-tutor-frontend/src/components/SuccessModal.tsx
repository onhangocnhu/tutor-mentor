import "../styles/SuccessModal.css"

interface SuccessModalProps {
  message: string
}

export default function SuccessModal({ message }: SuccessModalProps) {
  return (
    <div className="success-modal-overlay">
      <div className="success-modal">
        <div className="success-icon">✓</div>
        <h2>{message}</h2>
      </div>
    </div>
  )
}
