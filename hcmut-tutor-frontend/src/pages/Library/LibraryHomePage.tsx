import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HeaderSection } from "../../components/Library/HeaderLibrarySection";
import { FooterSection } from "../../components/Library/FooterLibrarySection";
import { BookCard, UploadedDocumentModal, BookDetailModal, PdfPreviewModal } from "../../components/Library";
import type { Document, UploadedDocument } from "../../components/Library";
import "../../styles/Library.css";

const API_BASE = "http://localhost:3001";

// Banner images array - using imported images from library folder
// You need to save the 3 banner images as banner1.jpg, banner2.jpg, banner3.jpg in src/images/library/
const bannerImages = [
  "/src/images/library/banner1.jpg",
  "/src/images/library/banner2.jpg",
  "/src/images/library/banner3.jpg"
];

// Department Card Component
const DepartmentCard: React.FC<{ name: string; icon: React.ReactNode; onClick: () => void }> = ({ name, icon, onClick }) => (
  <div
    className="min-w-[180px] w-[180px] h-32 flex flex-col items-center justify-center bg-white rounded-xl shadow-[0px_4px_6px_0px_rgba(0,0,0,0.10)] cursor-pointer hover:shadow-lg transition-shadow p-4"
    onClick={onClick}
  >
    <div className="text-3xl mb-3">
      {icon}
    </div>
    <div className="text-center text-black text-sm font-normal font-['Inter'] leading-5">
      {name}
    </div>
  </div>
);

