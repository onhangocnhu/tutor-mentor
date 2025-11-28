import React from "react";
import menu_icon from "../images/menu.png";

type TopBarProps = {
  menuOpen?: boolean;
  onMenuClick?: () => void;
  onLogoClick?: () => void;
};

const TopBar: React.FC<TopBarProps> = ({ menuOpen, onMenuClick, onLogoClick }) => {
  return (
    <header className="topbar" role="banner"
      style={{
        zIndex: 200,
        position: "fixed", // cố định
        top: 0,
        left: 0,
        width: "100%",    // full width
      }}
    >
      <div className="logo-box" onClick={onLogoClick} style={{ cursor: onLogoClick ? "pointer" : "default" }}>
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
