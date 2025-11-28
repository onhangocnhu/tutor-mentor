import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { DocumentRulesModal } from "../../components/Library";
import { HeaderSection } from "../ShareDocument/HeaderLibrarySection";
import { FooterSection } from "../ShareDocument/FooterLibrarySection";

const API_BASE = "http://localhost:3001";

type DocumentType = "physical" | "internal" | "digital" | "hcmut";

const ShareDocsPage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [documentType, setDocumentType] = useState<DocumentType>("digital");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState("");
  const [language, setLanguage] = useState("Tiếng Việt");
  const [category, setCategory] = useState("Giáo trình");
  const [department, setDepartment] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const userId = "student001";

  const documentTypes = [
    { value: "physical", label: "Tài liệu in" },
    { value: "internal", label: "Tài liệu nội sinh" },
    { value: "digital", label: "Tài liệu điện tử" },
    { value: "hcmut", label: "Tài liệu học tập ĐHQG-HCM" },
  ];

  const languages = [
    "Tiếng Việt",
    "Tiếng Anh",
    "Tiếng Trung",
    "Tiếng Pháp",
    "Tiếng Nhật",
    "Tiếng Hàn",
    "Tiếng Nga",
    "Tiếng Đức",
  ];

  const categories = [
    "Giáo trình",
    "Sách tham khảo",
    "Luận văn / Đồ án",
    "Tài liệu cá nhân",
    "Đề thi",
  ];

  const departments = [
    "Khoa học & Kỹ thuật Máy tính",
    "Kỹ thuật Điện - Điện tử",
    "Kỹ thuật Cơ khí",
    "Kỹ thuật Hóa học",
    "Kỹ thuật Xây dựng",
    "Quản lý Công Nghiệp",
    "Khoa học Ứng dụng",
    "Khác",
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        alert('Chỉ chấp nhận file PDF');
        return;
      }
      if (selectedFile.size > 50 * 1024 * 1024) {
        alert('File không được vượt quá 50MB');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      if (droppedFile.type !== 'application/pdf') {
        alert('Chỉ chấp nhận file PDF');
        return;
      }
      if (droppedFile.size > 50 * 1024 * 1024) {
        alert('File không được vượt quá 50MB');
        return;
      }
      setFile(droppedFile);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleSubmit = async () => {
    if (!title || !author || !file || !agreed) {
      alert("Vui lòng điền đầy đủ thông tin và đồng ý với quy định tài liệu");
      return;
    }

    try {
      setSubmitting(true);
      setUploadProgress(10);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      formData.append('author', author);
      formData.append('year', year || new Date().getFullYear().toString());
      formData.append('language', language);
      formData.append('category', category);
      formData.append('department', department);
      formData.append('description', description);
      formData.append('type', documentType);
      formData.append('userId', userId);

      setUploadProgress(30);

      const response = await fetch(`${API_BASE}/library/upload`, {
        method: "POST",
        body: formData,
      });

      setUploadProgress(80);

      const data = await response.json();

      setUploadProgress(100);

      if (data.success) {
        alert("Đăng tải tài liệu thành công! Ảnh bìa đã được tự động trích xuất từ trang đầu tiên của PDF.");
        // Reset form
        setTitle("");
        setAuthor("");
        setYear("");
        setLanguage("Tiếng Việt");
        setCategory("Giáo trình");
        setDepartment("");
        setDescription("");
        setFile(null);
        setAgreed(false);
        setDocumentType("digital");
        setUploadProgress(0);
        // Navigate to library home
        navigate("/library");
      } else {
        alert(data.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Error uploading document:", error);
      alert("Có lỗi xảy ra khi đăng tải tài liệu");
    } finally {
      setSubmitting(false);
      setUploadProgress(0);
    }
  };

  const isFormValid = title && author && file && agreed;

  return (
    <div className="library-page w-full min-h-screen relative bg-white overflow-hidden" style={{ fontFamily: 'Inter, sans-serif' }}>
      <HeaderSection />

      <main className="pt-[180px] px-[100px] pb-[100px]">
        <section className="text-center mb-10">
          <h1 className="text-4xl font-bold text-blue-800 mb-2">CHIA SẺ TÀI LIỆU</h1>
          <p className="text-lg text-gray-600">Đăng tải các tài liệu, giáo trình bạn muốn chia sẻ (Chỉ hỗ trợ file PDF)</p>
        </section>

        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
          {/* Document Type */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3 text-slate-800">Loại tài liệu</h3>
            <div className="flex flex-wrap gap-4">
              {documentTypes.map((type) => (
                <label key={type.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="documentType"
                    value={type.value}
                    checked={documentType === type.value}
                    onChange={(e) => setDocumentType(e.target.value as DocumentType)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-700">{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Document Info */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3 text-slate-800">Thông tin tài liệu</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-gray-700 mb-1">Tên tài liệu *</label>
                <input
                  type="text"
                  placeholder="Nhập tên tài liệu"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Tác giả *</label>
                <input
                  type="text"
                  placeholder="Nhập tên tác giả"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Năm phát hành</label>
                <input
                  type="number"
                  placeholder="Nhập năm phát hành"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Ngôn ngữ</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  {languages.map((lang) => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Danh mục</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Khoa/Bộ môn</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">-- Chọn khoa/bộ môn --</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-gray-700 mb-1">Mô tả</label>
                <textarea
                  placeholder="Nhập mô tả tài liệu"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                />
              </div>
            </div>
          </div>

          {/* File Upload */}
          <div className="mb-6">
            <label className="block text-xl font-semibold mb-3 text-slate-800">Đính kèm tài liệu (PDF) *</label>
            <div className="flex gap-4 items-center">
              <input
                ref={fileInputRef}
                type="file"
                style={{ display: "none" }}
                onChange={handleFileSelect}
                accept=".pdf"
              />
              <button 
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={handleBrowseClick}
              >
                Chọn file PDF
              </button>
              <div
                className="flex-1 min-h-[60px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-400 transition-colors"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={handleBrowseClick}
              >
                {file ? (
                  <span className="text-green-600 font-medium">
                    📄 {file.name} ({formatFileSize(file.size)})
                  </span>
                ) : (
                  <span className="text-gray-400">Kéo thả file PDF vào đây hoặc click để chọn</span>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              * Ảnh bìa sẽ được tự động trích xuất từ trang đầu tiên của file PDF
            </p>
          </div>

          {/* Upload Progress */}
          {submitting && uploadProgress > 0 && (
            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-1 text-center">
                {uploadProgress < 100 ? `Đang tải lên... ${uploadProgress}%` : 'Hoàn tất!'}
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-between items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-gray-700">
                Tôi đã đọc kỹ và cam kết không vi phạm "
                <span
                  className="text-blue-600 hover:underline cursor-pointer"
                  onClick={() => setIsRulesModalOpen(true)}
                >
                  Quy định tài liệu
                </span>
                "
              </span>
            </label>

            <button
              className={`px-8 py-3 rounded-lg font-semibold text-white transition-colors ${
                isFormValid && !submitting
                  ? 'bg-blue-800 hover:bg-blue-900'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
              disabled={!isFormValid || submitting}
              onClick={handleSubmit}
            >
              {submitting ? "Đang đăng tải..." : "Đăng tải"}
            </button>
          </div>
        </div>
      </main>

      <FooterSection />

      <DocumentRulesModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
      />
    </div>
  );
};

export default ShareDocsPage;
