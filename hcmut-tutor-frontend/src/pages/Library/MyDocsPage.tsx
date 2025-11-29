import React, { useState, useEffect } from "react";
import { HeaderSection } from "../../components/Library/HeaderLibrarySection";
import { FooterSection } from "../../components/Library/FooterLibrarySection";
import { BookCard, BookDetailModal, UploadedDocumentModal, PdfPreviewModal } from "../../components/Library";
import "../../styles/Library.css";

const API_BASE = "http://localhost:3001";

interface Document {
  id: string;
  title: string;
  author: string;
  status: string;
  coverImage?: string;
  category?: string;
  department?: string;
  language?: string;
  year?: number;
  type?: string;
  filePath?: string;
  description?: string;
  totalCopies?: number;
  availableCopies?: number;
  views?: number;
  downloads?: number;
  fileSize?: string;
  fileType?: string;
}

interface UploadedDocument extends Document {
  filePath: string;
}

interface SavedDocument {
  id: string;
  documentId: string;
  savedAt: string;
  document: Document | null;
}

interface BorrowRecord {
  id: string;
  documentId: string;
  borrowDate: string;
  dueDate: string;
  returnDate: string | null;
  status: string;
  document: Document | null;
  downloadDate?: string;
}

interface Stats {
  savedCount: number;
  borrowedCount: number;
  downloadedCount: number;
  sharedCount: number;
}

