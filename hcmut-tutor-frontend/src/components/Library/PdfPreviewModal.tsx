import React from "react";
import "../../styles/Library.css";

const API_BASE = "http://localhost:3001";

interface PdfPreviewModalProps {
  filePath: string;
  documentTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
}

const PdfPreviewModal: React.FC<PdfPreviewModalProps> = ({
  filePath,
  documentTitle,
  isOpen,
  onClose,
  onDownload,
}) => {
  if (!isOpen) return null;

  const pdfUrl = filePath.startsWith("http") ? filePath : `${API_BASE}${filePath}`;

  return (
    <div className="pdf-preview-overlay" onClick={onClose}>
      <div className="pdf-preview-modal pdf-preview-modal-large" onClick={(e) => e.stopPropagation()}>
        <button className="pdf-preview-close" onClick={onClose}>
          ×
        </button>

        <div className="pdf-preview-header">
          <h2>Xem trước: {documentTitle}</h2>
        </div>

        {/* Download prompt at top */}
        <div className="pdf-preview-top-prompt">
          <span className="pdf-preview-icon">📚</span>
          <p>Hãy tải về để xem thêm nội dung đầy đủ</p>
          <button className="pdf-download-btn-small" onClick={onDownload}>
            ⬇️ Tải xuống
          </button>
        </div>

        <div className="pdf-preview-content pdf-preview-content-large">
          <div className="pdf-preview-iframe-container pdf-preview-iframe-large">
            <iframe
              src={`${pdfUrl}#toolbar=0&navpanes=0`}
              title={`Preview: ${documentTitle}`}
              className="pdf-preview-iframe"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfPreviewModal;
