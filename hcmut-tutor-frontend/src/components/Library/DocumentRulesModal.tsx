import React from "react";
import "../../styles/Library.css";

interface DocumentRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DocumentRulesModal: React.FC<DocumentRulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="rules-modal-overlay" onClick={onClose}>
      <div className="rules-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Quy định tài liệu</h2>
        
        <div className="rules-content">
          <p>
            Tất cả tài liệu được tải lên hệ thống phải tuân thủ nghiêm ngặt các quy định pháp luật và tiêu chuẩn đạo đức. Người dùng chịu trách nhiệm hoàn toàn về tính xác thực, nguồn gốc và nội dung của tài liệu.
          </p>
          
          <p>
            Mọi tài liệu không được vi phạm bản quyền, quyền sở hữu trí tuệ hoặc sử dụng nội dung của bên thứ ba khi chưa được phép. Tài liệu không được chứa thông tin sai lệch, xuyên tạc, gây hiểu nhầm hoặc có khả năng gây tác động tiêu cực đến cá nhân, tổ chức hay cộng đồng.
          </p>
          
          <p>
            Nội dung tải lên phải phù hợp với thuần phong mỹ tục, không chứa yếu tố kích động bạo lực, phân biệt chủng tộc, tôn giáo, kỳ thị giới tính, nội dung xúc phạm danh dự – uy tín người khác, hoặc tài liệu mang tính chất thù hằn, đe dọa, quấy rối. Nghiêm cấm đăng tải nội dung nhạy cảm như dữ liệu cá nhân, thông tin bảo mật, bí mật kinh doanh, tài liệu mật của cơ quan – tổ chức nếu không được ủy quyền.
          </p>
          
          <p>
            Các tệp phải đảm bảo an toàn kỹ thuật, không chứa virus, phần mềm độc hại, mã chạy tự động, hoặc bất kỳ thành phần nào gây nguy hiểm cho hệ thống.
          </p>
          
          <p>
            Tài liệu, hình ảnh, số liệu, trích dẫn trong nội dung cần được ghi rõ nguồn và đảm bảo quyền sử dụng hợp pháp. Trong trường hợp phát hiện nội dung vi phạm, hệ thống có quyền gỡ bỏ tài liệu, cảnh báo hoặc khóa tài khoản tùy mức độ nghiêm trọng; đồng thời người dùng có thể bị xử lý theo quy định pháp luật hiện hành.
          </p>
        </div>

        <div className="rules-modal-footer">
          <button className="rules-close-btn" onClick={onClose}>
            Thoát
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentRulesModal;