const MyDocsPage: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    savedCount: 0,
    borrowedCount: 0,
    downloadedCount: 0,
    sharedCount: 0,
  });
  const [savedDocs, setSavedDocs] = useState<SavedDocument[]>([]);
  const [borrowedDocs, setBorrowedDocs] = useState<BorrowRecord[]>([]);
  const [downloadedDocs, setDownloadedDocs] = useState<BorrowRecord[]>([]);
  const [savedDocIds, setSavedDocIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [selectedBook, setSelectedBook] = useState<Document | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [borrowedDocIds, setBorrowedDocIds] = useState<string[]>([]);

  // PDF Preview states
  const [isPdfPreviewOpen, setIsPdfPreviewOpen] = useState(false);
  const [previewFilePath, setPreviewFilePath] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  // Expand states for "Xem tất cả"
  const [expandSaved, setExpandSaved] = useState(false);
  const [expandBorrowed, setExpandBorrowed] = useState(false);
  const [expandDownloaded, setExpandDownloaded] = useState(false);

  const userId = "student001";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, savedRes, historyRes] = await Promise.all([
        fetch(`${API_BASE}/library/my-stats?userId=${userId}`),
        fetch(`${API_BASE}/library/saved?userId=${userId}`),
        fetch(`${API_BASE}/library/borrow-history?userId=${userId}`),
      ]);

      const statsData = await statsRes.json();
      const savedData = await savedRes.json();
      const historyData = await historyRes.json();

      if (statsData.success) {
        setStats({
          savedCount: statsData.stats.saved || 0,
          borrowedCount: statsData.stats.borrowed || 0,
          downloadedCount: statsData.stats.downloaded || 0,
          sharedCount: statsData.stats.shared || 0,
        });
      }
      if (savedData.success) {
        // Filter out saved documents that don't exist anymore
        const validSaved = savedData.saved.filter((s: SavedDocument) => s.document !== null);
        setSavedDocs(validSaved);
        setSavedDocIds(validSaved.map((s: SavedDocument) => s.documentId));
      }
      if (historyData.success) {
        // Filter out history records for non-existent documents
        const validHistory = historyData.history.filter((h: BorrowRecord) => h.document !== null);
        const borrowed = validHistory.filter((h: BorrowRecord) => h.status === "borrowed" || h.status === "overdue");
        const downloaded = validHistory.filter((h: BorrowRecord) => h.status === "returned");
        setBorrowedDocs(borrowed);
        setDownloadedDocs(downloaded);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookClick = async (book: Document) => {
    setSelectedBook(book);
    setIsModalOpen(true);

    // Increment view count
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
        fetchData();
      } else {
        alert(data.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Error borrowing book:", error);
      alert("Có lỗi xảy ra khi mượn sách");
    }
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
        setSavedDocs(savedDocs.filter((s) => s.documentId !== documentId));
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

  const filterDocuments = <T extends { document?: Document | null; title?: string }>(
    docs: T[],
    query: string
  ): T[] => {
    if (!query) return docs;
    const lowerQuery = query.toLowerCase();
    return docs.filter((d) => {
      const title = d.document?.title || d.title || "";
      return title.toLowerCase().includes(lowerQuery);
    });
  };

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
        <section className="text-center mb-10">
          <h1 className="text-4xl font-bold text-blue-800 mb-2">TÀI LIỆU CỦA TÔI</h1>
          <p className="text-lg text-gray-600">Quản lý tài liệu đã lưu, đang mượn và đã chia sẻ của bạn</p>
        </section>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="w-full h-14 pl-4 pr-4 bg-white rounded-[90px] border-2 border-blue-400 inline-flex justify-between items-center">
            <div className="flex justify-start items-center gap-2.5">
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Tìm kiếm trong Tài liệu của tôi"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-[500px] text-lg font-normal text-black placeholder:text-black/50 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="flex justify-center gap-8 mb-12">
          <div className="w-40 h-28 bg-white rounded-xl shadow-lg flex flex-col items-center justify-center">
            <span className="text-3xl mb-2">🔖</span>
            <div className="text-gray-600">Đã lưu</div>
            <div className="text-2xl font-bold text-blue-800">{stats.savedCount}</div>
          </div>
          <div className="w-40 h-28 bg-white rounded-xl shadow-lg flex flex-col items-center justify-center">
            <span className="text-3xl mb-2">📖</span>
            <div className="text-gray-600">Đang mượn</div>
            <div className="text-2xl font-bold text-amber-500">{stats.borrowedCount}</div>
          </div>
          <div className="w-40 h-28 bg-white rounded-xl shadow-lg flex flex-col items-center justify-center">
            <span className="text-3xl mb-2">⬇️</span>
            <div className="text-gray-600">Đã tải về</div>
            <div className="text-2xl font-bold text-green-600">{stats.downloadedCount}</div>
          </div>
          <div className="w-40 h-28 bg-white rounded-xl shadow-lg flex flex-col items-center justify-center">
            <span className="text-3xl mb-2">☁️</span>
            <div className="text-gray-600">Đã chia sẻ</div>
            <div className="text-2xl font-bold text-purple-600">{stats.sharedCount}</div>
          </div>
        </div>

        {/* Tài liệu đã lưu */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <div className="text-slate-800 text-2xl font-normal font-['Inter'] leading-8">
              Tài liệu đã lưu ({filterDocuments(savedDocs, searchQuery).length})
            </div>
            {filterDocuments(savedDocs, searchQuery).length > 5 && (
              <button
                onClick={() => setExpandSaved(!expandSaved)}
                className="p-2.5 bg-blue-800 rounded-md flex justify-center items-center hover:bg-blue-900 transition-colors"
              >
                <div className="text-white text-base font-normal font-['Inter']">
                  {expandSaved ? "<< Thu gọn" : ">> Xem tất cả"}
                </div>
              </button>
            )}
          </div>
          <div className="flex justify-start items-center gap-6 flex-wrap">
            {(expandSaved ? filterDocuments(savedDocs, searchQuery) : filterDocuments(savedDocs, searchQuery).slice(0, 5)).map(
              (saved) =>
                saved.document && (
                  <BookCard
                    key={saved.id}
                    document={{
                      ...saved.document,
                      category: saved.document.category || "Tài liệu cá nhân",
                      type: saved.document.type || "digital"
                    }}
                    onClick={() => handleBookClick(saved.document!)}
                    onSave={() => handleSaveBook(saved.documentId)}
                    onViewFile={() => handleViewFile(saved.document!)}
                    isSaved={true}
                    userStatus="available"
                  />
                )
            )}
            {filterDocuments(savedDocs, searchQuery).length === 0 && (
              <div className="text-gray-500 italic">Chưa có tài liệu đã lưu</div>
            )}
          </div>
        </section>

        {/* Tài liệu đang mượn */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <div className="text-slate-800 text-2xl font-normal font-['Inter'] leading-8">
              Tài liệu đang mượn ({filterDocuments(borrowedDocs, searchQuery).length})
            </div>
            {filterDocuments(borrowedDocs, searchQuery).length > 5 && (
              <button
                onClick={() => setExpandBorrowed(!expandBorrowed)}
                className="p-2.5 bg-blue-800 rounded-md flex justify-center items-center hover:bg-blue-900 transition-colors"
              >
                <div className="text-white text-base font-normal font-['Inter']">
                  {expandBorrowed ? "<< Thu gọn" : ">> Xem tất cả"}
                </div>
              </button>
            )}
          </div>
          <div className="flex justify-start items-center gap-6 flex-wrap">
            {(expandBorrowed ? filterDocuments(borrowedDocs, searchQuery) : filterDocuments(borrowedDocs, searchQuery).slice(0, 5)).map(
              (borrow) =>
                borrow.document && (
                  <BookCard
                    key={borrow.id}
                    document={{
                      ...borrow.document,
                      status: borrow.status,
                      category: borrow.document.category || "Tài liệu cá nhân",
                      type: borrow.document.type || "digital"
                    }}
                    onClick={() => handleBookClick(borrow.document!)}
                    onSave={() => handleSaveBook(borrow.documentId)}
                    onViewFile={() => handleViewFile(borrow.document!)}
                    isSaved={savedDocIds.includes(borrow.documentId)}
                    userStatus="borrowed"
                  />
                )
            )}
            {filterDocuments(borrowedDocs, searchQuery).length === 0 && (
              <div className="text-gray-500 italic">Chưa có tài liệu đang mượn</div>
            )}
          </div>
        </section>

        {/* Tài liệu đã tải về */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <div className="text-slate-800 text-2xl font-normal font-['Inter'] leading-8">
              Tài liệu đã tải về ({filterDocuments(downloadedDocs, searchQuery).length})
            </div>
            {filterDocuments(downloadedDocs, searchQuery).length > 5 && (
              <button
                onClick={() => setExpandDownloaded(!expandDownloaded)}
                className="p-2.5 bg-blue-800 rounded-md flex justify-center items-center hover:bg-blue-900 transition-colors"
              >
                <div className="text-white text-base font-normal font-['Inter']">
                  {expandDownloaded ? "<< Thu gọn" : ">> Xem tất cả"}
                </div>
              </button>
            )}
          </div>
          <div className="flex justify-start items-center gap-6 flex-wrap">
            {(expandDownloaded ? filterDocuments(downloadedDocs, searchQuery) : filterDocuments(downloadedDocs, searchQuery).slice(0, 5)).map(
              (download) =>
                download.document && (
                  <BookCard
                    key={download.id}
                    document={{
                      ...download.document,
                      status: "returned",
                      category: download.document.category || "Tài liệu cá nhân",
                      type: download.document.type || "digital"
                    }}
                    onClick={() => handleBookClick(download.document!)}
                    onSave={() => handleSaveBook(download.documentId)}
                    onViewFile={() => handleViewFile(download.document!)}
                    isSaved={savedDocIds.includes(download.documentId)}
                    userStatus="downloaded"
                  />
                )
            )}
            {filterDocuments(downloadedDocs, searchQuery).length === 0 && (
              <div className="text-gray-500 italic">Chưa có tài liệu đã tải về</div>
            )}
          </div>
        </section>
      </main>

      <FooterSection />

      {/* Modal for document detail */}
      {selectedBook && (selectedBook as UploadedDocument).filePath ? (
        <UploadedDocumentModal
          document={{
            ...selectedBook as UploadedDocument,
            category: selectedBook.category || "Tài liệu cá nhân",
            type: selectedBook.type || "digital"
          } as UploadedDocument}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onBorrow={handleBorrowBook}
          onSave={() => selectedBook && handleSaveBook(selectedBook.id)}
          onViewFile={() => selectedBook && handleViewFile(selectedBook)}
          isSaved={selectedBook ? savedDocIds.includes(selectedBook.id) : false}
          isBorrowed={selectedBook ? borrowedDocIds.includes(selectedBook.id) : false}
        />
      ) : selectedBook ? (
        <BookDetailModal
          document={{
            ...selectedBook,
            category: selectedBook.category || "Tài liệu cá nhân",
            type: selectedBook.type || "digital"
          }}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onBorrow={handleBorrowBook}
          onSave={() => handleSaveBook(selectedBook.id)}
          isSaved={savedDocIds.includes(selectedBook.id)}
        />
      ) : null}

      {/* PDF Preview Modal */}
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

export default MyDocsPage;
