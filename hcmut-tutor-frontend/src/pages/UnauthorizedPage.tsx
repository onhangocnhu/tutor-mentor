import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/UnauthorizedPage.css";

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  const goNow = () => {
    const cookie = document.cookie || "";
    let role: string | null = null;
    cookie.split(";").map(s => s.trim()).forEach(pair => {
      const [k, v] = pair.split("=");
      if (k === "role") role = decodeURIComponent(v || "");
    });
    if (role) navigate(`/${role}-dashboard`);
    else navigate("/login");
  };

  return (
    <div className="unauth-root">
      <div className="unauth-box" role="alert" aria-live="polite">
        <h1 className="unauth-title">Không có quyền truy cập</h1>
        <p className="unauth-desc">
          Bạn không được phép xem trang này vì không có quyền.
        </p>
        <div className="unauth-actions">
          <button className="unauth-btn primary" onClick={goNow}>Quay về trang chính</button>
          <button className="unauth-btn" onClick={() => navigate("/login")}>Đăng nhập</button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