const LibraryHomePage: React.FC = () => {
  const navigate = useNavigate();
  const [recommendedBooks, setRecommendedBooks] = useState<Document[]>([]);
  const [mostViewedBooks, setMostViewedBooks] = useState<Document[]>([]);
  const [newestBooks, setNewestBooks] = useState<Document[]>([]);
  const [savedDocIds, setSavedDocIds] = useState<string[]>([]);
  const [borrowedDocIds, setBorrowedDocIds] = useState<string[]>([]);
  const [downloadedDocIds, setDownloadedDocIds] = useState<string[]>([]); // Documents that have been returned/downloaded
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // Modal states
  const [selectedBook, setSelectedBook] = useState<Document | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // PDF Preview modal states
  const [isPdfPreviewOpen, setIsPdfPreviewOpen] = useState(false);
  const [previewFilePath, setPreviewFilePath] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  // Expand states for "Xem tất cả"
  const [expandRecommended, setExpandRecommended] = useState(false);
  const [expandMostViewed, setExpandMostViewed] = useState(false);
  const [expandNewest, setExpandNewest] = useState(false);

  const userId = "student001";

  // Helper function to determine user's status for a document
  const getUserDocumentStatus = (docId: string): "available" | "borrowed" | "downloaded" => {
    if (borrowedDocIds.includes(docId)) {
      return "borrowed";
    }
    if (downloadedDocIds.includes(docId)) {
      return "downloaded";
    }
    return "available";
  };

  const popularTags = ["Giải tích 2", "Vật lý đại cương 1", "Đại số tuyến tính"];

  const departments = [
    { id: "cse", name: "Khoa học & Kỹ thuật Máy tính", icon: "🖥️" },
    { id: "eee", name: "Kỹ thuật Điện - Điện tử", icon: "⚡" },
    { id: "me", name: "Kỹ thuật Cơ khí", icon: "⚙️" },
    { id: "ce", name: "Kỹ thuật Hóa học", icon: "🧪" },
    { id: "civil", name: "Kỹ thuật Xây dựng", icon: "🏗️" },
    { id: "im", name: "Quản lý Công Nghiệp", icon: "📊" },
  ];

  // Banner slideshow effect - change every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [recommendedRes, mostViewedRes, newestRes, savedRes, borrowedRes, historyRes] = await Promise.all([
        fetch(`${API_BASE}/library/recommended`),
        fetch(`${API_BASE}/library/most-viewed`),
        fetch(`${API_BASE}/library/newest`),
        fetch(`${API_BASE}/library/saved?userId=${userId}`),
        fetch(`${API_BASE}/library/borrowed?userId=${userId}`),
        fetch(`${API_BASE}/library/borrow-history?userId=${userId}`),
      ]);

      const recommended = await recommendedRes.json();
      const mostViewed = await mostViewedRes.json();
      const newest = await newestRes.json();
      const saved = await savedRes.json();
      const borrowed = await borrowedRes.json();
      const history = await historyRes.json();

      if (recommended.success) setRecommendedBooks(recommended.documents);
      if (mostViewed.success) setMostViewedBooks(mostViewed.documents);
      if (newest.success) setNewestBooks(newest.documents);
      if (saved.success) {
        setSavedDocIds(saved.saved.map((s: { documentId: string }) => s.documentId));
      }
      if (borrowed.success) {
        setBorrowedDocIds(borrowed.borrowed.map((b: { documentId: string }) => b.documentId));
      }
      if (history.success) {
        // Get documents that have been returned (downloaded)
        const returnedDocs = history.history
          .filter((h: { status: string }) => h.status === "returned")
          .map((h: { documentId: string }) => h.documentId);
        setDownloadedDocIds(returnedDocs);
      }
    } catch (error) {
      console.error("Error fetching library data:", error);
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

  // Handler to update rating in local state after user rates a document
  const handleRatingUpdate = (documentId: string, newRating: number, newRatingCount: number) => {
    const updateBooks = (books: Document[]) =>
      books.map((book) =>
        book.id === documentId
          ? { ...book, rating: newRating, ratingCount: newRatingCount }
          : book
      );

    setRecommendedBooks(updateBooks(recommendedBooks));
    setMostViewedBooks(updateBooks(mostViewedBooks));
    setNewestBooks(updateBooks(newestBooks));
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/library/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleTagClick = (tag: string) => {
    navigate(`/library/search?q=${encodeURIComponent(tag)}`);
  };

  const handleDepartmentClick = (departmentName: string) => {
    navigate(`/library/search?department=${encodeURIComponent(departmentName)}`);
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

      {/* Hero Banner with Slideshow */}
      <div className="w-full h-[400px] pt-20 relative overflow-hidden">
        {bannerImages.map((banner, index) => (
          <img
            key={index}
            className={`w-full h-[400px] object-cover absolute top-0 left-0 transition-opacity duration-1000 ${index === currentBannerIndex ? 'opacity-100' : 'opacity-0'
              }`}
            src={banner}
            alt={`Library Banner ${index + 1}`}
          />
        ))}

        {/* Banner Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {bannerImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBannerIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${index === currentBannerIndex
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/75'
                }`}
            />
          ))}
        </div>
      </div>

      {/* Main Title & Search */}
      <div className="w-full px-[223px] pt-10 flex flex-col items-center">
        <div className="flex flex-col items-center">
          <div className="p-2.5 inline-flex justify-center items-center gap-2.5">
            <div className="text-blue-800 text-6xl font-bold font-['Inter']">HỆ THỐNG THƯ VIỆN</div>
          </div>
          <div className="p-2.5 inline-flex justify-center items-center gap-2.5">
            <div className="opacity-60 text-black text-xl font-normal font-['Inter']">
              Khám phá kho tàng tri thức với hàng ngàn tài liệu và công trình nghiên cứu
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="w-[1000px] h-20 mt-6 pl-1 pr-4 bg-white rounded-[90px] outline-[3px] outline-offset-[-3px] outline-blue-400 inline-flex justify-between items-center">
          <div className="px-3 flex justify-start items-center gap-2.5">
            <div className="w-12 h-12 inline-flex flex-col justify-center items-center">
              <div className="p-2 flex justify-center items-center">
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm sách, tạp chí, luận văn"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-[700px] text-2xl font-normal font-['Inter'] text-black placeholder:text-black/50 outline-none"
            />
          </div>
          <button
            onClick={handleSearch}
            className="w-36 h-14 p-2.5 bg-blue-800 rounded-[90px] flex justify-center items-center gap-2.5 hover:bg-blue-900 transition-colors"
          >
            <div className="text-white text-2xl font-normal font-['Inter']">Tìm kiếm</div>
          </button>
        </div>
      </div>

      {/* Popular Tags - aligned with search bar */}
      <div className="w-[1000px] mx-auto mt-8 flex justify-start items-center gap-5">
        <div className="p-2.5 flex justify-center items-center gap-2.5">
          <div className="opacity-60 text-black text-2xl font-normal font-['Inter']">Phổ biến:</div>
        </div>
        <div className="flex justify-center items-center gap-10">
          {popularTags.map((tag, index) => (
            <div
              key={index}
              onClick={() => handleTagClick(tag)}
              className="p-2.5 opacity-80 bg-sky-100 rounded-[90px] outline-1 -outline-offset-1 outline-blue-800 flex justify-center items-center gap-2.5 cursor-pointer hover:bg-sky-200 transition-colors"
            >
              <div className="text-center text-blue-800 text-2xl font-normal font-['Inter']">{tag}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Book Sections */}
      <div className="w-[1299px] mx-auto mt-16 flex flex-col gap-16">
        {/* Gợi ý cho bạn */}
        <section className="flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="text-slate-800 text-2xl font-normal font-['Inter'] leading-8">
              Gợi ý cho bạn ({recommendedBooks.length})
            </div>
            {recommendedBooks.length >= 5 && (
              <button
                onClick={() => setExpandRecommended(!expandRecommended)}
                className="p-2.5 bg-blue-800 rounded-md flex justify-center items-center gap-2.5 hover:bg-blue-900 transition-colors"
              >
                <div className="text-white text-base font-normal font-['Inter']">
                  {expandRecommended ? "<< Thu gọn" : ">> Xem tất cả"}
                </div>
              </button>
            )}
          </div>
          <div className="grid grid-cols-5 gap-6 justify-items-start">
            {(expandRecommended ? recommendedBooks : recommendedBooks.slice(0, 5)).map((book) => (
              <BookCard
                key={book.id}
                document={book}
                onClick={() => handleBookClick(book)}
                onSave={() => handleSaveBook(book.id)}
                onViewFile={() => handleViewFile(book)}
                isSaved={savedDocIds.includes(book.id)}
                userStatus={getUserDocumentStatus(book.id)}
              />
            ))}
          </div>
        </section>

        {/* Được xem nhiều nhất */}
        <section className="flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="text-slate-800 text-2xl font-normal font-['Inter'] leading-8">
              Được xem nhiều nhất ({mostViewedBooks.length})
            </div>
            {mostViewedBooks.length >= 5 && (
              <button
                onClick={() => setExpandMostViewed(!expandMostViewed)}
                className="p-2.5 bg-blue-800 rounded-md flex justify-center items-center gap-2.5 hover:bg-blue-900 transition-colors"
              >
                <div className="text-white text-base font-normal font-['Inter']">
                  {expandMostViewed ? "<< Thu gọn" : ">> Xem tất cả"}
                </div>
              </button>
            )}
          </div>
          <div className="grid grid-cols-5 gap-6 justify-items-start">
            {(expandMostViewed ? mostViewedBooks : mostViewedBooks.slice(0, 5)).map((book) => (
              <BookCard
                key={book.id}
                document={book}
                onClick={() => handleBookClick(book)}
                onSave={() => handleSaveBook(book.id)}
                onViewFile={() => handleViewFile(book)}
                isSaved={savedDocIds.includes(book.id)}
                userStatus={getUserDocumentStatus(book.id)}
              />
            ))}
          </div>
        </section>

        {/* Mới cập nhật */}
        <section className="flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="text-slate-800 text-2xl font-normal font-['Inter'] leading-8">
              Mới cập nhật ({newestBooks.length})
            </div>
            {newestBooks.length >= 5 && (
              <button
                onClick={() => setExpandNewest(!expandNewest)}
                className="p-2.5 bg-blue-800 rounded-md flex justify-center items-center gap-2.5 hover:bg-blue-900 transition-colors"
              >
                <div className="text-white text-base font-normal font-['Inter']">
                  {expandNewest ? "<< Thu gọn" : ">> Xem tất cả"}
                </div>
              </button>
            )}
          </div>
          <div className="grid grid-cols-5 gap-6 justify-items-start">
            {(expandNewest ? newestBooks : newestBooks.slice(0, 5)).map((book) => (
              <BookCard
                key={book.id}
                document={book}
                onClick={() => handleBookClick(book)}
                onSave={() => handleSaveBook(book.id)}
                onViewFile={() => handleViewFile(book)}
                isSaved={savedDocIds.includes(book.id)}
                userStatus={getUserDocumentStatus(book.id)}
              />
            ))}
          </div>
        </section>
      </div>

      {/* Duyệt theo Khoa/Bộ môn */}
      <div className="w-full max-w-[1300px] mx-auto mt-16 mb-16 flex flex-col justify-center items-center gap-7 px-4">
        <div className="p-2.5 inline-flex justify-center items-center gap-2.5">
          <div className="text-center text-black text-2xl font-normal font-['Inter'] leading-8">Duyệt theo Khoa/Bộ môn</div>
        </div>
        <div className="w-full flex justify-center items-stretch gap-4 flex-nowrap overflow-x-auto">
          {departments.map((dept) => (
            <DepartmentCard
              key={dept.id}
              name={dept.name}
              icon={dept.icon}
              onClick={() => handleDepartmentClick(dept.name)}
            />
          ))}
        </div>
      </div>

      <FooterSection />

      {/* Document Detail Modal */}
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

export default LibraryHomePage;
