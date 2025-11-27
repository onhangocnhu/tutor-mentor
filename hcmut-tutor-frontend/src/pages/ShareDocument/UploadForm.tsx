import React, { useState } from "react";
import "../../styles/UploadForm.css";

export const DocumentSection: React.FC = () => {
  // --- DoctType state ---
  const [selectedDocumentType, setSelectedDocumentType] = useState("print");
  const documentTypes = [
    { id: "print", label: "Tài liệu in" },
    { id: "internal", label: "Tài liệu nội sinh" },
    { id: "electronic", label: "Tài liệu điện tử" },
    { id: "university", label: "Tài liệu học tập ĐHQG-HCM" },
  ];

  // --- InformationDisplaySection state ---
  const [documentName, setDocumentName] = useState("");
  const [author, setAuthor] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  //--- Agree with the Rules ---
  const [isAgreed, setIsAgreed] = useState(false);

  //---Show the Rules (Modal)
  const [isModalOpen, setIsModalOpen] = useState(false);


  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleUploadClick = () => {
    if (!isAgreed) return;
    console.log({
      documentName,
      author,
      releaseYear,
      selectedDocumentType,
      file: selectedFile,
    });
  };

  return (

    <section className="document-section">
      {/*Title*/}
      <header className="title-header">
        <h1 className="title-main">CHIA SẺ TÀI LIỆU</h1>
      </header>

      <div className="title-sub">
        <p>Đăng tải các tài liệu, giáo trình bạn muốn chia sẻ</p>
      </div>
      {/* --- DoctType --- */}
      <fieldset className="doct-fieldset">
        {/* <legend className="sr-only">Loại tài liệu</legend> */}

        <div className="doct-header">
          <span>Loại tài liệu</span>
        </div>

        <div className="doct-options">
          {documentTypes.map((item) => (
            <label key={item.id} className="doct-option">
              <input
                type="radio"
                className="doct-radio"
                checked={selectedDocumentType === item.id}
                value={item.id}
                name="document-type"
                onChange={(e) => setSelectedDocumentType(e.target.value)}
              />
              <div className="doct-circle" />
              <span className="doct-label">{item.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* --- InformationDisplaySection --- */}
      <div className="info-section">
        <h2 className="info-title">Thông tin tài liệu</h2>

        <div className="info-fields">
          <div className="info-row">
            <label htmlFor="document-name">Tên tài liệu</label>
            <input
              type="text"
              id="document-name"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              placeholder="Nhập tên tài liệu"
            />
          </div>

          <div className="info-row">
            <label htmlFor="author">Tác giả</label>
            <input
              type="text"
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Nhập tên tác giả"
            />
          </div>

          <div className="info-row">
            <label htmlFor="release-year">Năm xuất bản</label>
            <input
              type="text"
              id="release-year"
              value={releaseYear}
              onChange={(e) => setReleaseYear(e.target.value)}
              placeholder="Nhập năm xuất bản"
            />
          </div>

          <div className="file-upload-section">
            <label className="file-upload-label">Đính kèm tài liệu</label>

            <div
              className={`file-dropzone ${isDragging ? "dragging" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              <span className="file-drop-text">
                {selectedFile ? selectedFile.name : "Kéo thả file hoặc bấm vào đây để chọn"}
              </span>
              <input
                type="file"
                id="file-upload"
                onChange={handleFileSelect}
                style={{ display: "none" }}
              />
            </div>
          </div>

          <div className="agreement-section">
            <label className="agreement-checkbox">
              <input
                type="checkbox"
                checked={isAgreed}
                onChange={() => setIsAgreed(!isAgreed)}
              />
              Tôi đã đọc kỹ và cam kết không vi phạm{" "}
              <span
                className="terms-link"
                onClick={() => setIsModalOpen(true)}
              >
                Quy định tài liệu
              </span>
              .
            </label>
          </div>
          <div className="upload-btn-container">
            <button
              type="button"
              disabled={!isAgreed}
              onClick={handleUploadClick}
              className="upload-btn"
            >
              Đăng tải
            </button>
          </div>
        </div>
      </div>
      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Quy định tài liệu</h2>
            <p>
              {/* Nội dung Quy định tài liệu */}
              1. Tất cả tài liệu được tải lên hệ thống phải tuân thủ nghiêm ngặt các quy định pháp luật và tiêu chuẩn đạo đức. Người dùng chịu trách nhiệm hoàn toàn về tính xác thực, nguồn gốc và nội dung của tài liệu. Mọi tài liệu không được vi phạm bản quyền, quyền sở hữu trí tuệ hoặc sử dụng nội dung của bên thứ ba khi chưa được phép. Tài liệu không được chứa thông tin sai lệch, xuyên tạc, gây hiểu nhầm hoặc có khả năng gây tác động tiêu cực đến cá nhân, tổ chức hay cộng đồng. <br />
              2. Nội dung tải lên phải phù hợp với thuần phong mỹ tục, không chứa yếu tố kích động bạo lực, phân biệt chủng tộc, tôn giáo, kỳ thị giới tính, nội dung xúc phạm danh dự – uy tín người khác, hoặc tài liệu mang tính chất thù hằn, đe dọa, quấy rối. Nghiêm cấm đăng tải nội dung nhạy cảm như dữ liệu cá nhân, thông tin bảo mật, bí mật kinh doanh, tài liệu mật của cơ quan – tổ chức nếu không được ủy quyền. Các tệp phải đảm bảo an toàn kỹ thuật, không chứa virus, phần mềm độc hại, mã chạy tự động, hoặc bất kỳ thành phần nào gây nguy hiểm cho hệ thống. <br />
              3. Tài liệu, hình ảnh, số liệu, trích dẫn trong nội dung cần được ghi rõ nguồn và đảm bảo quyền sử dụng hợp pháp. Trong trường hợp phát hiện nội dung vi phạm, hệ thống có quyền gỡ bỏ tài liệu, cảnh báo hoặc khóa tài khoản tùy mức độ nghiêm trọng; đồng thời người dùng có thể bị xử lý theo quy định pháp luật hiện hành. <br />
            </p>
            <div className="modal-close-btn-container">
              <button
                className="modal-close-btn"
                onClick={() => setIsModalOpen(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
