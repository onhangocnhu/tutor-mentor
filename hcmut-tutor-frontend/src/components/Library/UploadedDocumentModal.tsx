import React, { useState } from "react";

const API_BASE = "http://localhost:3001";

export interface UploadedDocument {
  id: string;
  title: string;
  author: string;
  year?: number;
  category?: string;
  department?: string;
  language?: string;
  status: string;
  type?: string;
  coverImage?: string;
  description?: string;
  views?: number;
  downloads?: number;
  borrows?: number;
  filePath?: string;
  fileSize?: string;
  fileType?: string;
  rating?: number;
  ratingCount?: number;
  uploadedAt?: string;
}

interface UploadedDocumentModalProps {
  document: UploadedDocument | null;
  isOpen: boolean;
  onClose: () => void;
  onBorrow?: () => void;
  onSave?: () => void;
  onViewFile?: () => void;
  isSaved?: boolean;
  isBorrowed?: boolean;
  onRatingUpdate?: (documentId: string, newRating: number, newRatingCount: number) => void;
}

const UploadedDocumentModal: React.FC<UploadedDocumentModalProps> = ({
  document,
  isOpen,
  onClose,
  onBorrow,
  onSave,
  onViewFile,
  isSaved = false,
  isBorrowed = false,
  onRatingUpdate,
}) => {
  const [downloading, setDownloading] = useState(false);
  const [borrowing, setBorrowing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentRating, setCurrentRating] = useState<number>(0);
  const [ratingCount, setRatingCount] = useState<number>(0);
  const [avgRating, setAvgRating] = useState<number>(0);
  const [hasRated, setHasRated] = useState(false);

  // Initialize rating from document
  React.useEffect(() => {
    if (document) {
      setAvgRating(document.rating || 0);
      setRatingCount(document.ratingCount || 0);
      setCurrentRating(0);
      setHasRated(false);
    }
  }, [document]);

  if (!isOpen || !document) return null;

  const coverUrl = document.coverImage
    ? document.coverImage.startsWith("http")
      ? document.coverImage
      : `${API_BASE}${document.coverImage}`
    : "https://placehold.co/164x172?text=No+Cover";

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const formatNumber = (num?: number) => {
    if (!num) return "0";
    if (num >= 1000) return (num / 1000).toFixed(1) + "k";
    return num.toString();
  };

  const handleDownload = async () => {
    if (!document.filePath) {
      alert("Không tìm thấy file để tải xuống");
      return;
    }

    try {
      setDownloading(true);
      
      await fetch(`${API_BASE}/library/documents/${document.id}/download`, {
        method: "POST",
      });

      const fileUrl = `${API_BASE}${document.filePath}`;
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const a = window.document.createElement("a");
      a.href = url;
      a.download = `${document.title}.pdf`;
      window.document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      window.document.body.removeChild(a);
      
      alert("Tải xuống thành công!");
    } catch (error) {
      console.error("Error downloading:", error);
      alert("Có lỗi xảy ra khi tải xuống");
    } finally {
      setDownloading(false);
    }
  };

  const handleBorrow = async () => {
    if (onBorrow) {
      setBorrowing(true);
      try {
        await onBorrow();
      } finally {
        setBorrowing(false);
      }
    }
  };

  const handleSave = async () => {
    if (onSave) {
      setSaving(true);
      try {
        await onSave();
      } finally {
        setSaving(false);
      }
    }
  };

  const handleRating = async (rating: number) => {
    if (!document || hasRated) return;
    
    try {
      const response = await fetch(`${API_BASE}/library/documents/${document.id}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating }),
      });
      
      const data = await response.json();
      if (data.success) {
        setCurrentRating(rating);
        setAvgRating(parseFloat(data.newRating.toFixed(1)));
        setRatingCount(data.newRatingCount);
        setHasRated(true);
        
        // Notify parent component about rating update
        if (onRatingUpdate) {
          onRatingUpdate(document.id, parseFloat(data.newRating.toFixed(1)), data.newRatingCount);
        }
      } else {
        console.error("Rating failed:", data.message);
        alert("Có lỗi khi đánh giá: " + (data.message || "Không xác định"));
      }
    } catch (error) {
      console.error("Error rating document:", error);
      alert("Có lỗi khi đánh giá tài liệu");
    }
  };

  // Star rating display component
  const StarRatingDisplay = () => {
    const fullStars = Math.floor(avgRating);
    const hasHalfStar = avgRating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-2">
        <div className="flex">
          {[...Array(fullStars)].map((_, i) => (
            <span key={`full-${i}`} className="text-amber-400 text-xl">★</span>
          ))}
          {hasHalfStar && <span className="text-amber-400 text-xl">★</span>}
          {[...Array(Math.max(0, emptyStars))].map((_, i) => (
            <span key={`empty-${i}`} className="text-gray-300 text-xl">★</span>
          ))}
        </div>
        <span className="text-gray-500 text-base">{avgRating.toFixed(1)}/5 ({ratingCount} đánh giá)</span>
      </div>
    );
  };

  // Rating dropdown component - replaced with clickable stars
  const RatingStarsInput = () => {
    const [hoverRating, setHoverRating] = useState(0);
    
    return (
      <div className="flex items-center gap-3 mt-2">
        <span className="text-gray-600 text-sm">Đánh giá:</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              disabled={hasRated}
              onMouseEnter={() => !hasRated && setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => handleRating(star)}
              className={`text-2xl transition-colors ${
                hasRated 
                  ? "cursor-not-allowed" 
                  : "cursor-pointer hover:scale-110"
              }`}
            >
              <span className={(
                hoverRating >= star || currentRating >= star
                  ? "text-amber-400"
                  : "text-gray-300"
              )}>★</span>
            </button>
          ))}
        </div>
        {hasRated && (
          <span className="text-green-600 text-sm">✓ Đã đánh giá {currentRating} sao</span>
        )}
      </div>
    );
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="w-[750px] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 text-2xl font-bold z-10 bg-white rounded-full shadow"
          >
            ×
          </button>

          {/* Header Section - Cover + Title Info */}
          <div className="flex gap-6 p-6 border-b border-gray-200">
            {/* Cover Image */}
            <div className="w-32 h-40 shrink-0 rounded-lg border border-gray-300 overflow-hidden shadow-md">
              <img 
                className="w-full h-full object-cover" 
                src={coverUrl} 
                alt={document.title}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://placehold.co/164x172?text=No+Cover";
                }}
              />
            </div>

            {/* Title Info */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {document.title}
                </h2>
                
                {/* Author */}
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <span className="text-lg">{document.author}</span>
                </div>

                {/* Date */}
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-lg">{formatDate(document.uploadedAt)}</span>
                </div>

                {/* File size */}
                <div className="flex items-center gap-2 text-gray-600 mb-3">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-lg">{document.fileSize || "N/A"}</span>
                </div>

                {/* Rating Display */}
                <StarRatingDisplay />
                
                {/* Rating Stars Input */}
                <RatingStarsInput />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 px-6 py-4 border-b border-gray-200 bg-gray-50">
            {/* Download button */}
            <button
              onClick={handleDownload}
              disabled={downloading || !document.filePath}
              className={`h-12 px-5 rounded-lg flex items-center gap-2 transition-colors ${
                downloading || !document.filePath
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-700 hover:bg-blue-800"
              }`}
            >
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span className="text-white text-lg font-medium">
                {downloading ? "Đang tải..." : "Tải xuống"}
              </span>
            </button>
            
            {/* Borrow button */}
            <button
              onClick={handleBorrow}
              disabled={borrowing || isBorrowed}
              className={`h-12 px-5 rounded-full flex items-center gap-2 transition-colors border-2 ${
                isBorrowed
                  ? "bg-green-50 border-green-500"
                  : borrowing
                  ? "bg-gray-200 border-gray-300 cursor-not-allowed"
                  : "bg-amber-50 border-amber-500 hover:bg-amber-100"
              }`}
            >
              <svg className={`w-5 h-5 ${isBorrowed ? "text-green-600" : "text-amber-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className={`text-lg font-medium ${isBorrowed ? "text-green-600" : "text-amber-600"}`}>
                {borrowing ? "Đang mượn..." : isBorrowed ? "Đã mượn" : "Mượn"}
              </span>
            </button>

            {/* Save button */}
            <button
              onClick={handleSave}
              disabled={saving}
              className={`h-12 px-5 rounded-full flex items-center gap-2 transition-colors border-2 ${
                isSaved
                  ? "bg-pink-50 border-pink-500"
                  : saving
                  ? "bg-gray-200 border-gray-300 cursor-not-allowed"
                  : "bg-gray-50 border-gray-300 hover:bg-gray-100"
              }`}
            >
              <svg 
                className={`w-5 h-5 ${isSaved ? "text-pink-600" : "text-gray-500"}`} 
                fill={isSaved ? "currentColor" : "none"} 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className={`text-lg font-medium ${isSaved ? "text-pink-600" : "text-gray-500"}`}>
                {saving ? "..." : isSaved ? "Đã lưu" : "Lưu"}
              </span>
            </button>

            {/* View File button */}
            {onViewFile && document.filePath && (
              <button
                onClick={onViewFile}
                className="h-12 px-5 rounded-full flex items-center gap-2 transition-colors border-2 bg-cyan-50 border-cyan-500 hover:bg-cyan-100"
              >
                <svg className="w-5 h-5 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                <span className="text-lg font-medium text-cyan-600">Xem file</span>
              </button>
            )}
          </div>

          {/* Stats Row */}
          <div className="flex flex-wrap items-center gap-3 px-6 py-3 border-b border-gray-200">
            <div className="h-9 px-4 py-1 bg-sky-100 rounded-full border border-blue-700 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-700" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              <span className="text-blue-700 text-sm font-medium">{formatNumber(document.views)} lượt xem</span>
            </div>
            
            <div className="h-9 px-4 py-1 bg-sky-100 rounded-full border border-blue-700 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-700" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span className="text-blue-700 text-sm font-medium">{formatNumber(document.downloads)} lượt tải</span>
            </div>
            
            <div className="h-9 px-4 py-1 bg-amber-100 rounded-full border border-amber-600 flex items-center gap-2">
              <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
              <span className="text-amber-600 text-sm font-medium">{formatNumber(document.borrows)} lượt mượn</span>
            </div>
          </div>

          {/* Description */}
          <div className="px-6 py-4 border-b border-gray-200">
            <p className="text-gray-700 text-lg">
              <span className="font-semibold">Mô tả:</span> {document.description || "Chưa có mô tả"}
            </p>
          </div>

          {/* Detail Info */}
          <div className="px-6 py-5">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Thông tin chi tiết</h3>
            
            <div className="grid grid-cols-2 gap-x-10 gap-y-4">
              {/* Danh mục */}
              <div className="flex items-center gap-4">
                <span className="text-gray-700 text-lg w-32">Danh mục</span>
                <span className="h-8 px-4 py-1 bg-sky-100 rounded-full border border-blue-700 text-blue-700 text-sm font-medium flex items-center">
                  {document.category || "Khác"}
                </span>
              </div>

              {/* Định dạng file */}
              <div className="flex items-center gap-4">
                <span className="text-gray-700 text-lg w-32">Định dạng file</span>
                <span className="h-8 px-4 py-1 bg-red-100 rounded-full border border-red-500 text-red-600 text-sm font-medium flex items-center">
                  {document.fileType || "PDF"}
                </span>
              </div>

              {/* Kích thước */}
              <div className="flex items-center gap-4">
                <span className="text-gray-700 text-lg w-32">Kích thước</span>
                <span className="h-8 px-4 py-1 bg-sky-100 rounded-full border border-blue-700 text-blue-700 text-sm font-medium flex items-center">
                  {document.fileSize || "N/A"}
                </span>
              </div>

              {/* Ngôn ngữ */}
              <div className="flex items-center gap-4">
                <span className="text-gray-700 text-lg w-32">Ngôn ngữ</span>
                <span className="h-8 px-4 py-1 bg-gray-100 rounded-full border border-gray-400 text-gray-600 text-sm font-medium flex items-center">
                  {document.language || "Tiếng Việt"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadedDocumentModal;
