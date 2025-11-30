import React, { useState, useEffect } from "react";
import { HeaderSection } from "../../components/Library/HeaderLibrarySection";
import { FooterSection } from "../../components/Library/FooterLibrarySection";
import { BookDetailModal, PdfPreviewModal } from "../../components/Library";
import "../../styles/Library.css";

const API_BASE = "http://localhost:3001";

interface Document {
  id: string;
  title: string;
  author: string;
  category?: string;
  department?: string;
  language?: string;
  year?: number;
  coverImage?: string;
  fileType?: string;
  fileSize?: string;
  filePath?: string;
  description?: string;
  status: string;
  type?: string;
  views?: number;
  downloads?: number;
  totalCopies?: number;
  availableCopies?: number;
}

interface BorrowRecord {
  id: string;
  documentId: string;
  borrowDate: string;
  dueDate: string;
  returnDate: string | null;
  status: string;
  renewCount: number;
  document: Document | null;
  downloadDate?: string;
}

const HistoryPage: React.FC = () => {
  const [borrowHistory, setBorrowHistory] = useState<BorrowRecord[]>([]);
  const [selectedTab, setSelectedTab] = useState<"all" | "borrowed" | "returned">("all");
  const [loading, setLoading] = useState(true);

  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isPdfPreviewOpen, setIsPdfPreviewOpen] = useState(false);
  const [previewFilePath, setPreviewFilePath] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const userId = "student001";
  const today = new Date();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/library/borrow-history?userId=${userId}`);
      const data = await response.json();
      if (data.success) {
        setBorrowHistory(data.history);
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRenew = async (borrowId: string) => {
    try {
      const response = await fetch(`${API_BASE}/library/renew`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ borrowId }),
      });
      const data = await response.json();
      if (data.success) {
        alert("Gia hạn thành công!");
        fetchHistory();
      } else {
        alert(data.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Error renewing:", error);
      alert("Có lỗi xảy ra khi gia hạn");
    }
  };

  const handleReturn = async (borrowId: string) => {
    try {
      const response = await fetch(`${API_BASE}/library/return`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ borrowId }),
      });
      const data = await response.json();
      if (data.success) {
        alert("Trả sách thành công!");
        fetchHistory();
      } else {
        alert(data.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Error returning:", error);
      alert("Có lỗi xảy ra khi trả sách");
    }
  };

  const handleViewDetail = (document: Document) => {
    setSelectedDocument(document);
    setIsDetailModalOpen(true);
  };

  const handleViewFile = (document: Document) => {
    if (document.filePath) {
      setPreviewFilePath(document.filePath);
      setPreviewTitle(document.title);
      setIsPdfPreviewOpen(true);
    }
  };

  const handleDownload = async (document: Document) => {
    if (document.filePath) {
      try {
        await fetch(`${API_BASE}/library/documents/${document.id}/download`, {
          method: "POST",
        });

        window.open(`${API_BASE}${document.filePath}`, "_blank");
      } catch (error) {
        console.error("Error downloading:", error);
      }
    }
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedDocument(null);
  };

  const handleClosePdfPreview = () => {
    setIsPdfPreviewOpen(false);
    setPreviewFilePath("");
    setPreviewTitle("");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const getDaysRemaining = (dueDate: string) => {
    const due = new Date(dueDate);
    const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const getPlaceholderColor = (category?: string) => {
    const colors: Record<string, string> = {
      "Giáo trình": "#1e88e5",
      "Sách tham khảo": "#43a047",
      "Luận văn / Đồ án": "#fb8c00",
      "Tài liệu cá nhân": "#8e24aa",
    };
    return colors[category || "Giáo trình"] || "#1e88e5";
  };

  const getFilteredHistory = () => {
    switch (selectedTab) {
      case "borrowed":
        return borrowHistory.filter((h) => h.status === "borrowed" || h.status === "overdue");
      case "returned":
        return borrowHistory.filter((h) => h.status === "returned");
      default:
        return borrowHistory;
    }
  };

  const getBorrowedCount = () =>
    borrowHistory.filter((h) => h.status === "borrowed" || h.status === "overdue").length;
  const getReturnedCount = () => borrowHistory.filter((h) => h.status === "returned").length;

  if (loading) {
    return (
      <div className="library-page w-full min-h-screen relative bg-white overflow-hidden" style={{ fontFamily: 'Inter, sans-serif' }}>
        <HeaderSection />
        <div className="pt-[200px] text-center text-2xl">Đang tải...</div>
        <FooterSection />
      </div>
    );
  }

  return (
    <div className="library-page w-full min-h-screen relative bg-white overflow-hidden" style={{ fontFamily: 'Inter, sans-serif' }}>
      <HeaderSection />

      <main className="pt-[180px] px-[68px] pb-[100px]">
        {/* Header Section */}
        <section className="text-center mb-10">
          <h1 className="text-4xl font-bold text-blue-800 mb-2">LỊCH SỬ MƯỢN TÀI LIỆU</h1>
          <p className="text-lg text-gray-600">Thống kê lịch sử mượn tài liệu của bạn</p>
        </section>

        {/* Date Display */}
        <div className="flex justify-center items-center gap-4 mb-8">
          <span className="text-gray-600 font-medium">Ngày:</span>
          <span className="text-blue-800 font-semibold">{formatDate(today.toISOString())}</span>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            className={`px-6 py-3 rounded-full font-medium transition-colors ${selectedTab === "all"
              ? "bg-blue-800 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            onClick={() => setSelectedTab("all")}
          >
            Tất cả ({borrowHistory.length})
          </button>
          <button
            className={`px-6 py-3 rounded-full font-medium transition-colors ${selectedTab === "borrowed"
              ? "bg-amber-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            onClick={() => setSelectedTab("borrowed")}
          >
            Đang mượn ({getBorrowedCount()})
          </button>
          <button
            className={`px-6 py-3 rounded-full font-medium transition-colors ${selectedTab === "returned"
              ? "bg-green-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            onClick={() => setSelectedTab("returned")}
          >
            Đã trả ({getReturnedCount()})
          </button>
        </div>

        {/* History List */}
        <div className="max-w-5xl mx-auto space-y-4">
          {getFilteredHistory().length === 0 && (
            <div className="text-center text-gray-500 italic py-10">
              Chưa có lịch sử mượn tài liệu
            </div>
          )}

          {getFilteredHistory().map((record) => {
            const isOverdue = record.status === "overdue" ||
              (record.status === "borrowed" && getDaysRemaining(record.dueDate) < 0);
            const daysRemaining = getDaysRemaining(record.dueDate);
            const coverUrl = record.document?.coverImage
              ? `${API_BASE}${record.document.coverImage}`
              : null;

            return (
              <div
                key={record.id}
                className={`flex items-center gap-6 p-4 bg-white rounded-xl shadow-md border-l-4 ${isOverdue
                  ? "border-red-500 bg-red-50"
                  : record.status === "returned"
                    ? "border-green-500"
                    : "border-amber-500"
                  }`}
              >
                <div className="w-20 h-28 shrink-0 rounded-lg overflow-hidden shadow">
                  {coverUrl ? (
                    <img
                      src={coverUrl}
                      alt={record.document?.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-white text-2xl font-bold"
                      style={{ backgroundColor: getPlaceholderColor(record.document?.category) }}
                    >
                      {record.document?.category?.charAt(0) || "T"}
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h3
                    className="text-lg font-semibold text-gray-800 hover:text-blue-600 cursor-pointer mb-1"
                    onClick={() => record.document && handleViewDetail(record.document)}
                  >
                    {record.document?.title || "Unknown"}
                  </h3>
                  <p className="text-gray-500 text-sm mb-2">
                    {record.document?.author} • {record.document?.department}
                  </p>

                  <div className="flex items-center gap-4 flex-wrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${isOverdue
                        ? "bg-red-200 text-red-700"
                        : record.status === "returned"
                          ? "bg-green-200 text-green-700"
                          : "bg-amber-200 text-amber-700"
                        }`}
                    >
                      {isOverdue ? "Quá hạn" : record.status === "returned" ? "Đã trả" : "Đang mượn"}
                    </span>

                    {record.status !== "returned" && (
                      <>
                        <span className="text-gray-500 text-sm">
                          Hạn trả: {formatDate(record.dueDate)}
                        </span>
                        <span
                          className={`text-sm font-medium ${isOverdue ? "text-red-600" : "text-green-600"}`}
                        >
                          {isOverdue
                            ? `Quá hạn ${Math.abs(daysRemaining)} ngày`
                            : `Còn ${daysRemaining} ngày`}
                        </span>
                      </>
                    )}

                    {record.status === "returned" && record.returnDate && (
                      <span className="text-gray-500 text-sm">
                        Ngày trả: {formatDate(record.returnDate)} • {record.document?.fileType} • {record.document?.fileSize}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    title="Xem chi tiết"
                    onClick={() => record.document && handleViewDetail(record.document)}
                  >
                    👁
                  </button>

                  {record.status !== "returned" && (
                    <>
                      <button
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
                        title="Gia hạn"
                        onClick={() => handleRenew(record.id)}
                      >
                        🔄
                      </button>
                      <button
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100 hover:bg-green-200 transition-colors"
                        title="Trả sách"
                        onClick={() => handleReturn(record.id)}
                      >
                        ↩️
                      </button>
                    </>
                  )}

                  {record.status === "returned" && (
                    <>
                      <button
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
                        title="Xem file"
                        onClick={() => record.document && handleViewFile(record.document)}
                      >
                        📄
                      </button>
                      <button
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100 hover:bg-green-200 transition-colors"
                        title="Tải xuống"
                        onClick={() => record.document && handleDownload(record.document)}
                      >
                        ⬇️
                      </button>
                    </>
                  )}

                  {isOverdue && (
                    <button
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-red-100"
                      title="Cảnh báo"
                    >
                      ⚠️
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <FooterSection />

      {selectedDocument && (
        <BookDetailModal
          document={{
            ...selectedDocument,
            category: selectedDocument.category || "Tài liệu cá nhân",
            type: selectedDocument.type || "digital"
          }}
          isOpen={isDetailModalOpen}
          onClose={handleCloseDetailModal}
          onDownload={() => handleDownload(selectedDocument)}
        />
      )}

      <PdfPreviewModal
        filePath={previewFilePath}
        documentTitle={previewTitle}
        isOpen={isPdfPreviewOpen}
        onClose={handleClosePdfPreview}
        onDownload={() => {
          const doc = borrowHistory.find(h => h.document?.filePath === previewFilePath)?.document;
          if (doc) handleDownload(doc);
          handleClosePdfPreview();
        }}
      />
    </div>
  );
};

export default HistoryPage;
