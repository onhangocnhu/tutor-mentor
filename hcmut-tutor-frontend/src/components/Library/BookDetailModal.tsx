import React from "react";
import type { Document } from "./BookCard";
import "../../styles/Library.css";

const API_BASE = "http://localhost:3001";

interface BookDetailModalProps {
  document: Document | null;
  isOpen: boolean;
  onClose: () => void;
  onBorrow?: () => void;
  onSave?: () => void;
  onDownload?: () => void;
  isSaved?: boolean;
  isBorrowed?: boolean;
}

const BookDetailModal: React.FC<BookDetailModalProps> = ({
  document,
  isOpen,
  onClose,
  onBorrow,
  onSave,
  onDownload,
  isSaved = false,
  isBorrowed = false,
}) => {
  if (!isOpen || !document) return null;

  const getStatusClass = (status: string) => {
    switch (status) {
      case "available":
        return "status-available";
      case "borrowed":
        return "status-borrowed";
      case "unavailable":
        return "status-unavailable";
      default:
        return "";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "available":
        return "Có sẵn";
      case "borrowed":
        return "Đang mượn";
      case "unavailable":
        return "Hết sách";
      default:
        return status;
    }
  };

  const getPlaceholderColor = () => {
    const colors: Record<string, string> = {
      "Giáo trình": "#1e88e5",
      "Sách tham khảo": "#43a047",
      "Luận văn / Đồ án": "#fb8c00",
      "Tài liệu cá nhân": "#8e24aa",
    };
    return colors[document.category] || "#1e88e5";
  };

  return (
    <div className="book-detail-overlay" onClick={onClose}>
      <div className="book-detail-modal" onClick={(e) => e.stopPropagation()}>
        <button className="book-detail-close" onClick={onClose}>
          ×
        </button>

        <div className="book-detail-content">
          <div className="book-detail-cover">
            {document.coverImage ? (
              <img src={document.coverImage.startsWith('http') ? document.coverImage : `${API_BASE}${document.coverImage}`} alt={document.title} />
            ) : (
              <div
                className="book-detail-placeholder"
                style={{ backgroundColor: getPlaceholderColor() }}
              >
                <span className="book-detail-category-label">{document.category}</span>
                <span className="book-detail-title-placeholder">{document.title}</span>
              </div>
            )}
          </div>

          <div className="book-detail-info">
            <h2 className="book-detail-title">{document.title}</h2>
            
            <div className="book-detail-meta">
              <div className="book-detail-row">
                <span className="book-detail-label">Tác giả:</span>
                <span className="book-detail-value">{document.author}</span>
              </div>
              
              {document.year && (
                <div className="book-detail-row">
                  <span className="book-detail-label">Năm xuất bản:</span>
                  <span className="book-detail-value">{document.year}</span>
                </div>
              )}
              
              <div className="book-detail-row">
                <span className="book-detail-label">Loại tài liệu:</span>
                <span className="book-detail-value">{document.category}</span>
              </div>
              
              {document.department && (
                <div className="book-detail-row">
                  <span className="book-detail-label">Khoa/Bộ môn:</span>
                  <span className="book-detail-value">{document.department}</span>
                </div>
              )}
              
              {document.language && (
                <div className="book-detail-row">
                  <span className="book-detail-label">Ngôn ngữ:</span>
                  <span className="book-detail-value">{document.language}</span>
                </div>
              )}
              
              <div className="book-detail-row">
                <span className="book-detail-label">Tình trạng:</span>
                <span className={`book-detail-status ${getStatusClass(document.status)}`}>
                  {getStatusLabel(document.status)}
                </span>
              </div>

              {document.type === "physical" && document.availableCopies !== undefined && (
                <div className="book-detail-row">
                  <span className="book-detail-label">Số bản còn:</span>
                  <span className="book-detail-value">
                    {document.availableCopies} / {document.totalCopies}
                  </span>
                </div>
              )}

              {document.type === "digital" && document.fileSize && (
                <div className="book-detail-row">
                  <span className="book-detail-label">Kích thước:</span>
                  <span className="book-detail-value">
                    {document.fileType} • {document.fileSize}
                  </span>
                </div>
              )}
            </div>

            {document.description && (
              <div className="book-detail-description">
                <h4>Mô tả</h4>
                <p>{document.description}</p>
              </div>
            )}

            <div className="book-detail-stats">
              <span>👁 {document.views || 0} lượt xem</span>
              <span>⬇️ {document.downloads || 0} lượt tải</span>
            </div>

            <div className="book-detail-actions">
              {document.type === "physical" && onBorrow && (
                <button
                  className={`book-detail-btn book-detail-borrow ${
                    isBorrowed || document.availableCopies === 0 ? "disabled" : ""
                  }`}
                  onClick={onBorrow}
                  disabled={isBorrowed || document.availableCopies === 0}
                >
                  {isBorrowed ? "Đã mượn" : "Mượn sách"}
                </button>
              )}

              {document.type === "digital" && onDownload && (
                <button className="book-detail-btn book-detail-download" onClick={onDownload}>
                  Tải xuống
                </button>
              )}

              {onSave && (
                <button
                  className={`book-detail-btn book-detail-save ${isSaved ? "saved" : ""}`}
                  onClick={onSave}
                >
                  {isSaved ? "Đã lưu" : "Lưu tài liệu"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailModal;
