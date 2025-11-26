import React from "react";
import "./Header.css";
import logobachkhoa from "../../images/hcmut_logo.png";

export const HeaderSection: React.FC = () => {
  const navigationItems = [
    { label: "Trang chủ", href: "/library/homepage" },
    { label: "Tìm kiếm", href: "/library/search" },
    { label: "Tài liệu của tôi", href: "/library/my-document" },
    { label: "Lịch sử mượn", href: "/library/history" },
  ];

  return (
    <header className="header">
      <div className="header-left">
        <img src={logobachkhoa} alt="HCMUT Logo" />
        <h1>HCMUT LIBRARY</h1>
      </div>

      <nav className="header-nav">
        {navigationItems.map((item, index) => (
          <a key={index} href={item.href}>
            {item.label}
          </a>
        ))}

        <a href="#" className="share-btn">
          Chia sẻ tài liệu
        </a>
      </nav>
    </header>
  );
};
