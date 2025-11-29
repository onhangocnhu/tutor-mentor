import React from "react";
import "../../styles/Library.css";

const API_BASE = "http://localhost:3001";

export interface Document {
  id: string;
  title: string;
  author: string;
  year?: number;
  category: string;
  department?: string;
  language?: string;
  status: string;
  type: string;
  coverImage?: string;
  description?: string;
  totalCopies?: number;
  availableCopies?: number;
  views?: number;
  downloads?: number;
  fileSize?: string;
  fileType?: string;
  filePath?: string;
  rating?: number;
  ratingCount?: number;
}

// User status for a document: 'available' | 'borrowed' | 'downloaded'
export type UserDocumentStatus = "available" | "borrowed" | "downloaded";

interface BookCardProps {
  document: Document;
  onClick?: () => void;
  onSave?: () => void;
  onViewFile?: () => void;
  isSaved?: boolean;
  showStatus?: boolean;
  size?: "small" | "medium" | "large";
  userStatus?: UserDocumentStatus; // Status based on user's interaction with this document
}

const BookCard: React.FC<BookCardProps> = ({
  document,
  onClick,
  onSave,
  onViewFile,
  isSaved = false,
  showStatus = true,
  size = "medium",
  userStatus = "available",
}) => {
  // Get status styling based on user's interaction status
  const getStatusStyles = (status: UserDocumentStatus) => {
    switch (status) {
      case "available":
        return {
          bg: "bg-green-200",
          text: "text-green-700",
          label: "Có sẵn"
        };
      case "borrowed":
        return {
          bg: "bg-yellow-200",
          text: "text-amber-600",
          label: "Đang mượn"
        };
      case "downloaded":
        return {
          bg: "bg-blue-200",
          text: "text-blue-700",
          label: "Đã tải về"
        };
      default:
        return {
          bg: "bg-green-200",
          text: "text-green-700",
          label: "Có sẵn"
        };
    }
  };

  const statusStyles = getStatusStyles(userStatus);

  const getPlaceholderImage = () => {
    // Generate a placeholder based on document category
    const colors: Record<string, string> = {
      "Giáo trình": "#1e88e5",
      "Sách tham khảo": "#43a047",
      "Luận văn / Đồ án": "#fb8c00",
      "Tài liệu cá nhân": "#8e24aa",
    };
    return colors[document.category] || "#1e88e5";
  };

  return (
    <div className={`book-card book-card-${size}`} onClick={onClick}>
      <div className="book-card-cover">
        {document.coverImage ? (
          <img src={document.coverImage.startsWith('http') ? document.coverImage : `${API_BASE}${document.coverImage}`} alt={document.title} />
        ) : (
          <div
            className="book-card-placeholder"
            style={{ backgroundColor: getPlaceholderImage() }}
          >
            <span className="book-card-category-label">{document.category}</span>
            <span className="book-card-title-placeholder">{document.title}</span>
          </div>
        )}
        {onSave && (
          <button
            className={`book-card-save-btn ${isSaved ? "saved" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              onSave();
            }}
          >
            {isSaved ? "🔖" : "🔗"}
          </button>
        )}
      </div>

      <div className="book-card-info">
        <h3 className="book-card-title">{document.title}</h3>
        <p className="book-card-author">{document.author}</p>
        
        {showStatus && (
          <div className="book-card-footer">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles.bg} ${statusStyles.text}`}>
              {statusStyles.label}
            </span>
            {onViewFile && (
              <button
                className="book-card-view-file-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewFile();
                }}
                title="Xem file"
              >
                📄
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCard;
