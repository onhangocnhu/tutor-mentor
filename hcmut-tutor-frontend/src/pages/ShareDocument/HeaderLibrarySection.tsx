import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/HeaderLibrary.css";
import logobachkhoa from "../../images/hcmut_logo.png";

export const HeaderSection: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navigationItems = [
    { label: "Trang chủ", href: "/library" },
    { label: "Tìm kiếm", href: "/library/search" },
    { label: "Tài liệu của tôi", href: "/library/my-docs" },
    { label: "Lịch sử mượn", href: "/library/history" },
  ];

  const handleBackToSystem = () => {
    navigate("/student-dashboard");
  };

  const isActive = (href: string) => {
    if (href === "/library") {
      return location.pathname === "/library";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <>
      <header className="header">
        <div className="header-left" onClick={() => navigate("/library")} style={{ cursor: "pointer" }}>
          <img src={logobachkhoa} alt="HCMUT Logo" />
          <h1>HCMUT LIBRARY</h1>
        </div>

        <nav className="header-nav">
          {navigationItems.map((item, index) => (
            <a 
              key={index} 
              href={item.href}
              className={isActive(item.href) ? "active" : ""}
            >
              {item.label}
            </a>
          ))}

          <a href="/library/share" className="share-btn">
            Chia sẻ tài liệu
          </a>
        </nav>
      </header>
      
      {/* Nút quay về hệ thống quản lý */}
      <button 
        onClick={handleBackToSystem}
        className="back-to-system-btn"
      >
        ← Quay về hệ thống quản lý
      </button>
    </>
  );
};
