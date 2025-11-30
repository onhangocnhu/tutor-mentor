import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  BookCard,
  BookDetailModal,
  UploadedDocumentModal,
  DocumentFilter,
  PdfPreviewModal,
} from "../../components/Library";
import { HeaderSection } from "../../components/Library/HeaderLibrarySection";
import { FooterSection } from "../../components/Library/FooterLibrarySection";
import type { Document } from "../../components/Library";
import type { UploadedDocument } from "../../components/Library";
import "../../styles/Library.css";

const API_BASE = "http://localhost:3001";

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [selectedBook, setSelectedBook] = useState<Document | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedDocIds, setSavedDocIds] = useState<string[]>([]);
  const [borrowedDocIds, setBorrowedDocIds] = useState<string[]>([]);
  const [downloadedDocIds, setDownloadedDocIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");
  const [sortBy, setSortBy] = useState("relevant");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // PDF Preview states
  const [isPdfPreviewOpen, setIsPdfPreviewOpen] = useState(false);
  const [previewFilePath, setPreviewFilePath] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  // Filter counts from backend
  const [filterCounts, setFilterCounts] = useState<{
    category: Record<string, number>;
    department: Record<string, number>;
    language: Record<string, number>;
    status: Record<string, number>;
  }>({
    category: {},
    department: {},
    language: {},
    status: {},
  });

  const userId = "student001";
  const searchQuery = searchParams.get("q") || "";
  const departmentParam = searchParams.get("department") || "";

  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    if (departmentParam) {
      setSelectedDepartments([departmentParam]);
    }
  }, [departmentParam]);

  useEffect(() => {
    const fetchFilterCounts = async () => {
      try {
        const response = await fetch(`${API_BASE}/library/filter-counts`);
        const data = await response.json();
        if (data.success) {
          setFilterCounts(data.counts);
        }
      } catch (error) {
        console.error("Error fetching filter counts:", error);
      }
    };
    fetchFilterCounts();
  }, []);

  const filterSections = [
    {
      id: "category",
      title: "Loại tài liệu",
      options: [
        { value: "Sách tham khảo", label: "Sách tham khảo", count: filterCounts.category["Sách tham khảo"] || 0 },
        { value: "Giáo trình", label: "Giáo trình", count: filterCounts.category["Giáo trình"] || 0 },
        { value: "Luận văn / Đồ án", label: "Luận văn / Đồ án", count: filterCounts.category["Luận văn / Đồ án"] || 0 },
        { value: "Đề thi", label: "Đề thi", count: filterCounts.category["Đề thi"] || 0 },
        { value: "Tài liệu cá nhân", label: "Tài liệu cá nhân", count: filterCounts.category["Tài liệu cá nhân"] || 0 },
      ],
      selectedValues: selectedCategories,
      onChange: setSelectedCategories,
    },
    {
      id: "department",
      title: "Khoa / Bộ môn",
      options: [
        { value: "Khoa học & Kỹ thuật Máy tính", label: "Khoa học & Kỹ thuật Máy tính", count: filterCounts.department["Khoa học & Kỹ thuật Máy tính"] || 0 },
        { value: "Kỹ thuật Điện - Điện tử", label: "Kỹ thuật Điện - Điện tử", count: filterCounts.department["Kỹ thuật Điện - Điện tử"] || 0 },
        { value: "Kỹ thuật Cơ khí", label: "Kỹ thuật Cơ khí", count: filterCounts.department["Kỹ thuật Cơ khí"] || 0 },
        { value: "Kỹ thuật Hóa học", label: "Kỹ thuật Hóa học", count: filterCounts.department["Kỹ thuật Hóa học"] || 0 },
        { value: "Kỹ thuật Xây dựng", label: "Kỹ thuật Xây dựng", count: filterCounts.department["Kỹ thuật Xây dựng"] || 0 },
        { value: "Quản lý Công Nghiệp", label: "Quản lý Công Nghiệp", count: filterCounts.department["Quản lý Công Nghiệp"] || 0 },
        { value: "Khoa học Ứng dụng", label: "Khoa học Ứng dụng", count: filterCounts.department["Khoa học Ứng dụng"] || 0 },
      ],
      selectedValues: selectedDepartments,
      onChange: setSelectedDepartments,
    },
    {
      id: "language",
      title: "Ngôn ngữ",
      options: [
        { value: "Tiếng Việt", label: "Tiếng Việt", count: filterCounts.language["Tiếng Việt"] || 0 },
        { value: "Tiếng Anh", label: "Tiếng Anh", count: filterCounts.language["Tiếng Anh"] || 0 },
        { value: "Tiếng Trung", label: "Tiếng Trung", count: filterCounts.language["Tiếng Trung"] || 0 },
        { value: "Tiếng Pháp", label: "Tiếng Pháp", count: filterCounts.language["Tiếng Pháp"] || 0 },
        { value: "Tiếng Nhật", label: "Tiếng Nhật", count: filterCounts.language["Tiếng Nhật"] || 0 },
        { value: "Tiếng Hàn", label: "Tiếng Hàn", count: filterCounts.language["Tiếng Hàn"] || 0 },
        { value: "Tiếng Nga", label: "Tiếng Nga", count: filterCounts.language["Tiếng Nga"] || 0 },
        { value: "Tiếng Đức", label: "Tiếng Đức", count: filterCounts.language["Tiếng Đức"] || 0 },
      ],
      selectedValues: selectedLanguages,
      onChange: setSelectedLanguages,
    },
    {
      id: "status",
      title: "Tình trạng",
      options: [
        { value: "available", label: "Có sẵn", count: filterCounts.status["available"] || 0 },
        { value: "borrowed", label: "Đang mượn", count: filterCounts.status["borrowed"] || 0 },
        { value: "unavailable", label: "Đã trả", count: filterCounts.status["unavailable"] || 0 },
      ],
      selectedValues: selectedStatuses,
      onChange: setSelectedStatuses,
    },
  ];

  useEffect(() => {
    fetchDocuments();
    fetchSavedDocuments();
    fetchBorrowedDocuments();
  }, [searchQuery, selectedCategories, selectedDepartments, selectedLanguages, selectedStatuses, sortBy, yearFrom, yearTo]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (searchQuery) params.append("search", searchQuery);
      if (selectedCategories.length > 0) params.append("category", selectedCategories.join(","));
      if (selectedDepartments.length > 0) params.append("department", selectedDepartments.join(","));
      if (selectedLanguages.length > 0) params.append("language", selectedLanguages.join(","));
      if (selectedStatuses.length > 0) params.append("status", selectedStatuses.join(","));
      if (sortBy !== "relevant") params.append("sortBy", sortBy);

      if (yearFrom && yearTo && parseInt(yearFrom) <= parseInt(yearTo)) {
        params.append("yearFrom", yearFrom);
        params.append("yearTo", yearTo);
      } else if (yearFrom && !yearTo) {
        params.append("yearFrom", yearFrom);
      } else if (yearTo && !yearFrom) {
        params.append("yearTo", yearTo);
      }

      const response = await fetch(`${API_BASE}/library/documents?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setDocuments(data.documents);
        setTotalResults(data.total);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedDocuments = async () => {
    try {
      const response = await fetch(`${API_BASE}/library/saved?userId=${userId}`);
      const data = await response.json();
      if (data.success) {
        setSavedDocIds(data.saved.map((s: { documentId: string }) => s.documentId));
      }
    } catch (error) {
      console.error("Error fetching saved documents:", error);
    }
  };

  const fetchBorrowedDocuments = async () => {
    try {
      const response = await fetch(`${API_BASE}/library/borrowed?userId=${userId}`);
      const data = await response.json();
      if (data.success) {
        setBorrowedDocIds(data.borrowed.map((b: { documentId: string }) => b.documentId));
      }
    } catch (error) {
      console.error("Error fetching borrowed documents:", error);
    }
  };

  useEffect(() => {
    const fetchDownloadedDocuments = async () => {
      try {
        const response = await fetch(`${API_BASE}/library/borrow-history?userId=${userId}`);
        const data = await response.json();
        if (data.success) {
          const returnedDocs = data.history
            .filter((h: { status: string }) => h.status === "returned")
            .map((h: { documentId: string }) => h.documentId);
          setDownloadedDocIds(returnedDocs);
        }
      } catch (error) {
        console.error("Error fetching downloaded documents:", error);
      }
    };
    fetchDownloadedDocuments();
  }, []);

  const getUserDocumentStatus = (docId: string): "available" | "borrowed" | "downloaded" => {
    if (borrowedDocIds.includes(docId)) {
      return "borrowed";
    }
    if (downloadedDocIds.includes(docId)) {
      return "downloaded";
    }
    return "available";
  };

  const handleSearch = (query: string) => {
    setSearchParams({ q: query });
    setCurrentPage(1);
  };

  const handleBookClick = async (book: Document) => {
    setSelectedBook(book);
    setIsModalOpen(true);

    try {
      await fetch(`${API_BASE}/library/documents/${book.id}/view`, {
        method: "POST",
      });
    } catch (error) {
      console.error("Error incrementing view count:", error);
    }
  };

  const handleViewFile = (book: Document) => {
    if (book.filePath) {
      setPreviewFilePath(book.filePath);
      setPreviewTitle(book.title);
      setIsPdfPreviewOpen(true);
    } else {
      alert("Không tìm thấy file cho tài liệu này");
    }
  };

  const handleDownloadFromPreview = async () => {
    if (!previewFilePath) return;
    try {
      const fileUrl = previewFilePath.startsWith("http") ? previewFilePath : `${API_BASE}${previewFilePath}`;
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = previewTitle || "document.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };

  const handleSaveBook = async (documentId: string) => {
    try {
      if (savedDocIds.includes(documentId)) {
        await fetch(`${API_BASE}/library/save`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ documentId, userId }),
        });
        setSavedDocIds(savedDocIds.filter((id) => id !== documentId));
      } else {
        await fetch(`${API_BASE}/library/save`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ documentId, userId }),
        });
        setSavedDocIds([...savedDocIds, documentId]);
      }
    } catch (error) {
      console.error("Error saving document:", error);
    }
  };

  const handleBorrowBook = async () => {
    if (!selectedBook) return;
    try {
      const response = await fetch(`${API_BASE}/library/borrow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId: selectedBook.id, userId }),
      });
      const data = await response.json();
      if (data.success) {
        alert("Mượn sách thành công!");
        setBorrowedDocIds([...borrowedDocIds, selectedBook.id]);
        fetchDocuments();
      } else {
        alert(data.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Error borrowing book:", error);
      alert("Có lỗi xảy ra khi mượn sách");
    }
  };

  const handleRatingUpdate = (documentId: string, newRating: number, newRatingCount: number) => {
    setDocuments(documents.map((doc) =>
      doc.id === documentId
        ? { ...doc, rating: newRating, ratingCount: newRatingCount }
        : doc
    ));
  };

  const totalPages = Math.ceil(documents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDocuments = documents.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="library-layout library-page" style={{ fontFamily: 'Inter, sans-serif' }}>
      <HeaderSection />

      <main className="library-content">
        <section className="search-page-header">
          <h1>TÌM KIẾM TÀI LIỆU</h1>

          <div className="w-full max-w-[900px] mx-auto mt-4">
            <div className="w-full h-16 px-4 bg-white rounded-[90px] border-[3px] border-blue-400 inline-flex justify-between items-center gap-3">
              <div className="flex items-center gap-2 shrink-0">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm sách, tạp chí, luận văn"
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch(localSearchQuery)}
                className="flex-1 min-w-0 text-lg font-normal text-black placeholder:text-black/50 outline-none bg-transparent"
              />
              <button
                onClick={() => handleSearch(localSearchQuery)}
                className="h-12 px-6 bg-blue-800 rounded-[90px] flex justify-center items-center shrink-0 hover:bg-blue-900 transition-colors ml-2"
              >
                <span className="text-white text-lg font-medium">Tìm kiếm</span>
              </button>
            </div>
          </div>

          {searchQuery && (
            <p className="search-results-info">
              Đã tìm thấy <span className="highlight">{totalResults} kết quả</span> cho từ khóa "
              <span className="highlight">{searchQuery}</span>"
            </p>
          )}
        </section>

        <div className="search-page-content">
          <aside className="search-filter-sidebar">
            <DocumentFilter
              sections={filterSections}
              yearRange={{
                from: yearFrom,
                to: yearTo,
                onFromChange: setYearFrom,
                onToChange: setYearTo,
              }}
            />
          </aside>

          <section className="search-results-section">
            <div className="search-results-toolbar">
              <div className="search-sort-dropdown">
                <label>Sắp xếp theo:</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="relevant">Độ phù hợp</option>
                  <option value="newest">Mới nhất</option>
                  <option value="oldest">Cũ nhất</option>
                  <option value="popular">Phổ biến</option>
                  <option value="mostDownloaded">Tải nhiều nhất</option>
                </select>
              </div>

              <div className="search-view-toggle">
                <button
                  className={`view-toggle-btn ${viewMode === "grid" ? "active" : ""}`}
                  onClick={() => setViewMode("grid")}
                >
                  ▦
                </button>
                <button
                  className={`view-toggle-btn ${viewMode === "list" ? "active" : ""}`}
                  onClick={() => setViewMode("list")}
                >
                  ≡
                </button>
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: "60px" }}>Đang tải...</div>
            ) : documents.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px", color: "#64748b" }}>
                Không tìm thấy tài liệu phù hợp
              </div>
            ) : (
              <>
                {viewMode === "grid" ? (
                  <div className="search-results-grid">
                    {paginatedDocuments.map((doc) => (
                      <BookCard
                        key={doc.id}
                        document={doc}
                        onClick={() => handleBookClick(doc)}
                        onSave={() => handleSaveBook(doc.id)}
                        onViewFile={() => handleViewFile(doc)}
                        isSaved={savedDocIds.includes(doc.id)}
                        userStatus={getUserDocumentStatus(doc.id)}
                        size="large"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {paginatedDocuments.map((doc) => {
                      const userStatus = getUserDocumentStatus(doc.id);
                      const statusStyles = {
                        available: { bg: "bg-green-200", text: "text-green-700", label: "Có sẵn" },
                        borrowed: { bg: "bg-yellow-200", text: "text-amber-600", label: "Đang mượn" },
                        downloaded: { bg: "bg-blue-200", text: "text-blue-700", label: "Đã tải về" },
                      };
                      const style = statusStyles[userStatus];
                      const coverUrl = doc.coverImage
                        ? (doc.coverImage.startsWith('http') ? doc.coverImage : `${API_BASE}${doc.coverImage}`)
                        : null;

                      return (
                        <div
                          key={doc.id}
                          className={`flex items-center gap-6 p-4 bg-white rounded-xl shadow-md border-l-4 ${userStatus === "borrowed"
                            ? "border-amber-500"
                            : userStatus === "downloaded"
                              ? "border-blue-500"
                              : "border-green-500"
                            }`}
                        >
                          {/* Cover Image */}
                          <div className="w-20 h-28 shrink-0 rounded-lg overflow-hidden shadow">
                            {coverUrl ? (
                              <img
                                src={coverUrl}
                                alt={doc.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <div
                                className="w-full h-full flex items-center justify-center text-white text-2xl font-bold"
                                style={{ backgroundColor: doc.category === "Giáo trình" ? "#1e88e5" : doc.category === "Sách tham khảo" ? "#43a047" : "#fb8c00" }}
                              >
                                {doc.category?.charAt(0) || "T"}
                              </div>
                            )}
                          </div>

                          <div className="flex-1">
                            <h3
                              className="text-lg font-semibold text-gray-800 hover:text-blue-600 cursor-pointer mb-1"
                              onClick={() => handleBookClick(doc)}
                            >
                              {doc.title}
                            </h3>
                            <p className="text-gray-500 text-sm mb-2">
                              {doc.author} • {doc.department}
                            </p>

                            <div className="flex items-center gap-4 flex-wrap">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
                                {style.label}
                              </span>
                              <span className="text-gray-500 text-sm">
                                {doc.category} • {doc.language || "Tiếng Việt"}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                              title="Xem chi tiết"
                              onClick={() => handleBookClick(doc)}
                            >
                              👁
                            </button>
                            <button
                              className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
                              title="Xem file"
                              onClick={() => handleViewFile(doc)}
                            >
                              📄
                            </button>
                            <button
                              className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${savedDocIds.includes(doc.id)
                                ? "bg-yellow-100 hover:bg-yellow-200"
                                : "bg-gray-100 hover:bg-gray-200"
                                }`}
                              title={savedDocIds.includes(doc.id) ? "Đã lưu" : "Lưu tài liệu"}
                              onClick={() => handleSaveBook(doc.id)}
                            >
                              {savedDocIds.includes(doc.id) ? "🔖" : "🔗"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="search-pagination">
                  <span className="pagination-info">
                    Hiển thị {startIndex + 1}-{Math.min(startIndex + itemsPerPage, documents.length)} trong tổng số{" "}
                    {documents.length} tài liệu
                  </span>

                  <button
                    className="pagination-btn"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    {"<"}
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      className={`pagination-btn ${currentPage === page ? "active" : ""}`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ))}

                  {totalPages > 5 && <span>...</span>}

                  {totalPages > 5 && (
                    <button className="pagination-btn" onClick={() => setCurrentPage(totalPages)}>
                      {totalPages}
                    </button>
                  )}

                  <button
                    className="pagination-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    {">"}
                  </button>
                </div>
              </>
            )}
          </section>
        </div>
      </main>

      <FooterSection />

      {selectedBook && (selectedBook as UploadedDocument).filePath ? (
        <UploadedDocumentModal
          document={selectedBook as UploadedDocument}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onBorrow={handleBorrowBook}
          onSave={() => selectedBook && handleSaveBook(selectedBook.id)}
          onViewFile={() => selectedBook && handleViewFile(selectedBook)}
          isSaved={selectedBook ? savedDocIds.includes(selectedBook.id) : false}
          isBorrowed={selectedBook ? borrowedDocIds.includes(selectedBook.id) : false}
          onRatingUpdate={handleRatingUpdate}
        />
      ) : (
        <BookDetailModal
          document={selectedBook}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onBorrow={handleBorrowBook}
          onSave={() => selectedBook && handleSaveBook(selectedBook.id)}
          isSaved={selectedBook ? savedDocIds.includes(selectedBook.id) : false}
        />
      )}

      <PdfPreviewModal
        filePath={previewFilePath}
        documentTitle={previewTitle}
        isOpen={isPdfPreviewOpen}
        onClose={() => setIsPdfPreviewOpen(false)}
        onDownload={handleDownloadFromPreview}
      />
    </div>
  );
};

export default SearchPage;
