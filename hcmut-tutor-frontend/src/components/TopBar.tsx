import React from "react";
import { useNavigate } from "react-router-dom";
import menu_icon from "../images/menu.png";

type TopBarProps = {
  menuOpen?: boolean;
  onMenuClick?: () => void;
  onLogoClick?: () => void;
};

const TopBar: React.FC<TopBarProps> = ({ menuOpen, onMenuClick, onLogoClick }) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    // read role cookie
    const cookieRole = document.cookie
      .split(";")
      .map((s) => s.trim())
      .find((s) => s.startsWith("role="))
      ? document.cookie
        .split(";")
        .map((s) => s.trim())
        .find((s) => s.startsWith("role="))!
        .split("=")[1]
      : null;

    if (cookieRole) {
      const role = decodeURIComponent(cookieRole);
      navigate(`/${role}-dashboard`);
      return;
    }

    // fallback to provided handler or root
    if (onLogoClick) {
      onLogoClick();
    } else {
      navigate("/");
    }
  };

  return (
    <header className="topbar" role="banner" style={{ zIndex: 200 }}>
      <div
        className="logo-box"
        onClick={handleLogoClick}
        style={{ cursor: "pointer" }}
      >
        <div className="logo-text">Bk</div>
      </div>

      <div className="top-title">
        {!menuOpen && onMenuClick && (
          <img
            className="top-menu"
            src={menu_icon}
            alt="menu"
            onClick={onMenuClick}
            style={{ cursor: "pointer", position: "relative" }}
          />
        )}
      </div>
    </header>
  );
};

export default TopBar;
